import type { Metadata } from 'next'
import { ThemeProvider } from '@/context/ThemeContext'
import AnimationWrapper from '@/components/layout/AnimationWrapper'
import CustomCursor from '@/components/layout/CustomCursor'
import ProgressBar from '@/components/layout/ProgressBar'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: 'Fahad Portfolio',
  description: 'Next.js 15 Portfolio with 3D Animations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-gray-900">
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