'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FAQ, 
  VideoTutorial, 
  ExampleContent, 
  LiveChat, 
  FloatingHelpButton,
  HelpIcon 
} from '@/components/ui/help-system'
import { 
  Search, 
  BookOpen, 
  Video, 
  MessageCircle, 
  Lightbulb, 
  ArrowRight,
  Play,
  FileText,
  Target,
  Users,
  TrendingUp,
  ShoppingCart
} from 'lucide-react'

// FAQ Data
const faqData = [
  {
    question: "How do I create my first customer avatar?",
    answer: "Start by going to your project workspace and clicking on 'Customer Avatar'. Fill in details about your target customer's demographics, pain points, goals, and buying behavior. The AI will help you create a comprehensive profile.",
    category: "Getting Started",
    tags: ["customer avatar", "onboarding", "first steps"]
  },
  {
    question: "What makes a good offer for my funnel?",
    answer: "A good offer should solve a specific problem, provide clear value, have an attractive price point, and include bonuses or guarantees. Focus on the transformation your customer will experience.",
    category: "Offers",
    tags: ["offers", "pricing", "value proposition"]
  },
  {
    question: "How long should my video sales letter be?",
    answer: "VSL length depends on your offer price and complexity. For offers under $100, aim for 5-15 minutes. For higher-priced offers ($100+), 15-45 minutes is typical. Focus on engagement over length.",
    category: "Video Sales Letters",
    tags: ["VSL", "video length", "engagement"]
  },
  {
    question: "What's the best order for my funnel elements?",
    answer: "Start with a compelling hook, then problem identification, solution presentation, proof/credibility, offer details, and a strong call-to-action. Each element should naturally flow to the next.",
    category: "Funnel Structure",
    tags: ["funnel flow", "conversion", "structure"]
  },
  {
    question: "How do I optimize my thank you page?",
    answer: "Include clear next steps, reinforce the purchase decision, provide immediate value, and set expectations for what's coming next. This page is crucial for reducing buyer's remorse.",
    category: "Thank You Pages",
    tags: ["thank you page", "optimization", "buyer's remorse"]
  },
  {
    question: "What email sequence should I use?",
    answer: "Start with a welcome email, then provide value and build trust over 3-7 emails before making additional offers. Use storytelling and personalization to increase engagement.",
    category: "Email Marketing",
    tags: ["email sequence", "nurturing", "conversion"]
  },
  {
    question: "How do I test different funnel elements?",
    answer: "Use A/B testing for headlines, offers, pricing, and calls-to-action. Test one element at a time and track conversion rates. Start with high-impact elements like headlines and pricing.",
    category: "Testing & Optimization",
    tags: ["A/B testing", "optimization", "conversion"]
  },
  {
    question: "What's the difference between order bumps and upsells?",
    answer: "Order bumps are offered on the same page as your main offer, while upsells are offered after the initial purchase. Order bumps should be low-cost, high-value additions that complement your main offer.",
    category: "Upsells & Order Bumps",
    tags: ["order bumps", "upsells", "revenue"]
  }
]

// Video Tutorials Data
const videoTutorials = [
  {
    title: "Creating Your First Customer Avatar",
    description: "Learn how to research and create a detailed customer avatar that will guide all your marketing decisions.",
    videoUrl: "/tutorials/customer-avatar.mp4",
    duration: "8:32",
    thumbnail: "/tutorials/avatar-thumb.jpg"
  },
  {
    title: "Writing Compelling Offers",
    description: "Discover the psychology behind creating offers that convert and how to structure them for maximum impact.",
    videoUrl: "/tutorials/compelling-offers.mp4",
    duration: "12:15",
    thumbnail: "/tutorials/offers-thumb.jpg"
  },
  {
    title: "Building High-Converting Sales Copy",
    description: "Master the art of writing sales copy that connects with your audience and drives conversions.",
    videoUrl: "/tutorials/sales-copy.mp4",
    duration: "15:47",
    thumbnail: "/tutorials/copy-thumb.jpg"
  },
  {
    title: "Designing Your Funnel Flow",
    description: "Learn how to structure your funnel for optimal user experience and conversion rates.",
    videoUrl: "/tutorials/funnel-flow.mp4",
    duration: "10:23",
    thumbnail: "/tutorials/flow-thumb.jpg"
  },
  {
    title: "Optimizing for Conversions",
    description: "Advanced techniques for testing and optimizing your funnel to maximize results.",
    videoUrl: "/tutorials/optimization.mp4",
    duration: "18:56",
    thumbnail: "/tutorials/optimization-thumb.jpg"
  }
]

// Example Content Data
const exampleContent = {
  customerAvatar: [
    {
      label: "E-commerce Business Owner",
      content: "Sarah, 35, runs an online jewelry store. She's struggling with low conversion rates and wants to increase average order value. She's tech-savvy but overwhelmed with marketing options.",
      description: "Specific demographics with clear pain points and goals"
    },
    {
      label: "SaaS Founder",
      content: "Mike, 42, built a project management tool for remote teams. He needs to generate more qualified leads and improve his sales process. He's analytical and data-driven.",
      description: "Technical background with measurable business objectives"
    }
  ],
  offers: [
    {
      label: "High-Value Course Package",
      content: "Complete 12-week course + 6 months of group coaching + Resource library + 30-day money-back guarantee",
      description: "Multiple value components with risk reversal"
    },
    {
      label: "Service + Bonus Bundle",
      content: "1-hour strategy session + Implementation guide + Email templates + 2 weeks of email support",
      description: "Immediate value with ongoing support"
    }
  ],
  headlines: [
    {
      label: "Problem-Awareness Headline",
      content: "Struggling to Get More Customers? Here's What 95% of Business Owners Are Doing Wrong",
      description: "Identifies problem and creates curiosity"
    },
    {
      label: "Solution-Focused Headline",
      content: "The 3-Step System That Helped 500+ Businesses Increase Revenue by 300% in 90 Days",
      description: "Specific results with social proof"
    }
  ]
}

export default function HelpCenter() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    {
      id: '1',
      text: "Hi! I'm here to help you with any questions about building funnels. How can I assist you today?",
      sender: 'support' as const,
      timestamp: new Date()
    }
  ])
  const [isTyping, setIsTyping] = useState(false)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    // Filter content based on search term
  }

  const handleChatMessage = (message: string) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user' as const,
      timestamp: new Date()
    }
    setChatMessages(prev => [...prev, userMessage])

    // Simulate support response
    setIsTyping(true)
    setTimeout(() => {
      const supportMessage = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! I'll get back to you shortly. In the meantime, you can check our FAQ section for quick answers to common questions.",
        sender: 'support' as const,
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, supportMessage])
      setIsTyping(false)
    }, 2000)
  }

  const handleUseExample = (content: string) => {
    // This would typically copy to clipboard or fill a form
    navigator.clipboard.writeText(content)
    // You could add a toast notification here
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-blue-600" />
                Help Center
              </h1>
              <p className="text-gray-600 mt-1">Everything you need to build high-converting funnels</p>
            </div>
            <Button 
              onClick={() => setIsChatOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Live Chat
            </Button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search for help articles, tutorials, or examples..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 text-lg py-4"
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Getting Started</h3>
              <p className="text-sm text-gray-600">New to funnel building? Start here</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Video className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Video Tutorials</h3>
              <p className="text-sm text-gray-600">Step-by-step video guides</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Lightbulb className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Examples</h3>
              <p className="text-sm text-gray-600">See what good content looks like</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <MessageCircle className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
              <p className="text-sm text-gray-600">Get help when you need it</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="faq" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="tutorials" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Video Tutorials
            </TabsTrigger>
            <TabsTrigger value="examples" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Examples
            </TabsTrigger>
            <TabsTrigger value="guides" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Guides
            </TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
              <p className="text-gray-600">Find quick answers to common questions about building funnels</p>
            </div>
            <FAQ items={faqData} searchable={true} categorized={true} />
          </TabsContent>

          <TabsContent value="tutorials" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Video Tutorials</h2>
              <p className="text-gray-600">Learn funnel building step-by-step with our comprehensive video guides</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {videoTutorials.map((tutorial, index) => (
                <VideoTutorial
                  key={index}
                  {...tutorial}
                  onPlay={() => console.log(`Playing: ${tutorial.title}`)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="examples" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Content Examples</h2>
              <p className="text-gray-600">See what good funnel content looks like and use these as templates</p>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Customer Avatar Examples
                </h3>
                <ExampleContent
                  title="Customer Avatar Examples"
                  examples={exampleContent.customerAvatar}
                  onUseExample={handleUseExample}
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  Offer Examples
                </h3>
                <ExampleContent
                  title="Offer Examples"
                  examples={exampleContent.offers}
                  onUseExample={handleUseExample}
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Headline Examples
                </h3>
                <ExampleContent
                  title="Headline Examples"
                  examples={exampleContent.headlines}
                  onUseExample={handleUseExample}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="guides" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Step-by-Step Guides</h2>
              <p className="text-gray-600">Comprehensive guides for each part of your funnel</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Customer Avatar Guide
                  </CardTitle>
                  <CardDescription>
                    Complete guide to researching and creating customer avatars
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Read Guide <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600" />
                    Offer Creation Guide
                  </CardTitle>
                  <CardDescription>
                    How to create irresistible offers that convert
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Read Guide <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    Copywriting Guide
                  </CardTitle>
                  <CardDescription>
                    Write copy that connects and converts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Read Guide <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-orange-600" />
                    Funnel Optimization
                  </CardTitle>
                  <CardDescription>
                    Test and optimize your funnel for better results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Read Guide <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Live Chat */}
      <LiveChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onSendMessage={handleChatMessage}
        messages={chatMessages}
        isTyping={isTyping}
      />

      {/* Floating Help Button */}
      <FloatingHelpButton
        onClick={() => setIsChatOpen(true)}
        className="bottom-20"
      />
    </div>
  )
}
