<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSponsorsStore } from '@/stores/sponsors'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { BaseButton, BaseCard } from '@/components/base'

const route = useRoute()
const router = useRouter()
const sponsorsStore = useSponsorsStore()

const sponsorId = computed(() => route.params.id as string)

const sponsor = computed(() => sponsorsStore.currentSponsor)

const formatBudget = (tier: string) => {
  const symbols = { low: '$', mid: '$$', high: '$$$' }
  const ranges = { low: '$200-$500', mid: '$500-$2k', high: '$2k+' }
  return {
    symbol: symbols[tier as keyof typeof symbols] || '$$',
    range: ranges[tier as keyof typeof ranges] || 'Mid-range'
  }
}

const assetLabels: Record<string, string> = {
  logo: 'Vector Logo',
  preroll: '15s Pre-roll',
  promo_codes: 'Promo Codes'
}

const eventTypeIcons: Record<string, string> = {
  'Outdoor Cinema': 'movie',
  'Drive-in': 'directions_car',
  'Kids Matinee': 'child_care',
  'Family Events': 'family_restroom',
  'Tech Events': 'computer',
  'Community Gatherings': 'groups'
}

// Mock sponsorship history
const sponsorshipHistory = [
  {
    id: 1,
    title: 'Summer Movies in the Park 2023',
    host: 'Downtown District Association',
    date: 'Aug 2023',
    status: 'Completed',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpS4ZFw4M2svSsuxfNb9Cnd3P9bDII4wSIwDmOZbCvgU2M_Jvb2oMfyc97NN0b-qJXyQaE5XLypEAX8VpKpg1Q7CuuhpOZiXaCoNv99fmsm_4_IyeaH_DV7pUSlXSmCFeqlSIZffjnRMprSwfdUATqulI48578gebYzFJZhj6QMLM-KQi1TebF07JEjtdFLx3ql6MZ2LYlshu9Y_wR-4EMW1Wu5HcZtWQduaMGnjR0d8TgZRBSnPzo0vAQCXLFiBkU94ADirJsxmAN'
  },
  {
    id: 2,
    title: 'Halloween Drive-in 2022',
    host: 'Starlight Cinemas',
    date: 'Oct 2022',
    status: 'Completed',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3hIM3mV_dfFKqoLUsW5RUyDaJXRdEU82sCYmooT-UayuQwAkMHJZKXwLGK9TeD8GDyfaz6xD6mac9e3lPf3UJvkzVQkjy91r_zg5aZ1M-LGYTz86UKEEgFASwkM3CXUlki7VDtyIBxa-6eN07VZXFTsXtkeS6RYCawPuK-D5u9U-ur6YFexwAbBxspTHlTU-owbVG5JE-5mGYF712nJzib9A_t0P5ukXItV1Ib1EeUIKZN_kGPPh7x-WPxlXCV8nO6hOTItg_YAtK'
  }
]

const toggleSave = async () => {
  if (sponsor.value) {
    await sponsorsStore.toggleSaveSponsor(sponsor.value.id)
  }
}

onMounted(() => {
  sponsorsStore.fetchSponsor(sponsorId.value)
})
</script>

<template>
  <DefaultLayout>
    <!-- Loading State -->
    <div v-if="sponsorsStore.loading" class="flex items-center justify-center py-20">
      <span class="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
    </div>
    
    <!-- Sponsor Not Found -->
    <div v-else-if="!sponsor" class="text-center py-20">
      <span class="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-4">error</span>
      <h2 class="text-xl font-bold text-text-main-light dark:text-white mb-2">Sponsor not found</h2>
      <BaseButton variant="primary" @click="router.push('/sponsors')">
        Back to Sponsors
      </BaseButton>
    </div>
    
    <!-- Sponsor Profile -->
    <div v-else class="space-y-6 -mt-4">
      <!-- Breadcrumbs -->
      <div class="flex flex-wrap items-center gap-2 text-sm">
        <router-link to="/dashboard" class="font-medium text-text-secondary hover:text-primary transition-colors">
          Home
        </router-link>
        <span class="material-symbols-outlined text-[16px] text-gray-400">chevron_right</span>
        <router-link to="/sponsors" class="font-medium text-text-secondary hover:text-primary transition-colors">
          Sponsors
        </router-link>
        <span class="material-symbols-outlined text-[16px] text-gray-400">chevron_right</span>
        <span class="font-semibold text-text-main-light dark:text-white">{{ sponsor.profile?.company_name }}</span>
      </div>
      
      <!-- Hero Header -->
      <div class="relative overflow-hidden rounded-xl bg-surface-light dark:bg-surface-dark shadow-sm">
        <!-- Cover Image -->
        <div 
          class="h-48 w-full bg-cover bg-center md:h-64"
          :style="sponsor.cover_image_url ? { backgroundImage: `url(${sponsor.cover_image_url})` } : { backgroundColor: '#1e6d8a' }"
        >
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        
        <!-- Profile Info -->
        <div class="relative -mt-16 flex flex-col items-start px-6 pb-6 md:flex-row md:items-end md:gap-6">
          <!-- Logo -->
          <div class="size-32 shrink-0 rounded-xl border-4 border-surface-light dark:border-surface-dark bg-white shadow-md overflow-hidden flex items-center justify-center">
            <img 
              v-if="sponsor.profile?.company_logo_url"
              :src="sponsor.profile.company_logo_url"
              :alt="sponsor.profile?.company_name"
              class="w-full h-full object-cover"
            />
            <span v-else class="material-symbols-outlined text-6xl text-primary">store</span>
          </div>
          
          <!-- Text Info -->
          <div class="mt-4 flex flex-1 flex-col gap-1 md:mt-0 md:mb-1">
            <div class="flex flex-wrap items-center gap-2">
              <h1 class="text-2xl font-bold tracking-tight text-text-main-light dark:text-white md:text-3xl">
                {{ sponsor.profile?.company_name }}
              </h1>
              <span 
                v-if="sponsor.is_verified"
                class="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary dark:bg-primary/20"
              >
                <span class="material-symbols-outlined text-[14px] filled">verified</span>
                Verified Sponsor
              </span>
            </div>
            <p class="text-base text-text-secondary dark:text-text-secondary-dark">
              {{ sponsor.business_type }} • Est. 2015
            </p>
          </div>
          
          <!-- Actions -->
          <div class="mt-4 flex w-full flex-col gap-3 md:mt-0 md:w-auto md:flex-row md:items-center">
            <BaseButton 
              variant="outline"
              @click="toggleSave"
            >
              <span 
                class="material-symbols-outlined text-[20px]"
                :class="{ 'filled': sponsorsStore.isSaved(sponsor.id) }"
              >
                bookmark
              </span>
              {{ sponsorsStore.isSaved(sponsor.id) ? 'Saved' : 'Save' }}
            </BaseButton>
            <BaseButton variant="primary">
              <span class="material-symbols-outlined text-[20px]">mail</span>
              Contact Sponsor
            </BaseButton>
          </div>
        </div>
      </div>
      
      <!-- Main Content Grid -->
      <div class="grid gap-8 lg:grid-cols-3">
        <!-- Left Column (Details) -->
        <div class="flex flex-col gap-6 lg:col-span-2">
          <!-- About Card -->
          <BaseCard>
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-xl font-bold text-text-main-light dark:text-white">About the Business</h2>
              <div class="flex gap-2">
                <button class="flex size-8 items-center justify-center rounded-full bg-gray-100 text-text-secondary hover:bg-gray-200 hover:text-primary dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors">
                  <span class="material-symbols-outlined text-[18px]">language</span>
                </button>
                <button class="flex size-8 items-center justify-center rounded-full bg-gray-100 text-text-secondary hover:bg-gray-200 hover:text-primary dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors">
                  <span class="material-symbols-outlined text-[18px]">share</span>
                </button>
              </div>
            </div>
            <div class="text-text-secondary dark:text-text-secondary-dark leading-relaxed">
              <p>{{ sponsor.description }}</p>
            </div>
            
            <div class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
              <h3 class="mb-3 text-sm font-bold uppercase tracking-wider text-text-secondary">Target Audience</h3>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="audience in sponsor.target_audience"
                  :key="audience"
                  class="rounded-md bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary dark:bg-primary/20"
                >
                  {{ audience }}
                </span>
              </div>
            </div>
          </BaseCard>
          
          <!-- Sponsorship History -->
          <BaseCard>
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-xl font-bold text-text-main-light dark:text-white">Sponsorship Portfolio</h2>
              <button class="text-sm font-semibold text-primary hover:underline">View all</button>
            </div>
            <div class="space-y-4">
              <div 
                v-for="item in sponsorshipHistory"
                :key="item.id"
                class="flex flex-col gap-4 rounded-lg border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-700/50 dark:bg-gray-800/50 sm:flex-row sm:items-center"
              >
                <div 
                  class="size-16 shrink-0 rounded-lg bg-cover bg-center bg-gray-200"
                  :style="{ backgroundImage: `url(${item.image})` }"
                />
                <div class="flex-1">
                  <h4 class="text-base font-bold text-text-main-light dark:text-white">{{ item.title }}</h4>
                  <p class="text-sm text-text-secondary dark:text-text-secondary-dark">Hosted by {{ item.host }}</p>
                </div>
                <div class="flex items-center gap-2 sm:flex-col sm:items-end sm:gap-0.5">
                  <span class="text-xs font-semibold text-text-secondary">{{ item.date }}</span>
                  <span class="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <span class="material-symbols-outlined text-[12px]">check_circle</span>
                    {{ item.status }}
                  </span>
                </div>
              </div>
            </div>
          </BaseCard>
        </div>
        
        <!-- Right Column (Sidebar) -->
        <div class="flex flex-col gap-6">
          <!-- Preferences Widget -->
          <BaseCard>
            <h3 class="mb-4 flex items-center gap-2 text-lg font-bold text-text-main-light dark:text-white">
              <span class="material-symbols-outlined text-primary">tune</span>
              Preferences
            </h3>
            <div class="space-y-4">
              <div>
                <p class="text-xs font-bold uppercase tracking-wider text-text-secondary mb-1">Budget Tier</p>
                <div class="flex items-baseline gap-1">
                  <span class="text-2xl font-bold text-text-main-light dark:text-white">
                    {{ formatBudget(sponsor.budget_tier).symbol }}
                  </span>
                  <span class="text-sm text-text-secondary font-medium">
                    {{ formatBudget(sponsor.budget_tier).range }}
                  </span>
                </div>
              </div>
              
              <div class="h-px bg-gray-100 dark:bg-gray-700" />
              
              <div>
                <p class="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Preferred Events</p>
                <ul class="space-y-2">
                  <li 
                    v-for="eventType in sponsor.preferred_event_types"
                    :key="eventType"
                    class="flex items-center gap-2 text-sm text-text-main-light dark:text-white"
                  >
                    <span class="material-symbols-outlined text-[18px] text-primary">
                      {{ eventTypeIcons[eventType] || 'event' }}
                    </span>
                    {{ eventType }}
                  </li>
                </ul>
              </div>
              
              <div class="h-px bg-gray-100 dark:bg-gray-700" />
              
              <div>
                <p class="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Assets Available</p>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="asset in sponsor.assets_available"
                    :key="asset"
                    class="inline-flex items-center gap-1 rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium text-text-secondary dark:border-gray-700 dark:bg-gray-800"
                  >
                    <span class="material-symbols-outlined text-[14px]">check</span>
                    {{ assetLabels[asset] || asset }}
                  </span>
                </div>
              </div>
            </div>
          </BaseCard>
          
          <!-- Location Widget -->
          <BaseCard>
            <h3 class="mb-3 text-lg font-bold text-text-main-light dark:text-white">Location</h3>
            <div class="mb-3 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
              <div class="relative h-40 w-full flex items-center justify-center">
                <span class="material-symbols-outlined text-4xl text-primary">location_on</span>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <span class="material-symbols-outlined mt-0.5 text-text-secondary">store</span>
              <div>
                <p class="text-sm font-semibold text-text-main-light dark:text-white">
                  {{ sponsor.profile?.address?.street || '123 Harbor Blvd' }}
                </p>
                <p class="text-sm text-text-secondary dark:text-text-secondary-dark">
                  {{ sponsor.profile?.address?.city || 'Harbor District' }}, 
                  {{ sponsor.profile?.address?.state || 'CA' }} 
                  {{ sponsor.profile?.address?.zip || '90210' }}
                </p>
                <button class="mt-1 text-xs text-primary font-medium hover:underline">
                  Get Directions
                </button>
              </div>
            </div>
          </BaseCard>
          
          <!-- Quick Actions -->
          <div class="rounded-xl bg-gradient-to-br from-primary to-primary-dark p-6 text-white shadow-md">
            <h3 class="mb-2 text-lg font-bold">Ready to partner?</h3>
            <p class="mb-4 text-sm text-white/90">Download their media kit to see detailed specs.</p>
            <BaseButton 
              v-if="sponsor.media_kit_url"
              variant="secondary"
              full-width
              class="!bg-white !text-primary hover:!bg-gray-100"
            >
              <span class="material-symbols-outlined text-[18px]">download</span>
              Download Media Kit
            </BaseButton>
            <BaseButton 
              v-else
              variant="secondary"
              full-width
              class="!bg-white !text-primary hover:!bg-gray-100"
            >
              <span class="material-symbols-outlined text-[18px]">mail</span>
              Request Media Kit
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
