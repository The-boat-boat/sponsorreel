<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSponsorsStore, type SponsorFilters } from '@/stores/sponsors'
import { useAuthStore } from '@/stores/auth'
import { businessTypes } from '@/services/mock/mockData'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { BaseButton, BaseCard } from '@/components/base'
import { SponsorCard } from '@/components/features/sponsors'

const router = useRouter()
const sponsorsStore = useSponsorsStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const selectedBusinessTypes = ref<string[]>([])
const selectedBudgetTiers = ref<string[]>([])
const minMatchScore = ref(50)
const sortBy = ref('recommended')

const filters = computed<SponsorFilters>(() => ({
  query: searchQuery.value || undefined,
  businessTypes: selectedBusinessTypes.value.length > 0 ? selectedBusinessTypes.value : undefined,
  budgetTiers: selectedBudgetTiers.value.length > 0 ? selectedBudgetTiers.value as any : undefined,
  minMatchScore: minMatchScore.value > 0 ? minMatchScore.value : undefined
}))

const budgetTierOptions = [
  { value: 'low', label: 'Low ($200-$500)' },
  { value: 'mid', label: 'Mid ($500-$2k)' },
  { value: 'high', label: 'High ($2k+)' }
]

const handleSearch = () => {
  sponsorsStore.searchSponsors(filters.value, 1)
}

const toggleBusinessType = (type: string) => {
  const index = selectedBusinessTypes.value.indexOf(type)
  if (index === -1) {
    selectedBusinessTypes.value.push(type)
  } else {
    selectedBusinessTypes.value.splice(index, 1)
  }
  handleSearch()
}

const toggleBudgetTier = (tier: string) => {
  const index = selectedBudgetTiers.value.indexOf(tier)
  if (index === -1) {
    selectedBudgetTiers.value.push(tier)
  } else {
    selectedBudgetTiers.value.splice(index, 1)
  }
  handleSearch()
}

const viewSponsor = (sponsorId: string) => {
  router.push(`/sponsors/${sponsorId}`)
}

const loadMore = () => {
  sponsorsStore.searchSponsors(filters.value, sponsorsStore.currentPage + 1)
}

onMounted(async () => {
  await sponsorsStore.searchSponsors({}, 1)
  if (authStore.user?.id) {
    await sponsorsStore.loadSavedSponsors(authStore.user.id)
  }
})
</script>

<template>
  <DefaultLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-text-main-light dark:text-text-main-dark">
            Find the perfect sponsor
          </h1>
          <p class="text-text-secondary dark:text-text-secondary-dark text-lg mt-1">
            Connect with local businesses looking to reach your audience.
          </p>
        </div>
        <BaseButton variant="primary" class="hidden md:flex">
          <span class="material-symbols-outlined text-[20px]">add_circle</span>
          Post New Opportunity
        </BaseButton>
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
                placeholder="Search by business name, industry, or keyword"
                @keyup.enter="handleSearch"
              />
            </div>
            <BaseButton variant="primary" @click="handleSearch">
              Search
            </BaseButton>
          </label>
        </div>
        
        <!-- Filters Row -->
        <div class="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-6">
          <!-- Filter Buttons -->
          <div class="flex flex-wrap gap-3">
            <!-- Business Type Dropdown (simplified as buttons) -->
            <div class="relative group">
              <button class="flex h-10 items-center gap-2 px-4 rounded-lg bg-background-light dark:bg-background-dark hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all">
                <span class="text-sm font-semibold text-text-main-light dark:text-white">
                  Business Type
                  <span v-if="selectedBusinessTypes.length" class="text-primary">({{ selectedBusinessTypes.length }})</span>
                </span>
                <span class="material-symbols-outlined text-text-secondary text-[20px]">keyboard_arrow_down</span>
              </button>
              
              <!-- Dropdown -->
              <div class="absolute top-full left-0 mt-2 w-56 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 hidden group-hover:block z-20">
                <button
                  v-for="type in businessTypes.slice(0, 6)"
                  :key="type"
                  :class="[
                    'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                    selectedBusinessTypes.includes(type)
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-text-main-light dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  ]"
                  @click="toggleBusinessType(type)"
                >
                  {{ type }}
                </button>
              </div>
            </div>
            
            <!-- Budget Range -->
            <div class="relative group">
              <button class="flex h-10 items-center gap-2 px-4 rounded-lg bg-background-light dark:bg-background-dark hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all">
                <span class="text-sm font-semibold text-text-main-light dark:text-white">
                  Budget Range
                  <span v-if="selectedBudgetTiers.length" class="text-primary">({{ selectedBudgetTiers.length }})</span>
                </span>
                <span class="material-symbols-outlined text-text-secondary text-[20px]">keyboard_arrow_down</span>
              </button>
              
              <div class="absolute top-full left-0 mt-2 w-48 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 hidden group-hover:block z-20">
                <button
                  v-for="tier in budgetTierOptions"
                  :key="tier.value"
                  :class="[
                    'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                    selectedBudgetTiers.includes(tier.value)
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-text-main-light dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  ]"
                  @click="toggleBudgetTier(tier.value)"
                >
                  {{ tier.label }}
                </button>
              </div>
            </div>
          </div>
          
          <!-- Match Score Slider -->
          <div class="w-full lg:w-auto min-w-[280px] flex flex-col gap-2">
            <div class="flex justify-between items-center">
              <span class="text-sm font-bold text-text-main-light dark:text-white">Min. Match Score</span>
              <span class="text-sm font-bold text-primary">{{ minMatchScore }}%</span>
            </div>
            <div class="relative h-6 flex items-center">
              <input 
                v-model="minMatchScore"
                type="range"
                min="0"
                max="100"
                class="w-full"
                @change="handleSearch"
              />
            </div>
          </div>
        </div>
      </BaseCard>
      
      <!-- Results Header -->
      <div class="flex justify-between items-center">
        <p class="text-text-secondary dark:text-text-secondary-dark font-medium">
          <span class="text-text-main-light dark:text-white font-bold">{{ sponsorsStore.totalCount }}</span> 
          businesses found
        </p>
        <div class="flex items-center gap-2">
          <span class="text-sm text-text-secondary dark:text-text-secondary-dark">Sort by:</span>
          <select 
            v-model="sortBy"
            class="bg-transparent text-sm font-bold text-text-main-light dark:text-white border-none focus:ring-0 cursor-pointer"
          >
            <option value="recommended">Recommended</option>
            <option value="distance">Distance: Nearest</option>
            <option value="match">Match Score: High to Low</option>
          </select>
        </div>
      </div>
      
      <!-- Loading State -->
      <div v-if="sponsorsStore.loading" class="flex items-center justify-center py-12">
        <span class="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
      </div>
      
      <!-- Empty State -->
      <BaseCard v-else-if="sponsorsStore.sponsors.length === 0" class="text-center py-12">
        <span class="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-4">search_off</span>
        <h3 class="text-lg font-bold text-text-main-light dark:text-white mb-2">No sponsors found</h3>
        <p class="text-text-secondary dark:text-text-secondary-dark">
          Try adjusting your search filters
        </p>
      </BaseCard>
      
      <!-- Sponsor Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SponsorCard
          v-for="sponsor in sponsorsStore.sponsors"
          :key="sponsor.id"
          :sponsor="sponsor"
          @view="viewSponsor"
        />
      </div>
      
      <!-- Pagination -->
      <div v-if="sponsorsStore.sponsors.length > 0" class="flex justify-center mt-8">
        <nav class="flex items-center gap-2">
          <button 
            class="flex items-center justify-center size-10 rounded-lg bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            :disabled="sponsorsStore.currentPage === 1"
          >
            <span class="material-symbols-outlined">chevron_left</span>
          </button>
          <button 
            class="flex items-center justify-center size-10 rounded-lg bg-primary text-white font-bold shadow-md shadow-primary/30"
          >
            {{ sponsorsStore.currentPage }}
          </button>
          <button 
            v-if="sponsorsStore.totalCount > sponsorsStore.sponsors.length"
            class="flex items-center justify-center size-10 rounded-lg bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-text-main-light dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            @click="loadMore"
          >
            {{ sponsorsStore.currentPage + 1 }}
          </button>
          <button 
            class="flex items-center justify-center size-10 rounded-lg bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
        </nav>
      </div>
    </div>
  </DefaultLayout>
</template>
