// app/test-supabase/page.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestSupabasePage() {
  const [status, setStatus] = useState<string>('Ready to test')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setStatus('Testing connection...')
    
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1)
      
      if (error) {
        setStatus(`❌ Connection failed: ${error.message}`)
      } else {
        setStatus(`✅ Connection successful! Found ${data?.length || 0} profiles`)
      }
    } catch (err) {
      setStatus(`❌ Unexpected error: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const testAuth = async () => {
    setLoading(true)
    setStatus('Testing auth...')
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        setStatus(`✅ Auth working! User: ${session.user.email}`)
      } else {
        setStatus('ℹ️ No active session (this is normal if not logged in)')
      }
    } catch (err) {
      setStatus(`❌ Auth error: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto max-w-2xl px-4">
        <Card>
          <CardHeader>
            <CardTitle>Supabase Connection Test</CardTitle>
            <CardDescription>
              Test your Supabase connection and authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-mono">{status}</p>
            </div>
            
            <div className="flex gap-4">
              <Button onClick={testConnection} disabled={loading}>
                Test Connection
              </Button>
              <Button onClick={testAuth} disabled={loading} variant="outline">
                Test Auth
              </Button>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>This page helps debug Supabase issues. Check the console for detailed logs.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
