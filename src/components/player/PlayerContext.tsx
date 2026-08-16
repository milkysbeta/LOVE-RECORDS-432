import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { Release, Track } from '../../data/types'
import { fullTrackTitle } from '../../lib/format'

/* ------------------------------------------------------------------ *
 *  Global audio player
 *
 *  One <audio> element lives in the provider for the lifetime of the
 *  app, so playback survives route changes — click a track on a release
 *  page, keep browsing, the music keeps going.
 * ------------------------------------------------------------------ */

export interface QueueItem {
  track: Track
  release: Release
}

interface PlayerState {
  queue: QueueItem[]
  index: number
  current: QueueItem | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  muted: boolean
  /** True between pressing play and the first frame of audio. */
  isLoading: boolean
  error: string | null
}

interface PlayerApi extends PlayerState {
  /** Play a track. Pass a queue to enable next/prev through a release. */
  play: (item: QueueItem, queue?: QueueItem[]) => void
  toggle: () => void
  pause: () => void
  next: () => void
  previous: () => void
  seek: (seconds: number) => void
  setVolume: (v: number) => void
  toggleMute: () => void
  close: () => void
  isCurrent: (trackId: string) => boolean
}

const PlayerContext = createContext<PlayerApi | null>(null)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [queue, setQueue] = useState<QueueItem[]>([])
  const [index, setIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(0.8)
  const [muted, setMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const current = index >= 0 && index < queue.length ? queue[index] : null

  /* -- element setup ------------------------------------------------ */
  if (!audioRef.current && typeof Audio !== 'undefined') {
    audioRef.current = new Audio()
    audioRef.current.preload = 'none'
    // Previews are cross-origin; without this the element still plays but
    // we cannot read the waveform for analysis later.
    audioRef.current.crossOrigin = 'anonymous'
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTime = () => setCurrentTime(audio.currentTime)
    const onDuration = () => setDuration(audio.duration || 0)
    const onPlay = () => {
      setIsPlaying(true)
      setIsLoading(false)
    }
    const onPause = () => setIsPlaying(false)
    const onWaiting = () => setIsLoading(true)
    const onPlaying = () => setIsLoading(false)
    const onError = () => {
      setError('Preview unavailable')
      setIsLoading(false)
      setIsPlaying(false)
    }
    const onEnded = () => setIndex((i) => (i + 1 < queue.length ? i + 1 : -1))

    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onDuration)
    audio.addEventListener('durationchange', onDuration)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('error', onError)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onDuration)
      audio.removeEventListener('durationchange', onDuration)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('playing', onPlaying)
      audio.removeEventListener('error', onError)
      audio.removeEventListener('ended', onEnded)
    }
  }, [queue.length])

  /* -- load whenever the current item changes ----------------------- */
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (!current?.track.previewUrl) {
      audio.pause()
      audio.removeAttribute('src')
      setCurrentTime(0)
      setDuration(0)
      return
    }

    setError(null)
    setIsLoading(true)
    setCurrentTime(0)
    audio.src = current.track.previewUrl
    audio.load()
    audio.play().catch(() => {
      // Autoplay policy or a dead URL — surface it rather than hanging on
      // a spinner forever.
      setIsLoading(false)
      setIsPlaying(false)
    })

    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: fullTrackTitle(current.track),
        artist: current.track.artists.join(', '),
        album: current.release.title,
        artwork: current.release.artwork
          ? [{ src: current.release.artwork, sizes: '512x512', type: 'image/jpeg' }]
          : undefined,
      })
    }
  }, [current])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
    audio.muted = muted
  }, [volume, muted])

  /* -- api ---------------------------------------------------------- */
  const play = useCallback(
    (item: QueueItem, nextQueue?: QueueItem[]) => {
      const q = nextQueue?.length ? nextQueue : [item]
      const i = q.findIndex((x) => x.track.id === item.track.id)

      const sameQueue =
        q.length === queue.length && q.every((x, n) => x.track.id === queue[n]?.track.id)

      if (sameQueue && i === index) {
        // Re-clicking the playing track toggles it.
        const audio = audioRef.current
        if (audio) {
          if (audio.paused) void audio.play()
          else audio.pause()
        }
        return
      }

      if (!sameQueue) setQueue(q)
      setIndex(i < 0 ? 0 : i)
    },
    [queue, index],
  )

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !current) return
    if (audio.paused) void audio.play()
    else audio.pause()
  }, [current])

  const pause = useCallback(() => audioRef.current?.pause(), [])

  const next = useCallback(() => {
    setIndex((i) => (i + 1 < queue.length ? i + 1 : i))
  }, [queue.length])

  const previous = useCallback(() => {
    const audio = audioRef.current
    // Standard behaviour: restart the track unless we are near its start.
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0
      return
    }
    setIndex((i) => (i > 0 ? i - 1 : i))
  }, [])

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(audio.duration)) return
    audio.currentTime = Math.max(0, Math.min(seconds, audio.duration))
    setCurrentTime(audio.currentTime)
  }, [])

  const setVolume = useCallback((v: number) => {
    setVolumeState(Math.max(0, Math.min(1, v)))
    setMuted(false)
  }, [])

  const toggleMute = useCallback(() => setMuted((m) => !m), [])

  const close = useCallback(() => {
    audioRef.current?.pause()
    setIndex(-1)
    setQueue([])
  }, [])

  const isCurrent = useCallback(
    (trackId: string) => current?.track.id === trackId,
    [current],
  )

  /* -- keyboard ----------------------------------------------------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!current) return
      const target = e.target as HTMLElement | null
      // Never hijack typing.
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return
      if (target?.isContentEditable) return

      if (e.code === 'Space') {
        e.preventDefault()
        toggle()
      } else if (e.code === 'ArrowRight' && e.shiftKey) {
        e.preventDefault()
        next()
      } else if (e.code === 'ArrowLeft' && e.shiftKey) {
        e.preventDefault()
        previous()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [current, toggle, next, previous])

  const value = useMemo<PlayerApi>(
    () => ({
      queue,
      index,
      current,
      isPlaying,
      currentTime,
      duration,
      volume,
      muted,
      isLoading,
      error,
      play,
      toggle,
      pause,
      next,
      previous,
      seek,
      setVolume,
      toggleMute,
      close,
      isCurrent,
    }),
    [
      queue,
      index,
      current,
      isPlaying,
      currentTime,
      duration,
      volume,
      muted,
      isLoading,
      error,
      play,
      toggle,
      pause,
      next,
      previous,
      seek,
      setVolume,
      toggleMute,
      close,
      isCurrent,
    ],
  )

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used inside <PlayerProvider>')
  return ctx
}
