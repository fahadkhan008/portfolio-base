'use client'
import { gsap } from 'gsap'

export const initPageAnimations = (element: HTMLElement) => {
  const ctx = gsap.context(() => {
    // Page enter animation
    gsap.fromTo(element,
      { opacity: 0 },
      { 
        opacity: 1, 
        duration: 1.2, 
        ease: 'power3.out' 
      }
    )

    // Page exit animation (for route changes)
    const handleRouteChange = () => {
      gsap.to(element, {
        opacity: 0,
        duration: 0.3
      })
    }

    window.addEventListener('beforeunload', handleRouteChange)

    return () => {
      window.removeEventListener('beforeunload', handleRouteChange)
    }
  }, element)

  return () => ctx.revert()
}