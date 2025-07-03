'use client'
import { useTheme } from '@/context/ThemeContext'
import { useEffect, useRef, useState, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Link from 'next/link'
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const navbarRef = useRef<HTMLElement>(null)
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([])
  const [activeLink, setActiveLink] = useState<string>('home')
  const pathname = usePathname()

  // Nav links data
  const navLinks = useMemo(() => [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' }
  ], [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    gsap.registerPlugin(ScrollTrigger)

    if (!navbarRef.current || !linksRef.current) return
    
    // Navbar entry animation
    gsap.fromTo(
      navbarRef.current,
      { y: -100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out'
      }
    )

    // Link animations
    gsap.fromTo(
      linksRef.current.filter(Boolean),
      { y: -20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        delay: 0.3,
        ease: 'back.out(1.2)'
      }
    )

    // Scroll effect - shrink navbar
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'max',
      onUpdate: (self) => {
        if (!navbarRef.current) return
        
        if (self.direction === -1 && self.scroll() > 100) {
          gsap.to(navbarRef.current, {
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
            backdropFilter: 'blur(12px)',
            duration: 0.3
          })
        } else if (self.scroll() < 100) {
          gsap.to(navbarRef.current, {
            paddingTop: '1rem',
            paddingBottom: '1rem',
            backdropFilter: 'blur(8px)',
            duration: 0.3
          })
        }
      }
    })

    // Highlight active section
    const sections = navLinks.map(link => document.getElementById(link.id))
    
    const scrollHandler = () => {
      sections.forEach(section => {
        if (section) {
          const rect = section.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveLink(section.id)
          }
        }
      })
    }
    
    // Set initial active link based on URL hash
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.substring(1)
      if (navLinks.some(link => link.id === hash)) {
        setActiveLink(hash)
      }
    }
    
    window.addEventListener('scroll', scrollHandler)
    return () => {
      window.removeEventListener('scroll', scrollHandler)
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [pathname, navLinks])

  const handleLinkClick = (linkId: string) => {
    setActiveLink(linkId)
    const element = document.getElementById(linkId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      ref={navbarRef}
      className="fixed w-full z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 shadow-sm transition-all duration-300 px-4 py-4"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link 
          href="/" 
          className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent"
        >
          Ultra Portfolio
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link, i) => (
            <button 
              key={link.id} 
              ref={(el) => {
                if(el) linksRef.current[i] = el as any
              }}
              className={`relative px-3 py-2 transition-colors ${activeLink === link.id ? 
                'text-indigo-500 font-medium' : 'text-gray-700 dark:text-gray-300 hover:text-indigo-500'
              }`}
              onClick={() => handleLinkClick(link.id)}
            >
              {link.label}
              {activeLink === link.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-full"></span>
              )}
            </button>
          ))}
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <MoonIcon className="w-5 h-5 text-gray-700" />
            ) : (
              <SunIcon className="w-5 h-5 text-yellow-400" />
            )}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  )
}