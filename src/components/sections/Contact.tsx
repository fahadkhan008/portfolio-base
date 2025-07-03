'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

type FormData = {
  name: string
  email: string
  message: string
}

type SubmitStatus = 'success' | 'error' | null

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const inputsRef = useRef<(HTMLInputElement | HTMLTextAreaElement | null)[]>([])
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: false
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    gsap.registerPlugin(ScrollTrigger)
    
    if (!inView || !contactRef.current || !formRef.current) return

    const contactElements = contactRef.current.children
    const formElement = formRef.current
    const inputElements = inputsRef.current.filter(Boolean) as (HTMLInputElement | HTMLTextAreaElement)[]

    // Clear existing animations for better performance 
    gsap.killTweensOf([contactElements, formElement, ...inputElements])

    // Contact section animation
    gsap.fromTo(
      Array.from(contactRef.current.children),
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
      }
    )

    // Form animation
    gsap.fromTo(
      formRef.current,
      { 
        y: 100,
        opacity: 0,
        scale: 0.95,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'elastic.out(1, 0.5)',
      }
    )

    // Input animations
    inputsRef.current.forEach((input, index) => {
      if (!input) return
      
      gsap.fromTo(
        input,
        { 
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.5 + index * 0.15,
          ease: 'back.out(1.2)',
        }
      )
    })
  }, [inView])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Input focus animation
    if (value) {
      gsap.to(e.target, {
        borderColor: '#6366f1',
        duration: 0.3,
      })
    } else {
      gsap.to(e.target, {
        borderColor: '#e2e8f0',
        duration: 0.3,
      })
    }
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!e.target.parentNode) return
    
    gsap.to(e.target.parentNode, {
      y: -5,
      duration: 0.3,
    })
    gsap.to(e.target, {
      borderColor: '#6366f1',
      boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.3)',
      duration: 0.3,
    })
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!e.target.parentNode) return
    
    gsap.to(e.target.parentNode, {
      y: 0,
      duration: 0.3,
    })
    gsap.to(e.target, {
      borderColor: e.target.value ? '#6366f1' : '#e2e8f0',
      boxShadow: 'none',
      duration: 0.3,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSubmitStatus('success')
      setFormData({ name: '', email: '', message: '' })
      
      // Success animation
      gsap.fromTo(
        '.submit-success',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.2)' }
      )
    } catch (error) {
      setSubmitStatus('error')
      console.error('Failed to send:', error)
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus(null), 5000)
    }
  }

  return (
    <section id="contact" 
      ref={ref} 
      className="py-20 bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800"
    >
      <div className="container mx-auto px-6">
        <div ref={contactRef} className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Have a project in mind or want to collaborate? Feel free to reach out!
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/10 rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full filter blur-3xl"></div>
            
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="submit-success mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-200 rounded-lg backdrop-blur-sm"
              >
                Thank you! Your message has been sent successfully.
              </motion.div>
            )}
            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200 rounded-lg backdrop-blur-sm"
              >
                Oops! Something went wrong. Please try again later.
              </motion.div>
            )}

            <div className="mb-6 relative">
              <label
                htmlFor="name"
                className="block text-gray-700 dark:text-gray-300 mb-2 font-medium"
              >
                Name
              </label>
              <input
                ref={(el) => { 
                  if(el) inputsRef.current[0] = el
                }}
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none transition-all duration-300"
                required
              />
            </div>

            <div className="mb-6 relative">
              <label
                htmlFor="email"
                className="block text-gray-700 dark:text-gray-300 mb-2 font-medium"
              >
                Email
              </label>
              <input
                ref={(el) => {
                  if(el) inputsRef.current[1] = el
                }}
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none transition-all duration-300"
                required
              />
              {formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                <div className="absolute text-red-500 text-sm mt-1">
                  Please enter a valid email address.
                </div>
              )}
            </div>

            <div className="mb-6 relative">
              <label
                htmlFor="message"
                className="block text-gray-700 dark:text-gray-300 mb-2 font-medium"
              >
                Message
              </label>
              <textarea
                ref={(el) => {
                  if(el) inputsRef.current[2] = el
                }}
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none transition-all duration-300"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary relative overflow-hidden group"
            >
              <span className="relative z-10">{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}