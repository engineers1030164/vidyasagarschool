import { supabase } from '@/lib/supabase'
import type { Student, Teacher, Assignment, Attendance, Message, Event } from '@/types/database'

// Student services
export const studentService = {
  async getById(id: string) {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        profiles(*),
        sections(*),
        classes(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        profiles(*),
        sections(*),
        classes(*)
      `)
      .eq('user_id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  async getBySection(sectionId: string) {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        profiles(*)
      `)
      .eq('section_id', sectionId)
      .eq('status', 'active')
    
    if (error) throw error
    return data
  }
}

// Teacher services
export const teacherService = {
  async getById(id: string) {
    const { data, error } = await supabase
      .from('teachers')
      .select(`
        *,
        profiles(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('teachers')
      .select(`
        *,
        profiles(*)
      `)
      .eq('user_id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  async getSubjects(teacherId: string) {
    const { data, error } = await supabase
      .from('teacher_subjects')
      .select(`
        *,
        subjects(*),
        sections(*)
      `)
      .eq('teacher_id', teacherId)
    
    if (error) throw error
    return data
  }
}

// Assignment services
export const assignmentService = {
  async create(assignment: Omit<Assignment, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('assignments')
      .insert(assignment)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getBySection(sectionId: string) {
    const { data, error } = await supabase
      .from('assignments')
      .select(`
        *,
        subjects(*),
        teachers(profiles(*))
      `)
      .eq('section_id', sectionId)
      .eq('status', 'active')
      .order('due_date', { ascending: true })
    
    if (error) throw error
    return data
  },

  async getByStudent(studentId: string) {
    // Get student's section first
    const { data: student } = await supabase
      .from('students')
      .select('section_id')
      .eq('id', studentId)
      .single()
    
    if (!student) throw new Error('Student not found')
    
    return this.getBySection(student.section_id)
  },

  async submit(submission: {
    assignment_id: string
    student_id: string
    submission_text?: string
    attachment_urls?: string[]
  }) {
    const { data, error } = await supabase
      .from('assignment_submissions')
      .insert(submission)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Attendance services
export const attendanceService = {
  async markAttendance(records: Omit<Attendance, 'id' | 'marked_at'>[]) {
    const { data, error } = await supabase
      .from('attendance')
      .upsert(records, { onConflict: 'student_id,date' })
      .select()
    
    if (error) throw error
    return data
  },

  async getByStudent(studentId: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('attendance')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false })
    
    if (startDate) query = query.gte('date', startDate)
    if (endDate) query = query.lte('date', endDate)
    
    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getAttendanceStats(studentId: string, month?: string) {
    const { data, error } = await supabase
      .rpc('get_attendance_stats', {
        student_id: studentId,
        month_filter: month
      })
    
    if (error) throw error
    return data
  }
}

// Message services
export const messageService = {
  async send(message: Omit<Message, 'id' | 'created_at' | 'is_read'>) {
    const { data, error } = await supabase
      .from('messages')
      .insert({ ...message, is_read: false })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getConversation(userId1: string, userId2: string) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!sender_id(*),
        recipient:profiles!recipient_id(*)
      `)
      .or(`and(sender_id.eq.${userId1},recipient_id.eq.${userId2}),and(sender_id.eq.${userId2},recipient_id.eq.${userId1})`)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data
  },

  async getRecentChats(userId: string) {
    const { data, error } = await supabase
      .rpc('get_recent_chats', { user_id: userId })
    
    if (error) throw error
    return data
  },

  async markAsRead(messageId: string) {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId)
    
    if (error) throw error
  }
}

// Event services
export const eventService = {
  async create(event: Omit<Event, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getByDateRange(startDate: string, endDate: string, schoolId?: string) {
    let query = supabase
      .from('events')
      .select('*')
      .gte('start_date', startDate)
      .lte('start_date', endDate)
      .order('start_date', { ascending: true })
    
    if (schoolId) query = query.eq('school_id', schoolId)
    
    const { data, error } = await query
    if (error) throw error
    return data
  },

  async register(eventId: string, userId: string) {
    const { data, error } = await supabase
      .from('event_registrations')
      .insert({
        event_id: eventId,
        user_id: userId,
        status: 'registered'
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Bus tracking services
export const busService = {
  async getRoutes(schoolId: string) {
    const { data, error } = await supabase
      .from('bus_routes')
      .select(`
        *,
        bus_stops(*)
      `)
      .eq('school_id', schoolId)
      .eq('status', 'active')
    
    if (error) throw error
    return data
  },

  async getLatestLocation(routeId: string) {
    const { data, error } = await supabase
      .from('bus_tracking')
      .select('*')
      .eq('route_id', routeId)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single()
    
    if (error) throw error
    return data
  },

  async updateLocation(tracking: {
    route_id: string
    latitude: number
    longitude: number
    speed?: number
    heading?: number
    driver_id?: string
  }) {
    const { data, error } = await supabase
      .from('bus_tracking')
      .insert(tracking)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Real-time subscriptions
export const subscriptions = {
  messages: (userId: string, callback: (payload: any) => void) => {
    return supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `recipient_id=eq.${userId}`
      }, callback)
      .subscribe()
  },

  busTracking: (routeId: string, callback: (payload: any) => void) => {
    return supabase
      .channel('bus_tracking')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'bus_tracking',
        filter: `route_id=eq.${routeId}`
      }, callback)
      .subscribe()
  },

  announcements: (schoolId: string, callback: (payload: any) => void) => {
    return supabase
      .channel('announcements')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'announcements',
        filter: `school_id=eq.${schoolId}`
      }, callback)
      .subscribe()
  }
}