'use client'
import { useTheme } from '@/context/ThemeContext'
import { useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { gsap } from 'gsap'
import Link from 'next/link'

// Only import GSAP on client-side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Footer() {
  const { theme } = useTheme()
  const footerRef = useRef<HTMLElement>(null)
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([])
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

      const initAnimations = () => {
        if (!footerRef.current || !linksRef.current || !textRef.current) return

        // Clean up previous instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      gsap.killTweensOf([footerRef.current, ...(linksRef.current.filter(Boolean)) as HTMLElement[], ...Array.from(textRef.current.children)])

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
          markers: process.env.NODE_ENV === 'development' // Helpful for debugging
        },
      }
    )

    // Links animation (only if links exist)
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
          { y: 30, 
            opacity: 0 
          },
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
    // Initialize with fallback
    try {
      initAnimations()
    } catch (error) {
      console.error('Animation error:', error)
    }
    // Cleanup
    return () => {
      if (typeof window !== 'undefined') {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill())
        gsap.killTweensOf([
          footerRef.current, 
          ...(linksRef.current.filter(Boolean) as HTMLElement[]), 
          ...(textRef.current ? Array.from(textRef.current.children) : [])
        ])
      }
    }
  }
    , [])

  return (
    <footer
      ref={footerRef}
      className={`bg-${theme === 'dark' ? 'gray-900' : 'gray-800'} text-gray-300 py-12 relative overflow-hidden`}
      // className="{bg-gray-800 dark:bg-gray-900 text-gray-300 py-12 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${i % 3 === 0 ? 'bg-neon-pink' : i % 3 === 1 ? 'bg-neon-blue' : 'bg-neon-green'}`}
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
            {['github', 'linkedin', 'twitter', 'dribbble','instagram'].map((social, i) => (
              <Link href="#" 
                key={social} 
                passHref
                ref={(el: HTMLAnchorElement | null) => {
                  if(el) linksRef.current[i] = el
                }}
                className="w-10 h-10 flex items-center justify-center bg-gray-700/50 hover:bg-primary-light dark:hover:bg-primary-dark rounded-full transition-all duration-300 transform hover:scale-110 hover:text-white"
                aria-label={social}
              >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    {/* SVG paths for social icons would go here */}
                    {social === 'github' && (
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.23c-3.338.726-4.033-1.61-4.033-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.835 2.807 1.305 3.492.997a2.557 2.557 0 0 1 .77-1.59c-2.665-.305-5.467-1.334-5.467-5.93a4.63 4.63 0 0 1 1.233-3.208c-.123-.303-.534-1.524.117-3 .001 0 .999-.32 3 .996a10.47 10.47 0 0 1 5.455-.001c2-.999 3-.996 3-.996s1 .697 1 .996c0 .476-.123 2 .117 3a4.63 4.63 0 0 1 1.233 3c0 4.61-2.81 5.622-5.48 5.92a2.57 2.57 0 0 1 .771 2c0 .998-.009 2-.009 2 .001 .319 .192 .694 .801 .576A12C12z" />
                    )}
                    {social === 'linkedin' && (
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.327-.027-3.036-1.85-3.036-1.85 0-2.134 1.445-2.134 2.938v5.667H9.305V9h3.413v1.561h.049c.477-.9 1.64-1.85 3.37-1.85 3.6 0 4.267 2.37 4.267 5.45v6.291zM5 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm1.775 13H3V9h3.775v11z" />
                    )}
                    {social === 'twitter' && (
                      <path d="M23.954 4.569c-.885.392-1.83.656-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.564-2.005.974-3.127 1.195-.896-.959-2.178-1.558-3.594-1.558-3.225 0-5.49 3.04-4.797 6.164C7.691 8.094 4.066 6.13 1.64 3.161c-.423.725-.666 1.564-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v0c0 .03 0 .06 0 .09a4.22 4.22 0 0 0 3.384 4.14c-.445.12-.915.18-1.398.18-.34 0-.67-.033-.99-.095a4.23 4.23 0 0 0 3.946 2.93A8.48 8.48 0 0 1 .96 19a11.98 11.98 0 0 0 6.29 1.84c7.547 0 11.675-6.25 11-11 .75-.54 1.-1 .75-1z" />
                    )}
                    {social === 'dribbble' && (
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.23c-3.338.726-4.033-1.61-4.033-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.835 2.807 1.305 3.492.997a2.557 2.557 0 0 1 .77-1.59c-2.665-.305-5.467-1.334-5.467-5.93a4.63 4.63 0 0 1 1.233-3.208c-.123-.303-.534-1.524 .117-3 .001 0 .999-.32 3 .996a10.47 10.47 0 0 1 5.455-.001c2-.999 3-.996 3-.996s1 .697 1 .996c0 .476-.123 2 .117 3a4.63 4.63 0 0 1 1.233 3c0 4.61-2.81 5.622-5.48 5.92a2.57 2.57 0 0 1 .771 2c0 .998-.009 2-.009 2 .001 .319 .192 .694 .801 .576A12C12z" />
                    )}
                    {social === 'instagram' && (
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.23c-3.338.726-4.033-1.61-4.033-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.835 2.807 1.305 3.492.997a2.557 2.557 0 0 1 .77-1.59c-2.665-.305-5.467-1.334-5.467-5.93a4.63 4.63 0 0 1 1.233-3.208c-.123-.303-.534-1.524 .117-3 .001 0 .999-.32 3 .996a10.47 10.47 0 0 1 5.455-.001c2-.999 3-.996 3-.996s1 .697 1 .996c0 .476-.123 2 .117 3a4.63 4.63 0 0 1 1.233 3c0 4.61-2.81 5.622-5.48 5.92a2.57 2.57 0 0 1 .771 2c0 .998-.009 2-.009 2 .001 .319 .192 .694 .801 .576A12C12z" />
                    )}
                  </svg>
                {/* </a> */}
              </Link>
            ))}
          </div>

          <div className="text-center md:text-right" ref={textRef}>
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