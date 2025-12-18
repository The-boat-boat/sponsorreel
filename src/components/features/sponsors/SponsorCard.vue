<script setup lang="ts">
import type { SponsorProfile } from '@/types'
import { useSponsorsStore } from '@/stores/sponsors'

interface Props {
  sponsor: SponsorProfile & { _matchScore?: number; _distance?: number }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  view: [sponsorId: string]
}>()

const sponsorsStore = useSponsorsStore()

const getMatchScoreColor = (score: number) => {
  if (score >= 90) return 'text-primary'
  if (score >= 80) return 'text-primary'
  return 'text-yellow-600 dark:text-yellow-500'
}

const getMatchScoreBgColor = (score: number) => {
  if (score >= 80) return 'bg-primary/10'
  return 'bg-yellow-500/10'
}

const toggleSave = async (e: Event) => {
  e.stopPropagation()
  await sponsorsStore.toggleSaveSponsor(props.sponsor.id)
}
</script>

<template>
  <div 
    class="group flex flex-col bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer"
    @click="emit('view', sponsor.id)"
  >
    <!-- Cover Image -->
    <div class="relative h-48 w-full bg-gray-200 dark:bg-gray-700">
      <img 
        v-if="sponsor.cover_image_url"
        :src="sponsor.cover_image_url" 
        :alt="sponsor.profile?.company_name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
        <span class="material-symbols-outlined text-4xl">store</span>
      </div>
      
      <!-- Verified Badge -->
      <div 
        v-if="sponsor.is_verified"
        class="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm"
      >
        <span class="material-symbols-outlined text-green-600 text-[18px]">verified</span>
        <span class="text-xs font-bold text-green-700 dark:text-green-400">Verified</span>
      </div>
    </div>
    
    <!-- Content -->
    <div class="p-5 flex flex-col flex-1">
      <div class="flex justify-between items-start mb-2">
        <div>
          <h3 class="text-lg font-bold text-text-main-light dark:text-white leading-tight mb-1">
            {{ sponsor.profile?.company_name }}
          </h3>
          <p class="text-sm text-text-secondary dark:text-text-secondary-dark">
            {{ sponsor.business_type }} 
            <span v-if="sponsor._distance">• {{ sponsor._distance }} miles away</span>
          </p>
        </div>
        <button 
          class="text-text-secondary hover:text-primary transition-colors p-1"
          @click="toggleSave"
        >
          <span 
            class="material-symbols-outlined"
            :class="{ 'filled text-primary': sponsorsStore.isSaved(sponsor.id) }"
          >
            favorite
          </span>
        </button>
      </div>
      
      <!-- Tags -->
      <div class="flex gap-2 flex-wrap mb-4">
        <span 
          v-for="audience in sponsor.target_audience?.slice(0, 2)"
          :key="audience"
          class="px-2 py-1 bg-background-light dark:bg-background-dark rounded text-xs font-medium text-text-secondary dark:text-text-secondary-dark"
        >
          {{ audience }}
        </span>
      </div>
      
      <!-- Footer -->
      <div class="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div class="flex items-center gap-1.5">
          <div 
            :class="[
              'w-8 h-8 rounded-full flex items-center justify-center',
              getMatchScoreBgColor(sponsor._matchScore || 0)
            ]"
          >
            <span 
              :class="['material-symbols-outlined text-[18px]', getMatchScoreColor(sponsor._matchScore || 0)]"
            >
              show_chart
            </span>
          </div>
          <div class="flex flex-col">
            <span class="text-[10px] uppercase font-bold text-text-secondary dark:text-text-secondary-dark tracking-wider">
              Match
            </span>
            <span :class="['text-sm font-bold', getMatchScoreColor(sponsor._matchScore || 0)]">
              {{ sponsor._matchScore || 85 }}% Score
            </span>
          </div>
        </div>
        <button 
          class="text-sm font-bold text-text-main-light dark:text-white border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          @click.stop="emit('view', sponsor.id)"
        >
          View Profile
        </button>
      </div>
    </div>
  </div>
</template>
