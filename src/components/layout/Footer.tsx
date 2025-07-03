'use client'
import { useTheme } from '@/context/ThemeContext'
import { useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { gsap } from 'gsap'
import Link from 'next/link'

export default function Footer() {
  const { theme } = useTheme()
  const footerRef = useRef<HTMLElement>(null)
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([])
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    gsap.registerPlugin(ScrollTrigger)

    const initAnimations = () => {
      if (!footerRef.current || !textRef.current) return

      // Clean up previous instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())

      // Footer animation
      gsap.fromTo(
        footerRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      )

      // Links animation
      const validLinks = linksRef.current.filter(Boolean) as HTMLElement[]
      if (validLinks.length > 0) {
        gsap.fromTo(
          validLinks,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            delay: 0.3,
            ease: 'back.out(1.2)',
          }
        )
      }

      // Text animation
      if (textRef.current.children.length > 0) {
        gsap.fromTo(
          Array.from(textRef.current.children),
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            delay: 0.5,
            ease: 'back.out(1.2)',
          }
        )
      }
    }

    try {
      initAnimations()
    } catch (error) {
      console.error('Animation error:', error)
    }

    return () => {
      if (typeof window !== 'undefined') {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      }
    }
  }, [])

  const socialLinks = [
    { name: 'github', href: '#', icon: 'M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.23c-3.338.726-4.033-1.61-4.033-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.835 2.807 1.305 3.492.997a2.557 2.557 0 0 1 .77-1.59c-2.665-.305-5.467-1.334-5.467-5.93a4.63 4.63 0 0 1 1.233-3.208c-.123-.303-.534-1.524.117-3 .001 0 .999-.32 3 .996a10.47 10.47 0 0 1 5.455-.001c2-.999 3-.996 3-.996s1 .697 1 .996c0 .476-.123 2 .117 3a4.63 4.63 0 0 1 1.233 3c0 4.61-2.81 5.622-5.48 5.92a2.57 2.57 0 0 1 .771 2c0 .998-.009 2-.009 2 .001 .319 .192 .694 .801 .576A12C12z' },
    { name: 'linkedin', href: '#', icon: 'M20.447 20.452h-3.554v-5.569c0-1.327-.027-3.036-1.85-3.036-1.85 0-2.134 1.445-2.134 2.938v5.667H9.305V9h3.413v1.561h.049c.477-.9 1.64-1.85 3.37-1.85 3.6 0 4.267 2.37 4.267 5.45v6.291zM5 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm1.775 13H3V9h3.775v11z' },
    { name: 'twitter', href: '#', icon: 'M23.954 4.569c-.885.392-1.83.656-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.564-2.005.974-3.127 1.195-.896-.959-2.178-1.558-3.594-1.558-3.225 0-5.49 3.04-4.797 6.164C7.691 8.094 4.066 6.13 1.64 3.161c-.423.725-.666 1.564-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v0c0 .03 0 .06 0 .09a4.22 4.22 0 0 0 3.384 4.14c-.445.12-.915.18-1.398.18-.34 0-.67-.033-.99-.095a4.23 4.23 0 0 0 3.946 2.93A8.48 8.48 0 0 1 .96 19a11.98 11.98 0 0 0 6.29 1.84c7.547 0 11.675-6.25 11-11 .75-.54 1.-1 .75-1z' },
    { name: 'instagram', href: '#', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
  ]

  return (
    <footer
      ref={footerRef}
      className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-800'} text-gray-300 py-12 relative overflow-hidden`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${i % 3 === 0 ? 'bg-pink-500' : i % 3 === 1 ? 'bg-blue-500' : 'bg-green-500'}`}
            style={{
              width: `${3 + Math.random() * 5}px`,
              height: `${3 + Math.random() * 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.3,
              filter: 'blur(1px)',
              animation: `float ${8 + Math.random() * 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0" ref={textRef}>
            <h3 className="text-2xl font-bold text-white mb-2">Fahad Khan</h3>
            <p className="text-gray-400">Creating digital experiences that matter</p>
          </div>

          <div className="flex space-x-6 mb-6 md:mb-0">
            {socialLinks.map((social, i) => (
              <Link 
                href={social.href} 
                key={social.name} 
                ref={(el: HTMLAnchorElement | null) => {
                  if(el) linksRef.current[i] = el
                }}
                className="w-10 h-10 flex items-center justify-center bg-gray-700/50 hover:bg-indigo-500 rounded-full transition-all duration-300 transform hover:scale-110 hover:text-white"
                aria-label={social.name}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d={social.icon} />
                </svg>
              </Link>
            ))}
          </div>

          <div className="text-center md:text-right">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Fahad Khan. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Built with Next.js, Tailwind, Three.js, and GSAP
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700/50 text-center">
          <p className="text-gray-500 text-sm">
            Made with ❤️ and lots of coffee
          </p>
        </div>
      </div>
    </footer>
  )
}