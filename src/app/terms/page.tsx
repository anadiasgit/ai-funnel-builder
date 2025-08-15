'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Link 
            href="/signup" 
            className="inline-flex items-center text-blue-600 hover:underline transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to signup
          </Link>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
            <CardDescription>
              Last updated: {new Date().toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="prose prose-gray max-w-none">
            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using AI Funnel Builder, you accept and agree to be bound by the terms 
                  and provision of this agreement.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Use License</h2>
                <p>
                  Permission is granted to temporarily use AI Funnel Builder for personal or commercial 
                  funnel building purposes. This is the grant of a license, not a transfer of title.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Service Description</h2>
                <p>
                  AI Funnel Builder provides AI-powered tools to help create marketing funnels, 
                  including copy generation, funnel templates, and optimization suggestions.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">4. User Responsibilities</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account</li>
                  <li>Use the service in compliance with applicable laws</li>
                  <li>Not misuse or attempt to gain unauthorized access</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Privacy & Data</h2>
                <p>
                  Your privacy is important to us. Please review our Privacy Policy, which also governs 
                  your use of the service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Limitation of Liability</h2>
                <p>
                  AI Funnel Builder is provided &quot;as is&quot; without warranties of any kind. We are not 
                  liable for any damages arising from the use of our service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Contact Information</h2>
                <p>
                  If you have any questions about these Terms of Service, please contact us at 
                  support@aifunnelbuilder.com
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
