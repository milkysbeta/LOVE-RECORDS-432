import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { audioEngine } from '../../lib/audioEngine'

/* ------------------------------------------------------------------ *
 *  Chladni cymatic particle field
 *
 *  A Chladni plate is a metal sheet driven at a resonant frequency; sand
 *  on its surface migrates away from the antinodes and settles along the
 *  *nodal lines*, where the standing wave amplitude is zero. It is what
 *  a frequency looks like when you make it visible — which is the whole
 *  premise of a label that tunes to 432.
 *
 *  For a square plate the standing wave is
 *
 *      s(x,y) = sin(πnx)sin(πmy) + sin(πmx)sin(πny)
 *
 *  and the figure is the level set s = 0. Rather than simulating sand,
 *  each particle starts at a fixed random seed point and the vertex
 *  shader runs a few Newton–Raphson steps to project it onto that level
 *  set. It converges in ~5 iterations, costs nothing on the CPU, and is
 *  fully deterministic, so there is no state to keep between frames.
 *
 *  m and n are lerped continuously (fractional modes are perfectly well
 *  defined here), so the figure morphs rather than cutting between
 *  patterns. Scroll drives the morph; live audio drives it further, and
 *  device tilt swings the plate.
 * ------------------------------------------------------------------ */

const PARTICLE_COUNT = 70_000

/** Resonant modes the field walks through, in order. */
const MODES: [number, number][] = [
  [1, 2],
  [2, 3],
  [3, 4],
  [2, 5],
  [4, 5],
  [3, 7],
  [5, 6],
  [2, 7],
]

const vertexShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uM;
  uniform float uN;
  uniform float uJitter;
  uniform float uSize;
  uniform float uScale;
  uniform vec2  uPointer;

  // Live audio, 0–1 each.
  uniform float uLevel;
  uniform float uBass;
  uniform float uHigh;

  attribute float aSeed;

  varying float vDepth;
  varying float vShade;

  const float PI = 3.14159265359;

  float chladni(vec2 q, float m, float n) {
    return sin(PI * n * q.x) * sin(PI * m * q.y)
         + sin(PI * m * q.x) * sin(PI * n * q.y);
  }

  float hash(float x) {
    return fract(sin(x * 127.1) * 43758.5453123);
  }

  void main() {
    vec2 p = position.xy;

    // Project the seed point onto the nodal set s(p) = 0.
    // Newton step: p -= grad * s / |grad|^2, damped to stay stable near
    // the antinodes where the gradient collapses.
    for (int i = 0; i < 5; i++) {
      float s = chladni(p, uM, uN);
      float e = 0.0015;
      float gx = (chladni(p + vec2(e, 0.0), uM, uN) - chladni(p - vec2(e, 0.0), uM, uN)) / (2.0 * e);
      float gy = (chladni(p + vec2(0.0, e), uM, uN) - chladni(p - vec2(0.0, e), uM, uN)) / (2.0 * e);
      vec2 g = vec2(gx, gy);
      p -= g * (s / (dot(g, g) + 0.5));
    }

    p = clamp(p, -1.0, 1.0);

    // Kick drum pushes the whole figure outward from centre.
    p *= 1.0 + uBass * 0.07;

    // Scatter around the line so it reads as settled sand, not wireframe.
    // Loudness shakes the plate — the sand stops sitting still.
    float ang = hash(aSeed) * 6.2831853;
    float rad = hash(aSeed + 7.7);
    p += vec2(cos(ang), sin(ang)) * rad * uJitter * (1.0 + uLevel * 5.0);

    // Slow vertical breathing keeps the plate alive while static;
    // treble adds a faster shimmer on top.
    float z = (hash(aSeed + 3.3) - 0.5) * 0.55;
    z += sin(uTime * 0.35 + aSeed * 12.0) * 0.03;
    z += sin(uTime * 3.1 + aSeed * 40.0) * uHigh * 0.05;
    vDepth = z;

    vec3 world = vec3(p * uScale, z * uScale * 0.35);

    // Pointer / tilt parallax — deeper particles swing further, so the
    // field gains volume as the cursor moves or the phone turns.
    world.x += uPointer.x * (0.05 + (z + 0.3) * 0.30) * uScale;
    world.y += uPointer.y * (0.05 + (z + 0.3) * 0.30) * uScale;

    vec4 mv = modelViewMatrix * vec4(world, 1.0);
    gl_Position = projectionMatrix * mv;

    vShade = rad;
    gl_PointSize = uSize * (1.0 + z + uLevel * 1.3) * (300.0 / max(-mv.z, 0.001));
  }
`

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3  uColorNear;
  uniform vec3  uColorFar;
  uniform float uOpacity;

  varying float vDepth;
  varying float vShade;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = dot(c, c);
    if (d > 0.25) discard;

    float alpha = smoothstep(0.25, 0.01, d);
    vec3 col = mix(uColorFar, uColorNear, clamp(vDepth + 0.5, 0.0, 1.0));

    gl_FragColor = vec4(col, alpha * uOpacity * (0.30 + vShade * 0.70));
  }
`

export interface TiltReading {
  x: number
  y: number
}

interface FieldProps {
  /** 0→1 across the page; drives which mode the plate is resonating in. */
  progressRef: React.RefObject<number>
  /** Device orientation, when the visitor has granted it. */
  tiltRef?: React.RefObject<TiltReading> | null
  reducedMotion: boolean
  /** Multiplier on how hard audio drives the visuals. */
  drive: number
  baseOpacity: number
}

function Field({ progressRef, tiltRef, reducedMotion, drive, baseOpacity }: FieldProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const pointer = useRef(new THREE.Vector2(0, 0))
  const smoothed = useRef(new THREE.Vector2(0, 0))
  // Reused each frame so parallax allocates nothing.
  const target = useRef(new THREE.Vector2(0, 0))
  const { viewport } = useThree()

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const seeds = new Float32Array(PARTICLE_COUNT)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = Math.random() * 2 - 1
      positions[i * 3 + 1] = Math.random() * 2 - 1
      positions[i * 3 + 2] = 0
      seeds[i] = Math.random() * 1000
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    // Points are repositioned entirely in the shader, so the CPU-side
    // bounding sphere is meaningless — make it big enough to never cull.
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 40)
    return geo
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uM: { value: MODES[0][0] },
      uN: { value: MODES[0][1] },
      uJitter: { value: 0.012 },
      uSize: { value: 1.5 },
      uScale: { value: 5 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uLevel: { value: 0 },
      uBass: { value: 0 },
      uHigh: { value: 0 },
      uColorNear: { value: new THREE.Color('#2f5fe0') },
      uColorFar: { value: new THREE.Color('#93aeff') },
      uOpacity: { value: baseOpacity },
    }),
    [baseOpacity],
  )

  // Track the pointer in normalised device space.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      )
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((state, delta) => {
    const mat = materialRef.current
    if (!mat) return

    // One analysis pass per rendered frame, shared by everything.
    audioEngine.update()
    const audio = audioEngine.metrics

    const t = state.clock.elapsedTime
    mat.uniforms.uTime.value = reducedMotion ? 0 : t

    const level = audio.level * drive
    const bass = audio.bass * drive
    const high = audio.high * drive

    mat.uniforms.uLevel.value = level
    mat.uniforms.uBass.value = bass
    mat.uniforms.uHigh.value = high
    // Louder passages bring the field forward out of the paper.
    mat.uniforms.uOpacity.value = baseOpacity * (1 + level * 0.5)

    // Scroll drives the walk through the mode list; a slow autonomous
    // drift keeps it moving even when the page is still; and brightness
    // of the incoming audio pushes it further up the list, so a hi-hat
    // pattern resonates in a denser figure than a bassline.
    const drift = reducedMotion ? 0 : t * 0.02
    const timbre = audio.active ? (audio.centroid - 0.5) * 2.5 * drive : 0
    const pos = (progressRef.current ?? 0) * (MODES.length - 1) + drift + timbre
    const wrapped = ((pos % MODES.length) + MODES.length) % MODES.length
    const i = Math.floor(wrapped)
    const j = (i + 1) % MODES.length
    const f = wrapped - i
    // Smoothstep the blend so the figure lingers on each resonance
    // instead of sliding through at constant speed.
    const e = f * f * (3 - 2 * f)

    mat.uniforms.uM.value = THREE.MathUtils.lerp(MODES[i][0], MODES[j][0], e)
    mat.uniforms.uN.value = THREE.MathUtils.lerp(MODES[i][1], MODES[j][1], e)

    // Tilt wins over pointer when the phone is actually reporting it.
    const tilt = tiltRef?.current
    const tilting = Boolean(tilt) && (tilt!.x !== 0 || tilt!.y !== 0)
    if (tilting) target.current.set(tilt!.x, -tilt!.y)
    else target.current.copy(pointer.current)

    // Ease so parallax glides rather than snaps.
    const k = 1 - Math.pow(0.001, delta)
    smoothed.current.lerp(target.current, reducedMotion ? 0 : k)
    mat.uniforms.uPointer.value.copy(smoothed.current)

    // Fill the viewport regardless of aspect ratio, breathing on bass.
    mat.uniforms.uScale.value = Math.max(viewport.width, viewport.height) * (0.62 + bass * 0.03)
  })

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  )
}

interface ChladniFieldProps {
  progressRef: React.RefObject<number>
  /** Dial the whole field back on content-heavy routes. */
  intensity?: number
  tiltRef?: React.RefObject<TiltReading> | null
  /** Amplify audio response. The fullscreen visualiser turns this up. */
  drive?: number
  /** Skip the readability vignette — the visualiser wants the full field. */
  bare?: boolean
}

export default function ChladniField({
  progressRef,
  intensity = 1,
  tiltRef = null,
  drive = 1,
  bare = false,
}: ChladniFieldProps) {
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // The chunk arrives after first paint; fade in so the field resolves
  // rather than popping in over an already-settled page.
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        opacity: ready ? intensity : 0,
        transition: 'opacity 1.4s var(--ease-out-expo)',
      }}
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <Field
          progressRef={progressRef}
          tiltRef={tiltRef}
          reducedMotion={reducedMotion}
          drive={drive}
          baseOpacity={bare ? 0.85 : 0.55}
        />
      </Canvas>

      {/* Radial vignette: keeps the centre of the page legible by fading
          the field out behind body copy. Deliberately strong — the
          pattern is at its best framing the edges, and unreadable text
          is never worth a prettier background. The visualiser opts out. */}
      {!bare && (
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 72% at 50% 42%, rgba(251,252,255,0.95) 0%, rgba(251,252,255,0.80) 38%, rgba(251,252,255,0.42) 62%, rgba(251,252,255,0) 88%)',
          }}
        />
      )}
    </div>
  )
}
