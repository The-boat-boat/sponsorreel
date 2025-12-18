<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { BaseButton, BaseInput, BaseCard, BaseSelect, BaseTextarea } from '@/components/base'
import { businessTypes } from '@/services/mock/mockData'
import { supabase } from '@/lib/supabase'
import type { BudgetTier } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

const currentStep = ref(1)
const totalSteps = 3

// Step 1: Account Info
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

// Step 2: Business Details
const companyName = ref('')
const businessType = ref('')
const phone = ref('')
const street = ref('')
const city = ref('')
const state = ref('')
const zip = ref('')
const description = ref('')

// Step 3: Sponsorship Preferences
const budgetTier = ref<BudgetTier>('mid')
const budgetMin = ref(50000)
const budgetMax = ref(150000)
const preferredEventTypes = ref<string[]>([])
const assetsAvailable = ref<string[]>([])

const budgetTierOptions = [
  { value: 'low', label: 'Low ($200-$500 per event)' },
  { value: 'mid', label: 'Mid ($500-$2k per event)' },
  { value: 'high', label: 'High ($2k+ per event)' }
]

const eventTypeOptions = [
  { value: 'Outdoor Cinema', label: 'Outdoor Cinema' },
  { value: 'Drive-in', label: 'Drive-in' },
  { value: 'Kids Matinee', label: 'Kids Matinee' },
  { value: 'Family Events', label: 'Family Events' },
  { value: 'Tech Events', label: 'Tech Events' },
  { value: 'Community Gatherings', label: 'Community Gatherings' }
]

const assetOptions = [
  { value: 'logo', label: 'Vector Logo' },
  { value: 'preroll', label: '15s Pre-roll Video' },
  { value: 'promo_codes', label: 'Promo Codes' }
]

const canProceedStep1 = computed(() => {
  return email.value && password.value && password.value === confirmPassword.value && password.value.length >= 8
})

const canProceedStep2 = computed(() => {
  return companyName.value.trim().length > 0 && businessType.value.length > 0
})

const canSubmit = computed(() => {
  return budgetTier.value && budgetMin.value > 0 && budgetMax.value > budgetMin.value
})

const toggleEventType = (type: string) => {
  const index = preferredEventTypes.value.indexOf(type)
  if (index === -1) {
    preferredEventTypes.value.push(type)
  } else {
    preferredEventTypes.value.splice(index, 1)
  }
}

const toggleAsset = (asset: string) => {
  const index = assetsAvailable.value.indexOf(asset)
  if (index === -1) {
    assetsAvailable.value.push(asset)
  } else {
    assetsAvailable.value.splice(index, 1)
  }
}

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
  // First, create the auth account and profile
  const success = await authStore.signup({
    email: email.value,
    password: password.value,
    user_type: 'sponsor',
    company_name: companyName.value,
    phone: phone.value || undefined
  })
  
  if (!success || !authStore.user) {
    return
  }

  // Update profile with address if provided
  if (street.value || city.value || state.value || zip.value) {
    await supabase
      .from('profiles')
      .update({
        address: {
          street: street.value,
          city: city.value,
          state: state.value,
          zip: zip.value
        }
      })
      .eq('id', authStore.user.id)
  }

  // Create sponsor_profile
  const { error: sponsorProfileError } = await supabase
    .from('sponsor_profiles')
    .insert([{
      profile_id: authStore.user.id,
      business_type: businessType.value,
      description: description.value || '',
      target_audience: [], // Will be set in settings
      budget_tier: budgetTier.value,
      budget_min: budgetMin.value,
      budget_max: budgetMax.value,
      preferred_event_types: preferredEventTypes.value,
      assets_available: assetsAvailable.value,
      is_verified: false
    }])

  if (sponsorProfileError) {
    console.error('Failed to create sponsor profile:', sponsorProfileError)
    // Still redirect, profile can be completed later
  }
  
  if (success) {
    router.push('/sponsor/dashboard')
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
            <span class="material-symbols-outlined text-white text-xl">store</span>
          </div>
          <h1 class="text-xl font-bold text-primary dark:text-white">Business Sponsor Signup</h1>
        </div>
      </div>
      
      <!-- Progress -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-semibold text-primary">Step {{ currentStep }} of {{ totalSteps }}</span>
          <span class="text-sm text-text-secondary">
            {{ currentStep === 1 ? 'Account Info' : currentStep === 2 ? 'Business Details' : 'Preferences' }}
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
              placeholder="you@business.com"
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
          
          <!-- Step 2: Business Details -->
          <div v-if="currentStep === 2" class="space-y-5">
            <h2 class="text-lg font-bold text-text-main-light dark:text-white mb-4">
              Tell us about your business
            </h2>
            
            <BaseInput
              v-model="companyName"
              type="text"
              label="Business Name"
              placeholder="e.g., Joe's Bistro & Bar"
              required
              icon="business"
            />
            
            <BaseSelect
              v-model="businessType"
              :options="businessTypes.map(type => ({ value: type, label: type }))"
              label="Business Type"
              placeholder="Select your business type"
              required
            />
            
            <BaseInput
              v-model="phone"
              type="tel"
              label="Phone Number"
              placeholder="(555) 123-4567"
              icon="phone"
              hint="Optional"
            />

            <div class="space-y-3">
              <p class="text-sm font-medium text-text-main-light dark:text-white">Business Address (Optional)</p>
              <BaseInput
                v-model="street"
                type="text"
                label="Street Address"
                placeholder="123 Main St"
                icon="location_on"
              />
              <div class="grid grid-cols-2 gap-3">
                <BaseInput
                  v-model="city"
                  type="text"
                  label="City"
                  placeholder="City"
                />
                <BaseInput
                  v-model="state"
                  type="text"
                  label="State"
                  placeholder="State"
                />
              </div>
              <BaseInput
                v-model="zip"
                type="text"
                label="ZIP Code"
                placeholder="12345"
              />
            </div>

            <BaseTextarea
              v-model="description"
              label="Business Description"
              placeholder="Tell us about your business and what makes it special..."
              hint="Optional"
              :rows="4"
            />
          </div>
          
          <!-- Step 3: Sponsorship Preferences -->
          <div v-if="currentStep === 3" class="space-y-5">
            <h2 class="text-lg font-bold text-text-main-light dark:text-white mb-4">
              Sponsorship preferences
            </h2>
            
            <BaseSelect
              v-model="budgetTier"
              :options="budgetTierOptions"
              label="Budget Tier"
              required
            />

            <div class="grid grid-cols-2 gap-3">
              <BaseInput
                v-model.number="budgetMin"
                type="number"
                label="Min Budget (cents)"
                placeholder="50000"
                required
                icon="attach_money"
              />
              <BaseInput
                v-model.number="budgetMax"
                type="number"
                label="Max Budget (cents)"
                placeholder="150000"
                required
                icon="attach_money"
              />
            </div>

            <div>
              <p class="text-sm font-medium text-text-main-light dark:text-white mb-2">
                Preferred Event Types
              </p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="option in eventTypeOptions"
                  :key="option.value"
                  type="button"
                  :class="[
                    'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                    preferredEventTypes.includes(option.value)
                      ? 'bg-primary text-white'
                      : 'bg-background-light dark:bg-gray-800 text-text-secondary border border-input-border dark:border-gray-600 hover:border-primary'
                  ]"
                  @click="toggleEventType(option.value)"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>

            <div>
              <p class="text-sm font-medium text-text-main-light dark:text-white mb-2">
                Assets Available
              </p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="option in assetOptions"
                  :key="option.value"
                  type="button"
                  :class="[
                    'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                    assetsAvailable.includes(option.value)
                      ? 'bg-primary text-white'
                      : 'bg-background-light dark:bg-gray-800 text-text-secondary border border-input-border dark:border-gray-600 hover:border-primary'
                  ]"
                  @click="toggleAsset(option.value)"
                >
                  {{ option.label }}
                </button>
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
              :disabled="currentStep === 1 ? !canProceedStep1 : currentStep === 2 ? !canProceedStep2 : !canSubmit"
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
