'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, 
  Mail, 
  Video,
  Sparkles,
  CheckCircle2,
  Copy,
  Download
} from 'lucide-react'

interface CopyGenerationFormProps {
  customerAvatar: CustomerAvatar
  mainOffer: MainOffer
  existingContent?: GeneratedContent | null
  onContentGenerated: (content: GeneratedContent) => void
}

interface CustomerAvatar {
  id: string
  businessName: string
  industry: string
  targetAudience: string
}

interface MainOffer {
  id: string
  productName: string
  price: string
  pricing?: {
    currentPrice: number
    originalPrice: number
  }
}

interface GeneratedContent {
  id: string
  generatedAt: string
  salesPage: {
    headline: string
    subheadline: string
    heroSection: string
    problemSection: string
    solutionSection: string
    benefits: string[]
    socialProof: string[]
    callToAction: string
    urgency: string
  }
  videoScript: {
    hook: string
    problem: string
    solution: string
    proof: string
    offer: string
    close: string
  }
  emailSequence: {
    welcome: { subject: string; body: string }
    nurture: { subject: string; body: string }
    offer: { subject: string; body: string }
  }
}

interface CopyFormData {
  pageType: string
  tone: string
  callToAction: string
  additionalNotes: string
}

export function CopyGenerationForm({ 
  customerAvatar, 
  mainOffer, 
  existingContent, 
  onContentGenerated 
}: CopyGenerationFormProps) {
  const [formData, setFormData] = useState<CopyFormData>({
    pageType: 'sales-page',
    tone: 'professional',
    callToAction: 'Buy Now',
    additionalNotes: ''
  })
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState(existingContent)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleInputChange = (field: keyof CopyFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Helper function to format content for download
  const formatContentForDownload = (content: GeneratedContent, type: 'sales-page' | 'video-script' | 'email-sequence') => {
    const timestamp = new Date().toLocaleString()
    const header = `AI Funnel Builder - Generated Content\nGenerated on: ${timestamp}\n\n`
    
    switch (type) {
      case 'sales-page':
        return header + `SALES PAGE COPY\n${'='.repeat(50)}\n\n` +
          `HEADLINE: ${content.salesPage.headline}\n\n` +
          `SUBHEADLINE: ${content.salesPage.subheadline}\n\n` +
          `HERO SECTION:\n${content.salesPage.heroSection}\n\n` +
          `PROBLEM SECTION:\n${content.salesPage.problemSection}\n\n` +
          `SOLUTION SECTION:\n${content.salesPage.solutionSection}\n\n` +
          `BENEFITS:\n${content.salesPage.benefits.map(benefit => `• ${benefit}`).join('\n')}\n\n` +
          `SOCIAL PROOF:\n${content.salesPage.socialProof.map(proof => `• ${proof}`).join('\n')}\n\n` +
          `CALL TO ACTION: ${content.salesPage.callToAction}\n\n` +
          `URGENCY: ${content.salesPage.urgency}\n\n`
      
      case 'video-script':
        return header + `VIDEO SCRIPT\n${'='.repeat(50)}\n\n` +
          `HOOK: ${content.videoScript.hook}\n\n` +
          `PROBLEM: ${content.videoScript.problem}\n\n` +
          `SOLUTION: ${content.videoScript.solution}\n\n` +
          `PROOF: ${content.videoScript.proof}\n\n` +
          `OFFER: ${content.videoScript.offer}\n\n` +
          `CLOSE: ${content.videoScript.close}\n\n`
      
      case 'email-sequence':
        return header + `EMAIL SEQUENCE\n${'='.repeat(50)}\n\n` +
          `WELCOME EMAIL:\nSubject: ${content.emailSequence.welcome.subject}\n\nBody:\n${content.emailSequence.welcome.body}\n\n` +
          `NURTURE EMAIL:\nSubject: ${content.emailSequence.nurture.subject}\n\nBody:\n${content.emailSequence.nurture.body}\n\n` +
          `OFFER EMAIL:\nSubject: ${content.emailSequence.offer.subject}\n\nBody:\n${content.emailSequence.offer.body}\n\n`
      
      default:
        return header + 'Content could not be formatted for download.'
    }
  }

  // Helper function to handle downloads
  const handleDownload = (content: GeneratedContent, type: 'sales-page' | 'video-script' | 'email-sequence') => {
    try {
      const formattedContent = formatContentForDownload(content, type)
      const blob = new Blob([formattedContent], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      
      // Create filename based on type and timestamp
      const timestamp = new Date().toISOString().split('T')[0]
      const typeName = type.replace('-', '_')
      const filename = `${customerAvatar.businessName || 'Business'}_${typeName}_${timestamp}.txt`
      
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      showToast(`${type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} downloaded successfully!`)
    } catch (error) {
      console.error('Download failed:', error)
      showToast('Download failed. Please try again.', 'error')
    }
  }

  // Helper function to handle copy to clipboard
  const handleCopy = async (content: GeneratedContent, type: 'sales-page' | 'video-script' | 'email-sequence') => {
    try {
      const formattedContent = formatContentForDownload(content, type)
      await navigator.clipboard.writeText(formattedContent)
      showToast(`${type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} copied to clipboard!`)
    } catch (error) {
      console.error('Copy failed:', error)
      // Fallback for older browsers
      try {
        const formattedContent = formatContentForDownload(content, type)
        const textArea = document.createElement('textarea')
        textArea.value = formattedContent
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        showToast(`${type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} copied to clipboard!`)
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError)
        showToast('Copy failed. Please try again.', 'error')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    
    try {
      // Simulate AI generation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 5000))
      
      const content = {
        id: Date.now().toString(),
        generatedAt: new Date().toISOString(),
        salesPage: {
          headline: `Transform Your ${customerAvatar.industry} Business in 30 Days`,
          subheadline: `The proven system that helped 500+ businesses like yours increase revenue by 300%`,
          heroSection: `Are you tired of struggling to grow your ${customerAvatar.industry} business?`,
          problemSection: `Most ${customerAvatar.industry} business owners face these challenges:\n\n• Limited marketing budget\n• Not enough time to implement strategies\n• Confusion about what actually works\n• Fear of wasting money on ineffective tactics`,
          solutionSection: `${mainOffer.productName} solves these problems by providing:\n\n• A proven, step-by-step system\n• Done-for-you implementation\n• Guaranteed results or your money back\n• Ongoing support and optimization`,
          benefits: [
            'Increase revenue by 300% in 90 days',
            'Save 20+ hours per week on marketing',
            'Build a predictable customer pipeline',
            'Scale without hiring additional staff'
          ],
          socialProof: [
            'Trusted by 500+ business owners',
            '4.9/5 star rating from 200+ reviews',
            'Featured in Business Insider, Forbes'
          ],
          callToAction: `Get Started Today - Only $${mainOffer.pricing?.currentPrice || mainOffer.price || '0'}`,
          urgency: 'Limited Time: Only 47 spots available this month'
        },
        videoScript: {
          hook: `&quot;What if I told you that you could transform your ${customerAvatar.industry} business in just 30 days?&quot;`,
                      problem: `&quot;Most business owners are stuck in a cycle of trying different marketing strategies, spending money, and not seeing results.&quot;`,
                      solution: `&quot;That&apos;s why I created ${mainOffer.productName} - a proven system that&apos;s helped 500+ businesses like yours.&quot;`,
            proof: `&quot;Here&apos;s what one of our clients said: &apos;We increased our revenue by 300% in just 90 days using this system.&apos;&quot;`,
            offer: `&quot;Today, I&apos;m offering you access to this system for just $${mainOffer.pricing?.currentPrice || mainOffer.price || '0'}.&quot;`,
            close: `&quot;Click the button below to get started now. This offer won&apos;t last long.&quot;`
        },
        emailSequence: {
          welcome: {
            subject: `Welcome to ${mainOffer.productName} - Let's Get Started!`,
            body: `Hi there!\n\nWelcome to ${mainOffer.productName}! I'm excited to help you transform your ${customerAvatar.industry} business.\n\nIn the next few emails, I'll share:\n• The exact strategy that's working for our clients\n• How to implement it step-by-step\n• Common mistakes to avoid\n\nStay tuned!\n\nBest regards,\n[Your Name]`
          },
          nurture: {
            subject: `The #1 Mistake ${customerAvatar.industry} Business Owners Make`,
            body: `Hi again!\n\nI've noticed that most ${customerAvatar.industry} business owners make the same critical mistake...\n\nThey try to do everything at once instead of focusing on what actually works.\n\nHere's the truth: You only need to master 3 core strategies to see real results.\n\nI'll share them in my next email.\n\nBest regards,\n[Your Name]`
          },
          offer: {
            subject: `Special Offer: Get ${mainOffer.productName} at 50% Off`,
            body: `Hi!\n\nI wanted to give you a special opportunity to get ${mainOffer.productName} at 50% off.\n\nThis system normally costs $${mainOffer.pricing?.originalPrice || mainOffer.price || '0'}, but for the next 24 hours, you can get it for just $${mainOffer.pricing?.currentPrice || mainOffer.price || '0'}.\n\nHere's what you'll get:\n• Complete step-by-step system\n• Done-for-you implementation\n• 30-day money-back guarantee\n• Lifetime access to updates\n\nClick here to claim your discount: [LINK]\n\nThis offer expires in 24 hours.\n\nBest regards,\n[Your Name]`
          }
        }
      }
      
      setGeneratedContent(content)
      onContentGenerated(content)
    } catch (error) {
      console.error('Error generating content:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border transition-all duration-300 ${
          toast.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <div className="h-5 w-5 text-red-600">⚠️</div>
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {generatedContent && !isGenerating ? (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">Sales Copy Generated Successfully!</span>
          </div>
          
          {/* Bulk Download Section */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Download className="h-5 w-5" />
                Download All Content
              </CardTitle>
              <CardDescription className="text-blue-700">
                Get all your generated content in organized, ready-to-use formats
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 bg-white hover:bg-blue-50 border-blue-300 text-blue-700"
                  onClick={() => handleDownload(generatedContent, 'sales-page')}
                >
                  <FileText className="h-4 w-4" />
                  Sales Page
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 bg-white hover:bg-blue-50 border-blue-300 text-blue-700"
                  onClick={() => handleDownload(generatedContent, 'video-script')}
                >
                  <Video className="h-4 w-4" />
                  Video Script
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 bg-white hover:bg-blue-50 border-blue-300 text-blue-700"
                  onClick={() => handleDownload(generatedContent, 'email-sequence')}
                >
                  <Mail className="h-4 w-4" />
                  Email Sequence
                </Button>
              </div>
              
              <div className="pt-2 border-t border-blue-200">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    // Create a comprehensive download with all content
                    const allContent = `AI FUNNEL BUILDER - COMPLETE CONTENT PACKAGE\n${'='.repeat(60)}\n\n` +
                      `Generated on: ${new Date().toLocaleString()}\n` +
                      `Business: ${customerAvatar.businessName || 'Your Business'}\n` +
                      `Industry: ${customerAvatar.industry}\n` +
                      `Product: ${mainOffer.productName}\n\n` +
                      formatContentForDownload(generatedContent, 'sales-page') +
                      '\n' + '='.repeat(60) + '\n\n' +
                      formatContentForDownload(generatedContent, 'video-script') +
                      '\n' + '='.repeat(60) + '\n\n' +
                      formatContentForDownload(generatedContent, 'email-sequence')
                    
                    const blob = new Blob([allContent], { type: 'text/plain;charset=utf-8' })
                    const url = URL.createObjectURL(blob)
                    const timestamp = new Date().toISOString().split('T')[0]
                    const filename = `${customerAvatar.businessName || 'Business'}_Complete_Funnel_${timestamp}.txt`
                    
                    const a = document.createElement('a')
                    a.href = url
                    a.download = filename
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                    URL.revokeObjectURL(url)
                    
                    showToast('Complete funnel package downloaded successfully!')
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Complete Package
                </Button>
                <p className="text-xs text-blue-600 mt-2 text-center">
                  Downloads all content as a single, organized text file
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="sales-page" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sales-page">Sales Page</TabsTrigger>
              <TabsTrigger value="video-script">Video Script</TabsTrigger>
              <TabsTrigger value="email-sequence">Email Sequence</TabsTrigger>
            </TabsList>

            {/* Sales Page Content */}
            <TabsContent value="sales-page" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Sales Page Copy
                  </CardTitle>
                  <CardDescription>
                    High-converting copy for your main sales page
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Headline</Label>
                      <div className="bg-gray-50 p-3 rounded-lg mt-1">
                        <p className="text-lg font-bold text-gray-900">{generatedContent.salesPage.headline}</p>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Subheadline</Label>
                      <div className="bg-gray-50 p-3 rounded-lg mt-1">
                        <p className="text-gray-700">{generatedContent.salesPage.subheadline}</p>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Hero Section</Label>
                      <div className="bg-gray-50 p-3 rounded-lg mt-1">
                        <p className="text-gray-700">{generatedContent.salesPage.heroSection}</p>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Problem Section</Label>
                      <div className="bg-gray-50 p-3 rounded-lg mt-1">
                        <pre className="text-gray-700 whitespace-pre-wrap">{generatedContent.salesPage.problemSection}</pre>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Solution Section</Label>
                      <div className="bg-gray-50 p-3 rounded-lg mt-1">
                        <pre className="text-gray-700 whitespace-pre-wrap">{generatedContent.salesPage.solutionSection}</pre>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Benefits</Label>
                      <div className="bg-gray-50 p-3 rounded-lg mt-1">
                        <ul className="space-y-1">
                          {generatedContent.salesPage.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-green-500 mt-0.5">•</span>
                              <span className="text-gray-700">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Social Proof</Label>
                      <div className="bg-gray-50 p-3 rounded-lg mt-1">
                        <ul className="space-y-1">
                          {generatedContent.salesPage.socialProof.map((proof, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-green-500 mt-0.5">•</span>
                              <span className="text-gray-700">{proof}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <Label className="text-sm font-medium text-blue-800">Call to Action</Label>
                      <p className="text-lg font-bold text-blue-900 text-center">
                        {generatedContent.salesPage.callToAction}
                      </p>
                    </div>
                    
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <Label className="text-sm font-medium text-orange-800">Urgency</Label>
                      <p className="text-orange-700 text-center">
                        {generatedContent.salesPage.urgency}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => handleCopy(generatedContent, 'sales-page')}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy All
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => handleDownload(generatedContent, 'sales-page')}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Video Script Content */}
            <TabsContent value="video-script" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Video Script
                  </CardTitle>
                  <CardDescription>
                    Engaging script for sales videos and webinars
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {Object.entries(generatedContent.videoScript).map(([section, text]) => (
                      <div key={section}>
                        <Label className="text-sm font-medium text-gray-700 capitalize">
                          {section.replace(/([A-Z])/g, ' $1')}
                        </Label>
                        <div className="bg-gray-50 p-3 rounded-lg mt-1">
                          <p className="text-sm text-gray-700 italic">&quot;{text}&quot;</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => handleCopy(generatedContent, 'video-script')}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Script
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => handleDownload(generatedContent, 'video-script')}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Email Sequence Content */}
            <TabsContent value="email-sequence" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Sequence
                  </CardTitle>
                  <CardDescription>
                    Complete email sequence for lead nurturing and sales
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {Object.entries(generatedContent.emailSequence).map(([emailType, email]) => (
                      <div key={emailType} className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="capitalize">
                            {emailType.replace(/([A-Z])/g, ' $1')}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Subject Line</Label>
                            <p className="text-sm text-gray-900 mt-1">{email.subject}</p>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Email Body</Label>
                            <div className="bg-gray-50 p-3 rounded-lg mt-1">
                              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                                {email.body}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => handleCopy(generatedContent, 'email-sequence')}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy All
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => handleDownload(generatedContent, 'email-sequence')}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Button 
            onClick={() => setGeneratedContent(null)}
            variant="outline"
            className="w-full"
          >
            Regenerate Content
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-blue-900">Customer Avatar</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Industry:</span>
                    <span className="text-blue-900 font-medium">{customerAvatar.industry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Audience:</span>
                    <span className="text-blue-900 font-medium">{customerAvatar.targetAudience}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-green-900">Main Offer</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">Product:</span>
                    <span className="text-green-900 font-medium">{mainOffer.productName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Price:</span>
                    <span className="text-green-900 font-medium">${mainOffer.pricing?.currentPrice || mainOffer.price}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Copy Preferences */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="pageType" className="text-sm font-medium">
                  Page Type
                </Label>
                <select
                  id="pageType"
                  value={formData.pageType}
                  onChange={(e) => handleInputChange('pageType', e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="sales-page">Sales Page</option>
                  <option value="landing-page">Landing Page</option>
                  <option value="webinar-page">Webinar Page</option>
                  <option value="checkout-page">Checkout Page</option>
                </select>
              </div>

              <div>
                <Label htmlFor="tone" className="text-sm font-medium">
                  Tone of Voice
                </Label>
                <select
                  id="tone"
                  value={formData.tone}
                  onChange={(e) => handleInputChange('tone', e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="professional">Professional</option>
                  <option value="conversational">Conversational</option>
                  <option value="urgent">Urgent</option>
                  <option value="friendly">Friendly</option>
                  <option value="authoritative">Authoritative</option>
                </select>
              </div>

              <div>
                <Label htmlFor="callToAction" className="text-sm font-medium">
                  Call to Action
                </Label>
                <Input
                  id="callToAction"
                  value={formData.callToAction}
                  onChange={(e) => handleInputChange('callToAction', e.target.value)}
                  placeholder="e.g., Buy Now, Get Started, Learn More"
                  required
                />
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="additionalNotes" className="text-sm font-medium">
                  Additional Notes
                </Label>
                <Textarea
                  id="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                  placeholder="Any specific requirements or preferences for the copy?"
                  rows={6}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Sparkles className="h-4 w-4" />
              <span>AI will generate sales copy optimized for your audience and offer</span>
            </div>
            
            <Button 
              type="submit" 
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <LoadingSpinner size="sm" />
                  Generating Copy...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Sales Copy
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
