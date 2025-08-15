'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Lock, Loader2, CheckCircle, Eye, EyeOff } from 'lucide-react'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const code = searchParams.get('code')

  useEffect(() => {
    if (!code) {
      setError('Invalid reset link. Please request a new password reset.')
    }
  }, [code])

  // Password strength calculation
  useEffect(() => {
    const calculatePasswordStrength = (password: string) => {
      let strength = 0
      
      // Length checks
      if (password.length >= 6) strength += 15
      if (password.length >= 8) strength += 15
      if (password.length >= 12) strength += 10
      
      // Character variety checks
      if (/[a-z]/.test(password)) strength += 20
      if (/[A-Z]/.test(password)) strength += 20
      if (/[0-9]/.test(password)) strength += 20
      if (/[^A-Za-z0-9]/.test(password)) strength += 20
      
      // Penalty for common patterns
      if (/^[0-9]+$/.test(password)) strength = Math.min(strength, 30)
      if (/^[a-z]+$/.test(password)) strength = Math.min(strength, 40)
      if (/^[A-Z]+$/.test(password)) strength = Math.min(strength, 40)
      if (/123|abc|qwe/i.test(password)) strength = Math.min(strength, 50)
      
      return Math.min(strength, 100)
    }
    setPasswordStrength(calculatePasswordStrength(password))
  }, [password])

  const getPasswordStrengthColor = (strength: number) => {
    if (strength < 50) return 'bg-red-500'
    if (strength < 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getPasswordStrengthText = (strength: number) => {
    if (strength < 50) return 'Weak'
    if (strength < 75) return 'Fair'
    return 'Strong'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setLoading(true)
    setError('')

    try {
      console.log('🔄 Starting password update process...')
      
      // Add timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        if (loading) {
          console.warn('Password update timeout - forcing completion')
          setLoading(false)
          setError('Password update timed out. Please try again.')
        }
      }, 10000) // 10 second timeout

      // Check if user is authenticated
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      if (!currentUser) {
        clearTimeout(timeoutId)
        setError('No authenticated user found. Please request a new password reset link.')
        setLoading(false)
        return
      }

      console.log('👤 Updating password for user:', currentUser.email)

      // Try to update password
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      clearTimeout(timeoutId)

      if (error) {
        console.error('❌ Password update error:', error)
        
        // Handle specific error cases
        if (error.message.includes('JWT')) {
          setError('Reset link expired. Please request a new password reset link.')
        } else if (error.message.includes('password')) {
          setError('Password does not meet requirements. Please try a different password.')
        } else {
          setError(`Password update failed: ${error.message}`)
        }
      } else {
        console.log('✅ Password updated successfully')
        setSuccess(true)
        
        // Force redirect after 2 seconds, regardless of any issues
        setTimeout(() => {
          console.log('🔄 Redirecting to login...')
          try {
            router.push('/login')
          } catch (redirectError) {
            console.error('❌ Redirect failed:', redirectError)
            // Fallback: force page reload to login
            window.location.href = '/login'
          }
        }, 2000)
      }
    } catch (err) {
      console.error('❌ Password update exception:', err)
      setError('An unexpected error occurred. Please try again or request a new reset link.')
    } finally {
      setLoading(false)
    }
  }

  if (!code) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-red-600">Invalid Reset Link</CardTitle>
            <CardDescription>
              This password reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/auth/forgot-password">
              <Button className="w-full">Request New Reset Link</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600">Password Updated!</CardTitle>
            <CardDescription>
              Your password has been successfully reset. Redirecting to login...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-sm text-gray-600">
              If you&apos;re not redirected automatically, click the button below.
            </div>
            <Button 
              onClick={() => router.push('/login')} 
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Reset your password</CardTitle>
          <CardDescription>
            Enter your new password below
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              
              {/* Password strength indicator */}
              {password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Password strength:</span>
                    <span className={`font-medium ${
                      passwordStrength < 50 ? 'text-red-600' : 
                      passwordStrength < 75 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {getPasswordStrengthText(passwordStrength)}
                    </span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div 
                      className={`h-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="border-red-500 bg-red-100">
                <AlertDescription className="text-red-800 font-medium">{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full transition-all duration-200 hover:scale-[1.02]" 
              disabled={loading || !password || !confirmPassword}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating password...
                </>
              ) : (
                'Update Password'
              )}
            </Button>
          </form>

          <div className="text-center">
            <Link href="/login" className="text-blue-600 hover:underline transition-colors">
              Back to sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mx-auto">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
