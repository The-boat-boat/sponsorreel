import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SponsorProfile, BudgetTier } from '@/types'
import { sponsorService } from '@/services/supabase/sponsorService'

export interface SponsorFilters {
  query?: string
  businessTypes?: string[]
  budgetTiers?: BudgetTier[]
  distance?: number
  minMatchScore?: number
}

export const useSponsorsStore = defineStore('sponsors', () => {
  // State
  const sponsors = ref<SponsorProfile[]>([])
  const currentSponsor = ref<SponsorProfile | null>(null)
  const savedSponsorIds = ref<Set<string>>(new Set())
  const loading = ref(false)
  const error = ref<string | null>(null)
  const totalCount = ref(0)
  const currentPage = ref(1)
  const filters = ref<SponsorFilters>({})

  // Actions
  async function searchSponsors(searchFilters: SponsorFilters, page = 1) {
    loading.value = true
    error.value = null
    filters.value = searchFilters
    currentPage.value = page
    
    try {
      const result = await sponsorService.searchSponsors(searchFilters, page)
      sponsors.value = result.data
      totalCount.value = result.total
      return result
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to search sponsors'
      return null
    } finally {
      loading.value = false
    }
  }

  async function fetchSponsor(sponsorId: string) {
    loading.value = true
    error.value = null
    
    try {
      currentSponsor.value = await sponsorService.getSponsor(sponsorId)
      return currentSponsor.value
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch sponsor'
      return null
    } finally {
      loading.value = false
    }
  }

  async function toggleSaveSponsor(sponsorId: string) {
    try {
      if (savedSponsorIds.value.has(sponsorId)) {
        await sponsorService.unsaveSponsor(sponsorId)
        savedSponsorIds.value.delete(sponsorId)
      } else {
        await sponsorService.saveSponsor(sponsorId)
        savedSponsorIds.value.add(sponsorId)
      }
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to save sponsor'
      return false
    }
  }

  async function loadSavedSponsors(operatorId: string) {
    try {
      const saved = await sponsorService.getSavedSponsors(operatorId)
      savedSponsorIds.value = new Set(saved.map(s => s.sponsor_id))
    } catch (e) {
      console.error('Failed to load saved sponsors:', e)
    }
  }

  function isSaved(sponsorId: string): boolean {
    return savedSponsorIds.value.has(sponsorId)
  }

  return {
    // State
    sponsors,
    currentSponsor,
    savedSponsorIds,
    loading,
    error,
    totalCount,
    currentPage,
    filters,
    // Actions
    searchSponsors,
    fetchSponsor,
    toggleSaveSponsor,
    loadSavedSponsors,
    isSaved
  }
})
