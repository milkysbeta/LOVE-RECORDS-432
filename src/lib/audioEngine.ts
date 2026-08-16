/* ------------------------------------------------------------------ *
 *  Audio analysis engine
 *
 *  One AudioContext for the whole site, feeding the Chladni field two
 *  possible sources:
 *
 *    track — the site's own player element, tapped with a
 *            MediaElementAudioSourceNode. No permission prompt, and it
 *            only works because Beatport's sample CDN sends CORS headers
 *            (verified) and the element is marked crossOrigin.
 *    mic   — getUserMedia, behind a permission prompt.
 *
 *  They get separate analysers on purpose. The track analyser sits in
 *  the path to the speakers; the mic analyser is a dead end. Sharing one
 *  node would route the microphone back out of the speakers and howl.
 *
 *  Metrics are written into a single mutable object that callers read
 *  each frame — nothing here allocates per frame or triggers a render.
 * ------------------------------------------------------------------ */

export interface AudioMetrics {
  /** Overall loudness, 0–1, already smoothed. */
  level: number
  bass: number
  mid: number
  high: number
  /** Spectral centroid 0–1 — roughly "how bright is this right now". */
  centroid: number
  /** True when any source is actually producing signal. */
  active: boolean
}

export type SourceKind = 'track' | 'mic' | null

const FFT_SIZE = 1024

/** Hz boundaries for the three bands the visuals care about. */
const BANDS = { bassTo: 250, midTo: 2000, highTo: 8000 }

class AudioEngine {
  private ctx: AudioContext | null = null
  private trackAnalyser: AnalyserNode | null = null
  private micAnalyser: AnalyserNode | null = null
  private elementSource: MediaElementAudioSourceNode | null = null
  private micSource: MediaStreamAudioSourceNode | null = null
  private micStream: MediaStream | null = null
  // Explicitly backed by ArrayBuffer (not SharedArrayBuffer) — the Web
  // Audio typings require the narrower form.
  private freq: Uint8Array<ArrayBuffer> = new Uint8Array(new ArrayBuffer(0))

  /** Read this every frame. Mutated in place. */
  readonly metrics: AudioMetrics = {
    level: 0,
    bass: 0,
    mid: 0,
    high: 0,
    centroid: 0.5,
    active: false,
  }

  micEnabled = false
  /** Which source the metrics are currently derived from. */
  source: SourceKind = null

  get supported() {
    return typeof window !== 'undefined' && 'AudioContext' in window
  }

  get micSupported() {
    return (
      typeof navigator !== 'undefined' &&
      Boolean(navigator.mediaDevices?.getUserMedia) &&
      // getUserMedia is only exposed in a secure context.
      (window.isSecureContext ?? false)
    )
  }

  private ensureContext() {
    if (!this.supported) return null
    if (!this.ctx) {
      this.ctx = new AudioContext()
      this.freq = new Uint8Array(new ArrayBuffer(FFT_SIZE / 2))
    }
    // Browsers start the context suspended until a gesture.
    if (this.ctx.state === 'suspended') void this.ctx.resume()
    return this.ctx
  }

  private makeAnalyser(ctx: AudioContext) {
    const node = ctx.createAnalyser()
    node.fftSize = FFT_SIZE
    node.smoothingTimeConstant = 0.75
    return node
  }

  /**
   * Tap the player's <audio> element. Safe to call repeatedly — a media
   * element can only ever have one source node, so the first call wins.
   */
  attachElement(el: HTMLAudioElement) {
    const ctx = this.ensureContext()
    if (!ctx || this.elementSource) return

    try {
      this.elementSource = ctx.createMediaElementSource(el)
      this.trackAnalyser = this.makeAnalyser(ctx)
      // Analyser is in-path, so it must reach the speakers or the site
      // goes silent the moment we tap it.
      this.elementSource.connect(this.trackAnalyser)
      this.trackAnalyser.connect(ctx.destination)
    } catch (err) {
      // A tainted (non-CORS) stream throws here. Playback must survive.
      console.warn('[love432] track analysis unavailable:', err)
      this.elementSource = null
      this.trackAnalyser = null
    }
  }

  /** Resume the context from inside a user gesture. */
  resume() {
    this.ensureContext()
  }

  async enableMic(): Promise<boolean> {
    if (!this.micSupported) return false
    const ctx = this.ensureContext()
    if (!ctx) return false

    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          // Processing built for speech actively fights a visualiser.
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      })
      this.micSource = ctx.createMediaStreamSource(this.micStream)
      this.micAnalyser = this.makeAnalyser(ctx)
      // Deliberately NOT connected to destination — that is a feedback loop.
      this.micSource.connect(this.micAnalyser)
      this.micEnabled = true
      return true
    } catch {
      // Denied, dismissed, or no input device.
      this.disableMic()
      return false
    }
  }

  disableMic() {
    this.micSource?.disconnect()
    this.micStream?.getTracks().forEach((t) => t.stop())
    this.micSource = null
    this.micAnalyser = null
    this.micStream = null
    this.micEnabled = false
  }

  /**
   * Recompute metrics. Call once per rendered frame; cheap enough to run
   * unconditionally, and a no-op when nothing is connected.
   */
  update() {
    const m = this.metrics
    const analyser = this.micEnabled && this.micAnalyser ? this.micAnalyser : this.trackAnalyser

    if (!analyser || !this.ctx) {
      // Decay to rest rather than snapping, so the field settles.
      m.level *= 0.9
      m.bass *= 0.9
      m.mid *= 0.9
      m.high *= 0.9
      m.active = false
      this.source = null
      return
    }

    this.source = this.micEnabled && this.micAnalyser ? 'mic' : 'track'
    analyser.getByteFrequencyData(this.freq)

    const nyquist = this.ctx.sampleRate / 2
    const bins = this.freq.length
    const binOf = (hz: number) => Math.min(bins - 1, Math.max(1, Math.round((hz / nyquist) * bins)))

    const bassEnd = binOf(BANDS.bassTo)
    const midEnd = binOf(BANDS.midTo)
    const highEnd = binOf(BANDS.highTo)

    let bass = 0
    let mid = 0
    let high = 0
    let total = 0
    let weighted = 0

    for (let i = 1; i < highEnd; i++) {
      const v = this.freq[i] / 255
      if (i < bassEnd) bass += v
      else if (i < midEnd) mid += v
      else high += v
      total += v
      weighted += v * i
    }

    const norm = (sum: number, count: number) => (count > 0 ? sum / count : 0)
    const targetBass = norm(bass, bassEnd - 1)
    const targetMid = norm(mid, midEnd - bassEnd)
    const targetHigh = norm(high, highEnd - midEnd)
    const targetLevel = norm(total, highEnd - 1)
    const targetCentroid = total > 0.0001 ? weighted / total / highEnd : 0.5

    // Attack fast, release slow — visuals should snap to a kick and ease
    // out of it, not average everything into mush.
    const ease = (current: number, target: number) =>
      current + (target - current) * (target > current ? 0.45 : 0.12)

    m.bass = ease(m.bass, targetBass)
    m.mid = ease(m.mid, targetMid)
    m.high = ease(m.high, targetHigh)
    m.level = ease(m.level, targetLevel)
    m.centroid = m.centroid + (targetCentroid - m.centroid) * 0.08
    m.active = m.level > 0.005
  }
}

export const audioEngine = new AudioEngine()
