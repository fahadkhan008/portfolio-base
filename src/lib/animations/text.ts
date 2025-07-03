'use client'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export const initTextAnimations = (container: HTMLElement) => {
  gsap.registerPlugin(ScrollTrigger)

  const ctx = gsap.context(() => {
    // Character animations
    gsap.utils.toArray<HTMLElement>('.animate-char').forEach((text) => {
      const chars = text.textContent?.split('') || []
      text.textContent = ''
      
      chars.forEach((char, i) => {
        const span = document.createElement('span')
        span.textContent = char
        span.style.display = 'inline-block'
        span.style.opacity = '0'
        span.style.transform = 'translateY(20px)'
        text.appendChild(span)
        
        gsap.to(span, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: i * 0.03,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: text,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        })
      })
    })

    // Word animations
    gsap.utils.toArray<HTMLElement>('.animate-word').forEach((text) => {
      const words = text.textContent?.split(' ') || []
      text.textContent = ''
      
      words.forEach((word, i) => {
        const span = document.createElement('span')
        span.textContent = word + ' '
        span.style.display = 'inline-block'
        span.style.opacity = '0'
        span.style.transform = 'translateY(30px)'
        text.appendChild(span)
        
        gsap.to(span, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'elastic.out(1, 0.5)'
        })
      })
    })

  }, container)

  return () => ctx.revert()
}