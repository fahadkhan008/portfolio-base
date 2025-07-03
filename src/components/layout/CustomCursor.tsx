'use client'
import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return
    
    const cursor = cursorRef.current
    if (!cursor) return

    // Only show cursor on desktop
    if (window.innerWidth <= 768) {
      cursor.style.display = 'none'
      return
    }

    cursor.style.display = 'block'

    const moveCursor = (e: MouseEvent) => {
      if (!cursor) return
      cursor.style.left = e.clientX + 'px'
      cursor.style.top = e.clientY + 'px'
    }

    const handleMouseDown = () => {
      if (!cursor) return
      cursor.style.transform = 'translate(-50%, -50%) scale(0.8)'
    }

    const handleMouseUp = () => {
      if (!cursor) return
      cursor.style.transform = 'translate(-50%, -50%) scale(1)'
    }

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement
      if (!cursor) return
      
      if (target.matches('a, button, .cursor-hover, input, textarea')) {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)'
        cursor.style.backgroundColor = 'rgba(99, 102, 241, 0.5)'
      }
    }

    const handleMouseLeave = () => {
      if (!cursor) return
      cursor.style.transform = 'translate(-50%, -50%) scale(1)'
      cursor.style.backgroundColor = 'rgba(99, 102, 241, 0.2)'
    }

    // Add event listeners
    document.addEventListener('mousemove', moveCursor)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    // Add hover effects
    const hoverElements = document.querySelectorAll('a, button, .cursor-hover, input, textarea')
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    return () => {
      document.removeEventListener('mousemove', moveCursor)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      
      hoverElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [mounted])

  if (!mounted) {
    return null
  }

  return (
    <div
      ref={cursorRef}
      className="fixed w-6 h-6 rounded-full pointer-events-none z-50 bg-indigo-200/20 backdrop-blur-sm border border-indigo-400/30 transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference transition-transform duration-300 ease-out hidden"
      style={{ display: 'none' }}
    />
  )
}