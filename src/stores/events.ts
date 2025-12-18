import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Event } from '@/types'
import { eventService } from '@/services/supabase/eventService'

export const useEventsStore = defineStore('events', () => {
  // State
  const events = ref<Event[]>([])
  const currentEvent = ref<Event | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const upcomingEvents = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return events.value
      .filter(e => e.event_date >= today && e.status !== 'canceled')
      .sort((a, b) => a.event_date.localeCompare(b.event_date))
  })

  const publishedEvents = computed(() => 
    events.value.filter(e => e.status === 'published')
  )

  const draftEvents = computed(() => 
    events.value.filter(e => e.status === 'draft')
  )

  // Actions
  async function fetchEvents(operatorId: string) {
    loading.value = true
    error.value = null
    
    try {
      events.value = await eventService.getEvents(operatorId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch events'
    } finally {
      loading.value = false
    }
  }

  async function fetchEvent(eventId: string) {
    loading.value = true
    error.value = null
    
    try {
      currentEvent.value = await eventService.getEvent(eventId)
      return currentEvent.value
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch event'
      return null
    } finally {
      loading.value = false
    }
  }

  async function createEvent(eventData: Partial<Event>) {
    loading.value = true
    error.value = null
    
    try {
      const newEvent = await eventService.createEvent(eventData)
      events.value.push(newEvent)
      return newEvent
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create event'
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateEvent(eventId: string, eventData: Partial<Event>) {
    loading.value = true
    error.value = null
    
    try {
      const updatedEvent = await eventService.updateEvent(eventId, eventData)
      const index = events.value.findIndex(e => e.id === eventId)
      if (index !== -1) {
        events.value[index] = updatedEvent
      }
      if (currentEvent.value?.id === eventId) {
        currentEvent.value = updatedEvent
      }
      return updatedEvent
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update event'
      return null
    } finally {
      loading.value = false
    }
  }

  async function deleteEvent(eventId: string) {
    loading.value = true
    error.value = null
    
    try {
      await eventService.deleteEvent(eventId)
      events.value = events.value.filter(e => e.id !== eventId)
      if (currentEvent.value?.id === eventId) {
        currentEvent.value = null
      }
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete event'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    events,
    currentEvent,
    loading,
    error,
    // Getters
    upcomingEvents,
    publishedEvents,
    draftEvents,
    // Actions
    fetchEvents,
    fetchEvent,
    createEvent,
    updateEvent,
    deleteEvent
  }
})
