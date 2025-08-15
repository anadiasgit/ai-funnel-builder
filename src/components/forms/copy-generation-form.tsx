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

  const handleInputChange = (field: keyof CopyFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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

  if (generatedContent && !isGenerating) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-medium">Sales Copy Generated Successfully!</span>
        </div>
        
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
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Headline</Label>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      {generatedContent.salesPage.headline}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Subheadline</Label>
                    <p className="text-gray-700 mt-1">
                      {generatedContent.salesPage.subheadline}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Hero Section</Label>
                    <p className="text-gray-700 mt-1">
                      {generatedContent.salesPage.heroSection}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Problem Section</Label>
                    <div className="bg-red-50 p-3 rounded-lg mt-1">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                        {generatedContent.salesPage.problemSection}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Solution Section</Label>
                    <div className="bg-green-50 p-3 rounded-lg mt-1">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                        {generatedContent.salesPage.solutionSection}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Benefits</Label>
                    <ul className="mt-1 space-y-1">
                      {generatedContent.salesPage.benefits.map((benefit: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Call to Action</Label>
                    <div className="bg-blue-50 p-3 rounded-lg mt-1">
                      <p className="text-lg font-bold text-blue-900 text-center">
                        {generatedContent.salesPage.callToAction}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy All
                  </Button>
                  <Button variant="outline" className="flex-1">
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
                  <Button variant="outline" className="flex-1">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Script
                  </Button>
                  <Button variant="outline" className="flex-1">
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
                  <Button variant="outline" className="flex-1">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy All
                  </Button>
                  <Button variant="outline" className="flex-1">
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
    )
  }

  return (
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
  )
}
