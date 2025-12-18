/*
  SPONSORREEL SEED DATA MIGRATION - AUTOMATED VERSION
  
  This script automatically creates auth users and seeds all database data.
  No manual user creation in Supabase Dashboard is required!
  
  INSTRUCTIONS:
  1. Copy this entire script
  2. Go to Supabase Dashboard → SQL Editor → New Query
  3. Paste the code and click Run
  
  DEFAULT PASSWORD FOR ALL USERS: Password123!
  (You can change passwords after login via Supabase Dashboard)
  
  NOTE: This script assumes your tables (profiles, sponsor_profiles, events, etc.) already exist.
  The script is idempotent - it can be run multiple times safely.
*/

-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
    -- Auth user UUIDs (generated deterministically)
    operator_id UUID;
    sponsor_joe_id UUID;
    sponsor_tech_id UUID;
    sponsor_green_id UUID;
    sponsor_city_id UUID;
    sponsor_arts_id UUID;
    sponsor_books_id UUID;
    sponsor_brewery_id UUID;

    -- Internal IDs for referential integrity
    evt1_id UUID;
    evt2_id UUID;
    evt3_id UUID;
    evt4_id UUID;
    
    app1_id UUID;
    contract1_id UUID;
    payment1_id UUID;
    
    -- Password hash (same for all users for simplicity)
    default_password_hash TEXT;
    
    -- Check if user exists
    user_exists BOOLEAN;
BEGIN
    -- Generate UUIDs for auth users
    -- Check if users already exist, if so use their IDs, otherwise generate new ones
    SELECT id INTO operator_id FROM auth.users WHERE email = 'operator@example.com' LIMIT 1;
    IF operator_id IS NULL THEN
        operator_id := gen_random_uuid();
    END IF;
    
    SELECT id INTO sponsor_joe_id FROM auth.users WHERE email = 'joes@example.com' LIMIT 1;
    IF sponsor_joe_id IS NULL THEN
        sponsor_joe_id := gen_random_uuid();
    END IF;
    
    SELECT id INTO sponsor_tech_id FROM auth.users WHERE email = 'techhub@example.com' LIMIT 1;
    IF sponsor_tech_id IS NULL THEN
        sponsor_tech_id := gen_random_uuid();
    END IF;
    
    SELECT id INTO sponsor_green_id FROM auth.users WHERE email = 'greenleaf@example.com' LIMIT 1;
    IF sponsor_green_id IS NULL THEN
        sponsor_green_id := gen_random_uuid();
    END IF;
    
    SELECT id INTO sponsor_city_id FROM auth.users WHERE email = 'citysports@example.com' LIMIT 1;
    IF sponsor_city_id IS NULL THEN
        sponsor_city_id := gen_random_uuid();
    END IF;
    
    SELECT id INTO sponsor_arts_id FROM auth.users WHERE email = 'creativearts@example.com' LIMIT 1;
    IF sponsor_arts_id IS NULL THEN
        sponsor_arts_id := gen_random_uuid();
    END IF;
    
    SELECT id INTO sponsor_books_id FROM auth.users WHERE email = 'downtownbooks@example.com' LIMIT 1;
    IF sponsor_books_id IS NULL THEN
        sponsor_books_id := gen_random_uuid();
    END IF;
    
    SELECT id INTO sponsor_brewery_id FROM auth.users WHERE email = 'rustyanchor@example.com' LIMIT 1;
    IF sponsor_brewery_id IS NULL THEN
        sponsor_brewery_id := gen_random_uuid();
    END IF;
    
    -- Generate password hash (bcrypt) - default password: Password123!
    default_password_hash := crypt('Password123!', gen_salt('bf'));
    
    -- Generate UUIDs for events and applications
    evt1_id := gen_random_uuid();
    evt2_id := gen_random_uuid();
    evt3_id := gen_random_uuid();
    evt4_id := gen_random_uuid();
    app1_id := gen_random_uuid();
    contract1_id := gen_random_uuid();
    payment1_id := gen_random_uuid();

    -- 1. CREATE AUTH USERS
    -- Insert operator user (only if doesn't exist)
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'operator@example.com') THEN
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            aud,
            role,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        )
        VALUES (
            operator_id,
            '00000000-0000-0000-0000-000000000000'::uuid,
            'operator@example.com',
            default_password_hash,
            now(),
            'authenticated',
            'authenticated',
            '{"provider": "email", "providers": ["email"]}'::jsonb,
            '{}'::jsonb,
            now(),
            now(),
            '',
            '',
            '',
            ''
        );
    END IF;

    -- Insert sponsor users (only if doesn't exist)
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'joes@example.com') THEN
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            aud,
            role,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        )
        VALUES (
            sponsor_joe_id,
            '00000000-0000-0000-0000-000000000000'::uuid,
            'joes@example.com',
            default_password_hash,
            now(),
            'authenticated',
            'authenticated',
            '{"provider": "email", "providers": ["email"]}'::jsonb,
            '{}'::jsonb,
            now(),
            now(),
            '',
            '',
            '',
            ''
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'techhub@example.com') THEN
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            aud,
            role,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        )
        VALUES (
            sponsor_tech_id,
            '00000000-0000-0000-0000-000000000000'::uuid,
            'techhub@example.com',
            default_password_hash,
            now(),
            'authenticated',
            'authenticated',
            '{"provider": "email", "providers": ["email"]}'::jsonb,
            '{}'::jsonb,
            now(),
            now(),
            '',
            '',
            '',
            ''
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'greenleaf@example.com') THEN
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            aud,
            role,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        )
        VALUES (
            sponsor_green_id,
            '00000000-0000-0000-0000-000000000000'::uuid,
            'greenleaf@example.com',
            default_password_hash,
            now(),
            'authenticated',
            'authenticated',
            '{"provider": "email", "providers": ["email"]}'::jsonb,
            '{}'::jsonb,
            now(),
            now(),
            '',
            '',
            '',
            ''
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'citysports@example.com') THEN
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            aud,
            role,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        )
        VALUES (
            sponsor_city_id,
            '00000000-0000-0000-0000-000000000000'::uuid,
            'citysports@example.com',
            default_password_hash,
            now(),
            'authenticated',
            'authenticated',
            '{"provider": "email", "providers": ["email"]}'::jsonb,
            '{}'::jsonb,
            now(),
            now(),
            '',
            '',
            '',
            ''
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'creativearts@example.com') THEN
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            aud,
            role,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        )
        VALUES (
            sponsor_arts_id,
            '00000000-0000-0000-0000-000000000000'::uuid,
            'creativearts@example.com',
            default_password_hash,
            now(),
            'authenticated',
            'authenticated',
            '{"provider": "email", "providers": ["email"]}'::jsonb,
            '{}'::jsonb,
            now(),
            now(),
            '',
            '',
            '',
            ''
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'downtownbooks@example.com') THEN
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            aud,
            role,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        )
        VALUES (
            sponsor_books_id,
            '00000000-0000-0000-0000-000000000000'::uuid,
            'downtownbooks@example.com',
            default_password_hash,
            now(),
            'authenticated',
            'authenticated',
            '{"provider": "email", "providers": ["email"]}'::jsonb,
            '{}'::jsonb,
            now(),
            now(),
            '',
            '',
            '',
            ''
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'rustyanchor@example.com') THEN
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            aud,
            role,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        )
        VALUES (
            sponsor_brewery_id,
            '00000000-0000-0000-0000-000000000000'::uuid,
            'rustyanchor@example.com',
            default_password_hash,
            now(),
            'authenticated',
            'authenticated',
            '{"provider": "email", "providers": ["email"]}'::jsonb,
            '{}'::jsonb,
            now(),
            now(),
            '',
            '',
            '',
            ''
        );
    END IF;

    -- Get actual IDs in case they already existed
    SELECT id INTO operator_id FROM auth.users WHERE email = 'operator@example.com' LIMIT 1;
    SELECT id INTO sponsor_joe_id FROM auth.users WHERE email = 'joes@example.com' LIMIT 1;
    SELECT id INTO sponsor_tech_id FROM auth.users WHERE email = 'techhub@example.com' LIMIT 1;
    SELECT id INTO sponsor_green_id FROM auth.users WHERE email = 'greenleaf@example.com' LIMIT 1;
    SELECT id INTO sponsor_city_id FROM auth.users WHERE email = 'citysports@example.com' LIMIT 1;
    SELECT id INTO sponsor_arts_id FROM auth.users WHERE email = 'creativearts@example.com' LIMIT 1;
    SELECT id INTO sponsor_books_id FROM auth.users WHERE email = 'downtownbooks@example.com' LIMIT 1;
    SELECT id INTO sponsor_brewery_id FROM auth.users WHERE email = 'rustyanchor@example.com' LIMIT 1;

    -- 2. INSERT PROFILES
    INSERT INTO profiles (id, user_type, email, company_name, company_logo_url, phone, subscription_status, subscription_tier, created_at, updated_at)
    VALUES 
        (operator_id, 'operator', 'operator@example.com', 'Cinema Paradiso', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbk_qHOy_Q1oqquE-ciU3H7ozRPzQWmx34X69urUNfT0RAldgwuaw_C-M2qp9fYfmN7SUOlYlrB10Ew8cYHrm_nGPZesbqSDrFM9mEOPO4pKdYeZqIS9xxFhpCgt2Bh_Z0jGHgsm2JgWveRWbP56T77ytNiekQkhnzMxg3pH_J-SrDwz_gBgBLwYsz-stwA3xeJjeJUBbnRSCEDw7KHBiUAQA3Y5R_Sco_e2gjRa3bn5oP68661MTYBlGpIX6DG_8sfUX1J7eQuB44', '(555) 123-4567', 'active', 'pro', '2023-01-15 10:00:00+00', '2023-10-24 10:00:00+00'),
        (sponsor_joe_id, 'sponsor', 'joes@example.com', 'Joe''s Bistro & Bar', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX6Iys3O_hzf715WXj_9i8gBhp3ZpePAE6fi-3Z4emNGwJumrB_yaIkRTvYftEuWpR5ssPz1--cD3x9MY5fyS1vHYfNfIG7SfJQ5oJMKwUp4oaw5Jz7jwLT4PS2fkQPsYTGsXUvfxx2pc15Kf9oNZWiLQUWCSSMmlu6_RKVRKH7zIb6Zx_wuPFH0nKQWC1wfcD3w-9eScv2ycFAyqr7AE-1iZ_i8dR7qwip_mrQThcPCaX6NZldYVdJIE4QMSqV-GUqaw9qK5nQdna', NULL, 'active', 'free', '2023-03-15 10:00:00+00', '2023-10-20 10:00:00+00'),
        (sponsor_tech_id, 'sponsor', 'techhub@example.com', 'TechHub Electronics', NULL, NULL, 'active', 'free', '2023-04-20 10:00:00+00', '2023-10-15 10:00:00+00'),
        (sponsor_green_id, 'sponsor', 'greenleaf@example.com', 'GreenLeaf Market', NULL, NULL, 'active', 'free', '2023-02-10 10:00:00+00', '2023-10-18 10:00:00+00'),
        (sponsor_city_id, 'sponsor', 'citysports@example.com', 'City Sports Gym', NULL, NULL, 'active', 'free', '2023-05-05 10:00:00+00', '2023-10-12 10:00:00+00'),
        (sponsor_arts_id, 'sponsor', 'creativearts@example.com', 'Creative Arts Studio', NULL, NULL, 'active', 'free', '2023-06-15 10:00:00+00', '2023-10-10 10:00:00+00'),
        (sponsor_books_id, 'sponsor', 'downtownbooks@example.com', 'Downtown Books', NULL, NULL, 'active', 'free', '2023-01-20 10:00:00+00', '2023-10-08 10:00:00+00'),
        (sponsor_brewery_id, 'sponsor', 'rustyanchor@example.com', 'The Rusty Anchor Brewery', 'https://lh3.googleusercontent.com/aida-public/AB6AXuADg-TcNTscShX9JxBmwRqajuNNTC46Qd3e6vr95RF8PLN1D8UB1hdDFfPCO0OKp-ZM5G66XFmLdN78Hnm1Olh2Xwowf32Bomhq3EOOM5LLAMGjMA24UA-zIyfMX6LSkupRwVgo528MSs4t418Hbck7YAZzeQ-n88UBQGxr1JgGPEQ5XmmPIu02iQ6CrjQjQ6SV93dHj0mrg7Mt3_RS2XWy-nMy9ctJVB68kIvldnMhV9s4uM1qOWCw5p-ubYc2L6HcQpQcmuiAOVRx', NULL, 'active', 'free', '2023-01-01 10:00:00+00', '2023-10-01 10:00:00+00')
    ON CONFLICT (id) DO UPDATE SET
        user_type = EXCLUDED.user_type,
        email = EXCLUDED.email,
        company_name = EXCLUDED.company_name,
        company_logo_url = EXCLUDED.company_logo_url,
        phone = EXCLUDED.phone,
        subscription_status = EXCLUDED.subscription_status,
        subscription_tier = EXCLUDED.subscription_tier,
        updated_at = EXCLUDED.updated_at;

    -- Update Brewery profile with address JSON
    UPDATE profiles SET address = '{"street": "123 Harbor Blvd", "city": "Harbor District", "state": "CA", "zip": "90210"}'::jsonb WHERE id = sponsor_brewery_id;

    -- 3. INSERT SPONSOR PROFILES
    INSERT INTO sponsor_profiles (profile_id, business_type, description, target_audience, budget_tier, budget_min, budget_max, preferred_event_types, assets_available, cover_image_url, is_verified)
    VALUES
        (sponsor_joe_id, 'Restaurant', 'Family-owned Italian restaurant serving authentic cuisine since 1985. Known for our wood-fired pizzas and homemade pasta.', '{"Families", "Foodies", "Date Night"}'::text[], 'mid', 50000, 150000, '{"Outdoor Cinema", "Family Events", "Community Gatherings"}'::text[], '{"logo", "promo_codes"}'::text[], 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX6Iys3O_hzf715WXj_9i8gBhp3ZpePAE6fi-3Z4emNGwJumrB_yaIkRTvYftEuWpR5ssPz1--cD3x9MY5fyS1vHYfNfIG7SfJQ5oJMKwUp4oaw5Jz7jwLT4PS2fkQPsYTGsXUvfxx2pc15Kf9oNZWiLQUWCSSMmlu6_RKVRKH7zIb6Zx_wuPFH0nKQWC1wfcD3w-9eScv2ycFAyqr7AE-1iZ_i8dR7qwip_mrQThcPCaX6NZldYVdJIE4QMSqV-GUqaw9qK5nQdna', true),
        (sponsor_tech_id, 'Retail', 'Your local tech destination for the latest gadgets, accessories, and expert advice. We specialize in consumer electronics and smart home devices.', '{"Young Adults", "Tech Enthusiasts", "Students"}'::text[], 'mid', 40000, 120000, '{"Tech Events", "Young Adult Oriented"}'::text[], '{"logo", "preroll"}'::text[], 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUmcBc_YvVpnQC2CPW5anx0VzSZ32d7xFxN4BDlz6W_1Np7GpiRSSk82nr3BeRr5aEr56dtqtQEHtNH2oIn8WVDSSX_619g88-_PYXodOL8D3qiuN5n3zUUcKOspuZCIH4mk0vkL0KgCgzIphRCZn47n8ZS2AJZfuBO0M9oP2P_4QsR2MaxzwEXXDsChkwphPwXyJ6Sz7V7m5sK6__B1MBbleipfZOa0i07oFLsdBWmJSKjVKyZrkHxOVkPahTAvog7khgW3jVtfgz', false),
        (sponsor_green_id, 'Grocery', 'Organic and locally-sourced produce, natural foods, and sustainable products. Supporting local farmers and promoting healthy living.', '{"Health Conscious", "Families", "Eco-Friendly"}'::text[], 'high', 100000, 300000, '{"Family Events", "Health & Wellness", "Community Markets"}'::text[], '{"logo", "promo_codes", "preroll"}'::text[], 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaOuDfjX95EydmBH0Mv7p234nQaV18hxUdnSKsE6mA9oqXd1B3jLAFThJBBB0iehWdV0iL4FrZrlWyMNdg0RXrOrJVm80eIBU_yCtkbfOaPuw41aJ52YW3OI5unUbEM60NwvKsdGGxQEEnU5SMSYk5cj721NfYGzYueD3v1vlNUmWJYaEszy9oL8uCQk-rnvLTOZWAdqeV4Jk0rmpplLHhu2gfkZxdAzaKE0bNS7DGFTRAwABDly5AjMECFdYIc_qOYH2pqMB9aaZH', true),
        (sponsor_city_id, 'Fitness', 'State-of-the-art fitness center with personal training, group classes, and wellness programs. Helping you achieve your health goals.', '{"Active Adults", "Young Professionals", "Athletes"}'::text[], 'low', 20000, 50000, '{"Sports Events", "Community Runs", "Wellness Fairs"}'::text[], '{"logo"}'::text[], 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5u1yQT15Jfy2VotGMPdtKma-N6aA3uZYkG3PPYT7KQ7BIKpHHfVYIq2vJulov1RWx8atGaVO3P_1shljR9_0Q8ZQfd0Cj3r92bBhuBwzY5fpmfQ90BxZLC_EXDWhLQv0iixfkPwKMZAliWm-ex_ISurXRradQ1DnNzX-M5udX2f-LScy_AVgEZRyD7huFscpqF8lBgbN4GBaSVu-0XNZzpQ5gMuWR3z2sugMYqivMNafiVc7z_Iedb2cWrtxaXbndpU85QDog_YnW', false),
        (sponsor_arts_id, 'Education', 'Arts and crafts studio offering classes for all ages. Painting, pottery, sculpture, and more. Unleash your creativity!', '{"Kids", "Families", "Art Enthusiasts"}'::text[], 'low', 15000, 40000, '{"Family Events", "Arts & Culture", "School Events"}'::text[], '{"logo", "promo_codes"}'::text[], 'https://lh3.googleusercontent.com/aida-public/AB6AXuBr7pVZ_W2C_5hBcxvj6rau2s3lRoh4SG4MsooKnt7HG8pnwRsOzgWTZYpvicjLVmVbSQn_7Hl6O3LT4K5DfrfUlv-Ra_6TagpL2_dtYcnd0VDMrz1eL3IfVLlEV9UUkwKQvHsIEvxycQEL8P2kJdE5Nh01k1A9lh1tlr7cLbkqwMCafF0B8YdSJmEaqomcg3HuvsuoyLeBdVolLrwt2TUbf3YcPdSNxaYmWlGtQifSFjuZaczMFsOjzL639qoovm6sObwZbf6pZ8DM', false),
        (sponsor_books_id, 'Retail', 'Independent bookstore with a curated selection of fiction, non-fiction, and local authors. Host of weekly book clubs and author signings.', '{"Book Lovers", "Intellectuals", "Local Community"}'::text[], 'low', 10000, 35000, '{"Literary Events", "Community Gatherings", "Cultural Events"}'::text[], '{"logo", "promo_codes"}'::text[], 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_Bwz0zBJW2UX_grtCMGfXhKyM6-GYfB2l2iscs7-9Nv_yxfgPd1Nlomi5Lr4UdKy0M14TciaCui8bb36fsfd8W0uaRaL0RWzVwXRkhhQD4TEGUBieLa8o1GbIE5uvmGnPWYXaDGB1PEhHGqF-7FRbVxx-AANC7tqCppVUgsaRwyN2-1IKrNtPuEdSScbFvjX1HjNLblGpuHx_MuFqf2TunFFmPe8mPAvXs0i695gTOzsTYzVvJrVduuQ77Nsbhbn-a-MZo-LBmtKn', true),
        (sponsor_brewery_id, 'Brewery', 'Family-owned brewery serving award-winning craft beers and seasonal ales. Our taproom hosts weekly trivia nights and supports local artists.', '{"21-35 year olds", "Craft Beer Enthusiasts", "Local Residents", "Foodies"}'::text[], 'mid', 50000, 200000, '{"Outdoor Cinema", "Drive-in", "Kids Matinee"}'::text[], '{"logo", "preroll", "promo_codes"}'::text[], 'https://lh3.googleusercontent.com/aida-public/AB6AXuADg-TcNTscShX9JxBmwRqajuNNTC46Qd3e6vr95RF8PLN1D8UB1hdDFfPCO0OKp-ZM5G66XFmLdN78Hnm1Olh2Xwowf32Bomhq3EOOM5LLAMGjMA24UA-zIyfMX6LSkupRwVgo528MSs4t418Hbck7YAZzeQ-n88UBQGxr1JgGPEQ5XmmPIu02iQ6CrjQjQ6SV93dHj0mrg7Mt3_RS2XWy-nMy9ctJVB68kIvldnMhV9s4uM1qOWCw5p-ubYc2L6HcQpQcmuiAOVRx', true)
    ON CONFLICT (profile_id) DO UPDATE SET
        business_type = EXCLUDED.business_type,
        description = EXCLUDED.description,
        target_audience = EXCLUDED.target_audience,
        budget_tier = EXCLUDED.budget_tier,
        budget_min = EXCLUDED.budget_min,
        budget_max = EXCLUDED.budget_max,
        preferred_event_types = EXCLUDED.preferred_event_types,
        assets_available = EXCLUDED.assets_available,
        cover_image_url = EXCLUDED.cover_image_url,
        is_verified = EXCLUDED.is_verified;

    -- 4. INSERT EVENTS
    INSERT INTO events (id, operator_id, title, description, film_title, event_date, start_time, end_time, venue_name, address, expected_attendance, status, cover_image_url, created_at, updated_at)
    VALUES
        (evt1_id, operator_id, 'Summer Blockbuster Night', 'Join us for an unforgettable outdoor movie experience under the stars! We''ll be showing the latest blockbuster hit with food trucks, live music before the show, and a family-friendly atmosphere.', 'Top Gun: Maverick', '2024-06-28', '18:00', '22:00', 'Central Park', '{"street": "123 Park Avenue", "city": "New York", "state": "NY", "zip": "10001", "lat": 40.7829, "lng": -73.9654}'::jsonb, 500, 'published', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9b2yy66nZuSdb6nO_XfhwPRekZQhRZsbqan0AXNE1xYpzbJVzb7XHfPQimjpHy1kibUNS-P6nTbfkYnR-h6hpJvCDce6Zxan8d4wssRlvRxRjPUWuAJH0aby9ty3dA4fMVcPjcfWp_9qY7Tso-zvx0Ctbs2LtqS9EDBcrFsBxfsJ3nBIZFg7T-wu614NAcdaddDN2iqGbWWH4YRCSaD4GWF6W55A-gdeaz_wdHijoMgfaq_PsHzUDt-sTHjUmb4YQ_lVzC090OozF', '2023-09-01 10:00:00+00', '2023-10-20 10:00:00+00'),
        (evt2_id, operator_id, 'Indie Film Showcase', 'A curated selection of independent films from emerging directors. Perfect for film enthusiasts and those who appreciate unique storytelling.', 'Various Indie Films', '2024-07-02', '19:00', '23:00', 'Warehouse 42', '{"street": "42 Industrial Way", "city": "Brooklyn", "state": "NY", "zip": "11201"}'::jsonb, 200, 'published', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDa5qnuhJISLJapOyJFjUqZZJt5oB61Gw5P1-WN7n5PrNGmWbVwK6ajJ-VlVuc9KMonh4vRAGKpWfvuIK9HjGvCDfJ-FQ13EJh0vIjlWYF44bjen_pBmxcU9RvHoi3Sw9PLa2jUWzlOkYuzEIg2vVtyxT7xXCib-PzcJZdpdxOVyBIava2rvIVOSpv1qYM4-nQdaoS746w4lr-5j3PU7mFFZ1GC1v_o6YU4xKLMwCcLreYoz-tocDFjU4dSPwoo5gcU7yAq_XsFaIuK', '2023-09-15 10:00:00+00', '2023-10-18 10:00:00+00'),
        (evt3_id, operator_id, 'Classic Drive-In', 'Relive the golden age of cinema with our classic drive-in experience. Bring your car, grab some popcorn, and enjoy timeless movies under the stars.', 'Grease (1978)', '2024-07-15', '20:00', '23:00', 'Fairgrounds', '{"street": "500 Fair Drive", "city": "Queens", "state": "NY", "zip": "11101"}'::jsonb, 300, 'draft', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBslHa9fsP-_rTfw-_1GS4Cw04b19CombsSQ0Xzbygy2ceUHFaVuE5sGOcQyR-QLEYPFWRTKhKNriZFhuyr2LDBH6xEUrn4-evUI7cgo5uEqYdfGmTErL8sEmPRul5gDZkRY4nXP100RZ6bAOXzyKY0uInrc-0-gd12H10aKysXHH4TCdMNejhvMikPaTMQS7mvK_hHuyiNypPp6k_2fw3zYLy-4f7mq6k1CNU2Hrr_e0ChDd13nmtXsSQyDNHAiKqillLhiQAAT_hs', '2023-10-01 10:00:00+00', '2023-10-22 10:00:00+00'),
        (evt4_id, operator_id, 'Halloween Horror Night', 'Get ready for a spine-chilling experience! Horror movies, spooky decorations, and costume contests. Not for the faint of heart!', 'The Conjuring', '2024-10-31', '21:00', '01:00', 'Abandoned Factory', '{"street": "666 Spooky Lane", "city": "Bronx", "state": "NY", "zip": "10451"}'::jsonb, 250, 'published', NULL, '2023-10-10 10:00:00+00', '2023-10-21 10:00:00+00')
    ON CONFLICT (id) DO NOTHING;

    -- 5. INSERT SPONSORSHIP TIERS
    INSERT INTO sponsorship_tiers (event_id, name, price, benefits, max_sponsors, display_order, is_active)
    VALUES
        (evt1_id, 'Gold', 99900, '{"Logo on main screen", "VIP seating area", "Social media shoutout", "Product sampling booth"}'::text[], 1, 1, true),
        (evt1_id, 'Silver', 59900, '{"Logo on signage", "Social media mention", "Banner placement"}'::text[], 3, 2, true),
        (evt1_id, 'Bronze', 29900, '{"Logo in program", "Thank you mention"}'::text[], 5, 3, true),
        (evt2_id, 'Presenting Sponsor', 75000, '{"Exclusive naming rights", "Opening remarks", "VIP access"}'::text[], 1, 1, true)
    ON CONFLICT DO NOTHING;

    -- 6. INSERT EVENT DEMOGRAPHICS
    INSERT INTO event_demographics (event_id, age_range_min, age_range_max, interests, custom_tags)
    VALUES
        (evt1_id, 18, 45, '{"Family Friendly", "Foodies", "Music Lovers"}'::text[], '{"Outdoor", "Summer"}'::text[])
    ON CONFLICT (event_id) DO NOTHING;

    -- 7. INSERT SAMPLE APPLICATIONS, CONTRACTS, PAYMENTS (Platform State)
    INSERT INTO sponsorship_applications (id, event_id, sponsor_id, tier_id, status, message, submitted_at)
    SELECT
        app1_id,
        evt1_id,
        sponsor_joe_id,
        (SELECT id FROM sponsorship_tiers WHERE event_id = evt1_id AND name = 'Silver' LIMIT 1),
        'accepted',
        'We would love to sponsor this community event!',
        now() - interval '2 days'
    WHERE NOT EXISTS (
        SELECT 1 FROM sponsorship_applications 
        WHERE event_id = evt1_id 
        AND sponsor_id = sponsor_joe_id 
        AND status = 'accepted'
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO contracts (id, operator_id, sponsor_id, event_id, application_id, tier_id, amount, platform_fee, status, created_at)
    SELECT
        contract1_id,
        operator_id,
        sponsor_joe_id,
        evt1_id,
        app1_id,
        (SELECT id FROM sponsorship_tiers WHERE event_id = evt1_id AND name = 'Silver' LIMIT 1),
        59900,
        2995,
        'paid',
        now() - interval '1 day'
    WHERE NOT EXISTS (
        SELECT 1 FROM contracts 
        WHERE event_id = evt1_id 
        AND sponsor_id = sponsor_joe_id 
        AND status = 'paid'
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO payments (id, contract_id, amount, platform_fee, operator_payout, status, created_at)
    SELECT
        payment1_id,
        contract1_id,
        59900,
        2995,
        56905,
        'completed',
        now() - interval '12 hours'
    WHERE NOT EXISTS (
        SELECT 1 FROM payments 
        WHERE contract_id = contract1_id 
        AND status = 'completed'
    )
    ON CONFLICT (id) DO NOTHING;

    -- 8. INSERT ACTIVITY LOGS
    INSERT INTO activity_log (user_id, action_type, entity_type, entity_id, metadata, created_at)
    VALUES
        (operator_id, 'application_received', 'application', app1_id, '{"sponsor_name": "Joe''s Bistro & Bar", "event_title": "Summer Blockbuster Night"}'::jsonb, now() - interval '2 hours'),
        (operator_id, 'payment_received', 'payment', payment1_id, '{"sponsor_name": "Joe''s Bistro & Bar", "amount": 59900}'::jsonb, now() - interval '24 hours'),
        (operator_id, 'event_updated', 'event', evt3_id, '{"event_title": "Classic Drive-In"}'::jsonb, now() - interval '3 days')
    ON CONFLICT DO NOTHING;

END $$;
