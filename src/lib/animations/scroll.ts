'use client'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type AnimationPresets = {
  [key: string]: {
    from: gsap.TweenVars
    to: gsap.TweenVars
  }
}

const presets: AnimationPresets = {
  fadeUp: { from: { y: 80, opacity: 0 }, to: { y: 0, opacity: 1 } },
  fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
  scaleIn: { from: { scale: 0.8, opacity: 0 }, to: { scale: 1, opacity: 1 } }
}

export const initScrollAnimations = (container: HTMLElement) => {
  gsap.registerPlugin(ScrollTrigger)
  
  const ctx = gsap.context(() => {
    gsap.utils.toArray<HTMLElement>('[data-animate]').forEach(el => {
      const type = el.dataset.animate || 'fadeUp'
      const preset = presets[type]
      
      if (preset) {
        gsap.fromTo(el, preset.from, {
          ...preset.to,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        })
      }
    })
  }, container)

  return () => ctx.revert()
}