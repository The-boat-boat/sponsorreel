<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEventsStore } from '@/stores/events'
import { interestTags } from '@/services/mock/mockData'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { BaseButton, BaseCard } from '@/components/base'
import type { Event } from '@/types'

const router = useRouter()
const eventsStore = useEventsStore()

const searchQuery = ref('')
const selectedInterests = ref<string[]>([])
const minAttendance = ref<number | null>(null)
const maxAttendance = ref<number | null>(null)
const sortBy = ref<'relevance' | 'date' | 'attendance'>('date')
const currentPage = ref(1)
const pageSize = 12

const events = ref<Event[]>([])
const totalCount = ref(0)
const loading = ref(false)

const filters = computed(() => ({
  query: searchQuery.value || undefined,
  status: 'published' as const,
  interests: selectedInterests.value.length > 0 ? selectedInterests.value : undefined,
  minAttendance: minAttendance.value || undefined,
  maxAttendance: maxAttendance.value || undefined,
  page: currentPage.value,
  pageSize
}))

const toggleInterest = (interest: string) => {
  const index = selectedInterests.value.indexOf(interest)
  if (index === -1) {
    selectedInterests.value.push(interest)
  } else {
    selectedInterests.value.splice(index, 1)
  }
  searchEvents()
}

const searchEvents = async () => {
  loading.value = true
  try {
    const result = await eventsStore.browseEvents(filters.value)
    if (result) {
      events.value = result.data
      totalCount.value = result.total

      // Apply sorting
      if (sortBy.value === 'date') {
        events.value.sort((a, b) => a.event_date.localeCompare(b.event_date))
      } else if (sortBy.value === 'attendance') {
        events.value.sort((a, b) => b.expected_attendance - a.expected_attendance)
      }
    }
  } catch (error) {
    console.error('Failed to search events:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

const formatCurrency = (cents: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(cents / 100)
}

onMounted(() => {
  searchEvents()
})
</script>

<template>
  <DefaultLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-text-main-light dark:text-text-main-dark">
            Browse Events
          </h1>
          <p class="text-text-sub-light dark:text-text-sub-dark font-medium mt-1">
            Discover sponsorship opportunities that match your business
          </p>
        </div>
      </div>
      
      <!-- Search & Filters -->
      <BaseCard>
        <!-- Search Row -->
        <div class="mb-6">
          <label class="flex w-full items-center gap-3">
            <div class="relative w-full">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span class="material-symbols-outlined text-text-secondary dark:text-text-secondary-dark">search</span>
              </div>
              <input 
                v-model="searchQuery"
                type="text"
                class="w-full h-12 pl-12 pr-4 rounded-lg bg-background-light dark:bg-background-dark border-none focus:ring-2 focus:ring-primary text-text-main-light dark:text-white placeholder:text-text-secondary transition-all"
                placeholder="Search by event title, film, or description..."
                @keyup.enter="searchEvents"
              />
            </div>
            <BaseButton variant="primary" @click="searchEvents">
              Search
            </BaseButton>
          </label>
        </div>
        
        <!-- Filters Row -->
        <div class="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-6">
          <!-- Interest Tags -->
          <div class="flex flex-wrap gap-2">
            <button
              v-for="interest in interestTags.slice(0, 8)"
              :key="interest"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                selectedInterests.includes(interest)
                  ? 'bg-primary text-white'
                  : 'bg-background-light dark:bg-background-dark text-text-secondary border border-input-border dark:border-gray-600 hover:border-primary'
              ]"
              @click="toggleInterest(interest)"
            >
              {{ interest }}
            </button>
          </div>
          
          <!-- Sort Options -->
          <div class="flex items-center gap-2">
            <span class="text-sm text-text-secondary dark:text-text-secondary-dark">Sort by:</span>
            <select 
              v-model="sortBy"
              class="bg-transparent text-sm font-bold text-text-main-light dark:text-white border-none focus:ring-0 cursor-pointer"
              @change="searchEvents"
            >
              <option value="date">Date: Soonest</option>
              <option value="attendance">Attendance: Highest</option>
              <option value="relevance">Relevance</option>
            </select>
          </div>
        </div>
      </BaseCard>
      
      <!-- Results Header -->
      <div class="flex justify-between items-center">
        <p class="text-text-secondary dark:text-text-secondary-dark font-medium">
          <span class="text-text-main-light dark:text-white font-bold">{{ totalCount }}</span> 
          events found
        </p>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <span class="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
      </div>
      
      <!-- Empty State -->
      <BaseCard v-else-if="events.length === 0" class="text-center py-12">
        <span class="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-4">search_off</span>
        <h3 class="text-lg font-bold text-text-main-light dark:text-white mb-2">No events found</h3>
        <p class="text-text-secondary dark:text-text-secondary-dark">
          Try adjusting your search filters
        </p>
      </BaseCard>
      
      <!-- Events Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="event in events"
          :key="event.id"
          class="group flex flex-col bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer"
          @click="router.push(`/sponsor/events/${event.id}`)"
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
            
            <!-- Sponsorship Tiers -->
            <div v-if="event.sponsorship_tiers && event.sponsorship_tiers.length > 0" class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <p class="text-xs font-semibold text-primary mb-2">
                Sponsorship from {{ formatCurrency(Math.min(...event.sponsorship_tiers.map(t => t.price))) }}
              </p>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="tier in event.sponsorship_tiers.slice(0, 3)"
                  :key="tier.id"
                  class="text-xs px-2 py-1 rounded bg-primary/10 text-primary font-medium"
                >
                  {{ tier.name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Pagination -->
      <div v-if="events.length > 0 && totalCount > pageSize" class="flex justify-center mt-8">
        <nav class="flex items-center gap-2">
          <button 
            class="flex items-center justify-center size-10 rounded-lg bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            :disabled="currentPage === 1"
            @click="currentPage--; searchEvents()"
          >
            <span class="material-symbols-outlined">chevron_left</span>
          </button>
          <button 
            class="flex items-center justify-center size-10 rounded-lg bg-primary text-white font-bold shadow-md shadow-primary/30"
          >
            {{ currentPage }}
          </button>
          <button 
            v-if="totalCount > currentPage * pageSize"
            class="flex items-center justify-center size-10 rounded-lg bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-text-main-light dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            @click="currentPage++; searchEvents()"
          >
            {{ currentPage + 1 }}
          </button>
          <button 
            v-if="totalCount > currentPage * pageSize"
            class="flex items-center justify-center size-10 rounded-lg bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            @click="currentPage++; searchEvents()"
          >
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
        </nav>
      </div>
    </div>
  </DefaultLayout>
</template>
