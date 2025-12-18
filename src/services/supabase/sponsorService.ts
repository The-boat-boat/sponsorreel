import { supabase } from '@/lib/supabase'
import type { SponsorProfile, SavedSponsor, BudgetTier } from '@/types'

export interface SponsorSearchFilters {
  query?: string
  businessTypes?: string[]
  budgetTiers?: BudgetTier[]
  distance?: number
  minMatchScore?: number
}

export interface SponsorSearchResult {
  data: SponsorProfile[]
  total: number
  page: number
  pageSize: number
}

// Calculate a match score based on sponsor profile
function calculateMatchScore(sponsor: SponsorProfile): number {
  let score = 70 // Base score
  
  if (sponsor.is_verified) score += 10
  if (sponsor.assets_available?.includes('preroll')) score += 5
  if (sponsor.assets_available?.includes('promo_codes')) score += 5
  if (sponsor.budget_tier === 'high') score += 8
  else if (sponsor.budget_tier === 'mid') score += 5
  
  // Add some randomness
  score += Math.floor(Math.random() * 10)
  
  return Math.min(100, score)
}

// Calculate mock distance (in a real app, this would use geolocation)
function calculateDistance(): number {
  return Math.round((Math.random() * 10 + 0.5) * 10) / 10
}

export const sponsorService = {
  async searchSponsors(
    filters: SponsorSearchFilters,
    page = 1,
    pageSize = 12
  ): Promise<SponsorSearchResult> {
    let query = supabase
      .from('sponsor_profiles')
      .select(`
        *,
        profile:profiles (*)
      `, { count: 'exact' })

    // Apply search query
    if (filters.query) {
      query = query.or(`description.ilike.%${filters.query}%,business_type.ilike.%${filters.query}%`)
    }

    // Apply business type filter
    if (filters.businessTypes && filters.businessTypes.length > 0) {
      query = query.in('business_type', filters.businessTypes)
    }

    // Apply budget tier filter
    if (filters.budgetTiers && filters.budgetTiers.length > 0) {
      query = query.in('budget_tier', filters.budgetTiers)
    }

    // Apply pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      throw new Error(error.message || 'Failed to search sponsors')
    }

    // Enrich with computed fields
    const enrichedSponsors = (data || []).map(sponsor => {
      const sponsorProfile = {
        ...sponsor,
        profile: sponsor.profile || undefined
      } as SponsorProfile

      // Add computed fields
      const matchScore = calculateMatchScore(sponsorProfile)
      const distance = calculateDistance()

      return {
        ...sponsorProfile,
        _matchScore: matchScore,
        _distance: distance
      } as SponsorProfile & { _matchScore: number; _distance: number }
    })

    // Sort by match score
    enrichedSponsors.sort((a, b) => (b._matchScore || 0) - (a._matchScore || 0))

    // Apply min match score filter if specified
    const filteredSponsors = filters.minMatchScore
      ? enrichedSponsors.filter(s => (s._matchScore || 0) >= filters.minMatchScore!)
      : enrichedSponsors

    return {
      data: filteredSponsors,
      total: count || 0,
      page,
      pageSize
    }
  },

  async getSponsor(sponsorId: string): Promise<SponsorProfile> {
    const { data, error } = await supabase
      .from('sponsor_profiles')
      .select(`
        *,
        profile:profiles (*)
      `)
      .eq('id', sponsorId)
      .single()

    if (error || !data) {
      throw new Error(error?.message || 'Sponsor not found')
    }

    const sponsorProfile = {
      ...data,
      profile: data.profile || undefined
    } as SponsorProfile

    // Add computed fields
    return {
      ...sponsorProfile,
      _matchScore: calculateMatchScore(sponsorProfile),
      _distance: calculateDistance()
    } as SponsorProfile & { _matchScore: number; _distance: number }
  },

  async getSavedSponsors(operatorId: string): Promise<SavedSponsor[]> {
    const { data, error } = await supabase
      .from('saved_sponsors')
      .select('*')
      .eq('operator_id', operatorId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message || 'Failed to fetch saved sponsors')
    }

    return (data || []) as SavedSponsor[]
  },

  async saveSponsor(sponsorId: string, operatorId: string): Promise<SavedSponsor> {
    // Get sponsor profile_id
    const { data: sponsor } = await supabase
      .from('sponsor_profiles')
      .select('profile_id')
      .eq('id', sponsorId)
      .single()

    if (!sponsor) {
      throw new Error('Sponsor not found')
    }

    const { data, error } = await supabase
      .from('saved_sponsors')
      .insert([{
        operator_id: operatorId,
        sponsor_id: sponsor.profile_id
      }])
      .select()
      .single()

    if (error) {
      // If already saved, return existing
      if (error.code === '23505') {
        const { data: existing } = await supabase
          .from('saved_sponsors')
          .select('*')
          .eq('operator_id', operatorId)
          .eq('sponsor_id', sponsor.profile_id)
          .single()
        
        if (existing) {
          return existing as SavedSponsor
        }
      }
      throw new Error(error.message || 'Failed to save sponsor')
    }

    return data as SavedSponsor
  },

  async unsaveSponsor(sponsorId: string, operatorId: string): Promise<void> {
    // Get sponsor profile_id
    const { data: sponsor } = await supabase
      .from('sponsor_profiles')
      .select('profile_id')
      .eq('id', sponsorId)
      .single()

    if (!sponsor) {
      throw new Error('Sponsor not found')
    }

    const { error } = await supabase
      .from('saved_sponsors')
      .delete()
      .eq('operator_id', operatorId)
      .eq('sponsor_id', sponsor.profile_id)

    if (error) {
      throw new Error(error.message || 'Failed to unsave sponsor')
    }
  },

  async getBusinessTypes(): Promise<string[]> {
    const { data, error } = await supabase
      .from('sponsor_profiles')
      .select('business_type')

    if (error) {
      throw new Error(error.message || 'Failed to fetch business types')
    }

    const types = new Set((data || []).map(s => s.business_type))
    return Array.from(types).sort()
  }
}
