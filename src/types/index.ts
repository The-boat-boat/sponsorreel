// User Types
export type UserType = 'operator' | 'sponsor' | 'admin'
export type SubscriptionStatus = 'trial' | 'active' | 'canceled' | 'past_due'
export type SubscriptionTier = 'free' | 'pro'

export interface Profile {
  id: string
  user_type: UserType
  email: string
  company_name: string
  company_logo_url?: string
  phone?: string
  address?: Address
  stripe_customer_id?: string
  subscription_status: SubscriptionStatus
  subscription_tier: SubscriptionTier
  created_at: string
  updated_at: string
}

export interface Address {
  street: string
  city: string
  state: string
  zip: string
  lat?: number
  lng?: number
}

// Event Types
export type EventStatus = 'draft' | 'published' | 'completed' | 'canceled'

export interface Event {
  id: string
  operator_id: string
  title: string
  description: string
  film_title: string
  event_date: string
  start_time: string
  end_time: string
  venue_name: string
  address: Address
  expected_attendance: number
  status: EventStatus
  cover_image_url?: string
  created_at: string
  updated_at: string
  // Joined data
  sponsorship_tiers?: SponsorshipTier[]
  demographics?: EventDemographics
}

export interface EventDemographics {
  id: string
  event_id: string
  age_range_min: number
  age_range_max: number
  interests: string[]
  custom_tags: string[]
}

export interface SponsorshipTier {
  id: string
  event_id: string
  name: string
  price: number // in cents
  benefits: string[]
  max_sponsors: number
  display_order: number
  is_active: boolean
}

// Sponsor Types
export type BudgetTier = 'low' | 'mid' | 'high'

export interface SponsorProfile {
  id: string
  profile_id: string
  business_type: string
  description: string
  target_audience: string[]
  budget_tier: BudgetTier
  budget_min: number
  budget_max: number
  preferred_event_types: string[]
  assets_available: string[]
  cover_image_url?: string
  is_verified: boolean
  media_kit_url?: string
  // Joined data
  profile?: Profile
}

// Application Types
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn'

export interface SponsorshipApplication {
  id: string
  event_id: string
  sponsor_id: string
  tier_id: string
  status: ApplicationStatus
  message: string
  submitted_at: string
  responded_at?: string
  response_message?: string
}

// Contract Types
export type ContractStatus = 'draft' | 'sent' | 'signed' | 'paid' | 'completed' | 'disputed'

export interface Contract {
  id: string
  application_id: string
  operator_id: string
  sponsor_id: string
  event_id: string
  tier_id: string
  amount: number
  platform_fee: number
  status: ContractStatus
  contract_pdf_url?: string
  operator_signed_at?: string
  sponsor_signed_at?: string
  created_at: string
  updated_at: string
}

// Activity Types
export interface ActivityLogItem {
  id: string
  user_id: string
  action_type: string
  entity_type: string
  entity_id: string
  metadata: Record<string, unknown>
  created_at: string
}

// Dashboard Types
export interface DashboardStats {
  revenueYTD: number
  revenueChange: number
  activeEvents: number
  activeEventsChange: number
  pendingRequests: number
  pendingRequestsChange: number
}

export interface RevenueData {
  month: string
  amount: number
}

// Saved Sponsors
export interface SavedSponsor {
  id: string
  operator_id: string
  sponsor_id: string
  created_at: string
}

// Auth Types
export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  email: string
  password: string
  user_type: UserType
  company_name: string
  phone?: string
}

export interface AuthSession {
  user: Profile
  token: string
  expires_at: string
}
