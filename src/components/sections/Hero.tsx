'use client'
import { gsap } from 'gsap'
import * as THREE from 'three'
import { Suspense, useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, Float, Html } from '@react-three/drei'
import type { Mesh, Material } from 'three'

// Register GSAP plugins once (client-side only)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}
// Define types for GLTF model
type GLTFResult = {
  nodes: {
    Cube: Mesh
    Screen: Mesh
    Keyboard: Mesh
  }
  materials: {
    Material: Material
    Screen: Material
    Keyboard: Material
  }
}

// 3D Model Component
function LaptopModel() {
  const group = useRef<THREE.Group>(null)
  const [error] = useState<string | null>(null)
  const { nodes, materials } = useGLTF('/assets/model/3d_model.glb') as unknown as GLTFResult
  
  useFrame((state) => {
    if (!group.current) return
    
    const t = state.clock.getElapsedTime()
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x, 
      Math.cos(t / 2) / 10 + 0.25, 
      0.1
    )
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y, 
      Math.sin(t / 4) / 10, 
      0.1
    )
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z, 
      Math.sin(t / 4) / 20, 
      0.1
    )
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y, 
      (-5 + Math.sin(t / 2)) / 5, 
      0.1
    )
  })

  // 3. Show error message if model fails to load
  if (error) {
    return (
      <Html center>
        <div className="text-red-500">Failed to load 3D model</div>
      </Html>
    )
  }

  // 4. Verify nodes exist before rendering
  if (!nodes?.Cube || !nodes?.Screen || !nodes?.Keyboard) {
    return (
      <Html center>
        <div className="text-green-500">Loading 3D model...</div>
      </Html>
    )
  }

  return (
    <group ref={group} dispose={null}>
      <group rotation={[0.1, 0, 0]}>
        <mesh 
          geometry={nodes.Cube.geometry} 
          material={materials.Material}
          position={[0, 0.05, 0]}
          rotation={[0, 0, 0]}
          castShadow
          receiveShadow
        />
        <mesh 
          geometry={nodes.Screen.geometry} 
          material={materials.Screen} 
          position={[0, 0.04, -0.1]} 
          rotation={[0, 0, 0]}
          castShadow
          receiveShadow
        />
        <mesh 
          geometry={nodes.Keyboard.geometry} 
          material={materials.Keyboard} 
          position={[0, -0.03, 0.02]} 
          castShadow
          receiveShadow
        />
      </group>
    </group>
  )
}
// 5. Add error boundary
function ModelWithErrorBoundary() {
  return (
    <Suspense fallback={
      <Html center>
        <div className="text-white">Loading...</div>
      </Html>
    }>
      <LaptopModel />
    </Suspense>
  )
}

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!textRef.current || !particlesRef.current || !heroRef.current || !canvasRef.current) return
    
    // Kill existing animations first
    gsap.killTweensOf([
      textRef.current.children,
      particlesRef.current.children,
      canvasRef.current
    ])

    // Master timeline for hero section
    const tl = gsap.timeline()
    
    // Text animation
    tl.fromTo(
      textRef.current.children,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.2,
        ease: 'power4.out',
      }
    )

    // Particle animation
    const particles = Array.from(particlesRef.current.children) as HTMLDivElement[]
    gsap.fromTo(
      particles,
      { 
        y: (i: number) => i % 2 === 0 ? -100 : 100,
        x: (i: number) => (i % 3 === 0 ? -50 : i % 3 === 1 ? 0 : 50),
        opacity: 0,
      },
      {
        y: 0,
        x: 0,
        opacity: 0.6,
        duration: 2,
        stagger: 0.1,
        ease: 'elastic.out(1, 0.5)',
      }
    )

    // Floating animation for particles
    Array.from(particles).forEach((particle: Element, i: number) => {
      gsap.to(particle, {
        y: i % 2 === 0 ? 20 : -20,
        duration: 3 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    })

    // Scroll animation for hero section
    const scrollTrigger = ScrollTrigger.create({
      trigger: heroRef.current,
      start: 'top top',
      end: 'bottom top',
      onLeave: () => {
        gsap.to(canvasRef.current, {
          scale: 0.8,
          opacity: 0,
          duration: 1,
          ease: 'power3.inOut',
        })
      },
      onEnterBack: () => {
        gsap.to(canvasRef.current, {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'power3.inOut',
        })
      },
    })
    return () => {
      scrollTrigger.kill()
    }
  }, [])

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated background particles */}
      <div ref={particlesRef} className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${i % 3 === 0 ? 'bg-neon-pink' : i % 3 === 1 ? 'bg-neon-blue' : 'bg-neon-green'}`}
            style={{
              width: `${5 + Math.random() * 10}px`,
              height: `${5 + Math.random() * 10}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.6,
              filter: 'blur(1px)',
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-background-light dark:to-background-dark"></div>

      <div className="container mx-auto px-6 relative z-20">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div ref={textRef} className="md:w-1/2">
            <h1 className="animate-char text-5xl md:text-7xl font-bold mb-6 gradient-text animate-word animate-text">
              Hi, I&apos;m <span className="neon-text text-primary-light dark:text-primary-dark">Fahadkhan</span>
            </h1>
            <h2 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mb-8 animate-pulse-slow">
              Creative <span className="gradient-text font-bold">Full Stack Developer</span>
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-lg leading-relaxed">
              I craft <span className="font-semibold text-primary-light dark:text-primary-dark">immersive digital experiences</span> with cutting-edge technologies and stunning visuals.
            </p>
            <div className="flex space-x-4">
              <button className="btn-primary">
                View My Work
              </button>
              <button className="btn-secondary">
                Contact Me
              </button>
            </div>
          </div>

          <div className="md:w-1/2 mt-10 md:mt-0 relative h-64 md:h-96 w-full">
            <div ref={canvasRef} className="absolute inset-0 h-full w-full">
              <Canvas
                dpr={[1, 1.5]}
                shadows
                camera={{ position: [0, 0, 8], fov: 50 }}
                gl = {{ antialias: true }}
              >
                <ambientLight intensity={0.5} />
                <pointLight 
                  position={[10, 10, 10]}
                  intensity={1}
                  castShadow 
                />
                <spotLight
                  castShadow
                  shadow-mapSize={[ 2048, 2048 ]}
                  shadow-bias={-0.0001}
                  position={[0, 10, 0]} 
                  angle={0.15} 
                  penumbra={1} 
                  intensity={1} 
                />
                <Environment preset="city" />
                <Float speed={2} rotationIntensity={1} floatIntensity={2}>
                  <LaptopModel />
                </Float>
                <ModelWithErrorBoundary />
                <OrbitControls 
                  enableZoom={false} 
                  autoRotate 
                  autoRotateSpeed={1.5}
                  minPolarAngle={Math.PI / 4}
                  maxPolarAngle={Math.PI / 2}
                />
              </Canvas>
            </div>
          </div>
        </div>
      </div>

      {/* Animated scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
        <div className="animate-bounce-slow flex flex-col items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400 mb-2">Scroll Down</span>
          <svg
            className="w-6 h-6 text-primary-light dark:text-primary-dark"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  )
}
// 6. Preload with error handling
try {
  useGLTF.preload('/assets/model/3d_laptop.glb')
} catch (err) {
  console.error('Failed to preload model:', err)
}