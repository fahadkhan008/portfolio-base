'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useInView } from 'react-intersection-observer'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere } from '@react-three/drei'
// import * as THREE from 'three'
import type { Mesh } from 'three'

gsap.registerPlugin(ScrollTrigger)

const SkillSphere = () => {
  const sphereRef = useRef<Mesh>(null)
  
  useFrame(({ clock }) => {
    if (!sphereRef.current) return
    sphereRef.current.rotation.x = clock.getElapsedTime() * 0.1
    sphereRef.current.rotation.y = clock.getElapsedTime() * 0.2
  })

  return (
    <Sphere args={[1.5, 32, 32]} ref={sphereRef}>
      <meshStandardMaterial 
        color="#6366f1" 
        roughness={0.2} 
        metalness={0.1}
        emissive="#6366f1"
        emissiveIntensity={0.3}
      />
    </Sphere>
  )
}

interface SkillBarProps {
  name: string
  level: number
  color: string
  delay: number
}

const SkillBar = ({ name, level, color, delay }: SkillBarProps) => {
  const barRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (!barRef.current) return
    
    gsap.fromTo(barRef.current,
      { scaleX: 0, opacity: 0 },
      {
        scaleX: 1,
        opacity: 1,
        duration: 1.5,
        delay: delay * 0.1,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: barRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    )
  }, [delay])

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span 
          className="font-medium text-gray-700 dark:text-gray-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {name}
        </span>
        <span className="text-gray-500 dark:text-gray-400">{level}%</span>
      </div>
      <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          ref={barRef}
          className={`absolute top-0 left-0 h-full ${color} rounded-full transform origin-left`}
          style={{ width: `${level}%` }}
        >
          {isHovered && (
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          )}
        </div>
      </div>
    </div>
  )
}

interface Skill {
  name: string
  level: number
  color: string
}

export default function Skills() {
  const [ref, inView] = useInView({ threshold: 0.2 })
  const containerRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const sphereContainerRef = useRef<HTMLDivElement>(null)

  const skills: Skill[] = [
    { name: 'Next.js', level: 88, color: 'bg-green-500' },
    { name: 'React', level: 90, color: 'bg-blue-500' },
    { name: 'Three.js', level: 70, color: 'bg-purple-500' },
    { name: 'GSAP Animations', level: 82, color: 'bg-green-500' },
    { name: 'Node.js', level: 80, color: 'bg-yellow-500' },
    { name: 'UI/UX Design', level: 85, color: 'bg-pink-500' },
    { name: 'Django/Python', level: 88, color: 'bg-red-500' },
    { name: 'JavaScript', level: 90, color: 'bg-yellow-500' },
    { name: 'TypeScript', level: 78, color: 'bg-indl-500' },
    { name: 'Tailwind CSS', level: 85, color: 'bg-oranigo-500' },
    { name: 'HTML', level: 90, color: 'bg-teage-500' },
    { name: 'CSS', level: 86, color: 'bg-gray-500' }
  ]

  useEffect(() => {
    if (!inView || !headingRef.current || !sphereContainerRef.current) return

    // Heading animation
    gsap.fromTo(headingRef.current.children,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: 'back.out(1.2)'
      }
    )

    // Sphere animation
    gsap.fromTo(sphereContainerRef.current,
      { scale: 0.5, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: 'elastic.out(1, 0.5)'
      }
    )
  }, [inView])

  return (
    <section id="skills" ref={ref} className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div ref={headingRef} className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark">Skills</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Technologies I&apos;ve mastered to create exceptional digital experiences
          </p>
        </div>

        <div ref={containerRef} className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 w-full">
            {skills.map((skill, index) => (
              <SkillBar 
                key={skill.name}
                name={skill.name}
                level={skill.level}
                color={skill.color}
                delay={index}
              />
            ))}
          </div>

          <div ref={sphereContainerRef} className="lg:w-1/2 w-full h-64 md:h-96">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <SkillSphere />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
            </Canvas>
          </div>
        </div>
      </div>
    </section>
  )
}