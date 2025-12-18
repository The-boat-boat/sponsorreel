import type { SponsorProfile, SavedSponsor, BudgetTier } from '@/types'
import { demoSponsors, demoSavedSponsors, generateId } from './mockData'

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory stores
const sponsors: SponsorProfile[] = [...demoSponsors]
let savedSponsors: SavedSponsor[] = [...demoSavedSponsors]

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

// Calculate a mock match score based on sponsor profile
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

// Calculate mock distance
function calculateDistance(): number {
  return Math.round((Math.random() * 10 + 0.5) * 10) / 10
}

export const sponsorService = {
  async searchSponsors(
    filters: SponsorSearchFilters,
    page = 1,
    pageSize = 12
  ): Promise<SponsorSearchResult> {
    await delay(400)
    
    let filteredSponsors = [...sponsors]
    
    // Apply search query
    if (filters.query) {
      const query = filters.query.toLowerCase()
      filteredSponsors = filteredSponsors.filter(s => 
        s.profile?.company_name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.business_type.toLowerCase().includes(query)
      )
    }
    
    // Apply business type filter
    if (filters.businessTypes && filters.businessTypes.length > 0) {
      filteredSponsors = filteredSponsors.filter(s =>
        filters.businessTypes!.includes(s.business_type)
      )
    }
    
    // Apply budget tier filter
    if (filters.budgetTiers && filters.budgetTiers.length > 0) {
      filteredSponsors = filteredSponsors.filter(s =>
        filters.budgetTiers!.includes(s.budget_tier)
      )
    }
    
    // Apply min match score filter
    if (filters.minMatchScore) {
      filteredSponsors = filteredSponsors.filter(s =>
        calculateMatchScore(s) >= filters.minMatchScore!
      )
    }
    
    // Calculate total
    const total = filteredSponsors.length
    
    // Apply pagination
    const startIndex = (page - 1) * pageSize
    const paginatedSponsors = filteredSponsors.slice(startIndex, startIndex + pageSize)
    
    // Add computed fields (match score, distance) to each sponsor
    const enrichedSponsors = paginatedSponsors.map(s => ({
      ...s,
      _matchScore: calculateMatchScore(s),
      _distance: calculateDistance()
    }))
    
    // Sort by match score
    enrichedSponsors.sort((a, b) => (b._matchScore || 0) - (a._matchScore || 0))
    
    return {
      data: enrichedSponsors,
      total,
      page,
      pageSize
    }
  },
  
  async getSponsor(sponsorId: string): Promise<SponsorProfile> {
    await delay(250)
    
    const sponsor = sponsors.find(s => s.id === sponsorId)
    if (!sponsor) {
      throw new Error('Sponsor not found')
    }
    
    return {
      ...sponsor,
      _matchScore: calculateMatchScore(sponsor),
      _distance: calculateDistance()
    } as SponsorProfile
  },
  
  async getSavedSponsors(operatorId: string): Promise<SavedSponsor[]> {
    await delay(200)
    return savedSponsors.filter(s => s.operator_id === operatorId)
  },
  
  async saveSponsor(sponsorId: string, operatorId = 'op-001'): Promise<SavedSponsor> {
    await delay(150)
    
    // Check if already saved
    const existing = savedSponsors.find(
      s => s.sponsor_id === sponsorId && s.operator_id === operatorId
    )
    if (existing) {
      return existing
    }
    
    const saved: SavedSponsor = {
      id: generateId(),
      operator_id: operatorId,
      sponsor_id: sponsorId,
      created_at: new Date().toISOString()
    }
    
    savedSponsors.push(saved)
    return saved
  },
  
  async unsaveSponsor(sponsorId: string, operatorId = 'op-001'): Promise<void> {
    await delay(150)
    
    savedSponsors = savedSponsors.filter(
      s => !(s.sponsor_id === sponsorId && s.operator_id === operatorId)
    )
  },
  
  async getBusinessTypes(): Promise<string[]> {
    await delay(100)
    const types = new Set(sponsors.map(s => s.business_type))
    return Array.from(types).sort()
  }
}
