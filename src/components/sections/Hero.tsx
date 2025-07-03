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
    [key: string]: Mesh
  }
  materials: {
    [key: string]: Material
  }
}

// 3D Model Component with fallback
function LaptopModel() {
  const group = useRef<THREE.Group>(null)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  let gltf: GLTFResult | null = null
  
  try {
    gltf = useGLTF('/assets/model/3d_laptop.glb') as unknown as GLTFResult
    if (gltf && !modelLoaded) {
      setModelLoaded(true)
    }
  } catch (err) {
    if (!error) {
      setError('Model failed to load')
    }
  }
  
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

  // Fallback geometric laptop if model fails
  if (error || !gltf) {
    return (
      <group ref={group} dispose={null}>
        {/* Laptop base */}
        <mesh position={[0, -0.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[3, 0.2, 2]} />
          <meshStandardMaterial color="#2d3748" />
        </mesh>
        {/* Laptop screen */}
        <mesh position={[0, 0.8, -0.9]} rotation={[-0.2, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.8, 1.8, 0.1]} />
          <meshStandardMaterial color="#1a202c" />
        </mesh>
        {/* Screen content */}
        <mesh position={[0, 0.8, -0.85]} rotation={[-0.2, 0, 0]}>
          <planeGeometry args={[2.6, 1.6]} />
          <meshStandardMaterial color="#4299e1" emissive="#4299e1" emissiveIntensity={0.3} />
        </mesh>
      </group>
    )
  }

  // Try to render the actual model
  const firstNode = Object.values(gltf.nodes)[0]
  const firstMaterial = Object.values(gltf.materials)[0]

  return (
    <group ref={group} dispose={null}>
      <mesh 
        geometry={firstNode?.geometry} 
        material={firstMaterial}
        castShadow
        receiveShadow
        scale={[2, 2, 2]}
      />
    </group>
  )
}

// Error boundary component
function ModelWithErrorBoundary() {
  return (
    <Suspense fallback={
      <Html center>
        <div className="text-white bg-black/50 px-4 py-2 rounded">Loading 3D Model...</div>
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
    if (typeof window === 'undefined') return
    
    gsap.registerPlugin(ScrollTrigger)
    
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
      Array.from(textRef.current.children),
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
    particles.forEach((particle: Element, i: number) => {
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
      tl.kill()
    }
  }, [])

  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects')
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"
    >
      {/* Animated background particles */}
      <div ref={particlesRef} className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${i % 3 === 0 ? 'bg-pink-500' : i % 3 === 1 ? 'bg-blue-500' : 'bg-green-500'}`}
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

      <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-gray-900/50"></div>

      <div className="container mx-auto px-6 relative z-20">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div ref={textRef} className="md:w-1/2 text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
              Hi, I&apos;m <span className="neon-text text-indigo-400">Fahadkhan</span>
            </h1>
            <h2 className="text-2xl md:text-3xl text-gray-300 mb-8 animate-pulse-slow">
              Creative <span className="gradient-text font-bold">Full Stack Developer</span>
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-lg leading-relaxed">
              I craft <span className="font-semibold text-indigo-400">immersive digital experiences</span> with cutting-edge technologies and stunning visuals.
            </p>
            <div className="flex space-x-4">
              <button onClick={scrollToProjects} className="btn-primary">
                View My Work
              </button>
              <button onClick={scrollToContact} className="btn-secondary">
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
                gl={{ antialias: true }}
              >
                <ambientLight intensity={0.5} />
                <pointLight 
                  position={[10, 10, 10]}
                  intensity={1}
                  castShadow 
                />
                <spotLight
                  castShadow
                  shadow-mapSize={[2048, 2048]}
                  shadow-bias={-0.0001}
                  position={[0, 10, 0]} 
                  angle={0.15} 
                  penumbra={1} 
                  intensity={1} 
                />
                <Environment preset="city" />
                <Float speed={2} rotationIntensity={1} floatIntensity={2}>
                  <ModelWithErrorBoundary />
                </Float>
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
          <span className="text-sm text-gray-400 mb-2">Scroll Down</span>
          <svg
            className="w-6 h-6 text-indigo-400"
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