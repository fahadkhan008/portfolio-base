'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function ProgressBar() {
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    if (!progressRef.current) return

    ScrollTrigger.create({
      onUpdate: (self) => {
        gsap.to(progressRef.current, {
          width: `${self.progress * 100}%`,
          duration: 0.3,
          ease: 'power2.out'
        })
      }
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <div
      ref={progressRef}
      className="fixed top-0 left-0 h-1 z-50 bg-gradient-to-r from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark w-0"
    />
  )
}