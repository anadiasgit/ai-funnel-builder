'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setIsAuthenticated(!!session)
      } catch (error) {
        console.error('Error checking auth:', error)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleCreateFunnel = () => {
    if (isAuthenticated) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }

  // Test Supabase connection
  const testSupabase = async () => {
    try {
      const { error } = await supabase.from('_dummy_table_').select('*').limit(1)
      if (error) {
        console.log('Supabase connection successful! (Error is expected for non-existent table)')
        alert('✅ Supabase is connected! (Error shown is normal for test)')
      }
    } catch (err) {
      console.error('Supabase connection failed:', err)
      alert('❌ Supabase connection failed')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            AI Funnel Builder
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Transform your business with AI-powered funnel creation. Generate customer avatars, compelling offers, and high-converting copy in minutes.
          </p>
          
          {/* Supabase Test Button */}
          <Button 
            onClick={testSupabase}
            className="mb-8 bg-green-600 hover:bg-green-700 text-white"
          >
            🧪 Test Supabase Connection
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <CardTitle className="text-xl font-semibold">Smart Customer Avatars</CardTitle>
              <CardDescription className="text-gray-600">
                AI analyzes your business to create detailed customer personas that convert
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <CardTitle className="text-xl font-semibold">High-Converting Copy</CardTitle>
              <CardDescription className="text-gray-600">
                Generate sales pages and email sequences that drive results
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-md mx-auto border-0 shadow-2xl bg-white/90 backdrop-blur">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl mb-2">Ready to Build Your Funnel?</CardTitle>
              <CardDescription className="text-gray-600">
                Join thousands of entrepreneurs using AI to scale their businesses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                size="lg" 
                className="w-full text-lg py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={handleCreateFunnel}
                disabled={loading}
              >
                {loading ? 'Loading...' : isAuthenticated ? 'Go to Dashboard 🚀' : 'Create Your First Funnel 🚀'}
              </Button>
              <p className="text-sm text-gray-500">
                No credit card required • Free to start
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}