# Seed Data Instructions

## Overview

The database schema has been created, but seed data requires auth users to be created first via Supabase Auth API to maintain referential integrity with the `profiles` table.

## ⚡ Quick Start: Automated Migration (Recommended)

**Use `seed_migration.sql` for the easiest setup** - it automatically creates all auth users and seeds all data in one step!

1. **Copy the migration file**
   - Open `seed_migration.sql` in your code editor
   - Copy the entire content

2. **Run in Supabase**
   - Go to Supabase Dashboard → SQL Editor → New Query
   - Paste the code and click **Run**

3. **Done!** All users are created with password: `Password123!`
   - You can login immediately with any of the seed user emails
   - Change passwords via Supabase Dashboard if needed

**Note:** The migration is idempotent - you can run it multiple times safely.

## Manual Method: Using `seed.sql` (Alternative)

We have provided a comprehensive SQL script to seed your database with all mock data.

1. **Create Auth Users**
   - Go to Supabase Dashboard → Authentication → Users → Add User.
   - Create users with the following emails:
     - `operator@example.com`
     - `joes@example.com`
     - `techhub@example.com`
     - `greenleaf@example.com`
     - `citysports@example.com`
     - `creativearts@example.com`
     - `downtownbooks@example.com`
     - `rustyanchor@example.com`
   - Copy the **User ID** (UUID) for each user you create.

2. **Configure and Run `seed.sql`**
   - Open `seed.sql` in your code editor.
   - At the top of the file, replace the placeholder UUIDs in the `DECLARE` block with the actual User IDs you just copied.
   - Copy the entire content of `seed.sql`.
   - Go to Supabase Dashboard → SQL Editor → New Query.
   - Paste the code and click **Run**.

## Manual Insert Method (Alternative)

If you prefer to insert data manually or only for specific users:

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

## Application Method (Alternative)

The easiest way to seed data organically is to:
1. Use the application's signup flow to create users.
2. The profiles will be automatically created via the `authService.signup()` function.
3. Then create events and sponsors through the application UI.

## Files Reference

- **`seed_migration.sql`** - Automated migration that creates auth users and seeds all data (recommended)
- **`seed.sql`** - Manual seed script that requires pre-created auth users
- **`src/services/mock/mockData.ts`** - Original TypeScript mock data structure used to generate seed scripts

