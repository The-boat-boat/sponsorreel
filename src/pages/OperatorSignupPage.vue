<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { BaseButton, BaseInput, BaseCard } from '@/components/base'

const router = useRouter()
const authStore = useAuthStore()

const currentStep = ref(1)
const totalSteps = 2

// Step 1: Account Info
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

// Step 2: Company Info
const companyName = ref('')
const phone = ref('')

const canProceedStep1 = computed(() => {
  return email.value && password.value && password.value === confirmPassword.value && password.value.length >= 8
})

const canSubmit = computed(() => {
  return companyName.value.trim().length > 0
})

const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const handleSubmit = async () => {
  const success = await authStore.signup({
    email: email.value,
    password: password.value,
    user_type: 'operator',
    company_name: companyName.value,
    phone: phone.value || undefined
  })
  
  if (success) {
    router.push('/dashboard')
  }
}
</script>

<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <router-link to="/signup" class="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors mb-4">
          <span class="material-symbols-outlined text-lg">arrow_back</span>
          Back
        </router-link>
        <div class="flex items-center justify-center gap-3 mb-2">
          <div class="size-10 rounded-xl bg-primary flex items-center justify-center">
            <span class="material-symbols-outlined text-white text-xl">local_movies</span>
          </div>
          <h1 class="text-xl font-bold text-primary dark:text-white">Cinema Operator Signup</h1>
        </div>
      </div>
      
      <!-- Progress -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-semibold text-primary">Step {{ currentStep }} of {{ totalSteps }}</span>
          <span class="text-sm text-text-secondary">
            {{ currentStep === 1 ? 'Account Info' : 'Company Details' }}
          </span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            class="bg-primary h-2 rounded-full transition-all duration-300"
            :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
          />
        </div>
      </div>
      
      <!-- Form -->
      <BaseCard>
        <form @submit.prevent="currentStep === totalSteps ? handleSubmit() : nextStep()">
          <!-- Step 1: Account Info -->
          <div v-if="currentStep === 1" class="space-y-5">
            <h2 class="text-lg font-bold text-text-main-light dark:text-white mb-4">
              Create your account
            </h2>
            
            <BaseInput
              v-model="email"
              type="email"
              label="Email Address"
              placeholder="you@company.com"
              required
              icon="mail"
            />
            
            <BaseInput
              v-model="password"
              type="password"
              label="Password"
              placeholder="Create a strong password"
              required
              icon="lock"
              hint="Min 8 characters"
              :error="password && password.length < 8 ? 'Password must be at least 8 characters' : ''"
            />
            
            <BaseInput
              v-model="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="Confirm your password"
              required
              icon="lock"
              :error="confirmPassword && password !== confirmPassword ? 'Passwords do not match' : ''"
            />
          </div>
          
          <!-- Step 2: Company Info -->
          <div v-if="currentStep === 2" class="space-y-5">
            <h2 class="text-lg font-bold text-text-main-light dark:text-white mb-4">
              Tell us about your cinema
            </h2>
            
            <BaseInput
              v-model="companyName"
              type="text"
              label="Company / Cinema Name"
              placeholder="e.g., Starlight Outdoor Cinema"
              required
              icon="business"
            />
            
            <BaseInput
              v-model="phone"
              type="tel"
              label="Phone Number"
              placeholder="(555) 123-4567"
              icon="phone"
              hint="Optional"
            />
            
            <div class="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-4">
              <div class="flex items-start gap-3">
                <span class="material-symbols-outlined text-primary">info</span>
                <div>
                  <p class="text-sm font-semibold text-text-main-light dark:text-white mb-1">
                    14-day free trial
                  </p>
                  <p class="text-sm text-text-secondary dark:text-text-secondary-dark">
                    Try all Pro features free. No credit card required.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <p v-if="authStore.error" class="mt-4 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
            {{ authStore.error }}
          </p>
          
          <!-- Actions -->
          <div class="flex items-center gap-3 mt-6">
            <BaseButton 
              v-if="currentStep > 1"
              type="button"
              variant="secondary"
              @click="prevStep"
            >
              Back
            </BaseButton>
            
            <BaseButton 
              type="submit"
              variant="primary"
              :full-width="currentStep === 1"
              :loading="authStore.loading"
              :disabled="currentStep === 1 ? !canProceedStep1 : !canSubmit"
              :class="{ 'flex-1': currentStep > 1 }"
            >
              {{ currentStep === totalSteps ? 'Create Account' : 'Continue' }}
              <span v-if="currentStep < totalSteps" class="material-symbols-outlined text-sm">arrow_forward</span>
            </BaseButton>
          </div>
        </form>
        
        <div class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
          <p class="text-sm text-text-secondary">
            Already have an account?
            <router-link to="/login" class="font-semibold text-primary hover:text-primary/80 transition-colors">
              Sign in
            </router-link>
          </p>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
