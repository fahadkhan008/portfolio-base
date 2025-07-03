'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Project {
  id: number
  title: string
  description: string
  tags: string[]
  image: string
  bgColor: string
}

const projects: Project[] = [
  {
    id: 1,
    title: '3D E-commerce Platform',
    description: 'An immersive shopping experience with 3D product visualization and AR capabilities.',
    tags: ['React', 'Three.js', 'Node.js'],
    image: '/project1.jpg',
    bgColor: 'bg-gradient-to-br from-blue-400 to-purple-500',
  },
  {
    id: 2,
    title: 'Interactive Dashboard',
    description: 'Real-time data visualization with animated charts and custom widgets.',
    tags: ['Next.js', 'D3.js', 'Tailwind CSS'],
    image: '/project2.jpg',
    bgColor: 'bg-gradient-to-br from-green-400 to-teal-500',
  },
  {
    id: 3,
    title: 'AI-Powered App',
    description: 'Machine learning application with custom trained models and intuitive UI.',
    tags: ['Python', 'TensorFlow', 'React'],
    image: '/project3.jpg',
    bgColor: 'bg-gradient-to-br from-yellow-400 to-orange-500',
  },
  {
    id: 4,
    title: 'Virtual Reality Experience',
    description: 'Web-based VR tour with WebXR and interactive elements.',
    tags: ['Three.js', 'WebXR', 'GSAP'],
    image: '/project4.jpg',
    bgColor: 'bg-gradient-to-br from-pink-400 to-red-500',
  },
]

export default function Projects() {
  const projectsRef = useRef<HTMLDivElement>(null)
  const projectItemsRef = useRef<(HTMLDivElement | null)[]>([])
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!titleRef.current || !projectItemsRef.current || !projectsRef.current) return

    // Title animation
    gsap.fromTo(
      titleRef.current.children,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    )

    // Project items animation
    projectItemsRef.current.forEach((item, index) => {
      if (!item) return

      gsap.fromTo(
        item,
        { 
          y: 100,
          opacity: 0,
          rotationY: 20,
        },
        {
          y: 0,
          opacity: 1,
          rotationY: 0,
          duration: 0.8,
          delay: index * 0.15,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )

      // Hover animation
      const mouseEnterHandler = () => {
        gsap.to(item, {
          y: -10,
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out',
        })
      }

      const mouseLeaveHandler = () => {
        gsap.to(item, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        })
      }

      item.addEventListener('mouseenter', mouseEnterHandler)
      item.addEventListener('mouseleave', mouseLeaveHandler)

      return () => {
        item.removeEventListener('mouseenter', mouseEnterHandler)
        item.removeEventListener('mouseleave', mouseLeaveHandler)
      }
    })

    // Perspective effect on scroll
    ScrollTrigger.create({
      trigger: projectsRef.current,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => {
        gsap.to(projectItemsRef.current.filter(Boolean), {
          rotationY: -5,
          transformPerspective: 1000,
          transformOrigin: 'center center',
          duration: 1,
          ease: 'power3.out',
        })
      },
      onLeaveBack: () => {
        gsap.to(projectItemsRef.current.filter(Boolean), {
          rotationY: 0,
          duration: 1,
          ease: 'power3.out',
        })
      },
    })
  }, [])

  return (
    <section id="projects" ref={projectsRef} className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Here are some of my recent projects that showcase my skills and creativity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              ref={(el) => {
                if(el) projectItemsRef.current[index] = el
              }}
              className={`card transform transition-all duration-500 hover:z-10 hover:shadow-3xl ${project.bgColor} bg-opacity-10 dark:bg-opacity-20 backdrop-blur-sm`}
            >
              <div className="h-60 relative overflow-hidden rounded-t-2xl">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 z-10"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-32 h-32 rounded-full ${project.bgColor} opacity-20 blur-xl`}></div>
                </div>
                <div className="absolute bottom-6 left-6 z-20">
                  <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 bg-white/20 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 rounded-full text-sm backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <button className="text-primary-light dark:text-primary-dark font-medium hover:underline flex items-center">
                    View Case Study
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                  <button className="p-2 rounded-full bg-white/20 dark:bg-gray-700/50 hover:bg-white/30 dark:hover:bg-gray-600/50 transition-colors">
                    <svg
                      className="w-5 h-5 text-gray-700 dark:text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="btn-primary px-8 py-3">
            View All Projects
          </button>
        </div>
      </div>
    </section>
  )
}