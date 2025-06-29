# Supabase Setup Guide for SchoolConnect

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key

## 2. Environment Variables

Create a `.env` file in your project root:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

## 4. Create Supabase Client

Create `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
```

## 5. Database Migrations

Run the SQL scripts from `database-schema.md` in your Supabase SQL editor to create all tables and policies.

## 6. Authentication Integration

Update your AuthContext to use Supabase:

```typescript
import { supabase } from '@/lib/supabase'

const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  return data
}

const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  
  if (error) throw error
  
  // Create profile
  if (data.user) {
    await supabase.from('profiles').insert({
      id: data.user.id,
      email,
      ...userData
    })
  }
  
  return data
}
```

## 7. Real-time Features

For messaging and live updates:

```typescript
// Subscribe to new messages
const subscription = supabase
  .channel('messages')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'messages' },
    (payload) => {
      console.log('New message:', payload.new)
    }
  )
  .subscribe()
```

## 8. File Storage

Configure storage buckets for:
- Profile pictures
- Assignment attachments
- Documents
- Bus route maps

```typescript
// Upload file
const uploadFile = async (file: File, bucket: string, path: string) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file)
    
  if (error) throw error
  return data
}
```

## 9. Security Considerations

- Enable RLS on all tables
- Create appropriate policies for each user role
- Use service role key only in secure server environments
- Validate all inputs on both client and server side
- Implement proper error handling

## 10. Testing

Create test data for:
- Sample school
- Test students, teachers, parents
- Sample classes and subjects
- Mock timetables and assignments

This setup provides a robust, scalable backend for your SchoolConnect application.