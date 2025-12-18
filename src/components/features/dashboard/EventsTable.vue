<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Event } from '@/types'
import { BaseBadge } from '@/components/base'

interface Props {
  events: Event[]
  loading?: boolean
}

defineProps<Props>()
const router = useRouter()

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

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'published': return 'Published'
    case 'draft': return 'Draft'
    case 'completed': return 'Completed'
    case 'canceled': return 'Canceled'
    default: return status
  }
}

const viewEvent = (eventId: string) => {
  router.push(`/events/${eventId}`)
}
</script>

<template>
  <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
    <div class="p-6 border-b border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h3 class="text-lg font-bold text-text-main-light dark:text-text-main-dark">Upcoming Events</h3>
        <p class="text-sm text-text-sub-light dark:text-text-sub-dark">Manage your next screenings</p>
      </div>
      <router-link 
        to="/events"
        class="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
      >
        View Calendar <span class="material-symbols-outlined text-lg">arrow_forward</span>
      </router-link>
    </div>
    
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50/50 dark:bg-gray-800/30 text-xs uppercase text-text-sub-light dark:text-text-sub-dark font-semibold tracking-wider">
            <th class="px-6 py-4">Event Name</th>
            <th class="px-6 py-4">Date</th>
            <th class="px-6 py-4">Venue</th>
            <th class="px-6 py-4">Status</th>
            <th class="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr v-if="loading" class="h-32">
            <td colspan="5" class="text-center">
              <span class="material-symbols-outlined animate-spin text-primary text-2xl">progress_activity</span>
            </td>
          </tr>
          <tr v-else-if="events.length === 0" class="h-32">
            <td colspan="5" class="text-center text-text-secondary">
              No upcoming events
            </td>
          </tr>
          <tr 
            v-else
            v-for="event in events" 
            :key="event.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group cursor-pointer"
            @click="viewEvent(event.id)"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div 
                  class="size-10 rounded-lg bg-gray-200 dark:bg-gray-700 bg-cover bg-center shrink-0"
                  :style="event.cover_image_url ? { backgroundImage: `url(${event.cover_image_url})` } : {}"
                >
                  <div v-if="!event.cover_image_url" class="w-full h-full flex items-center justify-center text-gray-400">
                    <span class="material-symbols-outlined text-lg">movie</span>
                  </div>
                </div>
                <span class="font-semibold text-text-main-light dark:text-text-main-dark">
                  {{ event.title }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 text-sm font-medium text-text-sub-light dark:text-text-sub-dark">
              {{ formatDate(event.event_date) }}
            </td>
            <td class="px-6 py-4 text-sm text-text-sub-light dark:text-text-sub-dark">
              {{ event.venue_name }}
            </td>
            <td class="px-6 py-4">
              <BaseBadge :variant="getStatusVariant(event.status)" dot>
                {{ getStatusLabel(event.status) }}
              </BaseBadge>
            </td>
            <td class="px-6 py-4 text-right">
              <button 
                class="text-gray-400 hover:text-primary dark:hover:text-white p-1"
                @click.stop
              >
                <span class="material-symbols-outlined">more_vert</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="p-4 bg-gray-50 dark:bg-gray-800/20 text-center">
      <router-link to="/events" class="text-sm font-semibold text-primary hover:underline">
        View All Events
      </router-link>
    </div>
  </div>
</template>
