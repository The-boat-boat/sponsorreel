<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useEventsStore } from '@/stores/events'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { BaseButton, BaseCard, BaseBadge } from '@/components/base'

const router = useRouter()
const authStore = useAuthStore()
const eventsStore = useEventsStore()

const filter = ref<'all' | 'published' | 'draft'>('all')

const filteredEvents = computed(() => {
  if (filter.value === 'all') return eventsStore.events
  return eventsStore.events.filter(e => e.status === filter.value)
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'published': return 'success'
    case 'draft': return 'neutral'
    case 'completed': return 'info'
    case 'canceled': return 'error'
    default: return 'neutral'
  }
}

onMounted(() => {
  if (authStore.user?.id) {
    eventsStore.fetchEvents(authStore.user.id)
  }
})
</script>

<template>
  <DefaultLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-text-main-light dark:text-text-main-dark">
            My Events
          </h1>
          <p class="text-text-sub-light dark:text-text-sub-dark font-medium mt-1">
            Manage your cinema events and sponsorship opportunities
          </p>
        </div>
        <BaseButton 
          variant="primary" 
          size="lg"
          @click="router.push('/events/create')"
        >
          <span class="material-symbols-outlined">add</span>
          Create New Event
        </BaseButton>
      </div>
      
      <!-- Filters -->
      <div class="flex gap-2">
        <button
          v-for="option in [
            { value: 'all', label: 'All Events' },
            { value: 'published', label: 'Published' },
            { value: 'draft', label: 'Drafts' }
          ]"
          :key="option.value"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            filter === option.value
              ? 'bg-primary text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700'
          ]"
          @click="filter = option.value as typeof filter"
        >
          {{ option.label }}
        </button>
      </div>
      
      <!-- Loading State -->
      <div v-if="eventsStore.loading" class="flex items-center justify-center py-12">
        <span class="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
      </div>
      
      <!-- Empty State -->
      <BaseCard v-else-if="filteredEvents.length === 0" class="text-center py-12">
        <span class="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-4">calendar_today</span>
        <h3 class="text-lg font-bold text-text-main-light dark:text-white mb-2">No events yet</h3>
        <p class="text-text-secondary dark:text-text-secondary-dark mb-6">
          Create your first event to start attracting sponsors
        </p>
        <BaseButton variant="primary" @click="router.push('/events/create')">
          <span class="material-symbols-outlined">add</span>
          Create Event
        </BaseButton>
      </BaseCard>
      
      <!-- Events Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="event in filteredEvents"
          :key="event.id"
          class="group flex flex-col bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer"
          @click="router.push(`/events/${event.id}`)"
        >
          <!-- Cover Image -->
          <div class="relative h-40 w-full bg-gray-200 dark:bg-gray-700">
            <img 
              v-if="event.cover_image_url"
              :src="event.cover_image_url" 
              :alt="event.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">movie</span>
            </div>
            <div class="absolute top-3 right-3">
              <BaseBadge :variant="getStatusVariant(event.status)" class="capitalize">
                {{ event.status }}
              </BaseBadge>
            </div>
          </div>
          
          <!-- Content -->
          <div class="p-5 flex flex-col flex-1">
            <h3 class="text-lg font-bold text-text-main-light dark:text-white leading-tight mb-1">
              {{ event.title }}
            </h3>
            <p class="text-sm text-text-secondary dark:text-text-secondary-dark mb-3">
              {{ event.film_title }}
            </p>
            
            <div class="space-y-2 text-sm text-text-secondary dark:text-text-secondary-dark mt-auto">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px]">calendar_today</span>
                {{ formatDate(event.event_date) }} at {{ event.start_time }}
              </div>
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px]">location_on</span>
                {{ event.venue_name }}
              </div>
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px]">group</span>
                {{ event.expected_attendance }} expected attendees
              </div>
            </div>
            
            <!-- Tiers count -->
            <div v-if="event.sponsorship_tiers?.length" class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <p class="text-xs font-semibold text-primary">
                {{ event.sponsorship_tiers.length }} sponsorship tier{{ event.sponsorship_tiers.length !== 1 ? 's' : '' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
