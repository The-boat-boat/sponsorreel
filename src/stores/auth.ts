import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Profile, LoginCredentials, SignupData, AuthSession } from '@/types'
import { authService } from '@/services/supabase/authService'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<Profile | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const isOperator = computed(() => user.value?.user_type === 'operator')
  const isSponsor = computed(() => user.value?.user_type === 'sponsor')

  // Actions
  async function login(credentials: LoginCredentials) {
    loading.value = true
    error.value = null
    
    try {
      const session = await authService.login(credentials)
      setSession(session)
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Login failed'
      return false
    } finally {
      loading.value = false
    }
  }

  async function signup(data: SignupData) {
    loading.value = true
    error.value = null
    
    try {
      const session = await authService.signup(data)
      setSession(session)
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Signup failed'
      return false
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    
    try {
      await authService.logout()
    } finally {
      clearSession()
      loading.value = false
    }
  }

  function setSession(session: AuthSession) {
    user.value = session.user
    token.value = session.token
    localStorage.setItem('auth_session', JSON.stringify(session))
  }

  function clearSession() {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_session')
  }

  async function initializeFromStorage() {
    // Try to get current user from Supabase
    const currentUser = await authService.getCurrentUser()
    if (currentUser) {
      // Get session token
      const { data: { session } } = await import('@/lib/supabase').then(m => m.supabase.auth.getSession())
      if (session) {
        setSession({
          user: currentUser,
          token: session.access_token,
          expires_at: new Date(session.expires_at * 1000).toISOString()
        })
      }
    } else {
      clearSession()
    }
  }

  // Initialize on store creation
  initializeFromStorage()

  return {
    // State
    user,
    token,
    loading,
    error,
    // Getters
    isAuthenticated,
    isOperator,
    isSponsor,
    // Actions
    login,
    signup,
    logout,
    initializeFromStorage
  }
})
