'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import { Mail, Loader2, CheckCircle, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [emailError, setEmailError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address')
      return
    }

    setLoading(true)
    setError('')
    setEmailError('')

    try {
      const { error } = await resetPassword(email)
      if (error) {
        setError(error.message)
      } else {
        setSuccess('Password reset link sent! Check your email for instructions.')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (emailError) setEmailError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Reset your password</CardTitle>
          <CardDescription>
            Enter your email address and we&apos;ll send you a link to reset your password
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className={`pl-10 transition-all duration-200 ${
                    emailError ? 'border-red-300 focus:border-red-500' : 
                    email && !emailError ? 'border-green-300 focus:border-green-500' : ''
                  }`}
                  required
                  aria-describedby={emailError ? "email-error" : undefined}
                />
                {email && !emailError && (
                  <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                )}
              </div>
              {emailError && (
                <p id="email-error" className="text-sm text-red-600 mt-1">{emailError}</p>
              )}
            </div>

            {error && (
              <Alert variant="destructive" className="animate-in slide-in-from-top-2">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="animate-in slide-in-from-top-2 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full transition-all duration-200 hover:scale-[1.02]" 
              disabled={loading || !email}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending reset link...
                </>
              ) : (
                'Send reset link'
              )}
            </Button>
          </form>

          <div className="text-center space-y-4">
            <Link 
              href="/login" 
              className="inline-flex items-center text-blue-600 hover:underline transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to sign in
            </Link>
            
            <div className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-blue-600 hover:underline font-medium transition-colors">
                Sign up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
