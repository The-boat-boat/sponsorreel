# SponsorReel Product Requirements Document (PRD)

## Executive Summary

SponsorReel is a B2B marketplace connecting pop-up cinema operators with local business sponsors. This PRD outlines the complete technical specification for building the MVP using Vue.js (frontend) and Supabase (backend).

**Current Status:** The Frontend MVP has been implemented with a comprehensive mock API layer. All core operator flows (dashboard, event creation, sponsor discovery) are functional and ready for backend integration.

**External API Dependency Assessment:** This application has **low external API dependency**. The core functionality (user management, event creation, sponsor discovery, contracts, payments) can be built primarily with Supabase's native features. The only significant external integrations needed are:
- **Stripe** for payment processing (required)
- **Google Maps/Mapbox** for location services (recommended but can start with manual address entry)
- **Email service** (Supabase has built-in email, or use SendGrid/Resend for transactional emails)

---

## 1. Project Overview

### 1.1 Product Vision
Enable pop-up cinema operators to discover, pitch, and close sponsorship deals with local businesses through an automated workflow platform.

### 1.2 User Types

| User Type | Description | Primary Goals |
|-----------|-------------|---------------|
| **Operator** | Pop-up cinema owners, outdoor movie organizers | Create events, find sponsors, manage contracts, receive payments |
| **Sponsor** | Local businesses (restaurants, breweries, dealerships) | Discover relevant events, evaluate ROI, manage sponsorship portfolio |
| **Admin** | SponsorReel internal team | Monitor platform health, resolve disputes, manage users |

### 1.3 Business Model Implementation
- Operators: $49/month subscription + 5% commission on deals
- Sponsors: Pay per event ($199–$999 based on tier)
- Platform takes 5% of all sponsorship transactions

---

## 2. Technical Architecture

### 2.1 Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Vue.js 3 + Composition API | Single-page application |
| UI Framework | Tailwind CSS | Styling (matches existing designs) |
| State Management | Pinia | Application state |
| Backend | Supabase | Database, Auth, Storage, Edge Functions |
| Database | PostgreSQL (via Supabase) | Data persistence |
| File Storage | Supabase Storage | Images, contracts, media kits |
| Authentication | Supabase Auth | User management, OAuth |
| Payments | Stripe | Subscriptions + one-time payments |
| Maps | Google Maps API or Mapbox | Location autocomplete, map display |
| Email | Supabase + Resend | Transactional emails |

### 2.2 Supabase Project Structure

```
supabase/
├── migrations/           # Database schema changes
├── functions/           # Edge functions for business logic
│   ├── stripe-webhook/  # Handle Stripe events
│   ├── generate-proposal/ # AI-assisted proposal generation
│   └── send-notification/ # Email/push notifications
└── seed.sql             # Initial data for development
```

---

## 3. Database Schema

### 3.1 Core Tables

```sql
-- Users (extends Supabase auth.users)
profiles
├── id (uuid, FK to auth.users)
├── user_type (enum: 'operator', 'sponsor', 'admin')
├── company_name (text)
├── company_logo_url (text)
├── phone (text)
├── address (jsonb)
├── stripe_customer_id (text)
├── subscription_status (enum: 'trial', 'active', 'canceled', 'past_due')
├── subscription_tier (enum: 'free', 'pro')
├── created_at (timestamp)
└── updated_at (timestamp)

-- Events (created by operators)
events
├── id (uuid)
├── operator_id (uuid, FK to profiles)
├── title (text)
├── description (text)
├── film_title (text)
├── event_date (date)
├── start_time (time)
├── end_time (time)
├── venue_name (text)
├── address (jsonb: street, city, state, zip, lat, lng)
├── expected_attendance (integer)
├── status (enum: 'draft', 'published', 'completed', 'canceled')
├── cover_image_url (text)
├── created_at (timestamp)
└── updated_at (timestamp)

-- Event Demographics
event_demographics
├── id (uuid)
├── event_id (uuid, FK to events)
├── age_range_min (integer)
├── age_range_max (integer)
├── interests (text[]) -- array of tags
└── custom_tags (text[])

-- Sponsor Profiles (additional sponsor-specific data)
sponsor_profiles
├── id (uuid)
├── profile_id (uuid, FK to profiles)
├── business_type (text)
├── description (text)
├── target_audience (text[])
├── budget_tier (enum: 'low', 'mid', 'high')
├── budget_min (integer)
├── budget_max (integer)
├── preferred_event_types (text[])
├── assets_available (text[]) -- 'logo', 'preroll', 'promo_codes'
├── cover_image_url (text)
├── is_verified (boolean)
└── media_kit_url (text)

-- Sponsorship Tiers (defined by operators per event)
sponsorship_tiers
├── id (uuid)
├── event_id (uuid, FK to events)
├── name (text) -- 'Bronze', 'Silver', 'Gold'
├── price (integer) -- in cents
├── benefits (text[])
├── max_sponsors (integer)
├── display_order (integer)
└── is_active (boolean)

-- Sponsorship Applications
sponsorship_applications
├── id (uuid)
├── event_id (uuid, FK to events)
├── sponsor_id (uuid, FK to profiles)
├── tier_id (uuid, FK to sponsorship_tiers)
├── status (enum: 'pending', 'accepted', 'rejected', 'withdrawn')
├── message (text)
├── submitted_at (timestamp)
├── responded_at (timestamp)
└── response_message (text)

-- Contracts
contracts
├── id (uuid)
├── application_id (uuid, FK to sponsorship_applications)
├── operator_id (uuid, FK to profiles)
├── sponsor_id (uuid, FK to profiles)
├── event_id (uuid, FK to events)
├── tier_id (uuid, FK to sponsorship_tiers)
├── amount (integer) -- in cents
├── platform_fee (integer) -- 5% in cents
├── status (enum: 'draft', 'sent', 'signed', 'paid', 'completed', 'disputed')
├── contract_pdf_url (text)
├── operator_signed_at (timestamp)
├── sponsor_signed_at (timestamp)
├── created_at (timestamp)
└── updated_at (timestamp)

-- Payments
payments
├── id (uuid)
├── contract_id (uuid, FK to contracts)
├── stripe_payment_intent_id (text)
├── amount (integer)
├── platform_fee (integer)
├── operator_payout (integer)
├── status (enum: 'pending', 'processing', 'completed', 'failed', 'refunded')
├── paid_at (timestamp)
├── payout_at (timestamp)
└── created_at (timestamp)

-- Messages
messages
├── id (uuid)
├── conversation_id (uuid)
├── sender_id (uuid, FK to profiles)
├── recipient_id (uuid, FK to profiles)
├── content (text)
├── is_read (boolean)
├── created_at (timestamp)
└── attachments (jsonb[])

-- Activity Log
activity_log
├── id (uuid)
├── user_id (uuid, FK to profiles)
├── action_type (text) -- 'application_received', 'payment_received', etc.
├── entity_type (text) -- 'event', 'contract', 'message'
├── entity_id (uuid)
├── metadata (jsonb)
└── created_at (timestamp)

-- Saved Sponsors (operator bookmarks)
saved_sponsors
├── id (uuid)
├── operator_id (uuid, FK to profiles)
├── sponsor_id (uuid, FK to profiles)
└── created_at (timestamp)
```

### 3.2 Row Level Security (RLS) Policies

```sql
-- Example RLS policies (implement for all tables)

-- Events: Operators can CRUD their own, sponsors can view published
CREATE POLICY "Operators manage own events" ON events
  FOR ALL USING (auth.uid() = operator_id);
  
CREATE POLICY "Sponsors view published events" ON events
  FOR SELECT USING (status = 'published');

-- Contracts: Only parties involved can view
CREATE POLICY "Contract parties only" ON contracts
  FOR SELECT USING (
    auth.uid() = operator_id OR auth.uid() = sponsor_id
  );
```

---

## 4. Feature Specifications

### 4.1 Authentication & Onboarding

#### 4.1.1 Sign Up Flow

**Operator Sign Up:**
1. Email/password or Google OAuth
2. Select "I'm a Cinema Operator"
3. Company name, phone number
4. Select subscription plan (start with 14-day trial)
5. Redirect to dashboard

**Sponsor Sign Up:**
1. Email/password or Google OAuth
2. Select "I'm a Local Business"
3. Business name, type, location
4. Brief description of sponsorship interests
5. Redirect to sponsor dashboard

#### 4.1.2 Requirements
- Email verification required
- Password minimum 8 characters
- OAuth: Google (primary), optionally Facebook
- Session persistence (remember me)
- Password reset via email

### 4.2 Operator Dashboard

**Route:** `/dashboard`

**Components:**
1. **Header Stats Cards**
   - Revenue YTD (calculated from completed payments)
   - Active Events count
   - Pending Requests count

2. **Upcoming Events Table**
   - Event name, date, venue, status badge
   - Quick actions: Edit, View Applications, Delete
   - Pagination (10 per page)

3. **Revenue Chart**
   - Last 6 months bar chart
   - Data from `payments` table aggregated by month

4. **Quick Actions Panel**
   - "Create New Event" button
   - "Find Sponsors" button

5. **Activity Feed**
   - Recent 10 activities from `activity_log`
   - Real-time updates via Supabase Realtime

6. **Mini Calendar**
   - Current month view
   - Dots indicating events on dates

**Data Queries:**
```javascript
// Dashboard stats
const stats = await supabase.rpc('get_operator_dashboard_stats', {
  operator_id: user.id
})

// Upcoming events
const events = await supabase
  .from('events')
  .select('*, sponsorship_tiers(*)')
  .eq('operator_id', user.id)
  .gte('event_date', today)
  .order('event_date', { ascending: true })
  .limit(10)
```

### 4.3 Event Creation (Multi-Step Form)

**Route:** `/events/create`

**Step 1: Event Basics**
- Event title (required, max 100 chars)
- Film/movie selection (searchable dropdown or free text)
- Date picker (required, must be future date)
- Start time, End time
- Description (rich text, max 2000 chars)
- Cover image upload (max 5MB, jpg/png)

**Step 2: Location & Venue**
- Venue name (required)
- Street address (Google Places autocomplete)
- City, State, Zip (auto-populated from address)
- Expected attendance (required, number input)
- Map preview showing pin

**Step 3: Audience Demographics**
- Age range slider (0-100)
- Interest tags (multi-select from predefined + custom)
  - Predefined: Family Friendly, Date Night, Horror Fans, Foodies, Students, Sports Fans, Music Lovers
- Custom tag input

**Step 4: Sponsorship Tiers**
- Add 1-3 tiers (Bronze/Silver/Gold default names)
- Per tier: Name, Price, Benefits (multi-line), Max sponsors
- Preview of tier cards

**Step 5: Review & Publish**
- Summary of all entered data
- "Save as Draft" or "Publish Event"

**Validation Rules:**
- All required fields filled
- Event date > today
- End time > Start time
- At least one sponsorship tier
- Price > 0 for all tiers

### 4.4 Sponsor Discovery

**Route:** `/sponsors` (for operators)

**Features:**
1. **Search Bar**
   - Full-text search on business name, description

2. **Filters Sidebar**
   - Business type (multi-select)
   - Budget tier (low/mid/high)
   - Distance from event (5/10/25/50 miles) - requires event selection
   - Preferred event types

3. **Results Grid**
   - Card layout (3 columns desktop, 1 mobile)
   - Card shows: Logo, name, business type, budget tier, "Contact" button
   - Pagination (12 per page)

4. **Sort Options**
   - Relevance (default)
   - Recently active
   - Most sponsorships completed

**Query Example:**
```javascript
const sponsors = await supabase
  .from('sponsor_profiles')
  .select(`
    *,
    profile:profiles(company_name, company_logo_url)
  `)
  .textSearch('description', searchTerm)
  .in('budget_tier', selectedTiers)
  .range(offset, offset + limit - 1)
```

### 4.5 Sponsor Profile Page

**Route:** `/sponsors/:id`

**Sections:**
1. **Hero Header**
   - Cover image
   - Logo, business name, verified badge
   - "Contact Sponsor" and "Save" buttons

2. **About Section**
   - Business description
   - Target audience tags

3. **Sponsorship Portfolio**
   - Past events sponsored (from completed contracts)
   - Event thumbnail, name, date, status

4. **Preferences Widget**
   - Budget tier display
   - Preferred event types list
   - Available assets checklist

5. **Location Widget**
   - Static map image
   - Address display

6. **Media Kit Download**
   - Download button (tracks in analytics)

### 4.6 Sponsorship Application Flow

**For Sponsors:**

**Route:** `/events/:id` (public event page)

1. Sponsor views event details
2. Clicks "Apply to Sponsor"
3. Modal: Select tier, add message
4. Submit application
5. Receive confirmation email
6. Track status in `/my-sponsorships`

**For Operators:**

**Route:** `/events/:id/applications`

1. View list of applications
2. Per application: Sponsor name, tier, message, timestamp
3. Actions: Accept, Reject, Message
4. On Accept: System creates contract draft
5. On Reject: Send rejection email with optional message

### 4.7 Contract Management

**Route:** `/contracts` and `/contracts/:id`

**Contract Lifecycle:**
1. **Draft** - Created when application accepted
2. **Sent** - Operator finalizes and sends to sponsor
3. **Signed** - Both parties have signed (e-signature)
4. **Paid** - Sponsor has completed payment
5. **Completed** - Event occurred, funds released
6. **Disputed** - Issue raised by either party

**Contract Detail Page:**
- PDF preview (generated from template)
- Event details summary
- Tier and price breakdown
- Fee breakdown (amount, 5% platform fee, operator net)
- Signature status for both parties
- Sign button (generates timestamp)
- Payment button (redirects to Stripe Checkout)

**PDF Generation:**
- Use Supabase Edge Function
- Template with placeholders
- Generate via library (e.g., PDFKit or use third-party like DocSpring)

### 4.8 Payment Processing

**Integration: Stripe**

**Flows:**

1. **Operator Subscription**
   - Stripe Checkout for $49/month
   - Webhook updates `subscription_status`
   - Dunning emails on failed payments

2. **Sponsor Event Payment**
   - Stripe Checkout session created with:
     - Line item: Sponsorship tier price
     - Application fee: 5% (for platform)
     - Destination: Operator's Stripe Connect account
   - Webhook on success:
     - Update contract status to 'paid'
     - Create payment record
     - Send confirmation emails

3. **Operator Payouts**
   - Automatic via Stripe Connect
   - Funds held until event date + 3 days
   - Manual release option for admin

**Required Stripe Setup:**
- Stripe Connect (Express or Standard accounts for operators)
- Webhooks for: `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `account.updated`

### 4.9 Messaging System

**Route:** `/messages`

**Features:**
1. **Conversation List**
   - List of all conversations
   - Unread indicator
   - Last message preview
   - Timestamp

2. **Conversation View**
   - Message thread (newest at bottom)
   - Sender avatar, name, timestamp
   - Text content
   - File attachments (images, PDFs)

3. **Compose**
   - Text input
   - File upload (max 10MB)
   - Send button

**Real-time:**
- Supabase Realtime subscription on `messages` table
- New message notification (in-app badge)

### 4.10 Analytics & Reporting

**Operator Analytics:**
- Revenue by month (chart)
- Revenue by event (table)
- Top sponsors by value
- Application conversion rate

**Sponsor Analytics:**
- Sponsorship history
- Total spent YTD
- Events by status

**Post-Event Report (for sponsors):**
- Generated after event completion
- Attendance actual vs expected
- Photo gallery from event
- ROI metrics placeholder

### 4.11 Settings Pages

**Operator Settings:**
- Profile (company name, logo, description)
- Billing (current plan, payment method, invoices)
- Payout settings (Stripe Connect onboarding)
- Notification preferences
- Team members (future: invite collaborators)

**Sponsor Settings:**
- Profile (business info, logo, description)
- Sponsorship preferences (budget, event types)
- Media kit upload
- Notification preferences

---

## 5. API Endpoints (Supabase Edge Functions)

| Function | Trigger | Purpose |
|----------|---------|---------|
| `stripe-webhook` | POST from Stripe | Handle payment events |
| `create-checkout-session` | POST from app | Generate Stripe Checkout URL |
| `generate-contract-pdf` | POST from app | Create PDF from contract data |
| `send-email` | Internal | Send transactional emails |
| `calculate-dashboard-stats` | RPC | Aggregate stats for dashboard |
| `onboard-stripe-connect` | POST from app | Create Stripe Connect account link |

---

## 6. File Storage Structure

```
storage/
├── avatars/
│   └── {user_id}/profile.jpg
├── events/
│   └── {event_id}/
│       ├── cover.jpg
│       └── gallery/
├── sponsors/
│   └── {sponsor_id}/
│       ├── logo.png
│       ├── cover.jpg
│       └── media-kit.pdf
├── contracts/
│   └── {contract_id}/
│       └── contract.pdf
└── messages/
    └── {conversation_id}/
        └── {attachment_id}.{ext}
```

**Storage Policies:**
- Avatars: Public read, owner write
- Events: Public read for published, operator write
- Contracts: Only contract parties can read/write
- Messages: Only conversation participants

---

## 7. Frontend Route Structure

```
/                           # Landing page (marketing)
/login                      # Login form
/signup                     # Registration with user type selection
/signup/operator            # Operator registration flow
/signup/sponsor             # Sponsor registration flow

# Operator Routes (protected)
/dashboard                  # Operator dashboard
/events                     # Event list
/events/create              # Multi-step event creation
/events/:id                 # Event detail (operator view)
/events/:id/edit            # Edit event
/events/:id/applications    # View applications
/sponsors                   # Sponsor discovery
/sponsors/:id               # Sponsor profile
/contracts                  # Contract list
/contracts/:id              # Contract detail
/messages                   # Messaging
/messages/:conversationId   # Conversation view
/settings                   # Settings hub
/settings/profile           # Profile settings
/settings/billing           # Subscription management
/settings/payouts           # Stripe Connect settings

# Sponsor Routes (protected)
/sponsor/dashboard          # Sponsor dashboard
/sponsor/events             # Browse events
/sponsor/events/:id         # Event detail (sponsor view)
/sponsor/applications       # My applications
/sponsor/contracts          # My contracts
/sponsor/contracts/:id      # Contract detail
/sponsor/messages           # Messaging
/sponsor/settings           # Settings

# Public Routes
/events/:id/public          # Public event page (for sponsors to view)
/sponsor/:id/public         # Public sponsor profile
```

---

## 8. Development Phases

### Phase 1: Foundation (Weeks 1-3)
- [x] Supabase project setup
- [x] Database schema implementation
- [x] Database seeding with automated migration script (`seed_migration.sql`)
- [x] Vue.js project scaffold with Tailwind
- [x] Authentication (Mock implementation)
- [x] Basic routing and layout components
- [x] User registration flows (Operator & Sponsor - Mock)

### Phase 2: Core Operator Features (Weeks 4-6)
- [x] Operator dashboard
- [x] Event CRUD (create, read, update, delete)
- [x] Event creation multi-step form
- [x] File upload for event images (Mocked)
- [x] Sponsorship tier management

### Phase 3: Sponsor Features (Weeks 7-8)
- [ ] Sponsor dashboard
- [ ] Sponsor profile setup
- [ ] Event browsing for sponsors
- [ ] Sponsorship application flow
- [x] Saved sponsors functionality (Mock implementation)

### Phase 4: Marketplace Connection (Weeks 9-10)
- [x] Sponsor discovery for operators
- [x] Search and filtering
- [ ] Application management (accept/reject)
- [ ] Messaging system (basic)

### Phase 5: Payments & Contracts (Weeks 11-13)
- [ ] Stripe integration setup
- [ ] Operator subscription checkout
- [ ] Stripe Connect onboarding for operators
- [ ] Contract generation
- [ ] Sponsor payment checkout
- [ ] Payment webhooks and status updates

### Phase 6: Polish & Launch (Weeks 14-16)
- [ ] Email notifications
- [ ] Activity feeds (Mock implemented)
- [ ] Analytics dashboards (Mock implemented)
- [x] Mobile responsiveness audit
- [ ] Performance optimization
- [ ] Security audit
- [ ] Beta testing
- [ ] Production deployment

---

## 9. Success Metrics

| Metric | Target (6 months) |
|--------|-------------------|
| Registered Operators | 100 |
| Registered Sponsors | 500 |
| Events Created | 300 |
| Successful Sponsorship Deals | 150 |
| Total GMV (Gross Merchandise Value) | $75,000 |
| Platform Revenue | $3,750 (5% of GMV) |
| Subscription Revenue | $14,700 ($49 × 100 operators × 3 avg months) |

---

## 10. Security Requirements

1. **Authentication**
   - Secure password hashing (handled by Supabase)
   - Rate limiting on login attempts
   - Session expiry (7 days default)

2. **Authorization**
   - Row Level Security on all tables
   - API route protection via middleware
   - User type verification on protected routes

3. **Data Protection**
   - HTTPS everywhere
   - Sensitive data encryption at rest (Supabase default)
   - PCI compliance via Stripe (no card data stored)

4. **Input Validation**
   - Client-side validation (Vue)
   - Server-side validation (Edge Functions + DB constraints)
   - XSS prevention (sanitize user content)

---

## 11. Third-Party Services Summary

| Service | Purpose | Pricing Estimate |
|---------|---------|------------------|
| Supabase | Backend infrastructure | Free tier → Pro $25/mo |
| Stripe | Payments | 2.9% + $0.30 per transaction |
| Google Maps API | Location services | Free tier (28k loads/mo) |
| Resend | Transactional email | Free tier (100 emails/day) |
| Vercel/Netlify | Frontend hosting | Free tier → $20/mo |

---

## 12. Open Questions for Stakeholder Decision

1. **E-signature approach**: Build simple timestamp-based signature or integrate DocuSign/HelloSign?
2. **Movie database**: Integrate with TMDB API for film search, or keep as free text?
3. **Mobile app**: Start web-only, or plan for React Native wrapper?
4. **Multi-language**: English only for MVP, or plan for i18n?
5. **Dispute resolution**: Manual admin process, or build formal workflow?

