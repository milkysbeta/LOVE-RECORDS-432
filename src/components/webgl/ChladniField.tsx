import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/* ------------------------------------------------------------------ *
 *  Chladni cymatic particle field
 *
 *  A Chladni plate is a metal sheet bowed or driven at a resonant
 *  frequency; sand on its surface migrates away from the antinodes and
 *  settles along the *nodal lines*, where the standing wave amplitude is
 *  zero. The result is the figure you get when you make a frequency
 *  visible — which is the whole premise of a label that tunes to 432.
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
 *  patterns. Scroll position drives the morph.
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

    // Scatter around the line so it reads as settled sand, not wireframe.
    float ang = hash(aSeed) * 6.2831853;
    float rad = hash(aSeed + 7.7);
    p += vec2(cos(ang), sin(ang)) * rad * uJitter;

    // Slow vertical breathing keeps the plate alive while static.
    float z = (hash(aSeed + 3.3) - 0.5) * 0.55;
    z += sin(uTime * 0.35 + aSeed * 12.0) * 0.03;
    vDepth = z;

    vec3 world = vec3(p * uScale, z * uScale * 0.35);

    // Pointer parallax — deeper particles swing further, so the field
    // gains volume as the cursor moves.
    world.x += uPointer.x * (0.05 + (z + 0.3) * 0.30) * uScale;
    world.y += uPointer.y * (0.05 + (z + 0.3) * 0.30) * uScale;

    vec4 mv = modelViewMatrix * vec4(world, 1.0);
    gl_Position = projectionMatrix * mv;

    vShade = rad;
    gl_PointSize = uSize * (1.0 + z) * (300.0 / max(-mv.z, 0.001));
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

interface FieldProps {
  /** 0→1 across the page; drives which mode the plate is resonating in. */
  progressRef: React.RefObject<number>
  reducedMotion: boolean
}

function Field({ progressRef, reducedMotion }: FieldProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const pointer = useRef(new THREE.Vector2(0, 0))
  const smoothed = useRef(new THREE.Vector2(0, 0))
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
      uColorNear: { value: new THREE.Color('#2f5fe0') },
      uColorFar: { value: new THREE.Color('#93aeff') },
      uOpacity: { value: 0.55 },
    }),
    [],
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

    const t = state.clock.elapsedTime
    mat.uniforms.uTime.value = reducedMotion ? 0 : t

    // Scroll drives the walk through the mode list; a slow autonomous
    // drift keeps it moving even when the page is still.
    const drift = reducedMotion ? 0 : t * 0.02
    const pos = (progressRef.current ?? 0) * (MODES.length - 1) + drift
    const i = Math.floor(pos) % MODES.length
    const j = (i + 1) % MODES.length
    const f = pos - Math.floor(pos)
    // Smoothstep the blend so the figure lingers on each resonance
    // instead of sliding through at constant speed.
    const e = f * f * (3 - 2 * f)

    mat.uniforms.uM.value = THREE.MathUtils.lerp(MODES[i][0], MODES[j][0], e)
    mat.uniforms.uN.value = THREE.MathUtils.lerp(MODES[i][1], MODES[j][1], e)

    // Ease the pointer so parallax glides rather than snaps.
    const k = 1 - Math.pow(0.001, delta)
    smoothed.current.lerp(pointer.current, reducedMotion ? 0 : k)
    mat.uniforms.uPointer.value.copy(smoothed.current)

    // Fill the viewport regardless of aspect ratio.
    mat.uniforms.uScale.value = Math.max(viewport.width, viewport.height) * 0.62
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
}

export default function ChladniField({ progressRef, intensity = 1 }: ChladniFieldProps) {
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
        <Field progressRef={progressRef} reducedMotion={reducedMotion} />
      </Canvas>

      {/* Radial vignette: keeps the centre of the page legible by fading
          the field out behind body copy. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 62% 55% at 50% 45%, rgba(251,252,255,0.86) 0%, rgba(251,252,255,0.45) 45%, rgba(251,252,255,0) 78%)',
        }}
      />
    </div>
  )
}
