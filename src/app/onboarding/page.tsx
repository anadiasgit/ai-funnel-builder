// app/onboarding/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { NetworkStatusIndicator } from '@/components/ui/network-status-indicator'
import { Tooltip } from '@/components/ui/help-system'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { ArrowRight, User, Building, Target, CheckCircle, SkipForward, Loader2, HelpCircle } from 'lucide-react'

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
  const [showSkipConfirm, setShowSkipConfirm] = useState(false)
  const [skipStepNumber, setSkipStepNumber] = useState<number | null>(null)
  


  const [formData, setFormData] = useState({
    full_name: '',
    company_name: '',
    business_type: '',
    industry: '',
    experience_level: '',
    goals: [] as string[]
  })

  // Load saved progress from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('onboarding-progress')
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setFormData(parsed.formData || formData)
        setCurrentStep(parsed.currentStep || 1)
      } catch (e) {
        console.warn('Failed to parse saved onboarding data')
      }
    }
  }, [])

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('onboarding-progress', JSON.stringify({
      formData,
      currentStep
    }))
  }, [currentStep])

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

  const skipStep = () => {
    // Skip to next step if current step has required fields
    if (currentStep === 1 && formData.full_name) {
      nextStep()
    } else if (currentStep === 2) {
      nextStep()
    } else if (currentStep === 3 && formData.goals.length === 0) {
      // Add a default goal if none selected
      setFormData(prev => ({ ...prev, goals: ['Learn funnel best practices'] }))
      nextStep()
    }
  }

  const confirmSkip = (step: number) => {
    setSkipStepNumber(step)
    setShowSkipConfirm(true)
  }

  const handleSkipConfirm = () => {
    if (skipStepNumber) {
      skipStep()
      setShowSkipConfirm(false)
      setSkipStepNumber(null)
    }
  }



  const completeOnboarding = async () => {
    setLoading(true)
    setError(null)
    
    console.log('🚀 Starting onboarding completion...')
    console.log('📝 Form data:', formData)
    console.log('👤 User:', user)
    
    try {
      // Add timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        if (loading) {
          console.warn('Onboarding completion timeout - forcing completion')
          setLoading(false)
          setError('Setup timed out. Please try refreshing the page.')
        }
      }, 20000) // 20 second timeout

      // Update profile with onboarding data
      console.log('📝 Updating profile...')
      const profileResult = await updateProfile({
        ...formData,
        onboarding_completed: true,
        updated_at: new Date().toISOString()
      })

      if (profileResult.error) {
        console.error('❌ Profile update failed:', profileResult.error)
        clearTimeout(timeoutId)
        throw new Error(profileResult.error.message || 'Failed to update profile')
      }

      console.log('✅ Profile updated successfully')

      // Create first project
      if (user) {
        console.log('📁 Creating first project...')
        const projectResult = await supabase.from('projects').insert({
          user_id: user.id,
          name: `${formData.company_name || 'My'} Funnel`,
          description: 'Your first AI-generated funnel',
          status: 'draft',
          created_at: new Date().toISOString()
        })

        if (projectResult.error) {
          console.warn('⚠️ Project creation failed:', projectResult.error)
          // Don't fail onboarding if project creation fails
        } else {
          console.log('✅ First project created successfully')
        }
      }

      clearTimeout(timeoutId)
      console.log('🎉 Onboarding completed, redirecting to dashboard...')
      
      // Clear saved progress
      localStorage.removeItem('onboarding-progress')
      
      // Force redirect immediately
      router.push('/dashboard')
      
    } catch (error) {
      console.error('❌ Onboarding error:', error)
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
          
          {/* Help Section */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl mx-auto">
            <div className="flex items-center gap-2 justify-center mb-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Need Help?</span>
            </div>
            <p className="text-sm text-blue-700 mb-3">
              Hover over the help icons (?) next to each field for detailed explanations and examples.
            </p>
            <div className="flex justify-center gap-4 text-xs text-blue-600">
              <span>💡 Examples provided for each field</span>
              <span>❓ Hover for tooltips</span>
              <span>📚 Help center available anytime</span>
            </div>
          </div>
          
          <div className="mt-4">
            <Progress value={progress} className="w-full h-2" />
            <p className="text-sm text-gray-500 mt-2">
              Step {currentStep} of 4 • {Math.round(progress)}% Complete
            </p>
          </div>
        </div>

        {/* Network Status */}
        <div className="mb-4 flex justify-center">
          <NetworkStatusIndicator variant="badge" />
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg animate-in slide-in-from-top-2">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        
        <Card className="shadow-xl">
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
              {currentStep === 2 && 'Help us understand your business (optional)'}
              {currentStep === 3 && 'What would you like to achieve?'}
              {currentStep === 4 && 'Your account is ready to go!'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in slide-in-from-right-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Tooltip content="Your full name will be displayed on your profile and used for personalization throughout the app">
                      <HelpCircle className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-help transition-colors" />
                    </Tooltip>
                  </div>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    placeholder="Enter your full name"
                    required
                    aria-describedby="full_name_help"
                    className="transition-all duration-200 focus:scale-[1.02]"
                  />
                  <p id="full_name_help" className="text-sm text-gray-500 mt-1">
                    This will be displayed on your profile
                  </p>
                  
                  {/* Example Content */}
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700 mb-2">
                      <strong>💡 Example:</strong> &quot;John Smith&quot; or &quot;Sarah Johnson&quot;
                    </p>
                    <p className="text-xs text-blue-600">
                      Use your real name as it appears on official documents
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="company_name">Company Name</Label>
                    <Tooltip content="Your company name helps us personalize your experience and provide industry-specific recommendations">
                      <HelpCircle className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-help transition-colors" />
                    </Tooltip>
                  </div>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                    placeholder="Enter your company name"
                    className="transition-all duration-200 focus:scale-[1.02]"
                  />
                  
                  {/* Example Content */}
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700 mb-2">
                      <strong>💡 Examples:</strong> &quot;Acme Corp&quot;, &quot;Smith Consulting&quot;, &quot;Your Business Name&quot;
                    </p>
                    <p className="text-xs text-green-600">
                      If you don't have a company yet, you can leave this blank or use your personal brand name
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Only your name is required to continue
                  </div>
                  <Button onClick={nextStep} disabled={!formData.full_name} className="transition-all duration-200 hover:scale-105">
                    Next <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Business Details */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in slide-in-from-right-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="business_type">Business Type</Label>
                    <Tooltip content="Your business type helps us provide relevant examples and industry-specific guidance for building funnels">
                      <HelpCircle className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-help transition-colors" />
                    </Tooltip>
                  </div>
                  <Select value={formData.business_type} onValueChange={(value: string) => handleInputChange('business_type', value)}>
                    <SelectTrigger className="transition-all duration-200 focus:scale-[1.02] bg-white">
                      <SelectValue placeholder="Select your business type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                      {BUSINESS_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {/* Example Content */}
                  <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm text-purple-700 mb-2">
                      <strong>💡 Examples:</strong> Choose the category that best describes your business model
                    </p>
                    <p className="text-xs text-purple-600">
                      E-commerce: Online stores, SaaS: Software companies, Coaching: Personal services, etc.
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={formData.industry} onValueChange={(value: string) => handleInputChange('industry', value)}>
                    <SelectTrigger className="transition-all duration-200 focus:scale-[1.02] bg-white">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                      {INDUSTRIES.map(industry => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="experience_level">Experience with Funnel Building</Label>
                  <Select value={formData.experience_level} onValueChange={(value: string) => handleInputChange('experience_level', value)}>
                    <SelectTrigger className="transition-all duration-200 focus:scale-[1.02] bg-white">
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                      <SelectItem value="beginner">Beginner - Just getting started</SelectItem>
                      <SelectItem value="intermediate">Intermediate - Built a few funnels</SelectItem>
                      <SelectItem value="advanced">Advanced - Very experienced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-between items-center">
                  <Button variant="outline" onClick={prevStep} className="transition-all duration-200 hover:scale-105">
                    Back
                  </Button>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      onClick={() => confirmSkip(currentStep)} 
                      className="text-gray-500 hover:text-gray-700 transition-all duration-200"
                    >
                      <SkipForward className="w-4 h-4 mr-2" />
                      Skip
                    </Button>
                    <Button 
                      onClick={nextStep} 
                      disabled={!formData.business_type || !formData.industry || !formData.experience_level}
                      className="transition-all duration-200 hover:scale-105"
                    >
                      Next <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Goals */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in slide-in-from-right-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Label>What are your main goals? (Select all that apply)</Label>
                    <Tooltip content="Your goals help us customize your experience and provide relevant content and features">
                      <HelpCircle className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-help transition-colors" />
                    </Tooltip>
                  </div>
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
                        className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
                          formData.goals.includes(goal)
                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => handleGoalToggle(goal)}
                      >
                        {goal}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Button variant="outline" onClick={prevStep} className="transition-all duration-200 hover:scale-105">
                    Back
                  </Button>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      onClick={() => confirmSkip(currentStep)} 
                      className="text-gray-500 hover:text-gray-700 transition-all duration-200"
                    >
                      <SkipForward className="w-4 h-4 mr-2" />
                      Skip
                    </Button>
                    <Button 
                      onClick={nextStep} 
                      disabled={formData.goals.length === 0}
                      className="transition-all duration-200 hover:scale-105"
                    >
                      Next <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Completion */}
            {currentStep === 4 && (
              <div className="text-center space-y-4 animate-in slide-in-from-right-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-in zoom-in-50">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                
                <h3 className="text-xl font-semibold">You&apos;re all set!</h3>
                <p className="text-gray-600">
                  Your account is ready. We&apos;ve created your first project and you can start generating 
                  AI-powered funnel content right away.
                </p>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    <strong>What&apos;s next?</strong> You&apos;ll be taken to your dashboard where you can:
                  </p>
                  <ul className="text-sm text-blue-600 mt-2 space-y-1">
                    <li>• Create your first customer avatar</li>
                    <li>• Generate compelling offers</li>
                    <li>• Build high-converting sales copy</li>
                  </ul>
                </div>

                <div className="flex justify-between items-center">
                  <Button variant="outline" onClick={prevStep} className="transition-all duration-200 hover:scale-105">
                    Back
                  </Button>
                  <Button 
                    onClick={completeOnboarding} 
                    disabled={loading} 
                    size="lg" 
                    className="ml-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 text-lg transition-all duration-200 hover:scale-105 shadow-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Setting up...
                      </>
                    ) : (
                      '🚀 Get Started Now!'
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Skip Confirmation Dialog */}
            {showSkipConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Skip this step?</h3>
                  <p className="text-gray-600 mb-4">
                    Skipping this step means we won&apos;t be able to personalize your experience as much. 
                    Your experience might be less tailored to your needs.
                  </p>
                  <div className="flex gap-3 justify-end">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowSkipConfirm(false)}
                      className="text-gray-600"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSkipConfirm}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      Yes, Skip
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}