import type { Event, SponsorshipTier, EventDemographics } from '@/types'
import { demoEvents, generateId } from './mockData'

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory events store
let events: Event[] = [...demoEvents]

export const eventService = {
  async getEvents(operatorId: string): Promise<Event[]> {
    await delay(300)
    return events.filter(e => e.operator_id === operatorId)
  },
  
  async getEvent(eventId: string): Promise<Event> {
    await delay(200)
    const event = events.find(e => e.id === eventId)
    if (!event) {
      throw new Error('Event not found')
    }
    return event
  },
  
  async createEvent(eventData: Partial<Event>): Promise<Event> {
    await delay(400)
    
    const newEvent: Event = {
      id: generateId(),
      operator_id: eventData.operator_id || '',
      title: eventData.title || '',
      description: eventData.description || '',
      film_title: eventData.film_title || '',
      event_date: eventData.event_date || '',
      start_time: eventData.start_time || '',
      end_time: eventData.end_time || '',
      venue_name: eventData.venue_name || '',
      address: eventData.address || { street: '', city: '', state: '', zip: '' },
      expected_attendance: eventData.expected_attendance || 0,
      status: eventData.status || 'draft',
      cover_image_url: eventData.cover_image_url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sponsorship_tiers: eventData.sponsorship_tiers || [],
      demographics: eventData.demographics
    }
    
    events.push(newEvent)
    return newEvent
  },
  
  async updateEvent(eventId: string, eventData: Partial<Event>): Promise<Event> {
    await delay(300)
    
    const index = events.findIndex(e => e.id === eventId)
    if (index === -1) {
      throw new Error('Event not found')
    }
    
    const updatedEvent: Event = {
      ...events[index],
      ...eventData,
      updated_at: new Date().toISOString()
    }
    
    events[index] = updatedEvent
    return updatedEvent
  },
  
  async deleteEvent(eventId: string): Promise<void> {
    await delay(300)
    
    const index = events.findIndex(e => e.id === eventId)
    if (index === -1) {
      throw new Error('Event not found')
    }
    
    events.splice(index, 1)
  },
  
  async addSponsorshipTier(eventId: string, tierData: Partial<SponsorshipTier>): Promise<SponsorshipTier> {
    await delay(200)
    
    const event = events.find(e => e.id === eventId)
    if (!event) {
      throw new Error('Event not found')
    }
    
    const newTier: SponsorshipTier = {
      id: generateId(),
      event_id: eventId,
      name: tierData.name || '',
      price: tierData.price || 0,
      benefits: tierData.benefits || [],
      max_sponsors: tierData.max_sponsors || 1,
      display_order: tierData.display_order || (event.sponsorship_tiers?.length || 0) + 1,
      is_active: tierData.is_active ?? true
    }
    
    if (!event.sponsorship_tiers) {
      event.sponsorship_tiers = []
    }
    event.sponsorship_tiers.push(newTier)
    
    return newTier
  },
  
  async updateSponsorshipTier(tierId: string, tierData: Partial<SponsorshipTier>): Promise<SponsorshipTier> {
    await delay(200)
    
    for (const event of events) {
      if (event.sponsorship_tiers) {
        const tierIndex = event.sponsorship_tiers.findIndex(t => t.id === tierId)
        if (tierIndex !== -1) {
          const updatedTier = {
            ...event.sponsorship_tiers[tierIndex],
            ...tierData
          }
          event.sponsorship_tiers[tierIndex] = updatedTier
          return updatedTier
        }
      }
    }
    
    throw new Error('Tier not found')
  },
  
  async deleteSponsorshipTier(tierId: string): Promise<void> {
    await delay(200)
    
    for (const event of events) {
      if (event.sponsorship_tiers) {
        const tierIndex = event.sponsorship_tiers.findIndex(t => t.id === tierId)
        if (tierIndex !== -1) {
          event.sponsorship_tiers.splice(tierIndex, 1)
          return
        }
      }
    }
    
    throw new Error('Tier not found')
  },
  
  async updateEventDemographics(eventId: string, demographics: Partial<EventDemographics>): Promise<EventDemographics> {
    await delay(200)
    
    const event = events.find(e => e.id === eventId)
    if (!event) {
      throw new Error('Event not found')
    }
    
    if (!event.demographics) {
      event.demographics = {
        id: generateId(),
        event_id: eventId,
        age_range_min: 0,
        age_range_max: 100,
        interests: [],
        custom_tags: []
      }
    }
    
    event.demographics = {
      ...event.demographics,
      ...demographics
    }
    
    return event.demographics
  }
}
