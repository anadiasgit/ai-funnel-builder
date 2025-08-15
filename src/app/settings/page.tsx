'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Lock, 
  Bell, 
  CreditCard, 
  Trash2, 
  Save, 
  Eye, 
  EyeOff,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Settings,
  Shield,
  Zap
} from 'lucide-react'

interface ProfileData {
  full_name: string
  company_name: string
  business_type: string
  industry: string
  experience_level: string
  goals: string[]
  [key: string]: unknown
}

interface AccountPreferences {
  email_notifications: boolean
  marketing_emails: boolean
  weekly_reports: boolean
  project_updates: boolean
}

interface UsageStats {
  total_projects: number
  total_generations: number
  monthly_generations: number
  monthly_limit: number
  subscription_tier: string
}

export default function SettingsPage() {
  const { user, updateProfile, signOut } = useAuth()
  const router = useRouter()
  
  // Profile state
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
    company_name: '',
    business_type: '',
    industry: '',
    experience_level: '',
    goals: []
  })
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  
  // Account preferences state
  const [preferences, setPreferences] = useState<AccountPreferences>({
    email_notifications: true,
    marketing_emails: false,
    weekly_reports: true,
    project_updates: true
  })
  
  // Usage stats state
  const [usageStats, setUsageStats] = useState<UsageStats>({
    total_projects: 0,
    total_generations: 0,
    monthly_generations: 0,
    monthly_limit: 100,
    subscription_tier: 'Free'
  })
  
  // UI state
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState('profile')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Load user data on mount
  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    try {
      setLoading(true)
      
      // Load profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (profile) {
        setProfileData({
          full_name: profile.full_name || '',
          company_name: profile.company_name || '',
          business_type: profile.business_type || '',
          industry: profile.industry || '',
          experience_level: profile.experience_level || '',
          goals: profile.goals || []
        })
      }

      // Load preferences
      const { data: prefs } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (prefs) {
        setPreferences({
          email_notifications: prefs.email_notifications ?? true,
          marketing_emails: prefs.marketing_emails ?? false,
          weekly_reports: prefs.weekly_reports ?? true,
          project_updates: prefs.project_updates ?? true
        })
      }

      // Load usage stats
      const { count: projects } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)

      const { count: generations } = await supabase
        .from('generations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)

      setUsageStats(prev => ({
        ...prev,
        total_projects: projects || 0,
        total_generations: generations || 0,
        monthly_generations: Math.floor(Math.random() * 50) + 10 // Mock data for now
      }))

    } catch (error) {
      console.error('Error loading user data:', error)
      setError('Failed to load user data')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async () => {
    try {
      setSaving(true)
      setError('')
      
      const result = await updateProfile(profileData)
      
      if (result.error) {
        setError(result.error.message)
      } else {
        setSuccess('Profile updated successfully!')
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (error) {
      setError('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    try {
      setSaving(true)
      setError('')
      
      if (passwordData.new_password !== passwordData.confirm_password) {
        setError('New passwords do not match')
        return
      }

      if (passwordData.new_password.length < 6) {
        setError('New password must be at least 6 characters')
        return
      }

      // Verify current password first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: passwordData.current_password
      })

      if (signInError) {
        setError('Current password is incorrect')
        return
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: passwordData.new_password
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess('Password updated successfully!')
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        })
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (error) {
      setError('Failed to update password')
    } finally {
      setSaving(false)
    }
  }

  const handlePreferencesUpdate = async () => {
    try {
      setSaving(true)
      setError('')
      
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user?.id,
          ...preferences,
          updated_at: new Date().toISOString()
        })

      if (error) {
        setError('Failed to update preferences')
      } else {
        setSuccess('Preferences updated successfully!')
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (error) {
      setError('Failed to update preferences')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      setSaving(true)
      setError('')
      
      // Delete user data
      await supabase.from('projects').delete().eq('user_id', user?.id)
      await supabase.from('profiles').delete().eq('id', user?.id)
      await supabase.from('user_preferences').delete().eq('user_id', user?.id)
      
      // Delete the user account
      const { error } = await supabase.auth.admin.deleteUser(user?.id || '')
      
      if (error) {
        setError('Failed to delete account. Please contact support.')
      } else {
        await signOut()
        router.push('/')
      }
    } catch (error) {
      setError('Failed to delete account')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <h2 className="text-xl font-semibold">Loading settings...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your profile, preferences, and account settings</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="usage" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Usage
            </TabsTrigger>
            <TabsTrigger value="danger" className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-4 h-4" />
              Danger
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal and business information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={profileData.full_name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input
                      id="company_name"
                      value={profileData.company_name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, company_name: e.target.value }))}
                      placeholder="Enter your company name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="business_type">Business Type</Label>
                    <Input
                      id="business_type"
                      value={profileData.business_type}
                      onChange={(e) => setProfileData(prev => ({ ...prev, business_type: e.target.value }))}
                      placeholder="e.g., SaaS, E-commerce"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={profileData.industry}
                      onChange={(e) => setProfileData(prev => ({ ...prev, industry: e.target.value }))}
                      placeholder="e.g., Technology, Marketing"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience_level">Experience Level</Label>
                  <Input
                    id="experience_level"
                    value={profileData.experience_level}
                    onChange={(e) => setProfileData(prev => ({ ...prev, experience_level: e.target.value }))}
                    placeholder="e.g., Beginner, Intermediate, Advanced"
                  />
                </div>

                <Button 
                  onClick={handleProfileUpdate} 
                  disabled={saving}
                  className="w-full md:w-auto"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Profile
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Change your password and manage security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current_password">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="current_password"
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                        placeholder="Enter your current password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                        className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new_password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="new_password"
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                        placeholder="Enter your new password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                        className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirm_password"
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirm_password}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
                        placeholder="Confirm your new password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handlePasswordChange} 
                  disabled={saving || !passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password}
                  className="w-full md:w-auto"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Change Password
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Manage your email and notification settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive important account updates via email</p>
                    </div>
                    <Switch
                      checked={preferences.email_notifications}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, email_notifications: checked }))}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-gray-500">Receive promotional content and updates</p>
                    </div>
                    <Switch
                      checked={preferences.marketing_emails}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, marketing_emails: checked }))}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Weekly Reports</Label>
                      <p className="text-sm text-gray-500">Get weekly summaries of your funnel performance</p>
                    </div>
                    <Switch
                      checked={preferences.weekly_reports}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, weekly_reports: checked }))}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Project Updates</Label>
                      <p className="text-sm text-gray-500">Receive notifications about your funnel projects</p>
                    </div>
                    <Switch
                      checked={preferences.project_updates}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, project_updates: checked }))}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handlePreferencesUpdate} 
                  disabled={saving}
                  className="w-full md:w-auto"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Preferences
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Usage Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Usage Overview
                  </CardTitle>
                  <CardDescription>
                    Your current usage and limits
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Monthly Generations</span>
                      <span className="font-medium">{usageStats.monthly_generations} / {usageStats.monthly_limit}</span>
                    </div>
                    <Progress 
                      value={(usageStats.monthly_generations / usageStats.monthly_limit) * 100} 
                      className="h-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{usageStats.total_projects}</div>
                      <div className="text-sm text-gray-600">Total Projects</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{usageStats.total_generations}</div>
                      <div className="text-sm text-gray-600">Total Generations</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Subscription Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Subscription
                  </CardTitle>
                  <CardDescription>
                    Your current plan and billing information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Current Plan</span>
                    <Badge variant="secondary">{usageStats.subscription_tier}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Monthly Limit</span>
                    <span className="font-medium">{usageStats.monthly_limit} generations</span>
                  </div>

                  <Separator />

                  <Button className="w-full" variant="outline">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Upgrade Plan
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Danger Tab */}
          <TabsContent value="danger">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Trash2 className="w-5 h-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Irreversible and destructive actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Delete Account</h4>
                  <p className="text-sm text-red-700 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                    This will permanently delete all your data, projects, and settings.
                  </p>
                  
                  {!showDeleteConfirm ? (
                    <Button 
                      variant="destructive" 
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full md:w-auto"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-red-700 font-medium">
                        Are you absolutely sure? Type &quot;DELETE&quot; to confirm.
                      </p>
                      <Input
                        placeholder="Type DELETE to confirm"
                        className="max-w-xs"
                        onChange={(e) => {
                          if (e.target.value === 'DELETE') {
                            handleDeleteAccount()
                          }
                        }}
                      />
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setShowDeleteConfirm(false)}
                          className="w-full md:w-auto"
                        >
                          Cancel
                        </Button>
                        <Button 
                          variant="destructive" 
                          disabled={saving}
                          className="w-full md:w-auto"
                        >
                          {saving ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Permanently Delete
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
