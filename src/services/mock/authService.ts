import type { LoginCredentials, SignupData, AuthSession, Profile } from '@/types'
import { demoOperator, generateId } from './mockData'

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory user store (would be replaced by Supabase)
const users: Map<string, { profile: Profile; password: string }> = new Map()

// Initialize with demo user
users.set('operator@example.com', {
  profile: demoOperator,
  password: 'password123'
})

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    await delay(300)
    
    const user = users.get(credentials.email)
    
    if (!user || user.password !== credentials.password) {
      throw new Error('Invalid email or password')
    }
    
    const session: AuthSession = {
      user: user.profile,
      token: `mock-token-${generateId()}`,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    }
    
    return session
  },
  
  async signup(data: SignupData): Promise<AuthSession> {
    await delay(400)
    
    // Check if user already exists
    if (users.has(data.email)) {
      throw new Error('An account with this email already exists')
    }
    
    // Create new profile
    const profile: Profile = {
      id: generateId(),
      user_type: data.user_type,
      email: data.email,
      company_name: data.company_name,
      phone: data.phone,
      subscription_status: 'trial',
      subscription_tier: 'free',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    // Store user
    users.set(data.email, {
      profile,
      password: data.password
    })
    
    // Create session
    const session: AuthSession = {
      user: profile,
      token: `mock-token-${generateId()}`,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }
    
    return session
  },
  
  async logout(): Promise<void> {
    await delay(100)
    // In a real app, this would invalidate the session on the server
  },
  
  async getCurrentUser(token: string): Promise<Profile | null> {
    await delay(200)
    
    // In a real app, this would validate the token and return the user
    // For mock purposes, we just return the demo operator if any token is provided
    if (token) {
      return demoOperator
    }
    return null
  },
  
  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    await delay(300)
    
    // Find user by ID
    for (const [email, userData] of users.entries()) {
      if (userData.profile.id === userId) {
        const updatedProfile = {
          ...userData.profile,
          ...updates,
          updated_at: new Date().toISOString()
        }
        users.set(email, { ...userData, profile: updatedProfile })
        return updatedProfile
      }
    }
    
    throw new Error('User not found')
  }
}
