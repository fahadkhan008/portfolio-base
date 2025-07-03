import type { Metadata } from 'next'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import { ThemeProvider } from '@/context/ThemeContext'
import AnimationWrapper from '@/components/layout/AnimationWrapper'
import CustomCursor from '@/components/layout/CustomCursor'
import ProgressBar from '@/components/layout/ProgressBar'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import '@/app/globals.css'
// import '../styles/globals.scss'

export const metadata: Metadata = {
  title: 'Fahad Portfolio',
  description: 'Next.js 15 Portfolio with 3D Animations',
}

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background-light dark:bg-background-dark">
        <ThemeProvider>
          <AnimationWrapper>
            <CustomCursor />
            <ProgressBar />
            <Navbar />
              {children}    
            <Footer />
          </AnimationWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
