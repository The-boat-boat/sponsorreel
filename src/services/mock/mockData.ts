import type { 
  Profile, 
  Event, 
  SponsorProfile,
  ActivityLogItem,
  DashboardStats,
  RevenueData,
  SavedSponsor
} from '@/types'

// Helper to generate UUIDs
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// Demo Operator Profile
export const demoOperator: Profile = {
  id: 'op-001',
  user_type: 'operator',
  email: 'operator@example.com',
  company_name: 'Cinema Paradiso',
  company_logo_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbk_qHOy_Q1oqquE-ciU3H7ozRPzQWmx34X69urUNfT0RAldgwuaw_C-M2qp9fYfmN7SUOlYlrB10Ew8cYHrm_nGPZesbqSDrFM9mEOPO4pKdYeZqIS9xxFhpCgt2Bh_Z0jGHgsm2JgWveRWbP56T77ytNiekQkhnzMxg3pH_J-SrDwz_gBgBLwYsz-stwA3xeJjeJUBbnRSCEDw7KHBiUAQA3Y5R_Sco_e2gjRa3bn5oP68661MTYBlGpIX6DG_8sfUX1J7eQuB44',
  phone: '(555) 123-4567',
  subscription_status: 'active',
  subscription_tier: 'pro',
  created_at: '2023-01-15T10:00:00Z',
  updated_at: '2023-10-24T10:00:00Z'
}

// Demo Events
export const demoEvents: Event[] = [
  {
    id: 'evt-001',
    operator_id: 'op-001',
    title: 'Summer Blockbuster Night',
    description: 'Join us for an unforgettable outdoor movie experience under the stars! We\'ll be showing the latest blockbuster hit with food trucks, live music before the show, and a family-friendly atmosphere.',
    film_title: 'Top Gun: Maverick',
    event_date: '2024-01-28',
    start_time: '18:00',
    end_time: '22:00',
    venue_name: 'Central Park',
    address: {
      street: '123 Park Avenue',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      lat: 40.7829,
      lng: -73.9654
    },
    expected_attendance: 500,
    status: 'published',
    cover_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9b2yy66nZuSdb6nO_XfhwPRekZQhRZsbqan0AXNE1xYpzbJVzb7XHfPQimjpHy1kibUNS-P6nTbfkYnR-h6hpJvCDce6Zxan8d4wssRlvRxRjPUWuAJH0aby9ty3dA4fMVcPjcfWp_9qY7Tso-zvx0Ctbs2LtqS9EDBcrFsBxfsJ3nBIZFg7T-wu614NAcdaddDN2iqGbWWH4YRCSaD4GWF6W55A-gdeaz_wdHijoMgfaq_PsHzUDt-sTHjUmb4YQ_lVzC090OozF',
    created_at: '2023-09-01T10:00:00Z',
    updated_at: '2023-10-20T10:00:00Z',
    sponsorship_tiers: [
      {
        id: 'tier-001',
        event_id: 'evt-001',
        name: 'Gold',
        price: 99900,
        benefits: ['Logo on main screen', 'VIP seating area', 'Social media shoutout', 'Product sampling booth'],
        max_sponsors: 1,
        display_order: 1,
        is_active: true
      },
      {
        id: 'tier-002',
        event_id: 'evt-001',
        name: 'Silver',
        price: 59900,
        benefits: ['Logo on signage', 'Social media mention', 'Banner placement'],
        max_sponsors: 3,
        display_order: 2,
        is_active: true
      },
      {
        id: 'tier-003',
        event_id: 'evt-001',
        name: 'Bronze',
        price: 29900,
        benefits: ['Logo in program', 'Thank you mention'],
        max_sponsors: 5,
        display_order: 3,
        is_active: true
      }
    ],
    demographics: {
      id: 'demo-001',
      event_id: 'evt-001',
      age_range_min: 18,
      age_range_max: 45,
      interests: ['Family Friendly', 'Foodies', 'Music Lovers'],
      custom_tags: ['Outdoor', 'Summer']
    }
  },
  {
    id: 'evt-002',
    operator_id: 'op-001',
    title: 'Indie Film Showcase',
    description: 'A curated selection of independent films from emerging directors. Perfect for film enthusiasts and those who appreciate unique storytelling.',
    film_title: 'Various Indie Films',
    event_date: '2024-02-02',
    start_time: '19:00',
    end_time: '23:00',
    venue_name: 'Warehouse 42',
    address: {
      street: '42 Industrial Way',
      city: 'Brooklyn',
      state: 'NY',
      zip: '11201'
    },
    expected_attendance: 200,
    status: 'published',
    cover_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDa5qnuhJISLJapOyJFjUqZZJt5oB61Gw5P1-WN7n5PrNGmWbVwK6ajJ-VlVuc9KMonh4vRAGKpWfvuIK9HjGvCDfJ-FQ13EJh0vIjlWYF44bjen_pBmxcU9RvHoi3Sw9PLa2jUWzlOkYuzEIg2vVtyxT7xXCib-PzcJZdpdxOVyBIava2rvIVOSpv1qYM4-nQdaoS746w4lr-5j3PU7mFFZ1GC1v_o6YU4xKLMwCcLreYoz-tocDFjU4dSPwoo5gcU7yAq_XsFaIuK',
    created_at: '2023-09-15T10:00:00Z',
    updated_at: '2023-10-18T10:00:00Z',
    sponsorship_tiers: [
      {
        id: 'tier-004',
        event_id: 'evt-002',
        name: 'Presenting Sponsor',
        price: 75000,
        benefits: ['Exclusive naming rights', 'Opening remarks', 'VIP access'],
        max_sponsors: 1,
        display_order: 1,
        is_active: true
      }
    ]
  },
  {
    id: 'evt-003',
    operator_id: 'op-001',
    title: 'Classic Drive-In',
    description: 'Relive the golden age of cinema with our classic drive-in experience. Bring your car, grab some popcorn, and enjoy timeless movies under the stars.',
    film_title: 'Grease (1978)',
    event_date: '2024-02-15',
    start_time: '20:00',
    end_time: '23:00',
    venue_name: 'Fairgrounds',
    address: {
      street: '500 Fair Drive',
      city: 'Queens',
      state: 'NY',
      zip: '11101'
    },
    expected_attendance: 300,
    status: 'draft',
    cover_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBslHa9fsP-_rTfw-_1GS4Cw04b19CombsSQ0Xzbygy2ceUHFaVuE5sGOcQyR-QLEYPFWRTKhKNriZFhuyr2LDBH6xEUrn4-evUI7cgo5uEqYdfGmTErL8sEmPRul5gDZkRY4nXP100RZ6bAOXzyKY0uInrc-0-gd12H10aKysXHH4TCdMNejhvMikPaTMQS7mvK_hHuyiNypPp6k_2fw3zYLy-4f7mq6k1CNU2Hrr_e0ChDd13nmtXsSQyDNHAiKqillLhiQAAT_hs',
    created_at: '2023-10-01T10:00:00Z',
    updated_at: '2023-10-22T10:00:00Z'
  },
  {
    id: 'evt-004',
    operator_id: 'op-001',
    title: 'Halloween Horror Night',
    description: 'Get ready for a spine-chilling experience! Horror movies, spooky decorations, and costume contests. Not for the faint of heart!',
    film_title: 'The Conjuring',
    event_date: '2024-03-31',
    start_time: '21:00',
    end_time: '01:00',
    venue_name: 'Abandoned Factory',
    address: {
      street: '666 Spooky Lane',
      city: 'Bronx',
      state: 'NY',
      zip: '10451'
    },
    expected_attendance: 250,
    status: 'published',
    created_at: '2023-10-10T10:00:00Z',
    updated_at: '2023-10-21T10:00:00Z'
  }
]

// Demo Sponsors
export const demoSponsors: SponsorProfile[] = [
  {
    id: 'sp-001',
    profile_id: 'prof-sp-001',
    business_type: 'Restaurant',
    description: 'Family-owned Italian restaurant serving authentic cuisine since 1985. Known for our wood-fired pizzas and homemade pasta.',
    target_audience: ['Families', 'Foodies', 'Date Night'],
    budget_tier: 'mid',
    budget_min: 50000,
    budget_max: 150000,
    preferred_event_types: ['Outdoor Cinema', 'Family Events', 'Community Gatherings'],
    assets_available: ['logo', 'promo_codes'],
    cover_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX6Iys3O_hzf715WXj_9i8gBhp3ZpePAE6fi-3Z4emNGwJumrB_yaIkRTvYftEuWpR5ssPz1--cD3x9MY5fyS1vHYfNfIG7SfJQ5oJMKwUp4oaw5Jz7jwLT4PS2fkQPsYTGsXUvfxx2pc15Kf9oNZWiLQUWCSSMmlu6_RKVRKH7zIb6Zx_wuPFH0nKQWC1wfcD3w-9eScv2ycFAyqr7AE-1iZ_i8dR7qwip_mrQThcPCaX6NZldYVdJIE4QMSqV-GUqaw9qK5nQdna',
    is_verified: true,
    profile: {
      id: 'prof-sp-001',
      user_type: 'sponsor',
      email: 'joes@example.com',
      company_name: "Joe's Bistro & Bar",
      company_logo_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX6Iys3O_hzf715WXj_9i8gBhp3ZpePAE6fi-3Z4emNGwJumrB_yaIkRTvYftEuWpR5ssPz1--cD3x9MY5fyS1vHYfNfIG7SfJQ5oJMKwUp4oaw5Jz7jwLT4PS2fkQPsYTGsXUvfxx2pc15Kf9oNZWiLQUWCSSMmlu6_RKVRKH7zIb6Zx_wuPFH0nKQWC1wfcD3w-9eScv2ycFAyqr7AE-1iZ_i8dR7qwip_mrQThcPCaX6NZldYVdJIE4QMSqV-GUqaw9qK5nQdna',
      subscription_status: 'active',
      subscription_tier: 'free',
      created_at: '2023-03-15T10:00:00Z',
      updated_at: '2023-10-20T10:00:00Z'
    }
  },
  {
    id: 'sp-002',
    profile_id: 'prof-sp-002',
    business_type: 'Retail',
    description: 'Your local tech destination for the latest gadgets, accessories, and expert advice. We specialize in consumer electronics and smart home devices.',
    target_audience: ['Young Adults', 'Tech Enthusiasts', 'Students'],
    budget_tier: 'mid',
    budget_min: 40000,
    budget_max: 120000,
    preferred_event_types: ['Tech Events', 'Young Adult Oriented'],
    assets_available: ['logo', 'preroll'],
    cover_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUmcBc_YvVpnQC2CPW5anx0VzSZ32d7xFxN4BDlz6W_1Np7GpiRSSk82nr3BeRr5aEr56dtqtQEHtNH2oIn8WVDSSX_619g88-_PYXodOL8D3qiuN5n3zUUcKOspuZCIH4mk0vkL0KgCgzIphRCZn47n8ZS2AJZfuBO0M9oP2P_4QsR2MaxzwEXXDsChkwphPwXyJ6Sz7V7m5sK6__B1MBbleipfZOa0i07oFLsdBWmJSKjVKyZrkHxOVkPahTAvog7khgW3jVtfgz',
    is_verified: false,
    profile: {
      id: 'prof-sp-002',
      user_type: 'sponsor',
      email: 'techhub@example.com',
      company_name: 'TechHub Electronics',
      subscription_status: 'active',
      subscription_tier: 'free',
      created_at: '2023-04-20T10:00:00Z',
      updated_at: '2023-10-15T10:00:00Z'
    }
  },
  {
    id: 'sp-003',
    profile_id: 'prof-sp-003',
    business_type: 'Grocery',
    description: 'Organic and locally-sourced produce, natural foods, and sustainable products. Supporting local farmers and promoting healthy living.',
    target_audience: ['Health Conscious', 'Families', 'Eco-Friendly'],
    budget_tier: 'high',
    budget_min: 100000,
    budget_max: 300000,
    preferred_event_types: ['Family Events', 'Health & Wellness', 'Community Markets'],
    assets_available: ['logo', 'promo_codes', 'preroll'],
    cover_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaOuDfjX95EydmBH0Mv7p234nQaV18hxUdnSKsE6mA9oqXd1B3jLAFThJBBB0iehWdV0iL4FrZrlWyMNdg0RXrOrJVm80eIBU_yCtkbfOaPuw41aJ52YW3OI5unUbEM60NwvKsdGGxQEEnU5SMSYk5cj721NfYGzYueD3v1vlNUmWJYaEszy9oL8uCQk-rnvLTOZWAdqeV4Jk0rmpplLHhu2gfkZxdAzaKE0bNS7DGFTRAwABDly5AjMECFdYIc_qOYH2pqMB9aaZH',
    is_verified: true,
    profile: {
      id: 'prof-sp-003',
      user_type: 'sponsor',
      email: 'greenleaf@example.com',
      company_name: 'GreenLeaf Market',
      subscription_status: 'active',
      subscription_tier: 'free',
      created_at: '2023-02-10T10:00:00Z',
      updated_at: '2023-10-18T10:00:00Z'
    }
  },
  {
    id: 'sp-004',
    profile_id: 'prof-sp-004',
    business_type: 'Fitness',
    description: 'State-of-the-art fitness center with personal training, group classes, and wellness programs. Helping you achieve your health goals.',
    target_audience: ['Active Adults', 'Young Professionals', 'Athletes'],
    budget_tier: 'low',
    budget_min: 20000,
    budget_max: 50000,
    preferred_event_types: ['Sports Events', 'Community Runs', 'Wellness Fairs'],
    assets_available: ['logo'],
    cover_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5u1yQT15Jfy2VotGMPdtKma-N6aA3uZYkG3PPYT7KQ7BIKpHHfVYIq2vJulov1RWx8atGaVO3P_1shljR9_0Q8ZQfd0Cj3r92bBhuBwzY5fpmfQ90BxZLC_EXDWhLQv0iixfkPwKMZAliWm-ex_ISurXRradQ1DnNzX-M5udX2f-LScy_AVgEZRyD7huFscpqF8lBgbN4GBaSVu-0XNZzpQ5gMuWR3z2sugMYqivMNafiVc7z_Iedb2cWrtxaXbndpU85QDog_YnW',
    is_verified: false,
    profile: {
      id: 'prof-sp-004',
      user_type: 'sponsor',
      email: 'citysports@example.com',
      company_name: 'City Sports Gym',
      subscription_status: 'active',
      subscription_tier: 'free',
      created_at: '2023-05-05T10:00:00Z',
      updated_at: '2023-10-12T10:00:00Z'
    }
  },
  {
    id: 'sp-005',
    profile_id: 'prof-sp-005',
    business_type: 'Education',
    description: 'Arts and crafts studio offering classes for all ages. Painting, pottery, sculpture, and more. Unleash your creativity!',
    target_audience: ['Kids', 'Families', 'Art Enthusiasts'],
    budget_tier: 'low',
    budget_min: 15000,
    budget_max: 40000,
    preferred_event_types: ['Family Events', 'Arts & Culture', 'School Events'],
    assets_available: ['logo', 'promo_codes'],
    cover_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBr7pVZ_W2C_5hBcxvj6rau2s3lRoh4SG4MsooKnt7HG8pnwRsOzgWTZYpvicjLVmVbSQn_7Hl6O3LT4K5DfrfUlv-Ra_6TagpL2_dtYcnd0VDMrz1eL3IfVLlEV9UUkwKQvHsIEvxycQEL8P2kJdE5Nh01k1A9lh1tlr7cLbkqwMCafF0B8YdSJmEaqomcg3HuvsuoyLeBdVolLrwt2TUbf3YcPdSNxaYmWlGtQifSFjuZaczMFsOjzL639qoovm6sObwZbf6pZ8DM',
    is_verified: false,
    profile: {
      id: 'prof-sp-005',
      user_type: 'sponsor',
      email: 'creativearts@example.com',
      company_name: 'Creative Arts Studio',
      subscription_status: 'active',
      subscription_tier: 'free',
      created_at: '2023-06-15T10:00:00Z',
      updated_at: '2023-10-10T10:00:00Z'
    }
  },
  {
    id: 'sp-006',
    profile_id: 'prof-sp-006',
    business_type: 'Retail',
    description: 'Independent bookstore with a curated selection of fiction, non-fiction, and local authors. Host of weekly book clubs and author signings.',
    target_audience: ['Book Lovers', 'Intellectuals', 'Local Community'],
    budget_tier: 'low',
    budget_min: 10000,
    budget_max: 35000,
    preferred_event_types: ['Literary Events', 'Community Gatherings', 'Cultural Events'],
    assets_available: ['logo', 'promo_codes'],
    cover_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_Bwz0zBJW2UX_grtCMGfXhKyM6-GYfB2l2iscs7-9Nv_yxfgPd1Nlomi5Lr4UdKy0M14TciaCui8bb36fsfd8W0uaRaL0RWzVwXRkhhQD4TEGUBieLa8o1GbIE5uvmGnPWYXaDGB1PEhHGqF-7FRbVxx-AANC7tqCppVUgsaRwyN2-1IKrNtPuEdSScbFvjX1HjNLblGpuHx_MuFqf2TunFFmPe8mPAvXs0i695gTOzsTYzVvJrVduuQ77Nsbhbn-a-MZo-LBmtKn',
    is_verified: true,
    profile: {
      id: 'prof-sp-006',
      user_type: 'sponsor',
      email: 'downtownbooks@example.com',
      company_name: 'Downtown Books',
      subscription_status: 'active',
      subscription_tier: 'free',
      created_at: '2023-01-20T10:00:00Z',
      updated_at: '2023-10-08T10:00:00Z'
    }
  },
  {
    id: 'sp-007',
    profile_id: 'prof-sp-007',
    business_type: 'Brewery',
    description: 'Family-owned brewery serving award-winning craft beers and seasonal ales. Our taproom hosts weekly trivia nights and supports local artists.',
    target_audience: ['21-35 year olds', 'Craft Beer Enthusiasts', 'Local Residents', 'Foodies'],
    budget_tier: 'mid',
    budget_min: 50000,
    budget_max: 200000,
    preferred_event_types: ['Outdoor Cinema', 'Drive-in', 'Kids Matinee'],
    assets_available: ['logo', 'preroll', 'promo_codes'],
    cover_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADg-TcNTscShX9JxBmwRqajuNNTC46Qd3e6vr95RF8PLN1D8UB1hdDFfPCO0OKp-ZM5G66XFmLdN78Hnm1Olh2Xwowf32Bomhq3EOOM5LLAMGjMA24UA-zIyfMX6LSkupRwVgo528MSs4t418Hbck7YAZzeQ-n88UBQGxr1JgGPEQ5XmmPIu02iQ6CrjQjQ6SV93dHj0mrg7Mt3_RS2XWy-nMy9ctJVB68kIvldnMhV9s4uM1qOWCw5p-ubYc2L6HcQpQcmuiAOVRx',
    is_verified: true,
    media_kit_url: '/media-kits/rusty-anchor-brewery.pdf',
    profile: {
      id: 'prof-sp-007',
      user_type: 'sponsor',
      email: 'rustyanchor@example.com',
      company_name: 'The Rusty Anchor Brewery',
      company_logo_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADg-TcNTscShX9JxBmwRqajuNNTC46Qd3e6vr95RF8PLN1D8UB1hdDFfPCO0OKp-ZM5G66XFmLdN78Hnm1Olh2Xwowf32Bomhq3EOOM5LLAMGjMA24UA-zIyfMX6LSkupRwVgo528MSs4t418Hbck7YAZzeQ-n88UBQGxr1JgGPEQ5XmmPIu02iQ6CrjQjQ6SV93dHj0mrg7Mt3_RS2XWy-nMy9ctJVB68kIvldnMhV9s4uM1qOWCw5p-ubYc2L6HcQpQcmuiAOVRx',
      address: {
        street: '123 Harbor Blvd',
        city: 'Harbor District',
        state: 'CA',
        zip: '90210'
      },
      subscription_status: 'active',
      subscription_tier: 'free',
      created_at: '2023-01-01T10:00:00Z',
      updated_at: '2023-10-01T10:00:00Z'
    }
  }
]

// Demo Activity Log
export const demoActivityLog: ActivityLogItem[] = [
  {
    id: 'act-001',
    user_id: 'op-001',
    action_type: 'application_received',
    entity_type: 'application',
    entity_id: 'app-001',
    metadata: { 
      sponsor_name: "Joe's Pizza",
      event_title: 'Summer Blockbuster Night'
    },
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
  },
  {
    id: 'act-002',
    user_id: 'op-001',
    action_type: 'payment_received',
    entity_type: 'payment',
    entity_id: 'pay-001',
    metadata: { 
      sponsor_name: 'TechCorp',
      amount: 59900
    },
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // Yesterday
  },
  {
    id: 'act-003',
    user_id: 'op-001',
    action_type: 'message_received',
    entity_type: 'message',
    entity_id: 'msg-001',
    metadata: { 
      sender_name: 'Local Bakery Co.',
      preview: 'regarding branding assets'
    },
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    id: 'act-004',
    user_id: 'op-001',
    action_type: 'event_updated',
    entity_type: 'event',
    entity_id: 'evt-003',
    metadata: { 
      event_title: 'Classic Drive-In'
    },
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  }
]

// Demo Dashboard Stats
export const demoDashboardStats: DashboardStats = {
  revenueYTD: 12450,
  revenueChange: 12,
  activeEvents: 4,
  activeEventsChange: 1,
  pendingRequests: 8,
  pendingRequestsChange: 3
}

// Demo Revenue Data
export const demoRevenueData: RevenueData[] = [
  { month: 'May', amount: 5200 },
  { month: 'Jun', amount: 7100 },
  { month: 'Jul', amount: 9800 },
  { month: 'Aug', amount: 14000 },
  { month: 'Sep', amount: 8500 },
  { month: 'Oct', amount: 6500 }
]

// Saved Sponsors (initially empty)
export const demoSavedSponsors: SavedSponsor[] = []

// Interest tags for events
export const interestTags = [
  'Family Friendly',
  'Date Night',
  'Horror Fans',
  'Foodies',
  'Students',
  'Sports Fans',
  'Music Lovers',
  'Art Enthusiasts',
  'Tech Savvy',
  'Outdoor Lovers'
]

// Business types for sponsors
export const businessTypes = [
  'Restaurant',
  'Retail',
  'Grocery',
  'Fitness',
  'Education',
  'Brewery',
  'Entertainment',
  'Healthcare',
  'Automotive',
  'Real Estate'
]
