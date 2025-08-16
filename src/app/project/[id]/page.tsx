'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { 
  User, 
  Target, 
  ShoppingCart, 
  TrendingUp, 
  FileText, 
  Mail, 
  Video,
  ArrowRight,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

// Import our custom components (we'll create these next)
import { AIStatusIndicator } from '@/components/ui/ai-status-indicator'
import { GenerationProgress } from '@/components/ui/generation-progress'
import { FunnelFlowDiagram } from '@/components/ui/funnel-flow-diagram'
import { CustomerAvatarForm } from '@/components/forms/customer-avatar-form'
import { OfferGenerationForm } from '@/components/forms/offer-generation-form'
import { OrderBumpForm } from '@/components/forms/order-bump-form'
import { UpsellsForm } from '@/components/forms/upsells-form'
import { OrderPageForm } from '@/components/forms/order-page-form'
import { ThankYouPageForm } from '@/components/forms/thank-you-page-form'
import { MainVSLForm } from '@/components/forms/main-vsl-form'
import { UpsellVSLForm } from '@/components/forms/upsell-vsl-form'
import { EmailStrategyForm } from '@/components/forms/email-strategy-form'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface Project {
  id: string
  name: string
  description: string
  status: 'draft' | 'generating' | 'completed'
  created_at: string
  customer_avatar?: CustomerAvatar | null
  main_offer?: MainOffer | null
  generated_content?: GeneratedContent | null
}

interface CustomerAvatar {
  id: string
  businessName: string
  industry: string
  targetAudience: string
  painPoints: string
  goals: string
  budget: string
  location: string
  insights?: string[]
  recommendations?: string[]
}

interface MainOffer {
  id: string
  productName: string
  productDescription: string
  price: string
  valueProposition: string
  features: string
  guarantee: string
  aiOptimizations?: {
    headline: string
    subheadline: string
    urgency: string
    socialProof: string[]
    objections: string[]
    responses: string[]
  }
  pricing?: {
    originalPrice: number
    currentPrice: number
    savings: number
    paymentOptions: string[]
  }
}

interface GeneratedContent {
  id: string
  generatedAt: string
  order_bump?: {
    title: string
    description: string
    price: string
    benefits: string[]
    urgency: string
  }
  upsells?: {
    upsell1: {
      title: string
      description: string
      price: string
      benefits: string[]
    }
    upsell2: {
      title: string
      description: string
      price: string
      benefits: string[]
    }
  }
  order_page?: {
    headline: string
    subheadline: string
    benefits: string[]
    socialProof: string[]
    callToAction: string
    guarantee: string
  }
  thank_you?: {
    headline: string
    message: string
    nextSteps: string[]
    bonus: string
  }
  main_vsl?: {
    hook: string
    problem: string
    solution: string
    proof: string
    offer: string
    close: string
    urgency: string
  }
  upsell_vsl?: {
    hook: string
    problem: string
    solution: string
    proof: string
    offer: string
    close: string
    urgency: string
  }
  email_strategy?: {
    welcome: { subject: string; body: string }
    nurture: { subject: string; body: string }
    offer: { subject: string; body: string }
    followUp: { subject: string; body: string }
    abandonedCart: { subject: string; body: string }
  }
}

interface GenerationStatus {
  avatar: 'pending' | 'generating' | 'completed' | 'error'
  offer: 'pending' | 'generating' | 'completed' | 'error'
  order_bump: 'pending' | 'generating' | 'completed' | 'error'
  upsells: 'pending' | 'generating' | 'completed' | 'error'
  order_page: 'pending' | 'generating' | 'completed' | 'error'
  thank_you: 'pending' | 'generating' | 'completed' | 'error'
  main_vsl: 'pending' | 'generating' | 'completed' | 'error'
  upsell_vsl: 'pending' | 'generating' | 'completed' | 'error'
  email_strategy: 'pending' | 'generating' | 'completed' | 'error'
}

export default function ProjectWorkspace() {
  const { id } = useParams()
  const { user } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('avatar')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>({
    avatar: 'pending',
    offer: 'pending',
    order_bump: 'pending',
    upsells: 'pending',
    order_page: 'pending',
    thank_you: 'pending',
    main_vsl: 'pending',
    upsell_vsl: 'pending',
    email_strategy: 'pending'
  })

  useEffect(() => {
    if (user && id) {
      fetchProject()
    }
  }, [user, id])

  const fetchProject = async () => {
    try {
      // For demo purposes, create sample project data
      if (id === 'test-project-123') {
        const sampleProject = {
          id: 'test-project-123',
          name: 'Demo E-commerce Funnel',
          description: 'A complete sales funnel for an online store',
          status: 'draft' as const,
          created_at: new Date().toISOString(),
          customer_avatar: null,
          main_offer: null,
          generated_content: null
        }
        
        setProject(sampleProject)
        updateGenerationStatus(sampleProject)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setProject(data)
      
      // Update generation status based on project data
      updateGenerationStatus(data)
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateGenerationStatus = (projectData: Project) => {
    setGenerationStatus({
      avatar: projectData.customer_avatar ? 'completed' : 'pending',
      offer: projectData.main_offer ? 'completed' : 'pending',
      order_bump: projectData.generated_content?.order_bump ? 'completed' : 'pending',
      upsells: projectData.generated_content?.upsells ? 'completed' : 'pending',
      order_page: projectData.generated_content?.order_page ? 'completed' : 'pending',
      thank_you: projectData.generated_content?.thank_you ? 'completed' : 'pending',
      main_vsl: projectData.generated_content?.main_vsl ? 'completed' : 'pending',
      upsell_vsl: projectData.generated_content?.upsell_vsl ? 'completed' : 'pending',
      email_strategy: projectData.generated_content?.email_strategy ? 'completed' : 'pending'
    })
  }

  const calculateProgress = () => {
    const statuses = Object.values(generationStatus)
    const completed = statuses.filter(status => status === 'completed').length
    return (completed / statuses.length) * 100
  }

  const getTabStatus = (tabName: keyof GenerationStatus) => {
    const status = generationStatus[tabName]
    return {
      icon: status === 'completed' ? CheckCircle2 : 
            status === 'generating' ? Clock : 
            status === 'error' ? AlertCircle : null,
      color: status === 'completed' ? 'text-green-500' : 
             status === 'generating' ? 'text-blue-500' : 
             status === 'error' ? 'text-red-500' : 'text-gray-400'
    }
  }

  const markAsDraft = () => {
    setHasUnsavedChanges(true)
  }

  const markAsSaved = () => {
    setHasUnsavedChanges(false)
  }

  // Warn user before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
        return 'You have unsaved changes. Are you sure you want to leave?'
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
          <p className="text-gray-600">The project you&apos;re looking for doesn&apos;t exist.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-sm text-gray-600 mt-1">{project.description}</p>
            </div>
            <div className="flex items-center gap-4">
              {hasUnsavedChanges && (
                <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 border border-yellow-200 rounded-full">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-yellow-700 font-medium">Draft</span>
                </div>
              )}
              <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                {project.status}
              </Badge>
              <AIStatusIndicator 
                status={project.status === 'generating' ? 'generating' : 'idle'} 
              />
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Funnel Completion Progress
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(calculateProgress())}%
              </span>
            </div>
            <GenerationProgress progress={calculateProgress()} />
          </div>
          
          {/* Funnel Flow Diagram */}
          <div className="pb-6">
            <FunnelFlowDiagram 
              steps={[
                { id: 'avatar', name: 'Avatar', status: generationStatus.avatar, icon: User },
                { id: 'offer', name: 'Offer', status: generationStatus.offer, icon: Target },
                { id: 'order-bump', name: 'Order Bump', status: generationStatus.order_bump, icon: ShoppingCart },
                { id: 'upsells', name: 'Upsells', status: generationStatus.upsells, icon: TrendingUp },
                { id: 'order-page', name: 'Copy', status: generationStatus.order_page, icon: FileText },
                { id: 'thank-you', name: 'Thank You', status: generationStatus.thank_you, icon: CheckCircle2 },
                { id: 'main-vsl', name: 'Main VSL', status: generationStatus.main_vsl, icon: Video },
                { id: 'upsell-vsl', name: 'Upsell VSL', status: generationStatus.upsell_vsl, icon: Video },
                { id: 'email-strategy', name: 'Email', status: generationStatus.email_strategy, icon: Mail }
              ]}
              currentStep={activeTab}
              onStepClick={(stepId) => setActiveTab(stepId)}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Smart Defaults Indicator */}
        {project?.customer_avatar && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-900">Smart Defaults Active</h4>
                <p className="text-xs text-blue-700">
                  Forms are automatically pre-filled with intelligent suggestions based on your customer avatar and business context.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content based on selected step */}
        <div className="space-y-6">
          
          {/* Customer Avatar Step */}
          {activeTab === 'avatar' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 h-5" />
                    Customer Avatar Generation
                  </CardTitle>
                  <CardDescription>
                    Let AI create a detailed customer avatar based on your business information. 
                    This will be used to generate targeted offers and copy.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CustomerAvatarForm 
                    existingAvatar={project.customer_avatar}
                    onAvatarGenerated={(avatar) => {
                      setProject(prev => prev ? { ...prev, customer_avatar: avatar } : null)
                      setGenerationStatus(prev => ({ ...prev, avatar: 'completed' }))
                      markAsSaved()
                    }}
                    onFormChange={markAsDraft}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Offer Step */}
          {activeTab === 'offer' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Main Offer Generation
                  </CardTitle>
                  <CardDescription>
                    Generate a compelling main offer based on your customer avatar and business goals.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {generationStatus.avatar !== 'completed' ? (
                    <div className="text-center py-8">
                      <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Customer Avatar Required
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Please complete your customer avatar first to generate targeted offers.
                      </p>
                      <Button 
                        onClick={() => setActiveTab('avatar')}
                        className="flex items-center gap-2"
                      >
                        Create Avatar First
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <OfferGenerationForm 
                      customerAvatar={project.customer_avatar!}
                      existingOffer={project.main_offer}
                      onOfferGenerated={(offer) => {
                        setProject(prev => prev ? { ...prev, main_offer: offer } : null)
                        setGenerationStatus(prev => ({ ...prev, offer: 'completed' }))
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Order Bump Step */}
          {activeTab === 'order-bump' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Order Bump Generation
                  </CardTitle>
                  <CardDescription>
                    Generate a compelling order bump offer to increase average order value.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OrderBumpForm 
                    customerAvatar={project.customer_avatar || {
                      id: 'demo',
                      businessName: 'Your Business',
                      industry: 'Your Industry',
                      targetAudience: 'Your Target Audience'
                    }}
                    mainOffer={project.main_offer || {
                      id: 'demo',
                      productName: 'Your Product',
                      price: '0'
                    }}
                    existingOrderBump={project.generated_content?.order_bump}
                    onOrderBumpGenerated={(orderBump) => {
                      setProject(prev => prev ? { 
                        ...prev, 
                        generated_content: { 
                          ...prev.generated_content, 
                          id: prev.generated_content?.id || Date.now().toString(),
                          generatedAt: prev.generated_content?.generatedAt || new Date().toISOString(),
                          order_bump: orderBump
                        }
                      } : null)
                      setGenerationStatus(prev => ({ ...prev, order_bump: 'completed' }))
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Upsells Step */}
          {activeTab === 'upsells' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Upsell Offers Generation
                  </CardTitle>
                  <CardDescription>
                    Generate two strategic upsell offers for post-purchase optimization.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UpsellsForm 
                    customerAvatar={project.customer_avatar || {
                      id: 'demo',
                      businessName: 'Your Business',
                      industry: 'Your Industry',
                      targetAudience: 'Your Target Audience'
                    }}
                    mainOffer={project.main_offer || {
                      id: 'demo',
                      productName: 'Your Product',
                      price: '0'
                    }}
                    existingUpsells={project.generated_content?.upsells}
                    onUpsellsGenerated={(upsells) => {
                      setProject(prev => prev ? { 
                        ...prev, 
                        generated_content: { 
                          ...prev.generated_content, 
                          id: prev.generated_content?.id || Date.now().toString(),
                          generatedAt: prev.generated_content?.generatedAt || new Date().toISOString(),
                          upsells: upsells
                        }
                      } : null)
                      setGenerationStatus(prev => ({ ...prev, upsells: 'completed' }))
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Order Page Step */}
          {activeTab === 'order-page' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Order Page Copy Generation
                  </CardTitle>
                  <CardDescription>
                    Generate high-converting copy for your order/checkout page.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OrderPageForm 
                    customerAvatar={project.customer_avatar || {
                      id: 'demo',
                      businessName: 'Your Business',
                      industry: 'Your Industry',
                      targetAudience: 'Your Target Audience'
                    }}
                    mainOffer={project.main_offer || {
                      id: 'demo',
                      productName: 'Your Product',
                      price: '0'
                    }}
                    existingOrderPage={project.generated_content?.order_page}
                    onOrderPageGenerated={(orderPage) => {
                      setProject(prev => prev ? { 
                        ...prev, 
                        generated_content: { 
                          ...prev.generated_content, 
                          id: prev.generated_content?.id || Date.now().toString(),
                          generatedAt: prev.generated_content?.generatedAt || new Date().toISOString(),
                          order_page: orderPage
                        }
                      } : null)
                      setGenerationStatus(prev => ({ ...prev, order_page: 'completed' }))
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Thank You Page Step */}
          {activeTab === 'thank-you' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Thank You Page Generation
                  </CardTitle>
                  <CardDescription>
                    Generate engaging thank you page content with next steps and bonuses.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ThankYouPageForm 
                    customerAvatar={project.customer_avatar || {
                      id: 'demo',
                      businessName: 'Your Business',
                      industry: 'Your Industry',
                      targetAudience: 'Your Target Audience'
                    }}
                    mainOffer={project.main_offer || {
                      id: 'demo',
                      productName: 'Your Product',
                      price: '0'
                    }}
                    existingThankYou={project.generated_content?.thank_you}
                    onThankYouGenerated={(thankYou) => {
                      setProject(prev => prev ? { 
                        ...prev, 
                        generated_content: { 
                          ...prev.generated_content, 
                          id: prev.generated_content?.id || Date.now().toString(),
                          generatedAt: prev.generated_content?.generatedAt || new Date().toISOString(),
                          thank_you: thankYou
                        }
                      } : null)
                      setGenerationStatus(prev => ({ ...prev, thank_you: 'completed' }))
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main VSL Step */}
          {activeTab === 'main-vsl' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Main VSL Script Generation
                  </CardTitle>
                  <CardDescription>
                    Generate a compelling video sales letter script for your main offer.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MainVSLForm 
                    customerAvatar={project.customer_avatar || {
                      id: 'demo',
                      businessName: 'Your Business',
                      industry: 'Your Industry',
                      targetAudience: 'Your Target Audience'
                    }}
                    mainOffer={project.main_offer || {
                      id: 'demo',
                      productName: 'Your Product',
                      price: '0'
                    }}
                    existingVSL={project.generated_content?.main_vsl}
                    onVSLGenerated={(vsl) => {
                      setProject(prev => prev ? { 
                        ...prev, 
                        generated_content: { 
                          ...prev.generated_content, 
                          id: prev.generated_content?.id || Date.now().toString(),
                          generatedAt: prev.generated_content?.generatedAt || new Date().toISOString(),
                          main_vsl: vsl
                        }
                      } : null)
                      setGenerationStatus(prev => ({ ...prev, main_vsl: 'completed' }))
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Upsell VSL Step */}
          {activeTab === 'upsell-vsl' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Upsell VSL Script Generation
                  </CardTitle>
                  <CardDescription>
                    Generate a compelling video sales letter script for your upsell offers.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UpsellVSLForm 
                    customerAvatar={project.customer_avatar || {
                      id: 'demo',
                      businessName: 'Your Business',
                      industry: 'Your Industry',
                      targetAudience: 'Your Target Audience'
                    }}
                    mainOffer={project.main_offer || {
                      id: 'demo',
                      productName: 'Your Product',
                      price: '0'
                    }}
                    existingVSL={project.generated_content?.upsell_vsl}
                    onVSLGenerated={(vsl) => {
                      setProject(prev => prev ? { 
                        ...prev, 
                        generated_content: { 
                          ...prev.generated_content, 
                          id: prev.generated_content?.id || Date.now().toString(),
                          generatedAt: prev.generated_content?.generatedAt || new Date().toISOString(),
                          upsell_vsl: vsl
                        }
                      } : null)
                      setGenerationStatus(prev => ({ ...prev, upsell_vsl: 'completed' }))
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Email Strategy Step */}
          {activeTab === 'email-strategy' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Strategy & Copy Generation
                  </CardTitle>
                  <CardDescription>
                    Generate complete email sequences and marketing automation for your funnel.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EmailStrategyForm 
                    customerAvatar={project.customer_avatar || {
                      id: 'demo',
                      businessName: 'Your Business',
                      industry: 'Your Industry',
                      targetAudience: 'Your Target Audience'
                    }}
                    mainOffer={project.main_offer || {
                      id: 'demo',
                      productName: 'Your Product',
                      price: '0'
                    }}
                    existingStrategy={project.generated_content?.email_strategy}
                    onStrategyGenerated={(strategy) => {
                      setProject(prev => prev ? { 
                        ...prev, 
                        generated_content: { 
                          ...prev.generated_content, 
                          id: prev.generated_content?.id || Date.now().toString(),
                          generatedAt: prev.generated_content?.generatedAt || new Date().toISOString(),
                          email_strategy: strategy
                        }
                      } : null)
                      setGenerationStatus(prev => ({ ...prev, email_strategy: 'completed' }))
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
