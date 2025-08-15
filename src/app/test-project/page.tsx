'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, ArrowRight } from 'lucide-react'

export default function TestProjectPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleStartProject = () => {
    setIsLoading(true)
    // Simulate loading
    setTimeout(() => {
      router.push('/project/test-project-123')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">AI Funnel Builder</CardTitle>
          <CardDescription>
            Test the project workspace with sample data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              This will open a demo project workspace showing:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Tab-based navigation</li>
              <li>• AI status indicators</li>
              <li>• Form components</li>
              <li>• Progress tracking</li>
              <li>• Responsive design</li>
            </ul>
          </div>
          
          <Button 
            onClick={handleStartProject}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              'Loading Project...'
            ) : (
              <>
                View Demo Project
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
          
          <div className="text-center">
            <Badge variant="secondary">Demo Mode</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
