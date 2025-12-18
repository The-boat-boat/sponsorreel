# Seed Data Instructions

## Overview

The database schema has been created, but seed data requires auth users to be created first via Supabase Auth API.

## Steps to Seed Data

1. **Create Auth Users**
   - Use Supabase Dashboard → Authentication → Add User
   - Or use the Supabase Auth API to create users
   - Required users:
     - Operator: `operator@example.com` (password: `password123`)
     - Sponsors: See `src/services/mock/mockData.ts` for sponsor emails

2. **After Auth Users Are Created**

   The profiles will be automatically created when users sign up through the application, OR you can insert them manually via SQL:

   ```sql
   -- Insert operator profile (replace USER_ID with actual auth user ID)
   INSERT INTO profiles (id, user_type, email, company_name, company_logo_url, phone, subscription_status, subscription_tier)
   VALUES (
     'USER_ID_FROM_AUTH'::uuid,
     'operator',
     'operator@example.com',
     'Cinema Paradiso',
     'https://...',
     '(555) 123-4567',
     'active',
     'pro'
   );
   ```

3. **Insert Events and Related Data**

   Once profiles exist, you can insert events, sponsors, and other data. See `src/services/mock/mockData.ts` for the complete data structure.

## Alternative: Use Application Signup Flow

The easiest way to seed data is to:
1. Use the application's signup flow to create users
2. The profiles will be automatically created via the `authService.signup()` function
3. Then create events and sponsors through the application UI

## Note

The mock data in `src/services/mock/mockData.ts` contains all the seed data structure. You can reference it when inserting data manually.
