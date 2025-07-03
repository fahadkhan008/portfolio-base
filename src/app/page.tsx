import About from '@/components/sections/About'
import Hero from '@/components/sections/Hero'
import Projects from '@/components/sections/Projects'
import Skills from '@/components/sections/Skills'
import Contact from '@/components/sections/Contact'
import React from 'react'


function home() {
  return (
    <>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
    </>
  )
}

export default home