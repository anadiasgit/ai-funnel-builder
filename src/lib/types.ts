export interface CustomerAvatar {
  id: string
  businessName: string
  businessDescription: string
  industry: string
  pricePoint: 'low' | 'mid' | 'high'
  audienceDescription: string
  websiteUrl: string
  existingCustomerData: string
  competitorAnalysis: string
  socialMediaAnalysis: string
  knownPainPoints: string
  previousResearch: string
  specificQuestions: string
  targetAge: string
  targetLocation: string
  targetIncome: string
  insights?: string[]
  recommendations?: string[]
}

export interface MainOffer {
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

export interface GeneratedContent {
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
