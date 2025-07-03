'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { gsap } from 'gsap'

type Theme = 'light' | 'dark'
type ThemeContextType = {
  theme: Theme
  toggleTheme: () => void
  isMounted: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

type ThemeProviderProps = {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>('light')
  const [isMounted, setIsMounted] = useState(false)

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    setIsMounted(true)
    const savedTheme = localStorage.getItem('theme') as Theme | null
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light')
    setTheme(initialTheme)
    document.documentElement.classList.toggle('dark', initialTheme === 'dark')
    
    // Watch for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light'
      setTheme(newTheme)
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
      localStorage.setItem('theme', newTheme)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    
    // Smooth theme transition animation
    gsap.to(document.documentElement, {
      '--theme-transition': 1,
      duration: 0.5,
      onComplete: () => {
        document.documentElement.classList.toggle('dark', newTheme === 'dark')
        gsap.to(document.documentElement, {
          '--theme-transition': 0,
          duration: 0.5
        })
      }
    })
  }

  // Don't render UI until mounted on client
  if (!isMounted) {
    return <div className='hidden' />
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isMounted }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}