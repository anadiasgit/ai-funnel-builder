'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Target, 
  ShoppingCart, 
  TrendingUp, 
  FileText, 
  CheckCircle2, 
  Video, 
  Mail, 
  ArrowRight,
  CopyIcon,
  Share
} from 'lucide-react'
import { CustomerAvatarForm } from '@/components/forms/customer-avatar-form'
import { OfferGenerationForm } from '@/components/forms/offer-generation-form'
import { OrderBumpForm } from '@/components/forms/order-bump-form'
import { UpsellsForm } from '@/components/forms/upsells-form'
import { OrderPageForm } from '@/components/forms/order-page-form'
import { ThankYouPageForm } from '@/components/forms/thank-you-page-form'
import { MainVSLForm } from '@/components/forms/main-vsl-form'
import { UpsellVSLForm } from '@/components/forms/upsell-vsl-form'
import { EmailStrategyForm } from '@/components/forms/email-strategy-form'
import { FunnelFlowDiagram } from '@/components/ui/funnel-flow-diagram'
import { supabase } from '@/lib/supabase'
import { exportCompleteFunnel, downloadFile, ExportContent } from '@/lib/export-utils'
import { GenerationProgress } from '@/components/ui/generation-progress'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { FloatingHelpButton } from '@/components/ui/help-system'

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
  const router = useRouter()
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
    const status: GenerationStatus = {
      avatar: projectData.customer_avatar ? 'completed' : 'pending',
      offer: projectData.main_offer ? 'completed' : 'pending',
      order_bump: projectData.generated_content?.order_bump ? 'completed' : 'pending',
      upsells: projectData.generated_content?.upsells ? 'completed' : 'pending',
      order_page: projectData.generated_content?.order_page ? 'completed' : 'pending',
      thank_you: projectData.generated_content?.thank_you ? 'completed' : 'pending',
      main_vsl: projectData.generated_content?.main_vsl ? 'completed' : 'pending',
      upsell_vsl: projectData.generated_content?.upsell_vsl ? 'completed' : 'pending',
      email_strategy: projectData.generated_content?.email_strategy ? 'completed' : 'pending'
    }
    setGenerationStatus(status)
  }

  const calculateProgress = () => {
    const statuses = Object.values(generationStatus)
    const completed = statuses.filter(status => status === 'completed').length
    return (completed / statuses.length) * 100
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

  const handleIndividualExport = async (step: string, format: 'pdf' | 'docx' | 'txt') => {
    if (!project) return

    try {
      let content: ExportContent = {}
      let fileName = ''

      switch (step) {
        case 'avatar':
          if (project.customer_avatar) {
            content = { customerAvatar: project.customer_avatar }
            fileName = `${project.name || 'Business'}_Customer_Avatar`
          }
          break
        case 'offer':
          if (project.main_offer) {
            content = { mainOffer: project.main_offer }
            fileName = `${project.name || 'Business'}_Main_Offer`
          }
          break
        case 'order-bump':
          if (project.generated_content?.order_bump) {
            content = { orderBump: project.generated_content.order_bump }
            fileName = `${project.name || 'Business'}_Order_Bump`
          }
          break
        case 'upsells':
          if (project.generated_content?.upsells) {
            content = { upsells: project.generated_content.upsells }
            fileName = `${project.name || 'Business'}_Upsells`
          }
          break
        case 'order-page':
          if (project.generated_content?.order_page) {
            content = { orderPage: project.generated_content.order_page }
            fileName = `${project.name || 'Business'}_Order_Page`
          }
          break
        case 'thank-you':
          if (project.generated_content?.thank_you) {
            content = { thankYou: project.generated_content.thank_you }
            fileName = `${project.name || 'Business'}_Thank_You_Page`
          }
          break
        case 'main-vsl':
          if (project.generated_content?.main_vsl) {
            content = { mainVSL: project.generated_content.main_vsl }
            fileName = `${project.name || 'Business'}_Main_VSL`
          }
          break
        case 'upsell-vsl':
          if (project.generated_content?.upsell_vsl) {
            content = { upsellVSL: project.generated_content.upsell_vsl }
            fileName = `${project.name || 'Business'}_Upsell_VSL`
          }
          break
        case 'email-strategy':
          if (project.generated_content?.email_strategy) {
            content = { emailStrategy: project.generated_content.email_strategy }
            fileName = `${project.name || 'Business'}_Email_Strategy`
          }
          break
      }

      if (Object.keys(content).length > 0) {
        const exportResult = await exportCompleteFunnel(content, {
          format,
          businessName: project.name || 'Business'
        })
        
        const timestamp = new Date().toISOString().split('T')[0]
        const finalFileName = `${fileName}_${timestamp}.${format}`
        
        downloadFile(exportResult, finalFileName)
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    }
  }

  const handleCompleteExport = async (format: 'pdf' | 'docx' | 'txt') => {
    if (!project) return

    try {
      const content: ExportContent = {
        customerAvatar: project.customer_avatar || undefined,
        mainOffer: project.main_offer || undefined,
        orderBump: project.generated_content?.order_bump || undefined,
        upsells: project.generated_content?.upsells || undefined,
        orderPage: project.generated_content?.order_page || undefined,
        thankYou: project.generated_content?.thank_you || undefined,
        mainVSL: project.generated_content?.main_vsl || undefined,
        upsellVSL: project.generated_content?.upsell_vsl || undefined,
        emailStrategy: project.generated_content?.email_strategy || undefined
      }

      const exportResult = await exportCompleteFunnel(content, {
        format,
        businessName: project.name || 'Business'
      })
      
      const timestamp = new Date().toISOString().split('T')[0]
      const fileName = `${project.name || 'Business'}_Complete_Funnel_Package_${timestamp}.${format}`
      
      downloadFile(exportResult, fileName)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    }
  }

  const handleCopyToClipboard = () => {
    const contentToCopy = JSON.stringify(project, null, 2);
    navigator.clipboard.writeText(contentToCopy).then(() => {
      alert('Project data copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy project data:', err);
    });
  };

  const handleShareFunnel = () => {
    const contentToShare = JSON.stringify(project, null, 2);
    const shareData = {
      title: project.name,
      text: `Check out my sales funnel: ${project.name}`,
      url: window.location.href, // Or a specific project URL
    };

    if (navigator.share) {
      navigator.share(shareData)
        .then(() => console.log('Project shared successfully'))
        .catch((error) => console.error('Error sharing project:', error));
    } else {
      alert('Web Share API not supported in your browser. You can manually copy the link.');
      // Fallback for manual copy if not supported
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Project URL copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy project URL:', err);
      });
    }
  };

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
                    Create an irresistible order bump to increase your average order value.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {generationStatus.offer !== 'completed' ? (
                    <div className="text-center py-8">
                      <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Main Offer Required
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Please complete your main offer first to generate targeted order bumps.
                      </p>
                      <Button 
                        onClick={() => setActiveTab('offer')}
                        className="flex items-center gap-2"
                      >
                        Create Offer First
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <OrderBumpForm 
                      customerAvatar={project.customer_avatar!}
                      mainOffer={project.main_offer!}
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
                  )}
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
                    Generate compelling upsell offers to maximize customer lifetime value.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {generationStatus.offer !== 'completed' ? (
                    <div className="text-center py-8">
                      <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Main Offer Required
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Please complete your main offer first to generate targeted upsells.
                      </p>
                      <Button 
                        onClick={() => setActiveTab('offer')}
                        className="flex items-center gap-2"
                      >
                        Create Offer First
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <UpsellsForm 
                      customerAvatar={project.customer_avatar!}
                      mainOffer={project.main_offer!}
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
                  )}
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
                    Generate compelling order page copy to maximize conversions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {generationStatus.offer !== 'completed' ? (
                    <div className="text-center py-8">
                      <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Main Offer Required
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Please complete your main offer first to generate targeted order page copy.
                      </p>
                      <Button 
                        onClick={() => setActiveTab('offer')}
                        className="flex items-center gap-2"
                      >
                        Create Offer First
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <OrderPageForm 
                      customerAvatar={project.customer_avatar!}
                      mainOffer={project.main_offer!}
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
                  )}
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
                    Generate a compelling thank you page to maintain customer engagement.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {generationStatus.offer !== 'completed' ? (
                    <div className="text-center py-8">
                      <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Main Offer Required
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Please complete your main offer first to generate targeted thank you page copy.
                      </p>
                      <Button 
                        onClick={() => setActiveTab('offer')}
                        className="flex items-center gap-2"
                      >
                        Create Offer First
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <ThankYouPageForm 
                      customerAvatar={project.customer_avatar!}
                      mainOffer={project.main_offer!}
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
                  )}
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
                  {generationStatus.offer !== 'completed' ? (
                    <div className="text-center py-8">
                      <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Main Offer Required
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Please complete your main offer first to generate targeted VSL scripts.
                      </p>
                      <Button 
                        onClick={() => setActiveTab('offer')}
                        className="flex items-center gap-2"
                      >
                        Create Offer First
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <MainVSLForm 
                      customerAvatar={project.customer_avatar!}
                      mainOffer={project.main_offer!}
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
                  )}
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
                  {generationStatus.offer !== 'completed' ? (
                    <div className="text-center py-8">
                      <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Main Offer Required
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Please complete your main offer first to generate targeted VSL scripts.
                      </p>
                      <Button 
                        onClick={() => setActiveTab('offer')}
                        className="flex items-center gap-2"
                      >
                        Create Offer First
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <UpsellVSLForm 
                      customerAvatar={project.customer_avatar!}
                      mainOffer={project.main_offer!}
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
                  )}
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
                  {generationStatus.offer !== 'completed' ? (
                    <div className="text-center py-8">
                      <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Main Offer Required
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Please complete your main offer first to generate targeted email strategies.
                      </p>
                      <Button 
                        onClick={() => setActiveTab('offer')}
                        className="flex items-center gap-2"
                      >
                        Create Offer First
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <EmailStrategyForm 
                      customerAvatar={project.customer_avatar!}
                      mainOffer={project.main_offer!}
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
                  )}
                </CardContent>
              </Card>
            </div>
          )}

        </div>

        {/* Export Panel - Only show when there's content to export */}
        {(() => {
          const hasAnyContent = project?.customer_avatar || project?.main_offer || project?.generated_content?.order_bump || project?.generated_content?.upsells || project?.generated_content?.order_page || project?.generated_content?.thank_you || project?.generated_content?.main_vsl || project?.generated_content?.upsell_vsl || project?.generated_content?.email_strategy;
          
          if (!hasAnyContent) return null;

          const completedSteps = [
            project?.customer_avatar,
            project?.main_offer,
            project?.generated_content?.order_bump,
            project?.generated_content?.upsells,
            project?.generated_content?.order_page,
            project?.generated_content?.thank_you,
            project?.generated_content?.main_vsl,
            project?.generated_content?.upsell_vsl,
            project?.generated_content?.email_strategy
          ].filter(Boolean).length;

          return (
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-blue-900">Export Your Funnel</h4>
                  <p className="text-sm text-blue-700">
                    Download your funnel content in professional formats for easy sharing and editing
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-blue-600 font-medium">Export Ready</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Individual Content Exports */}
                <div className="space-y-3">
                  <h5 className="text-sm font-medium text-blue-800">Individual Content</h5>
                  <div className="flex flex-wrap gap-2">
                    {project?.customer_avatar && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => handleIndividualExport('avatar', 'pdf')}
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        Avatar PDF
                      </Button>
                    )}
                    {project?.main_offer && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => handleIndividualExport('offer', 'pdf')}
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        Offer PDF
                      </Button>
                    )}
                    {project?.generated_content?.order_bump && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => handleIndividualExport('order-bump', 'pdf')}
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        Order Bump PDF
                      </Button>
                    )}
                    {project?.generated_content?.upsells && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => handleIndividualExport('upsells', 'pdf')}
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        Upsells PDF
                      </Button>
                    )}
                    {project?.generated_content?.order_page && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => handleIndividualExport('order-page', 'pdf')}
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        Order Page PDF
                      </Button>
                    )}
                    {project?.generated_content?.thank_you && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => handleIndividualExport('thank-you', 'pdf')}
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        Thank You PDF
                      </Button>
                    )}
                    {project?.generated_content?.main_vsl && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => handleIndividualExport('main-vsl', 'pdf')}
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        Main VSL PDF
                      </Button>
                    )}
                    {project?.generated_content?.upsell_vsl && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => handleIndividualExport('upsell-vsl', 'pdf')}
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        Upsell VSL PDF
                      </Button>
                    )}
                    {project?.generated_content?.email_strategy && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => handleIndividualExport('email-strategy', 'pdf')}
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        Email Strategy PDF
                      </Button>
                    )}
                  </div>
                </div>

                {/* Complete Package Export - Only show when multiple steps are completed */}
                {completedSteps > 1 && (
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium text-blue-800">Complete Package</h5>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        size="sm" 
                        variant="default" 
                        className="text-xs bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleCompleteExport('pdf')}
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        Complete PDF
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => handleCompleteExport('docx')}
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        Complete Word
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => handleCompleteExport('txt')}
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        Complete Text
                      </Button>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="space-y-3">
                  <h5 className="text-sm font-medium text-blue-800">Quick Actions</h5>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs"
                      onClick={() => handleCopyToClipboard()}
                    >
                      <CopyIcon className="w-3 h-3 mr-1" />
                      Copy All
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs"
                      onClick={() => handleShareFunnel()}
                    >
                      <Share className="w-3 h-3 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
      
      {/* Floating Help Button */}
      <FloatingHelpButton
        onClick={() => router.push('/help')}
        className="bottom-4 right-4"
      />
    </div>
  )
}
