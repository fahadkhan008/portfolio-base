'use client'
import { useRef, useEffect } from 'react'
import { initPageAnimations } from '@/lib/animations/page'
import { initScrollAnimations } from '@/lib/animations/scroll'
import { initTextAnimations } from '@/lib/animations/text'
import { useRouter } from 'next/navigation'

export default function AnimationWrapper({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (!wrapperRef.current) return
    
    const cleanupPage = initPageAnimations(wrapperRef.current)
    const cleanupScroll = initScrollAnimations(wrapperRef.current)
    const cleanupText = initTextAnimations(wrapperRef.current)
    
    return () => {
      cleanupPage()
      cleanupScroll()
      cleanupText()
    }
  }, [router])

  return <div ref={wrapperRef}>{children}</div>
}