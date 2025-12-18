<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useApplicationsStore } from '@/stores/applications'
import { useEventsStore } from '@/stores/events'
import { sponsorService } from '@/services/supabase/sponsorService'
import { supabase } from '@/lib/supabase'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { BaseCard, BaseButton } from '@/components/base'
import type { SponsorshipApplication, Event } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const applicationsStore = useApplicationsStore()
const eventsStore = useEventsStore()

const loading = ref(true)
const activeSponsorships = ref(0)
const totalSpentYTD = ref(0)
const upcomingEvents = ref<Event[]>([])
const recommendedEvents = ref<Event[]>([])
const recentApplications = ref<SponsorshipApplication[]>([])

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
})

const todayFormatted = computed(() => {
  return new Date().toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  })
})

const fetchDashboardData = async () => {
  if (!authStore.user?.id) return
  
  loading.value = true
  
  try {
    // Get sponsor profile
    const sponsorProfile = await sponsorService.getSponsorByProfileId(authStore.user.id)
    
    if (!sponsorProfile) {
      console.error('Sponsor profile not found')
      return
    }

    // Fetch applications
    const applications = await applicationsStore.fetchApplicationsBySponsor(authStore.user.id)
    recentApplications.value = applications.slice(0, 5)

    // Count active sponsorships (accepted applications)
    activeSponsorships.value = applications.filter(app => app.status === 'accepted').length

    // Calculate total spent YTD from contracts
    const currentYear = new Date().getFullYear()
    const { data: contracts } = await supabase
      .from('contracts')
      .select('amount')
      .eq('sponsor_id', authStore.user.id)
      .eq('status', 'paid')
      .gte('created_at', `${currentYear}-01-01`)

    totalSpentYTD.value = contracts?.reduce((sum, c) => sum + (c.amount || 0), 0) || 0

    // Get upcoming events from accepted applications
    const acceptedEventIds = applications
      .filter(app => app.status === 'accepted')
      .map(app => app.event_id)

    if (acceptedEventIds.length > 0) {
      const { data: events } = await supabase
        .from('events')
        .select(`
          *,
          sponsorship_tiers (*),
          demographics:event_demographics (*)
        `)
        .in('id', acceptedEventIds)
        .gte('event_date', new Date().toISOString().split('T')[0])
        .order('event_date', { ascending: true })
        .limit(5)

      upcomingEvents.value = (events || []).map(e => ({
        ...e,
        sponsorship_tiers: e.sponsorship_tiers || [],
        demographics: e.demographics || undefined
      })) as Event[]
    }

    // Get recommended events based on preferences
    const browseResult = await eventsStore.browseEvents({
      status: 'published',
      interests: sponsorProfile.preferred_event_types,
      page: 1,
      pageSize: 6
    })

    if (browseResult) {
      recommendedEvents.value = browseResult.data.slice(0, 6)
    }
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  } finally {
    loading.value = false
  }
}

const formatCurrency = (cents: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(cents / 100)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const getStatusColor = (status: string) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-500',
    accepted: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    withdrawn: 'bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-400'
  }
  return colors[status as keyof typeof colors] || colors.pending
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<template>
  <DefaultLayout>
    <div class="space-y-8">
      <!-- Page Heading -->
      <header class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div class="space-y-1">
          <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-text-main-light dark:text-text-main-dark">
            {{ greeting }}, <span class="text-primary">{{ authStore.user?.company_name || 'Sponsor' }}</span>
          </h1>
          <p class="text-text-sub-light dark:text-text-sub-dark font-medium flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px]">calendar_month</span>
            Today is {{ todayFormatted }}
          </p>
        </div>
        <BaseButton variant="primary" @click="router.push('/sponsor/events')">
          <span class="material-symbols-outlined text-[20px]">search</span>
          Browse Events
        </BaseButton>
      </header>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <span class="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
      </div>

      <!-- Dashboard Content -->
      <div v-else class="space-y-8">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseCard>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-text-sub-light dark:text-text-sub-dark font-medium mb-1">Active Sponsorships</p>
                <h2 class="text-3xl font-bold text-text-main-light dark:text-text-main-dark">{{ activeSponsorships }}</h2>
              </div>
              <div class="size-16 rounded-xl bg-primary/10 flex items-center justify-center">
                <span class="material-symbols-outlined text-primary text-3xl">handshake</span>
              </div>
            </div>
          </BaseCard>

          <BaseCard>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-text-sub-light dark:text-text-sub-dark font-medium mb-1">Total Spent YTD</p>
                <h2 class="text-3xl font-bold text-text-main-light dark:text-text-main-dark">{{ formatCurrency(totalSpentYTD) }}</h2>
              </div>
              <div class="size-16 rounded-xl bg-primary/10 flex items-center justify-center">
                <span class="material-symbols-outlined text-primary text-3xl">payments</span>
              </div>
            </div>
          </BaseCard>
        </div>

        <!-- Main Content Grid -->
        <div class="grid gap-8 lg:grid-cols-3">
          <!-- Left Column -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Upcoming Events -->
            <BaseCard>
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-text-main-light dark:text-white">Upcoming Events</h2>
                <router-link 
                  to="/sponsor/applications"
                  class="text-sm font-semibold text-primary hover:underline"
                >
                  View All
                </router-link>
              </div>
              
              <div v-if="upcomingEvents.length === 0" class="text-center py-8">
                <span class="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-4">event_busy</span>
                <p class="text-text-secondary dark:text-text-secondary-dark">No upcoming events</p>
                <BaseButton variant="primary" class="mt-4" @click="router.push('/sponsor/events')">
                  Browse Events
                </BaseButton>
              </div>

              <div v-else class="space-y-4">
                <div
                  v-for="event in upcomingEvents"
                  :key="event.id"
                  class="flex items-start gap-4 p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                  @click="router.push(`/sponsor/events/${event.id}`)"
                >
                  <div
                    v-if="event.cover_image_url"
                    class="size-20 shrink-0 rounded-lg bg-cover bg-center"
                    :style="{ backgroundImage: `url(${event.cover_image_url})` }"
                  />
                  <div
                    v-else
                    class="size-20 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center"
                  >
                    <span class="material-symbols-outlined text-primary text-3xl">movie</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-text-main-light dark:text-white mb-1">{{ event.title }}</h3>
                    <p class="text-sm text-text-secondary dark:text-text-secondary-dark mb-2">{{ event.film_title }}</p>
                    <div class="flex items-center gap-4 text-xs text-text-secondary dark:text-text-secondary-dark">
                      <span class="flex items-center gap-1">
                        <span class="material-symbols-outlined text-[16px]">calendar_today</span>
                        {{ formatDate(event.event_date) }}
                      </span>
                      <span class="flex items-center gap-1">
                        <span class="material-symbols-outlined text-[16px]">location_on</span>
                        {{ event.venue_name }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </BaseCard>

            <!-- Recent Applications -->
            <BaseCard>
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-text-main-light dark:text-white">Recent Applications</h2>
                <router-link 
                  to="/sponsor/applications"
                  class="text-sm font-semibold text-primary hover:underline"
                >
                  View All
                </router-link>
              </div>
              
              <div v-if="recentApplications.length === 0" class="text-center py-8">
                <span class="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-4">description</span>
                <p class="text-text-secondary dark:text-text-secondary-dark mb-4">No applications yet</p>
                <BaseButton variant="primary" @click="router.push('/sponsor/events')">
                  Browse Events
                </BaseButton>
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="app in recentApplications"
                  :key="app.id"
                  class="flex items-center justify-between p-4 rounded-lg border border-gray-100 dark:border-gray-800"
                >
                  <div class="flex-1">
                    <p class="font-semibold text-text-main-light dark:text-white">Application #{{ app.id.slice(0, 8) }}</p>
                    <p class="text-sm text-text-secondary dark:text-text-secondary-dark">{{ formatDate(app.submitted_at) }}</p>
                  </div>
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-semibold capitalize',
                      getStatusColor(app.status)
                    ]"
                  >
                    {{ app.status }}
                  </span>
                </div>
              </div>
            </BaseCard>
          </div>

          <!-- Right Column -->
          <div class="space-y-6">
            <!-- Recommended Events -->
            <BaseCard>
              <h2 class="text-lg font-bold text-text-main-light dark:text-white mb-4">Recommended Events</h2>
              
              <div v-if="recommendedEvents.length === 0" class="text-center py-6">
                <p class="text-sm text-text-secondary dark:text-text-secondary-dark">No recommendations yet</p>
              </div>

              <div v-else class="space-y-4">
                <div
                  v-for="event in recommendedEvents"
                  :key="event.id"
                  class="cursor-pointer group"
                  @click="router.push(`/sponsor/events/${event.id}`)"
                >
                  <div
                    v-if="event.cover_image_url"
                    class="aspect-video rounded-lg bg-cover bg-center mb-2 group-hover:opacity-90 transition-opacity"
                    :style="{ backgroundImage: `url(${event.cover_image_url})` }"
                  />
                  <div
                    v-else
                    class="aspect-video rounded-lg bg-primary/10 flex items-center justify-center mb-2"
                  >
                    <span class="material-symbols-outlined text-primary text-4xl">movie</span>
                  </div>
                  <h3 class="font-bold text-sm text-text-main-light dark:text-white mb-1 line-clamp-1">{{ event.title }}</h3>
                  <p class="text-xs text-text-secondary dark:text-text-secondary-dark">{{ formatDate(event.event_date) }}</p>
                </div>
              </div>

              <BaseButton 
                variant="secondary" 
                class="w-full mt-4"
                @click="router.push('/sponsor/events')"
              >
                Browse All Events
              </BaseButton>
            </BaseCard>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
