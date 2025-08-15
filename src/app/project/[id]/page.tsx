'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  User, 
  Target, 
  ShoppingCart, 
  TrendingUp, 
  FileText, 
  ThumbsUp, 
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
import { CustomerAvatarForm } from '@/components/forms/customer-avatar-form'
import { OfferGenerationForm } from '@/components/forms/offer-generation-form'
import { CopyGenerationForm } from '@/components/forms/copy-generation-form'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface Project {
  id: string
  name: string
  description: string
  status: 'draft' | 'generating' | 'completed'
  created_at: string
  customer_avatar?: any
  main_offer?: any
  generated_content?: any
}

interface GenerationStatus {
  avatar: 'pending' | 'generating' | 'completed' | 'error'
  offer: 'pending' | 'generating' | 'completed' | 'error'
  order_bump: 'pending' | 'generating' | 'completed' | 'error'
  upsells: 'pending' | 'generating' | 'completed' | 'error'
  copy: 'pending' | 'generating' | 'completed' | 'error'
}

export default function ProjectWorkspace() {
  const { id } = useParams()
  const { user } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('avatar')
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>({
    avatar: 'pending',
    offer: 'pending',
    order_bump: 'pending',
    upsells: 'pending',
    copy: 'pending'
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

  const updateGenerationStatus = (projectData: any) => {
    setGenerationStatus({
      avatar: projectData.customer_avatar ? 'completed' : 'pending',
      offer: projectData.main_offer ? 'completed' : 'pending',
      order_bump: projectData.generated_content?.order_bump ? 'completed' : 'pending',
      upsells: projectData.generated_content?.upsells ? 'completed' : 'pending',
      copy: projectData.generated_content?.copy ? 'completed' : 'pending'
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
          <p className="text-gray-600">The project you're looking for doesn't exist.</p>
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
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-5 h-auto p-1">
            <TabsTrigger 
              value="avatar" 
              className="flex flex-col items-center gap-2 py-3 px-2 text-xs sm:text-sm"
            >
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {getTabStatus('avatar').icon && (
                  <getTabStatus('avatar').icon className={`h-3 w-3 ${getTabStatus('avatar').color}`} />
                )}
              </div>
              <span>Customer Avatar</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="offer" 
              className="flex flex-col items-center gap-2 py-3 px-2 text-xs sm:text-sm"
            >
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                {getTabStatus('offer').icon && (
                  <getTabStatus('offer').icon className={`h-3 w-3 ${getTabStatus('offer').color}`} />
                )}
              </div>
              <span>Main Offer</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="upsells" 
              className="flex flex-col items-center gap-2 py-3 px-2 text-xs sm:text-sm"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {getTabStatus('upsells').icon && (
                  <getTabStatus('upsells').icon className={`h-3 w-3 ${getTabStatus('upsells').color}`} />
                )}
              </div>
              <span>Upsells</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="copy" 
              className="flex flex-col items-center gap-2 py-3 px-2 text-xs sm:text-sm"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {getTabStatus('copy').icon && (
                  <getTabStatus('copy').icon className={`h-3 w-3 ${getTabStatus('copy').color}`} />
                )}
              </div>
              <span>Sales Copy</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="email" 
              className="flex flex-col items-center gap-2 py-3 px-2 text-xs sm:text-sm"
            >
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <Clock className="h-3 w-3 text-gray-400" />
              </div>
              <span>Email Strategy</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Customer Avatar Tab */}
            <TabsContent value="avatar" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Avatar Generation
                  </CardTitle>
                  <CardDescription>
                    Let AI create a detailed customer avatar based on your business information. 
                    This will be used to generate targeted offers and copy.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CustomerAvatarForm 
                    projectId={project.id}
                    existingAvatar={project.customer_avatar}
                    onAvatarGenerated={(avatar) => {
                      setProject(prev => prev ? { ...prev, customer_avatar: avatar } : null)
                      setGenerationStatus(prev => ({ ...prev, avatar: 'completed' }))
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Main Offer Tab */}
            <TabsContent value="offer" className="space-y-6">
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
                      projectId={project.id}
                      customerAvatar={project.customer_avatar}
                      existingOffer={project.main_offer}
                      onOfferGenerated={(offer) => {
                        setProject(prev => prev ? { ...prev, main_offer: offer } : null)
                        setGenerationStatus(prev => ({ ...prev, offer: 'completed' }))
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Upsells Tab */}
            <TabsContent value="upsells" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Order Bump Ideas
                    </CardTitle>
                    <CardDescription>
                      Generate complementary order bump offers to increase average order value.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {generationStatus.offer !== 'completed' ? (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-600">Complete your main offer first</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Button className="w-full" disabled={generationStatus.order_bump === 'generating'}>
                          {generationStatus.order_bump === 'generating' ? (
                            <>
                              <LoadingSpinner size="sm" className="mr-2" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Generate Order Bump
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Upsell Offers
                    </CardTitle>
                    <CardDescription>
                      Create strategic upsell offers for post-purchase optimization.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {generationStatus.offer !== 'completed' ? (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-600">Complete your main offer first</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Button className="w-full" disabled={generationStatus.upsells === 'generating'}>
                          {generationStatus.upsells === 'generating' ? (
                            <>
                              <LoadingSpinner size="sm" className="mr-2" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Generate Upsells
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Sales Copy Tab */}
            <TabsContent value="copy" className="space-y-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Sales Copy Generation
                    </CardTitle>
                    <CardDescription>
                      Generate high-converting copy for all your funnel pages and videos.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {generationStatus.offer !== 'completed' ? (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Main Offer Required
                        </h3>
                        <p className="text-gray-600">
                          Complete your main offer to generate targeted sales copy.
                        </p>
                      </div>
                    ) : (
                      <CopyGenerationForm 
                        projectId={project.id}
                        customerAvatar={project.customer_avatar}
                        mainOffer={project.main_offer}
                        existingContent={project.generated_content}
                        onContentGenerated={(content) => {
                          setProject(prev => prev ? { 
                            ...prev, 
                            generated_content: { ...prev.generated_content, ...content }
                          } : null)
                          setGenerationStatus(prev => ({ ...prev, copy: 'completed' }))
                        }}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Email Strategy Tab */}
            <TabsContent value="email" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Marketing Strategy
                  </CardTitle>
                  <CardDescription>
                    Coming soon: Generate complete email sequences and marketing automation.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Email Strategy Coming Soon
                  </h3>
                  <p className="text-gray-600 mb-4">
                    We're working on advanced email sequence generation and automation features.
                  </p>
                  <Badge variant="secondary">Phase 2 Feature</Badge>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
