'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'

import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, Building, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

export default function SignupPage() {
  const { signUp, signInWithGoogle } = useAuth()
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    company_name: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  // Validation states
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [isFormValid, setIsFormValid] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Password strength calculation
  useEffect(() => {
    const calculatePasswordStrength = (password: string) => {
      let strength = 0
      if (password.length >= 6) strength += 25
      if (password.length >= 8) strength += 25
      if (/[a-z]/.test(password)) strength += 25
      if (/[A-Z]/.test(password)) strength += 25
      if (/[0-9]/.test(password)) strength += 25
      if (/[^A-Za-z0-9]/.test(password)) strength += 25
      return Math.min(strength, 100)
    }
    setPasswordStrength(calculatePasswordStrength(formData.password))
  }, [formData.password])

  // Real-time validation
  useEffect(() => {
    const errors: Record<string, string> = {}

    // Full name validation
    if (formData.full_name && formData.full_name.length < 2) {
      errors.full_name = 'Full name must be at least 2 characters'
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    setFieldErrors(errors)

    // Form validation
    const isValid = 
      formData.full_name.length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.password.length >= 6 &&
      agreedToTerms &&
      Object.keys(errors).length === 0

    setIsFormValid(isValid)
  }, [formData, agreedToTerms])

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isFormValid) return

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const { error } = await signUp(formData.email, formData.password, {
        full_name: formData.full_name,
        company_name: formData.company_name
      })
      
      if (error) {
        setError(error.message)
      } else {
        setSuccess('Account created! Please check your email to confirm your account.')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setLoading(true)
    setError('')

    try {
      const { error } = await signInWithGoogle()
      if (error) {
        setError(error.message)
      } else {
        setSuccess('Redirecting to Google...')
      }
    } catch (err) {
      setError('Failed to sign up with Google')
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
          <CardDescription>
            Start building high-converting funnels with AI
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Google Sign Up */}
          <Button 
            onClick={handleGoogleSignup}
            variant="outline" 
            className="w-full hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {loading ? 'Signing up...' : 'Continue with Google'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or sign up with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="full_name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    className={`pl-10 transition-all duration-200 ${
                      fieldErrors.full_name ? 'border-red-300 focus:border-red-500' : 
                      formData.full_name && !fieldErrors.full_name ? 'border-green-300 focus:border-green-500' : ''
                    }`}
                    required
                    aria-describedby={fieldErrors.full_name ? "full_name-error" : undefined}
                  />
                  {formData.full_name && !fieldErrors.full_name && (
                    <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                  )}
                </div>
                {fieldErrors.full_name && (
                  <p id="full_name-error" className="text-sm text-red-600 mt-1">{fieldErrors.full_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name (Optional)</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="company_name"
                    type="text"
                    placeholder="Enter your company name"
                    value={formData.company_name}
                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`pl-10 transition-all duration-200 ${
                    fieldErrors.email ? 'border-red-300 focus:border-red-500' : 
                    formData.email && !fieldErrors.email ? 'border-green-300 focus:border-green-500' : ''
                  }`}
                  required
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                />
                {formData.email && !fieldErrors.email && (
                  <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                )}
              </div>
              {fieldErrors.email && (
                <p id="email-error" className="text-sm text-red-600 mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`pl-10 pr-10 transition-all duration-200 ${
                    fieldErrors.password ? 'border-red-300 focus:border-red-500' : 
                    formData.password && !fieldErrors.password ? 'border-green-300 focus:border-green-500' : ''
                  }`}
                  required
                  minLength={6}
                  aria-describedby={fieldErrors.password ? "password-error" : "password-strength"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-10 top-3 h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
                {formData.password && !fieldErrors.password && (
                  <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                )}
              </div>
              
              {/* Password strength indicator */}
              {formData.password && (
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
                  <p className="text-xs text-gray-500">
                    Use at least 6 characters with a mix of letters, numbers, and symbols
                  </p>
                </div>
              )}
              
              {fieldErrors.password && (
                <p id="password-error" className="text-sm text-red-600 mt-1">{fieldErrors.password}</p>
              )}
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox 
                id="terms" 
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                className="mt-1"
              />
              <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                I agree to the{' '}
                <Link href="/terms" className="text-blue-600 hover:underline transition-colors">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-blue-600 hover:underline transition-colors">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            {error && (
              <Alert variant="destructive" className="animate-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4" />
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
              disabled={loading || !isFormValid}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline font-medium transition-colors">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
