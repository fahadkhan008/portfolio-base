'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useInView } from 'react-intersection-observer'

gsap.registerPlugin(ScrollTrigger)

interface Skill {
  name: string
  level: number
  color: string
  description: string
}

export default function About() {
  const [activeSkill, setActiveSkill] = useState<number | null>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const skillsRef = useRef<HTMLDivElement>(null)
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: false
  })

  const skills: Skill[] = [
    { name: 'Next.js', level: 90, color: 'bg-red-500', description: 'Server-side rendering and static site generation' },
    { name: 'React', level: 95, color: 'bg-blue-500', description: '3+ years building complex applications' },
    { name: 'Three.js', level: 85, color: 'bg-green-400', description: 'Interactive 3D web experiences' },
    { name: 'GSAP', level: 90, color: 'bg-purple-400', description: 'Advanced animations and scroll effects' },
    { name: 'Node.js', level: 88, color: 'bg-green-500', description: 'Backend services and APIs' },
    { name: 'Python/Django', level: 82, color: 'bg-yellow-500', description: 'Full-stack web applications' },
    { name: 'UI/UX Design', level: 78, color: 'bg-pink-400', description: 'User-centered design principles' },
    { name: 'TypeScript', level: 80, color: 'bg-indigo-400', description: 'Strongly typed JavaScript development' },
    { name: 'Tailwind CSS', level: 85, color: 'bg-orange-400', description: 'Utility-first CSS framework' },
    { name: 'HTML/CSS', level: 90, color: 'bg-teal-400', description: 'Semantic and accessible web standards' },
  ]

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    gsap.registerPlugin(ScrollTrigger)

    if (!aboutRef.current || !skillsRef.current) return

    gsap.killTweensOf([aboutRef.current.children, skillsRef.current.children])
    
    // About section animation
    const aboutTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: aboutRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    })

    const aboutChildren = Array.from(aboutRef.current.children) as HTMLElement[]
    const skillsChildren = Array.from(skillsRef.current.children) as HTMLElement[]

    aboutTimeline.fromTo(
      aboutChildren,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: aboutRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    )

    // Skills animation
    if (inView) {
      const skillsTimeline = gsap.timeline()
      skillsTimeline.fromTo(
        skillsChildren,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1.5,
          stagger: 0.1,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: skillsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          }
        }
      )
    }
    
    return () => {
      aboutTimeline.kill()
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [inView])

  return (
    <section id="about" ref={ref} className="py-20 bg-gradient-to-b from-white to-gray-100 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6">
        <div ref={aboutRef} className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            About <span className="gradient-text">Me</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            I&apos;m a passionate developer with expertise in creating immersive web experiences that combine
            functionality with stunning visuals.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
              My <span className="gradient-text">Journey</span>
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              With over 5 years in the industry, I&apos;ve worked with startups and Fortune 500 companies
              to create digital products that users love. My approach combines technical excellence
              with creative design thinking.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              I specialize in building performant, accessible, and visually striking web applications
              using modern JavaScript frameworks and cutting-edge CSS techniques.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <h4 className="font-bold text-indigo-500 mb-2">5+</h4>
                <p className="text-gray-600 dark:text-gray-300">Years Experience</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <h4 className="font-bold text-indigo-500 mb-2">50+</h4>
                <p className="text-gray-600 dark:text-gray-300">Projects Completed</p>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
              My <span className="gradient-text">Skills</span>
            </h3>
            <div ref={skillsRef} className="space-y-6">
              {skills.map((skill, index) => (
                <div 
                  key={index}
                  className="group"
                  onMouseEnter={() => setActiveSkill(index)}
                  onMouseLeave={() => setActiveSkill(null)}
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-indigo-500 transition-colors">
                      {skill.name}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className={`${skill.color} h-3 rounded-full relative`}
                      style={{ width: `${skill.level}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse-slow"></div>
                    </div>
                  </div>
                  {activeSkill === index && (
                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 transition-all duration-300">
                      {skill.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}