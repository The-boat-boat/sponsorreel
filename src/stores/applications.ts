import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SponsorshipApplication } from '@/types'
import { eventService } from '@/services/supabase/eventService'

export const useApplicationsStore = defineStore('applications', () => {
  // State
  const applications = ref<SponsorshipApplication[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  async function fetchApplicationsBySponsor(sponsorId: string) {
    loading.value = true
    error.value = null
    
    try {
      applications.value = await eventService.getApplicationsBySponsor(sponsorId)
      return applications.value
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch applications'
      return []
    } finally {
      loading.value = false
    }
  }

  async function withdrawApplication(applicationId: string) {
    loading.value = true
    error.value = null
    
    try {
      await eventService.withdrawApplication(applicationId)
      applications.value = applications.value.filter(app => app.id !== applicationId)
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to withdraw application'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    applications,
    loading,
    error,
    // Actions
    fetchApplicationsBySponsor,
    withdrawApplication
  }
})
