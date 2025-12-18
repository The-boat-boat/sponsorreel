import { supabase } from '@/lib/supabase'
import type { Event, SponsorshipTier, EventDemographics } from '@/types'

export const eventService = {
  async getEvents(operatorId: string): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        sponsorship_tiers (*),
        demographics:event_demographics (*)
      `)
      .eq('operator_id', operatorId)
      .order('event_date', { ascending: true })

    if (error) {
      throw new Error(error.message || 'Failed to fetch events')
    }

    return (data || []).map(event => ({
      ...event,
      sponsorship_tiers: event.sponsorship_tiers || [],
      demographics: event.demographics || undefined
    })) as Event[]
  },

  async getEvent(eventId: string): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        sponsorship_tiers (*),
        demographics:event_demographics (*)
      `)
      .eq('id', eventId)
      .single()

    if (error || !data) {
      throw new Error(error?.message || 'Event not found')
    }

    return {
      ...data,
      sponsorship_tiers: data.sponsorship_tiers || [],
      demographics: data.demographics || undefined
    } as Event
  },

  async createEvent(eventData: Partial<Event>): Promise<Event> {
    if (!eventData.operator_id) {
      throw new Error('Operator ID is required')
    }

    // Insert event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert([{
        operator_id: eventData.operator_id,
        title: eventData.title || '',
        description: eventData.description || '',
        film_title: eventData.film_title || '',
        event_date: eventData.event_date || '',
        start_time: eventData.start_time || '',
        end_time: eventData.end_time || '',
        venue_name: eventData.venue_name || '',
        address: eventData.address || {},
        expected_attendance: eventData.expected_attendance || 0,
        status: eventData.status || 'draft',
        cover_image_url: eventData.cover_image_url
      }])
      .select()
      .single()

    if (eventError || !event) {
      throw new Error(eventError?.message || 'Failed to create event')
    }

    const eventId = event.id

    // Insert sponsorship tiers if provided
    if (eventData.sponsorship_tiers && eventData.sponsorship_tiers.length > 0) {
      const tiers = eventData.sponsorship_tiers.map(tier => ({
        event_id: eventId,
        name: tier.name,
        price: tier.price,
        benefits: tier.benefits,
        max_sponsors: tier.max_sponsors,
        display_order: tier.display_order,
        is_active: tier.is_active
      }))

      await supabase
        .from('sponsorship_tiers')
        .insert(tiers)
    }

    // Insert demographics if provided
    if (eventData.demographics) {
      await supabase
        .from('event_demographics')
        .insert([{
          event_id: eventId,
          age_range_min: eventData.demographics.age_range_min,
          age_range_max: eventData.demographics.age_range_max,
          interests: eventData.demographics.interests,
          custom_tags: eventData.demographics.custom_tags
        }])
    }

    // Fetch complete event with relations
    return this.getEvent(eventId)
  },

  async updateEvent(eventId: string, eventData: Partial<Event>): Promise<Event> {
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (eventData.title !== undefined) updateData.title = eventData.title
    if (eventData.description !== undefined) updateData.description = eventData.description
    if (eventData.film_title !== undefined) updateData.film_title = eventData.film_title
    if (eventData.event_date !== undefined) updateData.event_date = eventData.event_date
    if (eventData.start_time !== undefined) updateData.start_time = eventData.start_time
    if (eventData.end_time !== undefined) updateData.end_time = eventData.end_time
    if (eventData.venue_name !== undefined) updateData.venue_name = eventData.venue_name
    if (eventData.address !== undefined) updateData.address = eventData.address
    if (eventData.expected_attendance !== undefined) updateData.expected_attendance = eventData.expected_attendance
    if (eventData.status !== undefined) updateData.status = eventData.status
    if (eventData.cover_image_url !== undefined) updateData.cover_image_url = eventData.cover_image_url

    const { error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', eventId)

    if (error) {
      throw new Error(error.message || 'Failed to update event')
    }

    return this.getEvent(eventId)
  },

  async deleteEvent(eventId: string): Promise<void> {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId)

    if (error) {
      throw new Error(error.message || 'Failed to delete event')
    }
  },

  async addSponsorshipTier(eventId: string, tierData: Partial<SponsorshipTier>): Promise<SponsorshipTier> {
    // Get current max display_order
    const { data: existingTiers } = await supabase
      .from('sponsorship_tiers')
      .select('display_order')
      .eq('event_id', eventId)
      .order('display_order', { ascending: false })
      .limit(1)

    const displayOrder = existingTiers && existingTiers.length > 0
      ? existingTiers[0].display_order + 1
      : 1

    const { data, error } = await supabase
      .from('sponsorship_tiers')
      .insert([{
        event_id: eventId,
        name: tierData.name || '',
        price: tierData.price || 0,
        benefits: tierData.benefits || [],
        max_sponsors: tierData.max_sponsors || 1,
        display_order: displayOrder,
        is_active: tierData.is_active ?? true
      }])
      .select()
      .single()

    if (error || !data) {
      throw new Error(error?.message || 'Failed to create sponsorship tier')
    }

    return data as SponsorshipTier
  },

  async updateSponsorshipTier(tierId: string, tierData: Partial<SponsorshipTier>): Promise<SponsorshipTier> {
    const updateData: any = {}
    
    if (tierData.name !== undefined) updateData.name = tierData.name
    if (tierData.price !== undefined) updateData.price = tierData.price
    if (tierData.benefits !== undefined) updateData.benefits = tierData.benefits
    if (tierData.max_sponsors !== undefined) updateData.max_sponsors = tierData.max_sponsors
    if (tierData.display_order !== undefined) updateData.display_order = tierData.display_order
    if (tierData.is_active !== undefined) updateData.is_active = tierData.is_active

    const { data, error } = await supabase
      .from('sponsorship_tiers')
      .update(updateData)
      .eq('id', tierId)
      .select()
      .single()

    if (error || !data) {
      throw new Error(error?.message || 'Failed to update sponsorship tier')
    }

    return data as SponsorshipTier
  },

  async deleteSponsorshipTier(tierId: string): Promise<void> {
    const { error } = await supabase
      .from('sponsorship_tiers')
      .delete()
      .eq('id', tierId)

    if (error) {
      throw new Error(error.message || 'Failed to delete sponsorship tier')
    }
  },

  async updateEventDemographics(eventId: string, demographics: Partial<EventDemographics>): Promise<EventDemographics> {
    // Check if demographics exist
    const { data: existing } = await supabase
      .from('event_demographics')
      .select('id')
      .eq('event_id', eventId)
      .single()

    const updateData: any = {
      event_id: eventId,
      age_range_min: demographics.age_range_min ?? 0,
      age_range_max: demographics.age_range_max ?? 100,
      interests: demographics.interests ?? [],
      custom_tags: demographics.custom_tags ?? []
    }

    let data, error

    if (existing) {
      // Update existing
      const result = await supabase
        .from('event_demographics')
        .update(updateData)
        .eq('event_id', eventId)
        .select()
        .single()
      data = result.data
      error = result.error
    } else {
      // Insert new
      const result = await supabase
        .from('event_demographics')
        .insert([updateData])
        .select()
        .single()
      data = result.data
      error = result.error
    }

    if (error || !data) {
      throw new Error(error?.message || 'Failed to update event demographics')
    }

    return data as EventDemographics
  }
}
