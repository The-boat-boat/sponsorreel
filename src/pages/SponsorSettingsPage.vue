<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSponsorsStore } from '@/stores/sponsors'
import { sponsorService } from '@/services/supabase/sponsorService'
import { businessTypes } from '@/services/mock/mockData'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { BaseButton, BaseCard, BaseInput, BaseSelect, BaseTextarea } from '@/components/base'
import type { BudgetTier } from '@/types'

const authStore = useAuthStore()
const sponsorsStore = useSponsorsStore()

const loading = ref(false)
const saving = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

// Profile fields
const companyName = ref('')
const phone = ref('')
const street = ref('')
const city = ref('')
const state = ref('')
const zip = ref('')

// Sponsor profile fields
const businessType = ref('')
const description = ref('')
const budgetTier = ref<BudgetTier>('mid')
const budgetMin = ref(50000)
const budgetMax = ref(150000)
const preferredEventTypes = ref<string[]>([])
const assetsAvailable = ref<string[]>([])
const sponsorProfileId = ref<string | null>(null)

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

const loadProfile = async () => {
  if (!authStore.user?.id) return

  loading.value = true
  error.value = null

  try {
    // Load profile data
    companyName.value = authStore.user.company_name || ''
    phone.value = authStore.user.phone || ''
    
    if (authStore.user.address) {
      street.value = authStore.user.address.street || ''
      city.value = authStore.user.address.city || ''
      state.value = authStore.user.address.state || ''
      zip.value = authStore.user.address.zip || ''
    }

    // Load sponsor profile
    const sponsorProfile = await sponsorService.getSponsorByProfileId(authStore.user.id)
    
    if (sponsorProfile) {
      sponsorProfileId.value = sponsorProfile.id
      businessType.value = sponsorProfile.business_type || ''
      description.value = sponsorProfile.description || ''
      budgetTier.value = sponsorProfile.budget_tier
      budgetMin.value = sponsorProfile.budget_min
      budgetMax.value = sponsorProfile.budget_max
      preferredEventTypes.value = sponsorProfile.preferred_event_types || []
      assetsAvailable.value = sponsorProfile.assets_available || []
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load profile'
  } finally {
    loading.value = false
  }
}

const handleSave = async () => {
  if (!authStore.user?.id) return

  saving.value = true
  error.value = null
  success.value = false

  try {
    // Update profile
    const { supabase } = await import('@/lib/supabase')
    await supabase
      .from('profiles')
      .update({
        company_name: companyName.value,
        phone: phone.value || null,
        address: {
          street: street.value,
          city: city.value,
          state: state.value,
          zip: zip.value
        }
      })
      .eq('id', authStore.user.id)

    // Update sponsor profile
    if (sponsorProfileId.value) {
      await sponsorsStore.updateSponsorProfile(sponsorProfileId.value, {
        business_type: businessType.value,
        description: description.value,
        budget_tier: budgetTier.value,
        budget_min: budgetMin.value,
        budget_max: budgetMax.value,
        preferred_event_types: preferredEventTypes.value,
        assets_available: assetsAvailable.value
      })
    }

    success.value = true
    setTimeout(() => {
      success.value = false
    }, 3000)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to save profile'
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>

<template>
  <DefaultLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-text-main-light dark:text-text-main-dark">
          Settings
        </h1>
        <p class="text-text-sub-light dark:text-text-sub-dark font-medium mt-1">
          Manage your sponsor profile and preferences
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <span class="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
      </div>

      <!-- Settings Form -->
      <form v-else @submit.prevent="handleSave" class="space-y-6">
        <!-- Business Information -->
        <BaseCard>
          <h2 class="text-xl font-bold text-text-main-light dark:text-white mb-6">Business Information</h2>
          
          <div class="space-y-5">
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
            />

            <div class="space-y-3">
              <p class="text-sm font-medium text-text-main-light dark:text-white">Business Address</p>
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
              placeholder="Tell us about your business..."
              :rows="4"
            />
          </div>
        </BaseCard>

        <!-- Sponsorship Preferences -->
        <BaseCard>
          <h2 class="text-xl font-bold text-text-main-light dark:text-white mb-6">Sponsorship Preferences</h2>
          
          <div class="space-y-5">
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
                      : 'bg-background-light dark:bg-background-dark text-text-secondary border border-input-border dark:border-gray-600 hover:border-primary'
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
                      : 'bg-background-light dark:bg-background-dark text-text-secondary border border-input-border dark:border-gray-600 hover:border-primary'
                  ]"
                  @click="toggleAsset(option.value)"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Messages -->
        <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
        </div>

        <div v-if="success" class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p class="text-sm text-green-600 dark:text-green-400">Profile saved successfully!</p>
        </div>

        <!-- Actions -->
        <div class="flex justify-end">
          <BaseButton 
            type="submit"
            variant="primary"
            :loading="saving"
          >
            Save Changes
          </BaseButton>
        </div>
      </form>
    </div>
  </DefaultLayout>
</template>
