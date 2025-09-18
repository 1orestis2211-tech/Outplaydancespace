# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `school-management-system`
   - Database Password: (choose a strong password)
   - Region: (choose closest to your users)
6. Click "Create new project"

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`)

## 3. Set Up Environment Variables

Create a `.env.local` file in your project root with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Important:** Replace the placeholder values with your actual Supabase credentials.

## 4. Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `lib/database-schema.sql`
3. Paste it into the SQL editor
4. Click **Run** to create all tables and relationships

## 5. Test the Connection

Your Next.js app should now be able to connect to Supabase. The database service functions are already set up in `lib/database.ts`.

## 6. Deploy to Production

### Option A: Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Deploy!

### Option B: Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Connect your GitHub repository
4. Add environment variables in Netlify dashboard
5. Deploy!

## 7. Security Notes

- Never commit your `.env.local` file to version control
- The `NEXT_PUBLIC_` variables are safe to expose in the browser
- Keep your `SUPABASE_SERVICE_ROLE_KEY` secret - it has admin privileges
- Consider setting up Row Level Security (RLS) policies for production

## 8. Next Steps

- Customize the database schema in `lib/database-schema.sql` as needed
- Update the TypeScript types in `lib/database.ts` if you modify the schema
- Add authentication if needed (Supabase Auth is easy to integrate)
- Set up proper RLS policies for multi-user scenarios

Your school management system is now ready with a real database!
