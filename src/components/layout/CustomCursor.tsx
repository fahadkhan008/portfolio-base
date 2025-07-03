'use client'
import { useEffect, useRef } from 'react'
import { initCustomCursor } from '@/lib/animations/cursor'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

   useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    const cleanup = initCustomCursor({ current: cursor } as React.RefObject<HTMLDivElement>)

    return () => {
      cleanup?.()
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className="fixed w-6 h-6 rounded-full pointer-events-none z-50 bg-indigo-200/20 backdrop-blur-sm border border-indigo-400/30 transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference transition-transform duration-300 ease-out hidden"
    />
  )
}