// app/onboarding/page.tsx
'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { ArrowRight, User, Building, Target, CheckCircle } from 'lucide-react'

const BUSINESS_TYPES = [
  'E-commerce',
  'SaaS',
  'Coaching/Consulting',
  'Digital Marketing Agency',
  'Local Service Business',
  'Online Course Creator',
  'Affiliate Marketer',
  'Real Estate',
  'Health & Fitness',
  'Finance/Investment',
  'Other'
]

const INDUSTRIES = [
  'Technology',
  'Marketing & Advertising',
  'Education',
  'Health & Wellness',
  'Finance',
  'Real Estate',
  'E-commerce',
  'Professional Services',
  'Entertainment',
  'Food & Beverage',
  'Other'
]

export default function OnboardingPage() {
  const { user, updateProfile } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    full_name: '',
    company_name: '',
    business_type: '',
    industry: '',
    experience_level: '',
    goals: [] as string[]
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }))
  }

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4))
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const completeOnboarding = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Update profile with onboarding data
      const profileResult = await updateProfile({
        ...formData,
        onboarding_completed: true,
        updated_at: new Date().toISOString()
      })

      if (profileResult.error) {
        throw new Error(profileResult.error.message || 'Failed to update profile')
      }

      // Create first project
      if (user) {
        const projectResult = await supabase.from('projects').insert({
          user_id: user.id,
          name: `${formData.company_name || 'My'} Funnel`,
          description: 'Your first AI-generated funnel',
          status: 'draft',
          created_at: new Date().toISOString()
        })

        if (projectResult.error) {
          console.warn('Project creation failed:', projectResult.error)
          // Don't fail onboarding if project creation fails
        }
      }

      router.push('/dashboard')
    } catch (error) {
      console.error('Onboarding error:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const progress = (currentStep / 4) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to AI Funnel Builder!</h1>
                          <p className="text-gray-600">Let&apos;s get you set up in just a few steps</p>
          <div className="mt-4">
            <Progress value={progress} className="w-full h-2" />
            <p className="text-sm text-gray-500 mt-2">
              Step {currentStep} of 4 • {Math.round(progress)}% Complete
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentStep === 1 && <User className="w-5 h-5" />}
              {currentStep === 2 && <Building className="w-5 h-5" />}
              {currentStep === 3 && <Target className="w-5 h-5" />}
              {currentStep === 4 && <CheckCircle className="w-5 h-5" />}
              
              {currentStep === 1 && 'Personal Information'}
              {currentStep === 2 && 'Business Details'}
              {currentStep === 3 && 'Your Goals'}
              {currentStep === 4 && 'All Set!'}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && 'Tell us a bit about yourself'}
              {currentStep === 2 && 'Help us understand your business'}
              {currentStep === 3 && 'What would you like to achieve?'}
              {currentStep === 4 && 'Your account is ready to go!'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    placeholder="Enter your full name"
                    required
                    aria-describedby="full_name_help"
                  />
                  <p id="full_name_help" className="text-sm text-gray-500 mt-1">
                    This will be displayed on your profile
                  </p>
                </div>

                <div>
                  <Label htmlFor="company_name">Company Name</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                    placeholder="Enter your company name"
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={nextStep} disabled={!formData.full_name}>
                    Next <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Business Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="business_type">Business Type</Label>
                  <Select value={formData.business_type} onValueChange={(value: string) => handleInputChange('business_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={formData.industry} onValueChange={(value: string) => handleInputChange('industry', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map(industry => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="experience_level">Experience with Funnel Building</Label>
                  <Select value={formData.experience_level} onValueChange={(value: string) => handleInputChange('experience_level', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner - Just getting started</SelectItem>
                      <SelectItem value="intermediate">Intermediate - Built a few funnels</SelectItem>
                      <SelectItem value="advanced">Advanced - Very experienced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button onClick={nextStep} disabled={!formData.business_type || !formData.industry || !formData.experience_level}>
                    Next <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Goals */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <Label>What are your main goals? (Select all that apply)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    {[
                      'Increase conversions',
                      'Generate more leads',
                      'Improve copy quality',
                      'Save time on content creation',
                      'Scale my business',
                      'Test new offers',
                      'Optimize existing funnels',
                      'Learn funnel best practices'
                    ].map(goal => (
                      <div
                        key={goal}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.goals.includes(goal)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleGoalToggle(goal)}
                      >
                        {goal}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button onClick={nextStep} disabled={formData.goals.length === 0}>
                    Next <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Completion */}
            {currentStep === 4 && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                
                <h3 className="text-xl font-semibold">You&apos;re all set!</h3>
                <p className="text-gray-600">
                  Your account is ready. We&apos;ve created your first project and you can start generating 
                  AI-powered funnel content right away.
                </p>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>What&apos;s next?</strong> You&apos;ll be taken to your dashboard where you can:
                  </p>
                  <ul className="text-sm text-blue-600 mt-2 space-y-1">
                    <li>• Create your first customer avatar</li>
                    <li>• Generate compelling offers</li>
                    <li>• Build high-converting sales copy</li>
                  </ul>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button onClick={completeOnboarding} disabled={loading} size="lg" className="ml-auto">
                    {loading ? 'Setting up...' : 'Get Started'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}