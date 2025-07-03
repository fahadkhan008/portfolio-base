'use client'
import { gsap } from 'gsap'

type CursorType = 'default' | 'link' | 'button' | 'text'

export const initCustomCursor = (cursorRef: React.RefObject<HTMLDivElement>) => {
  if (typeof window === 'undefined' || !cursorRef.current) return () => {}

  const cursor = cursorRef.current
  cursor.style.display = window.innerWidth > 768 ? 'block' : 'none'

  const moveCursor = (e: MouseEvent) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  const handleMouseDown = () => {
    gsap.to(cursor, {
      scale: 0.8,
      duration: 0.1,
      onComplete: () => {
        gsap.to(cursor, { scale: 1, duration: 0.3 })
      }
    })
  }

  const handleMouseUp = () => {
    gsap.to(cursor, {
      scale: 1,
      duration: 0.3
    })
  }

  const updateCursor = (type: CursorType) => {
    const states = {
      default: { scale: 1, bg: 'rgba(99, 102, 241, 0.2)', border: 'rgba(99, 102, 241, 0.3)' },
      link: { scale: 1.8, bg: 'rgba(99, 102, 241, 0.5)', border: 'rgba(99, 102, 241, 0.8)' },
      button: { scale: 2, bg: 'rgba(236, 72, 153, 0.5)', border: 'rgba(236, 72, 153, 0.8)' },
      text: { scale: 1.3, bg: 'rgba(16, 185, 129, 0.5)', border: 'rgba(16, 185, 129, 0.8)' }
    }

    gsap.to(cursor, {
      scale: states[type].scale,
      backgroundColor: states[type].bg,
      borderColor: states[type].border,
      duration: 0.3
    })
  }

  const handleHover = (e: Event) => {
    const target = e.currentTarget as HTMLElement
    const type = (target.dataset.cursor as CursorType) || 'default'
    updateCursor(type)
  }

  const handleHoverEnd = () => updateCursor('default')

  // Setup event listeners
  const hoverElements = document.querySelectorAll(
    'a, button, .cursor-hover, input, textarea, [data-cursor]'
  )

  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', handleHover)
    el.addEventListener('mouseleave', handleHoverEnd)
  })

  document.addEventListener('mousemove', moveCursor)
  document.addEventListener('mousedown', handleMouseDown)
  document.addEventListener('mouseup', handleMouseUp)

  return () => {
    document.removeEventListener('mousemove', moveCursor)
    document.removeEventListener('mousedown', handleMouseDown)
    document.removeEventListener('mouseup', handleMouseUp)
    
    hoverElements.forEach(el => {
      el.removeEventListener('mouseenter', handleHover)
      el.removeEventListener('mouseleave', handleHoverEnd)
    })
  }
}

export const updateCursorState = (cursorRef: React.RefObject<HTMLDivElement>, type: CursorType) => {
  if (!cursorRef.current) return
    const cursor = cursorRef.current
    gsap.to(cursor, {
        scale: type === 'link' ? 1.8 : type === 'button' ? 2 : type === 'text' ? 1.3 : 1,
        backgroundColor: type === 'link' ? 'rgba(99, 102, 241, 0.5)' :
                         type === 'button' ? 'rgba(236, 72, 153, 0.5)' :
                         type === 'text' ? 'rgba(16, 185, 129, 0.5)' :
                         'rgba(99, 102, 241, 0.2)',
        borderColor: type === 'link' ? 'rgba(99, 102, 241, 0.8)' :
                        type === 'button' ? 'rgba(236, 72, 153, 0.8)' :
                        type === 'text' ? 'rgba(16, 185, 129, 0.8)' :
                        'rgba(99, 102, 241, 0.3)',
        duration: 0.3
        })
  // Implementation similar to updateCursor above
}