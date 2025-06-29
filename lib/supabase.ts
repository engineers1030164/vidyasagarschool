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

// Database types (generated from Supabase)
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          role: 'student' | 'teacher' | 'admin' | 'parent'
          phone: string | null
          address: string | null
          date_of_birth: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string | null
          role: 'student' | 'teacher' | 'admin' | 'parent'
          phone?: string | null
          address?: string | null
          date_of_birth?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          role?: 'student' | 'teacher' | 'admin' | 'parent'
          phone?: string | null
          address?: string | null
          date_of_birth?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          user_id: string
          school_id: string
          section_id: string
          student_id: string
          admission_date: string | null
          status: 'active' | 'inactive' | 'graduated' | 'transferred'
          parent_contact: string | null
          emergency_contact: string | null
          medical_info: any | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          school_id: string
          section_id: string
          student_id: string
          admission_date?: string | null
          status?: 'active' | 'inactive' | 'graduated' | 'transferred'
          parent_contact?: string | null
          emergency_contact?: string | null
          medical_info?: any | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          school_id?: string
          section_id?: string
          student_id?: string
          admission_date?: string | null
          status?: 'active' | 'inactive' | 'graduated' | 'transferred'
          parent_contact?: string | null
          emergency_contact?: string | null
          medical_info?: any | null
          created_at?: string
        }
      }
      // Add more table types as needed
    }
  }
}