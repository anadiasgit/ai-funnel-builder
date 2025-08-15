// app/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  FileText, 
  TrendingUp, 
  Users, 
  Target, 
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Calendar,
  BarChart3,
  DollarSign,
  Settings
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Avatar {
  id: string
  name: string
  description: string
}

interface Offer {
  id: string
  title: string
  description: string
}

interface GeneratedContent {
  id: string
  type: string
  content: string
}

interface Project {
  id: string
  name: string
  description: string
  status: 'draft' | 'active' | 'completed'
  created_at: string
  updated_at: string
  avatars?: Avatar[]
  offers?: Offer[]
  generated_content?: GeneratedContent[]
}

interface Profile {
  full_name: string
  company_name: string
  subscription_tier: string
  total_generations: number
  monthly_generations: number
}

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalAvatars: 0,
    totalOffers: 0,
    totalContent: 0,
    monthlyUsage: 0,
    monthlyLimit: 100, // Free tier limit
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      // Add timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        if (loading) {
          console.warn('Dashboard loading timeout - forcing completion')
          setLoading(false)
          setError('Dashboard loading timed out. Please refresh the page.')
        }
      }, 15000) // 15 second timeout

      fetchDashboardData()
      
      return () => clearTimeout(timeoutId)
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchDashboardData = async (retryCount = 0) => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()
      
      if (profileError) {
        console.error('Profile fetch error:', profileError)
        // Don't throw error, just set profile to null
        setProfile(null)
      } else {
        setProfile(profileData)
      }

      // Fetch projects with related data - fix the query
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false })

      if (projectsError) {
        console.error('Projects fetch error:', projectsError)
        setProjects([])
      } else {
        setProjects(projectsData || [])
      }

      // Calculate stats safely
      const totalProjects = projectsData?.length || 0
      const totalAvatars = 0 // We'll implement this later when avatars table is set up
      const totalOffers = 0  // We'll implement this later when offers table is set up
      const totalContent = 0 // We'll implement this later when content table is set up

      setStats({
        totalProjects,
        totalAvatars,
        totalOffers,
        totalContent,
        monthlyUsage: profileData?.monthly_generations || 0,
        monthlyLimit: profileData?.subscription_tier === 'pro' ? 1000 : 100,
        totalRevenue: 0 // Placeholder for revenue
      })

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      
      // Retry once if it's the first attempt
      if (retryCount === 0) {
        console.log('Retrying dashboard data fetch...')
        setTimeout(() => fetchDashboardData(1), 2000)
        return
      }
      
      setError('Failed to load dashboard data. Please try refreshing the page.')
      // Set default values on error
      setProjects([])
      setProfile(null)
      setStats({
        totalProjects: 0,
        totalAvatars: 0,
        totalOffers: 0,
        totalContent: 0,
        monthlyUsage: 0,
        monthlyLimit: 100,
        totalRevenue: 0
      })
    } finally {
      setLoading(false)
    }
  }

  const createNewProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user?.id,
          name: `Funnel ${projects.length + 1}`,
          description: 'New AI-generated funnel',
          status: 'draft'
        })
        .select()
        .single()

      if (error) throw error

      router.push(`/project/${data.id}`)
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  const deleteProject = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await supabase
          .from('projects')
          .delete()
          .eq('id', projectId)

        fetchDashboardData() // Refresh data
      } catch (error) {
        console.error('Error deleting project:', error)
      }
    }
  }

  const duplicateProject = async (project: Project) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user?.id,
          name: `${project.name} (Copy)`,
          description: project.description,
          status: 'draft'
        })
        .select()
        .single()

      if (error) throw error

      fetchDashboardData()
    } catch (error) {
      console.error('Error duplicating project:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-700'
      case 'active': return 'bg-green-100 text-green-700'
      case 'completed': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="text-red-600 text-2xl">⚠️</div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Button onClick={() => fetchDashboardData()} className="w-full">
              Try Again
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
              Refresh Page
            </Button>
            <Button variant="outline" onClick={() => router.push('/')} className="w-full">
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}!
              </h1>
              <p className="text-gray-600">
                {profile?.company_name && `${profile.company_name} • `}
                {profile?.subscription_tier?.toUpperCase()} Plan
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={createNewProject} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push('/settings')}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/billing')}>
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avatars Created</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalAvatars}</p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Offers Generated</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOffers}</p>
                </div>
                <Target className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue Generated</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue}</p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}