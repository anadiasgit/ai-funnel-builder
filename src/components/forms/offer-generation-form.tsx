'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useAIStream } from '@/components/ui/use-ai-stream'
import { 
  Target, 
  Sparkles,
  CheckCircle2,
  Star,
  Download,
  Wand2,
  Copy,
  RefreshCw,
  DollarSign,
  Zap,
  Shield,
  TrendingUp
} from 'lucide-react'

interface OfferGenerationFormProps {
  customerAvatar: CustomerAvatar
  existingOffer?: MainOffer | null
  onOfferGenerated: (offer: MainOffer) => void
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

interface OfferFormData {
  productName: string
  productDescription: string
  price: string
  valueProposition: string
  features: string
  guarantee: string
}

export function OfferGenerationForm({ 
  customerAvatar, 
  existingOffer, 
  onOfferGenerated 
}: OfferGenerationFormProps) {
  const [formData, setFormData] = useState({
    productName: existingOffer?.productName || '',
    productDescription: existingOffer?.productDescription || '',
    price: existingOffer?.price || '',
    valueProposition: existingOffer?.valueProposition || '',
    features: existingOffer?.features || '',
    guarantee: existingOffer?.guarantee || ''
  })
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [offer, setOffer] = useState(existingOffer)
  const [aiSuggestions, setAiSuggestions] = useState<Partial<OfferFormData>>({})
  const [activeField, setActiveField] = useState<keyof typeof formData | 'headlines' | 'urgency' | 'socialProof' | 'objections' | 'responses' | null>(null)
  const [aiHeadlines, setAiHeadlines] = useState<{ headline: string; subheadline: string } | null>(null)
  const [aiUrgency, setAiUrgency] = useState<string>('')
  const [aiSocialProof, setAiSocialProof] = useState<string[]>([])
  const [aiObjections, setAiObjections] = useState<string[]>([])
  const [aiResponses, setAiResponses] = useState<string[]>([])

  // AI Stream hook for real-time generation
  const { isStreaming, content, error, startStream, reset: resetAI } = useAIStream({
    onStart: () => console.log('AI generation started'),
    onChunk: (chunk) => console.log('AI chunk received:', chunk),
    onComplete: (fullText) => {
      console.log('AI generation completed:', fullText)
      if (activeField) {
        if (activeField === 'headlines') {
          // Parse headline and subheadline
          const lines = fullText.split('\n').filter(line => line.trim())
          setAiHeadlines({
            headline: lines[0] || '',
            subheadline: lines[1] || ''
          })
        } else if (activeField === 'urgency') {
          setAiUrgency(fullText)
        } else if (activeField === 'socialProof') {
          // Parse social proof into bullet points
          const proof = fullText.split('\n')
            .filter(line => line.trim().length > 0)
            .map(line => line.replace(/^[-•*]\s*/, '').trim())
            .filter(line => line.length > 10)
          setAiSocialProof(proof)
        } else if (activeField === 'objections') {
          // Parse objections into bullet points
          const objections = fullText.split('\n')
            .filter(line => line.trim().length > 0)
            .map(line => line.replace(/^[-•*]\s*/, '').trim())
            .filter(line => line.length > 10)
          setAiObjections(objections)
        } else if (activeField === 'responses') {
          // Parse responses into bullet points
          const responses = fullText.split('\n')
            .filter(line => line.trim().length > 0)
            .map(line => line.replace(/^[-•*]\s*/, '').trim())
            .filter(line => line.length > 10)
          setAiResponses(responses)
        } else {
          setAiSuggestions(prev => ({ ...prev, [activeField]: fullText }))
        }
        setActiveField(null)
      }
    },
    onError: (error) => console.error('AI generation error:', error)
  })

  // Smart defaults based on customer avatar
  useEffect(() => {
    if (customerAvatar && !existingOffer) {
      const smartDefaults = generateSmartDefaults(customerAvatar)
      setFormData(prev => ({
        ...prev,
        ...smartDefaults
      }))
    }
  }, [customerAvatar, existingOffer])

  const generateSmartDefaults = (avatar: CustomerAvatar) => {
    const defaults: Partial<typeof formData> = {}
    
    // Industry-specific product suggestions
    if (avatar.industry) {
      const industryDefaults = getIndustryDefaults(avatar.industry)
      defaults.productName = industryDefaults.productName
      defaults.productDescription = industryDefaults.productDescription
      defaults.valueProposition = industryDefaults.valueProposition
      defaults.guarantee = industryDefaults.guarantee
    }

    // Industry-specific features (using industry instead of businessType)
    if (avatar.industry) {
      const industryFeatures = getIndustryFeatures(avatar.industry)
      defaults.features = industryFeatures
    }

    // Budget-aware pricing suggestions
    if (avatar.budget) {
      defaults.price = getBudgetBasedPricing(avatar.budget)
    }

    return defaults
  }

  const getIndustryDefaults = (industry: string) => {
    const industryMap: Record<string, {
      productName: string
      productDescription: string
      valueProposition: string
      guarantee: string
    }> = {
      'Technology': {
        productName: 'Complete Tech Solution Suite',
        productDescription: 'End-to-end technology solution for modern businesses',
        valueProposition: 'Transform your business with cutting-edge technology',
        guarantee: '30-day money-back guarantee with full support'
      },
      'Marketing & Advertising': {
        productName: 'Marketing Mastery System',
        productDescription: 'Comprehensive marketing strategy and implementation guide',
        valueProposition: 'Generate consistent leads and increase conversions',
        guarantee: 'Double your ROI or get your money back'
      },
      'E-commerce': {
        productName: 'E-commerce Growth Blueprint',
        productDescription: 'Proven system to scale your online store',
        valueProposition: 'Increase sales and reduce customer acquisition costs',
        guarantee: 'See results in 90 days or full refund'
      },
      'Health & Wellness': {
        productName: 'Wellness Business Builder',
        productDescription: 'Complete system for health and wellness entrepreneurs',
        valueProposition: 'Help more people while building a profitable business',
        guarantee: 'Transform your practice or 100% refund'
      },
      'Finance': {
        productName: 'Financial Freedom Framework',
        productDescription: 'Step-by-step guide to building wealth',
        valueProposition: 'Secure your financial future with proven strategies',
        guarantee: 'Achieve your first milestone or money back'
      }
    }
    
    return industryMap[industry] || {
      productName: 'Business Success System',
      productDescription: 'Complete solution for your business needs',
      valueProposition: 'Transform your business and achieve your goals',
      guarantee: '30-day satisfaction guarantee'
    }
  }

  const getIndustryFeatures = (industry: string) => {
    const featureMap: Record<string, string> = {
      'Technology': 'Cloud infrastructure, automation tools, security protocols, scalability solutions, integration capabilities',
      'Marketing & Advertising': 'Lead generation systems, conversion optimization, customer journey mapping, analytics tools, campaign management',
      'E-commerce': 'Product optimization, conversion tactics, customer retention, scaling strategies, inventory management',
      'Health & Wellness': 'Client management systems, appointment scheduling, wellness tracking, outcome measurement, practice growth',
      'Finance': 'Investment strategies, risk management, portfolio optimization, tax planning, retirement planning',
      'Real Estate': 'Lead generation, client management, market analysis, transaction coordination, team building',
      'Professional Services': 'Client acquisition, service delivery, pricing models, business scaling, team management'
    }
    
    return featureMap[industry] || 'Core business strategies, growth tactics, operational efficiency, customer success'
  }

  const getBudgetBasedPricing = (budget: string) => {
    const budgetMap: Record<string, string> = {
      'Under $1,000': '97',
      '$1,000 - $5,000': '297',
      '$5,000 - $10,000': '497',
      '$10,000 - $25,000': '997',
      '$25,000+': '1,997'
    }
    
    return budgetMap[budget] || '197'
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const generateAIField = async (field: keyof typeof formData) => {
    setActiveField(field)
    
    const context = `Industry: ${customerAvatar.industry}, Target Audience: ${customerAvatar.targetAudience}, Budget: ${customerAvatar.budget}, Pain Points: ${customerAvatar.painPoints}, Goals: ${customerAvatar.goals}`
    
    const fieldPrompts: Record<keyof typeof formData, string> = {
      productName: `Create a compelling product name for a ${customerAvatar.industry} business solution. Make it memorable, benefit-focused, and industry-specific.`,
      productDescription: `Write a compelling product description for a ${customerAvatar.industry} business solution. Focus on benefits, outcomes, and how it solves customer problems.`,
      price: `Suggest an appropriate price for a ${customerAvatar.industry} business solution. Consider the target audience's budget and the value provided.`,
      valueProposition: `Create a powerful value proposition for a ${customerAvatar.industry} business solution. Emphasize the main benefit and why customers should choose this over alternatives.`,
      features: `List the key features and benefits of a ${customerAvatar.industry} business solution. Focus on what makes it unique and valuable to customers.`,
      guarantee: `Write a compelling guarantee for a ${customerAvatar.industry} business solution. Make it risk-free and confidence-building for potential customers.`
    }

    await startStream(
      `${fieldPrompts[field]}\n\nContext: ${context}`,
      'offerGeneration',
      { model: 'gpt-4o-mini', maxTokens: 200, temperature: 0.8 }
    )
  }

  const generateAIHeadlines = async () => {
    setActiveField('headlines')
    
    const context = `Industry: ${customerAvatar.industry}, Target Audience: ${customerAvatar.targetAudience}, Product: ${formData.productName || 'Business Solution'}, Price: $${formData.price || '197'}`
    
    await startStream(
      `Generate a compelling headline and subheadline for a ${customerAvatar.industry} business offer. The headline should be attention-grabbing and benefit-focused. The subheadline should provide social proof and urgency.\n\nContext: ${context}`,
      'offerGeneration',
      { model: 'gpt-4o', maxTokens: 300, temperature: 0.7 }
    )
  }

  const generateAIUrgency = async () => {
    setActiveField('urgency')
    
    const context = `Industry: ${customerAvatar.industry}, Target Audience: ${customerAvatar.targetAudience}, Product: ${formData.productName || 'Business Solution'}, Price: $${formData.price || '197'}`
    
    await startStream(
      `Create an urgency message for a ${customerAvatar.industry} business offer. Include scarcity, time limits, or special bonuses to encourage immediate action.\n\nContext: ${context}`,
      'offerGeneration',
      { model: 'gpt-4o-mini', maxTokens: 150, temperature: 0.8 }
    )
  }

  const generateAISocialProof = async () => {
    setActiveField('socialProof')
    
    const context = `Industry: ${customerAvatar.industry}, Target Audience: ${customerAvatar.targetAudience}, Product: ${formData.productName || 'Business Solution'}`
    
    await startStream(
      `Generate 5-7 compelling social proof elements for a ${customerAvatar.industry} business offer. Include testimonials, case studies, statistics, and credibility markers.\n\nContext: ${context}`,
      'offerGeneration',
      { model: 'gpt-4o', maxTokens: 300, temperature: 0.7 }
    )
  }

  const generateAIObjections = async () => {
    setActiveField('objections')
    
    const context = `Industry: ${customerAvatar.industry}, Target Audience: ${customerAvatar.targetAudience}, Product: ${formData.productName || 'Business Solution'}, Price: $${formData.price || '197'}`
    
    await startStream(
      `Generate 5-7 common objections that customers might have about a ${customerAvatar.industry} business offer. Focus on price, time, skepticism, and implementation concerns.\n\nContext: ${context}`,
      'offerGeneration',
      { model: 'gpt-4o', maxTokens: 300, temperature: 0.7 }
    )
  }

  const generateAIResponses = async () => {
    setActiveField('responses')
    
    const context = `Industry: ${customerAvatar.industry}, Target Audience: ${customerAvatar.targetAudience}, Product: ${formData.productName || 'Business Solution'}, Guarantee: ${formData.guarantee || '30-day guarantee'}`
    
    await startStream(
      `Generate 5-7 compelling responses to common objections about a ${customerAvatar.industry} business offer. Address concerns about price, time, skepticism, and implementation. Use the guarantee and value proposition to overcome objections.\n\nContext: ${context}`,
      'offerGeneration',
      { model: 'gpt-4o', maxTokens: 400, temperature: 0.7 }
    )
  }

  const applyAISuggestion = (field: keyof typeof formData) => {
    if (aiSuggestions[field]) {
      setFormData(prev => ({ ...prev, [field]: aiSuggestions[field] as string }))
      setAiSuggestions(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // Helper function to handle offer download
  const handleDownload = (offerData: MainOffer) => {
    try {
      const timestamp = new Date().toLocaleString()
      const content = `MAIN OFFER - ${offerData.productName}\n${'='.repeat(50)}\n\n` +
        `Generated on: ${timestamp}\n\n` +
        `PRODUCT DETAILS:\n` +
        `Product Name: ${offerData.productName}\n` +
        `Product Description: ${offerData.productDescription}\n` +
        `Price: $${offerData.price}\n` +
        `Value Proposition: ${offerData.valueProposition}\n\n` +
        `FEATURES:\n${offerData.features}\n\n` +
        `GUARANTEE:\n${offerData.guarantee}\n\n` +
        `AI OPTIMIZATIONS:\n` +
        `Headline: ${offerData.aiOptimizations?.headline || 'Not available'}\n` +
        `Subheadline: ${offerData.aiOptimizations?.subheadline || 'Not available'}\n` +
        `Urgency: ${offerData.aiOptimizations?.urgency || 'Not available'}\n\n` +
        `SOCIAL PROOF:\n${offerData.aiOptimizations?.socialProof?.map(proof => `• ${proof}`).join('\n') || 'Not available'}\n\n` +
        `OBJECTIONS & RESPONSES:\n` +
        `${offerData.aiOptimizations?.objections?.map((obj, index) => 
          `Objection ${index + 1}: ${obj}\nResponse: ${offerData.aiOptimizations?.responses?.[index] || 'Not available'}\n`
        ).join('\n') || 'Not available'}\n\n` +
        `PRICING:\n` +
        `Original Price: $${offerData.pricing?.originalPrice || 'Not set'}\n` +
        `Current Price: $${offerData.pricing?.currentPrice || offerData.price}\n` +
        `Savings: $${offerData.pricing?.savings || '0'}\n` +
        `Payment Options: ${offerData.pricing?.paymentOptions?.join(', ') || 'Not specified'}\n\n` +
        `Generated by AI Funnel Builder`

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const timestamp2 = new Date().toISOString().split('T')[0]
      const filename = `${offerData.productName.replace(/[^a-zA-Z0-9]/g, '_')}_Main_Offer_${timestamp2}.txt`
      
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      // Show success feedback
      alert('Main offer downloaded successfully!')
    } catch (error) {
      console.error('Download failed:', error)
      alert('Download failed. Please try again.')
    }
  }

  const generateFullOffer = async () => {
    setIsGenerating(true)
    
    try {
      const context = `Industry: ${customerAvatar.industry}, Target Audience: ${customerAvatar.targetAudience}, Budget: ${customerAvatar.budget}, Pain Points: ${customerAvatar.painPoints}, Goals: ${customerAvatar.goals}`
      
      // Generate all AI optimizations
      await generateAIHeadlines()
      await generateAIUrgency()
      await generateAISocialProof()
      await generateAIObjections()
      await generateAIResponses()
      
      const generatedOffer = {
        ...formData,
        id: Date.now().toString(),
        generatedAt: new Date().toISOString(),
        aiOptimizations: {
          headline: aiHeadlines?.headline || `Transform Your ${customerAvatar.industry} Business in 30 Days`,
          subheadline: aiHeadlines?.subheadline || `The proven system that helped 500+ businesses like yours increase revenue by 300%`,
          urgency: aiUrgency || 'Limited Time: Only 47 spots available this month',
          socialProof: aiSocialProof.length > 0 ? aiSocialProof : [
            'Trusted by 500+ business owners',
            '4.9/5 star rating from 200+ reviews',
            'Featured in Business Insider, Forbes'
          ],
          objections: aiObjections.length > 0 ? aiObjections : [
            'What if it doesn\'t work for my business?',
            'I don\'t have time to implement this',
            'It sounds too good to be true'
          ],
          responses: aiResponses.length > 0 ? aiResponses : [
            '30-day money-back guarantee, no questions asked',
            'Done-for-you implementation included',
            'Real results from real businesses - see case studies'
          ]
        },
        pricing: {
          originalPrice: parseFloat(formData.price) * 1.5,
          currentPrice: parseFloat(formData.price),
          savings: parseFloat(formData.price) * 0.5,
          paymentOptions: ['One-time payment', '3 monthly payments']
        }
      }
      
      setOffer(generatedOffer)
      onOfferGenerated(generatedOffer)
    } catch (error) {
      console.error('Error generating offer:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  if (offer && !isGenerating) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-medium">Main Offer Generated Successfully!</span>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {offer.productName}
            </CardTitle>
            <CardDescription>
              AI-optimized offer with conversion-focused copy and pricing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* AI Headlines */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <Label className="text-sm font-medium text-gray-700">AI-Generated Headline</Label>
                              <h3 className="text-xl font-bold text-gray-900 mt-2">
                  {offer.aiOptimizations?.headline}
                </h3>
                <p className="text-gray-600 mt-1">
                  {offer.aiOptimizations?.subheadline}
                </p>
            </div>

            {/* Pricing */}
            <div className="bg-green-50 p-4 rounded-lg">
              <Label className="text-sm font-medium text-gray-700">Optimized Pricing</Label>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-bold text-green-600">
                  ${offer.pricing?.currentPrice || offer.price}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  ${offer.pricing?.originalPrice || offer.price}
                </span>
                <Badge variant="secondary" className="ml-2">
                  Save ${offer.pricing?.savings || '0'}
                </Badge>
              </div>
                              <p className="text-sm text-gray-600 mt-1">
                  {offer.pricing?.paymentOptions?.join(' • ') || 'One-time payment'}
                </p>
            </div>

            <Separator />

            {/* Product Details */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-sm font-medium text-gray-700">Product Description</Label>
                <p className="text-sm text-gray-900 mt-1">{offer.productDescription}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Value Proposition</Label>
                <p className="text-sm text-gray-900 mt-1">{offer.valueProposition}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Key Features</Label>
                <p className="text-sm text-gray-900 mt-1">{offer.features}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Guarantee</Label>
                <p className="text-sm text-gray-900 mt-1">{offer.guarantee}</p>
              </div>
            </div>

            <Separator />

            {/* Social Proof */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Social Proof Elements</Label>
              <div className="mt-2 space-y-2">
                {offer.aiOptimizations?.socialProof?.map((proof: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <p className="text-sm text-gray-700">{proof}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Objection Handling */}
            <div>
              <Label className="text-sm font-medium text-gray-700">AI Objection Handling</Label>
              <div className="mt-2 space-y-3">
                {offer.aiOptimizations?.objections?.map((objection: string, index: number) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Objection: {objection}
                    </p>
                    <p className="text-sm text-gray-700">
                      Response: {offer.aiOptimizations?.responses?.[index]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={() => setOffer(null)}
              variant="outline"
              className="w-full"
            >
              Regenerate Offer
            </Button>

            <Button 
              onClick={() => handleDownload(offer)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Main Offer
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* AI Status Bar */}
      {isStreaming && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-blue-800 font-medium">
                AI is generating content for: {activeField === 'headlines' ? 'AI Headlines' : activeField === 'urgency' ? 'AI Urgency' : activeField === 'socialProof' ? 'AI Social Proof' : activeField === 'objections' ? 'AI Objections' : activeField === 'responses' ? 'AI Responses' : activeField ? activeField.charAt(0).toUpperCase() + activeField.slice(1) : 'Main Offer'}
              </span>
              {activeField && activeField !== 'headlines' && activeField !== 'urgency' && activeField !== 'socialProof' && activeField !== 'objections' && activeField !== 'responses' && (
                <Badge variant="outline" className="ml-auto">
                  {content.length} characters
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Suggestions Panel */}
      {Object.keys(aiSuggestions).some(key => aiSuggestions[key as keyof typeof aiSuggestions]) && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-sm text-green-900 flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              AI Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(aiSuggestions).map(([field, suggestion]) => 
              suggestion ? (
                <div key={field} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-green-800 capitalize">
                      {field.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => applyAISuggestion(field as keyof typeof formData)}
                        className="h-7 px-2 text-xs"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Apply
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setAiSuggestions(prev => ({ ...prev, [field]: undefined }))}
                        className="h-7 px-2 text-xs"
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded border border-green-200">
                    <p className="text-sm text-green-900">{suggestion}</p>
                  </div>
                </div>
              ) : null
            )}
          </CardContent>
        </Card>
      )}

      {/* AI Headlines Panel */}
      {aiHeadlines && (
        <Card className="bg-purple-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-sm text-purple-900 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              AI Headlines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-white rounded border border-purple-200">
              <h4 className="font-medium text-purple-900">{aiHeadlines.headline}</h4>
              <p className="text-sm text-purple-700 mt-1">{aiHeadlines.subheadline}</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  setFormData(prev => ({ ...prev, productName: aiHeadlines.headline }))
                  setAiHeadlines(null)
                }}
                className="h-7 px-2 text-xs"
              >
                <Copy className="h-3 w-3 mr-1" />
                Apply Headline
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAiHeadlines(null)}
                className="h-7 px-2 text-xs"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Urgency Panel */}
      {aiUrgency && (
        <Card className="bg-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle className="text-sm text-orange-900 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              AI Urgency Message
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-white rounded border border-orange-200">
              <p className="text-sm text-orange-900">{aiUrgency}</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => setAiUrgency('')}
                className="h-7 px-2 text-xs"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy Text
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAiUrgency('')}
                className="h-7 px-2 text-xs"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Social Proof Panel */}
      {aiSocialProof.length > 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-sm text-yellow-900 flex items-center gap-2">
              <Star className="h-4 w-4" />
              AI Social Proof
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              {aiSocialProof.map((proof, index) => (
                <div key={index} className="p-2 bg-white rounded border border-yellow-200">
                  <p className="text-sm text-yellow-900">{proof}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => setAiSocialProof([])}
                className="h-7 px-2 text-xs"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy All
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAiSocialProof([])}
                className="h-7 px-2 text-xs"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Objections & Responses Panel */}
      {(aiObjections.length > 0 || aiResponses.length > 0) && (
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-sm text-red-900 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              AI Objection Handling
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {aiObjections.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-red-800">Objections</Label>
                <div className="mt-2 space-y-2">
                  {aiObjections.map((objection, index) => (
                    <div key={index} className="p-2 bg-white rounded border border-red-200">
                      <p className="text-sm text-red-900">{objection}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {aiResponses.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-red-800">Responses</Label>
                <div className="mt-2 space-y-2">
                  {aiResponses.map((response, index) => (
                    <div key={index} className="p-2 bg-white rounded border border-red-200">
                      <p className="text-sm text-red-900">{response}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  setAiObjections([])
                  setAiResponses([])
                }}
                className="h-7 px-2 text-xs"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy All
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setAiObjections([])
                  setAiResponses([])
                }}
                className="h-7 px-2 text-xs"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customer Avatar Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-blue-900">Customer Avatar Summary</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">Industry:</span>
              <span className="text-blue-900 font-medium">{customerAvatar.industry}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Target Audience:</span>
              <span className="text-blue-900 font-medium">{customerAvatar.targetAudience}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Budget Range:</span>
              <span className="text-blue-900 font-medium">{customerAvatar.budget}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={(e) => { e.preventDefault(); generateFullOffer(); }} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Product Information */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="productName" className="text-sm font-medium">
                  Product/Service Name
                </Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => generateAIField('productName')}
                  disabled={isStreaming}
                  className="h-7 px-2 text-xs"
                >
                  <Wand2 className="h-3 w-3 mr-1" />
                  AI Generate
                </Button>
              </div>
              <Input
                id="productName"
                value={formData.productName}
                onChange={(e) => handleInputChange('productName', e.target.value)}
                placeholder="Your main product or service"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="productDescription" className="text-sm font-medium">
                  Product Description
                </Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => generateAIField('productDescription')}
                  disabled={isStreaming}
                  className="h-7 px-2 text-xs"
                >
                  <Wand2 className="h-3 w-3 mr-1" />
                  AI Generate
                </Button>
              </div>
              <Textarea
                id="productDescription"
                value={formData.productDescription}
                onChange={(e) => handleInputChange('productDescription', e.target.value)}
                placeholder="What does your product/service do?"
                rows={3}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="price" className="text-sm font-medium">
                  Price
                </Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => generateAIField('price')}
                  disabled={isStreaming}
                  className="h-7 px-2 text-xs"
                >
                  <Wand2 className="h-3 w-3 mr-1" />
                  AI Generate
                </Button>
              </div>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Offer Details */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="valueProposition" className="text-sm font-medium">
                  Value Proposition
                </Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => generateAIField('valueProposition')}
                  disabled={isStreaming}
                  className="h-7 px-2 text-xs"
                >
                  <Wand2 className="h-3 w-3 mr-1" />
                  AI Generate
                </Button>
              </div>
              <Textarea
                id="valueProposition"
                value={formData.valueProposition}
                onChange={(e) => handleInputChange('valueProposition', e.target.value)}
                placeholder="What's the main benefit for customers?"
                rows={3}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="features" className="text-sm font-medium">
                  Key Features
                </Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => generateAIField('features')}
                  disabled={isStreaming}
                  className="h-7 px-2 text-xs"
                >
                  <Wand2 className="h-3 w-3 mr-1" />
                  AI Generate
                </Button>
              </div>
              <Textarea
                id="features"
                value={formData.features}
                onChange={(e) => handleInputChange('features', e.target.value)}
                placeholder="What features make your offer unique?"
                rows={3}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="guarantee" className="text-sm font-medium">
                  Guarantee/Refund Policy
                </Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => generateAIField('guarantee')}
                  disabled={isStreaming}
                  className="h-7 px-2 text-xs"
                >
                  <Wand2 className="h-3 w-3 mr-1" />
                  AI Generate
                </Button>
              </div>
              <Textarea
                id="guarantee"
                value={formData.guarantee}
                onChange={(e) => handleInputChange('guarantee', e.target.value)}
                placeholder="What's your guarantee to customers?"
                rows={2}
                required
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* AI Generation Buttons */}
        <div className="grid gap-4 md:grid-cols-3">
          <Button
            type="button"
            variant="outline"
            onClick={generateAIHeadlines}
            disabled={isStreaming || !formData.productName}
            className="flex items-center gap-2"
          >
            <Zap className="h-4 w-4" />
            Generate Headlines
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={generateAIUrgency}
            disabled={isStreaming || !formData.productName}
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Generate Urgency
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={generateAISocialProof}
            disabled={isStreaming || !formData.productName}
            className="flex items-center gap-2"
          >
            <Star className="h-4 w-4" />
            Generate Social Proof
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            onClick={generateAIObjections}
            disabled={isStreaming || !formData.productName}
            className="flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            Generate Objections
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={generateAIResponses}
            disabled={isStreaming || !formData.productName}
            className="flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            Generate Responses
          </Button>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Sparkles className="h-4 w-4" />
            <span>AI will optimize your offer for maximum conversions</span>
          </div>
          
          <div className="flex gap-2">
            {existingOffer && (
              <Button 
                variant="outline"
                onClick={() => handleDownload(existingOffer)}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Existing Offer
              </Button>
            )}
            
            <Button 
              type="submit" 
              disabled={isGenerating || isStreaming}
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <LoadingSpinner size="sm" />
                  Generating Offer...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Complete Offer
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
