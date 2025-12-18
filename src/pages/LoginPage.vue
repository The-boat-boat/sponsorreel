<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { BaseButton, BaseInput, BaseCard } from '@/components/base'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('operator@example.com')
const password = ref('password123')

const handleSubmit = async () => {
  const success = await authStore.login({
    email: email.value,
    password: password.value
  })
  
  if (success) {
    // Redirect based on user type
    if (authStore.user?.user_type === 'sponsor') {
      router.push('/sponsor/dashboard')
    } else {
      router.push('/dashboard')
    }
  }
}
</script>

<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-3 mb-4">
          <div class="size-12 rounded-xl bg-primary flex items-center justify-center">
            <span class="material-symbols-outlined text-white text-2xl">movie_filter</span>
          </div>
          <h1 class="text-2xl font-bold text-primary dark:text-white">SponsorReel</h1>
        </div>
        <p class="text-text-secondary dark:text-text-secondary-dark">
          Connect your cinema with local sponsors
        </p>
      </div>
      
      <!-- Login Form -->
      <BaseCard>
        <h2 class="text-xl font-bold text-text-main-light dark:text-white mb-6">Welcome back</h2>
        
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <BaseInput
            v-model="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            required
            icon="mail"
          />
          
          <BaseInput
            v-model="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            required
            icon="lock"
          />
          
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" class="rounded border-gray-300 text-primary focus:ring-primary" />
              <span class="text-sm text-text-secondary">Remember me</span>
            </label>
            <a href="#" class="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              Forgot password?
            </a>
          </div>
          
          <p v-if="authStore.error" class="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
            {{ authStore.error }}
          </p>
          
          <BaseButton 
            type="submit" 
            variant="primary" 
            size="lg" 
            full-width 
            :loading="authStore.loading"
          >
            Sign In
          </BaseButton>
        </form>
        
        <div class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
          <p class="text-sm text-text-secondary">
            Don't have an account?
            <router-link to="/signup" class="font-semibold text-primary hover:text-primary/80 transition-colors">
              Sign up
            </router-link>
          </p>
        </div>
      </BaseCard>
      
      <!-- Demo credentials hint -->
      <div class="mt-6 p-4 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl text-center">
        <p class="text-sm text-text-secondary dark:text-text-secondary-dark">
          <span class="font-semibold text-primary">Demo:</span> 
          Use <code class="bg-white dark:bg-gray-800 px-1 rounded">operator@example.com</code> / 
          <code class="bg-white dark:bg-gray-800 px-1 rounded">password123</code>
        </p>
      </div>
    </div>
  </div>
</template>
