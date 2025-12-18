import { supabase } from '@/lib/supabase'
import type { LoginCredentials, SignupData, AuthSession, Profile } from '@/types'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    })

    if (error) {
      throw new Error(error.message || 'Invalid email or password')
    }

    if (!data.user) {
      throw new Error('Login failed')
    }

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profileError || !profile) {
      throw new Error('Profile not found')
    }

    const session: AuthSession = {
      user: profile as Profile,
      token: data.session?.access_token || '',
      expires_at: data.session?.expires_at
        ? new Date(data.session.expires_at * 1000).toISOString()
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }

    return session
  },

  async signup(data: SignupData): Promise<AuthSession> {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password
    })

    if (authError) {
      throw new Error(authError.message || 'Signup failed')
    }

    if (!authData.user) {
      throw new Error('User creation failed')
    }

    // Create profile
    const profile: Profile = {
      id: authData.user.id,
      user_type: data.user_type,
      email: data.email,
      company_name: data.company_name,
      phone: data.phone,
      subscription_status: 'trial',
      subscription_tier: 'free',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert([profile])

    if (profileError) {
      // Note: Auth user will need to be cleaned up manually if profile creation fails
      throw new Error(profileError.message || 'Profile creation failed')
    }

    const session: AuthSession = {
      user: profile,
      token: authData.session?.access_token || '',
      expires_at: authData.session?.expires_at
        ? new Date(authData.session.expires_at * 1000).toISOString()
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }

    return session
  },

  async logout(): Promise<void> {
    await supabase.auth.signOut()
  },

  async getCurrentUser(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return null
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error || !profile) {
      return null
    }

    return profile as Profile
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error || !data) {
      throw new Error(error?.message || 'Failed to update profile')
    }

    return data as Profile
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (session: AuthSession | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profile) {
          callback({
            user: profile as Profile,
            token: session.access_token,
            expires_at: new Date(session.expires_at * 1000).toISOString()
          })
        } else {
          callback(null)
        }
      } else {
        callback(null)
      }
    })
  }
}
