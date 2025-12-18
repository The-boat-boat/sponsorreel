<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useEventsStore } from '@/stores/events'
import { useApplicationsStore } from '@/stores/applications'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { BaseButton, BaseCard } from '@/components/base'
import SponsorshipApplicationModal from '@/components/features/sponsors/SponsorshipApplicationModal.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const eventsStore = useEventsStore()
const applicationsStore = useApplicationsStore()

const eventId = computed(() => route.params.id as string)
const showApplicationModal = ref(false)
const hasExistingApplication = ref(false)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

const formatPrice = (cents: number) => {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

const checkExistingApplication = async () => {
  if (!authStore.user?.id) return
  
  try {
    const applications = await applicationsStore.fetchApplicationsBySponsor(authStore.user.id)
    hasExistingApplication.value = applications.some(
      app => app.event_id === eventId.value && app.status === 'pending'
    )
  } catch (error) {
    console.error('Failed to check applications:', error)
  }
}

const handleApplicationSubmitted = () => {
  showApplicationModal.value = false
  hasExistingApplication.value = true
  // Refresh applications
  if (authStore.user?.id) {
    applicationsStore.fetchApplicationsBySponsor(authStore.user.id)
  }
}

onMounted(async () => {
  await eventsStore.fetchEvent(eventId.value)
  await checkExistingApplication()
})
</script>

<template>
  <DefaultLayout>
    <!-- Loading State -->
    <div v-if="eventsStore.loading" class="flex items-center justify-center py-20">
      <span class="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
    </div>
    
    <!-- Event Not Found -->
    <div v-else-if="!eventsStore.currentEvent" class="text-center py-20">
      <span class="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-4">error</span>
      <h2 class="text-xl font-bold text-text-main-light dark:text-white mb-2">Event not found</h2>
      <BaseButton variant="primary" @click="router.push('/sponsor/events')">
        Back to Events
      </BaseButton>
    </div>
    
    <!-- Event Content -->
    <div v-else class="space-y-6">
      <!-- Header -->
      <div class="flex items-start gap-4">
        <button 
          class="p-2 text-text-secondary hover:text-primary transition-colors mt-1"
          @click="router.push('/sponsor/events')"
        >
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <div class="flex-1">
          <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-text-main-light dark:text-text-main-dark mb-2">
            {{ eventsStore.currentEvent.title }}
          </h1>
          <p class="text-text-sub-light dark:text-text-sub-dark">
            {{ eventsStore.currentEvent.film_title }}
          </p>
        </div>
        <BaseButton 
          v-if="!hasExistingApplication"
          variant="primary"
          @click="showApplicationModal = true"
        >
          <span class="material-symbols-outlined text-[18px]">handshake</span>
          Apply to Sponsor
        </BaseButton>
        <BaseButton 
          v-else
          variant="secondary"
          disabled
        >
          <span class="material-symbols-outlined text-[18px]">pending</span>
          Application Pending
        </BaseButton>
      </div>
      
      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Cover Image -->
          <BaseCard padding="none">
            <div class="h-64 md:h-80 w-full bg-gray-200 dark:bg-gray-700 rounded-t-xl overflow-hidden">
              <img 
                v-if="eventsStore.currentEvent.cover_image_url"
                :src="eventsStore.currentEvent.cover_image_url" 
                :alt="eventsStore.currentEvent.title"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <span class="material-symbols-outlined text-6xl">movie</span>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-lg font-bold text-text-main-light dark:text-white mb-3">About This Event</h3>
              <p class="text-text-secondary dark:text-text-secondary-dark leading-relaxed">
                {{ eventsStore.currentEvent.description || 'No description provided.' }}
              </p>
            </div>
          </BaseCard>
          
          <!-- Sponsorship Tiers -->
          <BaseCard v-if="eventsStore.currentEvent.sponsorship_tiers?.length">
            <h3 class="text-lg font-bold text-text-main-light dark:text-white mb-4">Sponsorship Tiers</h3>
            <div class="space-y-4">
              <div 
                v-for="tier in eventsStore.currentEvent.sponsorship_tiers"
                :key="tier.id"
                class="p-4 border border-gray-200 dark:border-gray-700 rounded-xl"
              >
                <div class="flex items-center justify-between mb-3">
                  <h4 class="text-lg font-bold text-text-main-light dark:text-white">{{ tier.name }}</h4>
                  <span class="text-xl font-bold text-primary">{{ formatPrice(tier.price) }}</span>
                </div>
                <ul class="space-y-2">
                  <li 
                    v-for="(benefit, i) in tier.benefits" 
                    :key="i"
                    class="flex items-center gap-2 text-sm text-text-secondary dark:text-text-secondary-dark"
                  >
                    <span class="material-symbols-outlined text-green-500 text-[16px]">check</span>
                    {{ benefit }}
                  </li>
                </ul>
                <div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 text-sm text-text-secondary">
                  <span>{{ tier.max_sponsors }} sponsor slot{{ tier.max_sponsors !== 1 ? 's' : '' }} available</span>
                </div>
              </div>
            </div>
          </BaseCard>
        </div>
        
        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Event Details -->
          <BaseCard>
            <h3 class="text-lg font-bold text-text-main-light dark:text-white mb-4">Event Details</h3>
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <span class="material-symbols-outlined text-primary text-[20px] mt-0.5">calendar_today</span>
                <div>
                  <p class="text-sm font-semibold text-text-main-light dark:text-white">Date & Time</p>
                  <p class="text-sm text-text-secondary dark:text-text-secondary-dark">
                    {{ formatDate(eventsStore.currentEvent.event_date) }}
                  </p>
                  <p class="text-sm text-text-secondary dark:text-text-secondary-dark">
                    {{ eventsStore.currentEvent.start_time }} - {{ eventsStore.currentEvent.end_time }}
                  </p>
                </div>
              </div>
              
              <div class="flex items-start gap-3">
                <span class="material-symbols-outlined text-primary text-[20px] mt-0.5">location_on</span>
                <div>
                  <p class="text-sm font-semibold text-text-main-light dark:text-white">Venue</p>
                  <p class="text-sm text-text-secondary dark:text-text-secondary-dark">
                    {{ eventsStore.currentEvent.venue_name }}
                  </p>
                  <p class="text-sm text-text-secondary dark:text-text-secondary-dark">
                    {{ eventsStore.currentEvent.address?.street }}, {{ eventsStore.currentEvent.address?.city }}, {{ eventsStore.currentEvent.address?.state }} {{ eventsStore.currentEvent.address?.zip }}
                  </p>
                </div>
              </div>
              
              <div class="flex items-start gap-3">
                <span class="material-symbols-outlined text-primary text-[20px] mt-0.5">group</span>
                <div>
                  <p class="text-sm font-semibold text-text-main-light dark:text-white">Expected Attendance</p>
                  <p class="text-sm text-text-secondary dark:text-text-secondary-dark">
                    {{ eventsStore.currentEvent.expected_attendance }} attendees
                  </p>
                </div>
              </div>
            </div>
          </BaseCard>

          <!-- Demographics -->
          <BaseCard v-if="eventsStore.currentEvent.demographics">
            <h3 class="text-lg font-bold text-text-main-light dark:text-white mb-4">Audience Demographics</h3>
            <div class="space-y-3">
              <div>
                <p class="text-sm font-semibold text-text-main-light dark:text-white mb-1">Age Range</p>
                <p class="text-sm text-text-secondary dark:text-text-secondary-dark">
                  {{ eventsStore.currentEvent.demographics.age_range_min }} - {{ eventsStore.currentEvent.demographics.age_range_max }} years
                </p>
              </div>
              <div v-if="eventsStore.currentEvent.demographics.interests?.length">
                <p class="text-sm font-semibold text-text-main-light dark:text-white mb-2">Interests</p>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="interest in eventsStore.currentEvent.demographics.interests"
                    :key="interest"
                    class="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium"
                  >
                    {{ interest }}
                  </span>
                </div>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>

    <!-- Application Modal -->
    <SponsorshipApplicationModal
      v-if="showApplicationModal && eventsStore.currentEvent"
      :event="eventsStore.currentEvent"
      :sponsor-id="authStore.user?.id || ''"
      @close="showApplicationModal = false"
      @submitted="handleApplicationSubmitted"
    />
  </DefaultLayout>
</template>
