// Database entity types for SchoolConnect

export interface School {
  id: string
  name: string
  address?: string
  phone?: string
  email?: string
  website?: string
  logo_url?: string
  created_at: string
}

export interface Class {
  id: string
  school_id: string
  name: string
  academic_year: string
  created_at: string
}

export interface Section {
  id: string
  class_id: string
  name: string
  capacity: number
  created_at: string
}

export interface Subject {
  id: string
  school_id: string
  name: string
  code?: string
  description?: string
  created_at: string
}

export interface Student {
  id: string
  user_id: string
  school_id: string
  section_id: string
  student_id: string
  admission_date?: string
  status: 'active' | 'inactive' | 'graduated' | 'transferred'
  parent_contact?: string
  emergency_contact?: string
  medical_info?: any
  created_at: string
}

export interface Teacher {
  id: string
  user_id: string
  school_id: string
  teacher_id: string
  department?: string
  qualification?: string
  experience_years?: number
  hire_date?: string
  salary?: number
  status: 'active' | 'inactive' | 'on_leave'
  created_at: string
}

export interface Assignment {
  id: string
  teacher_id: string
  subject_id: string
  section_id: string
  title: string
  description?: string
  due_date: string
  max_marks?: number
  attachment_urls?: string[]
  status: 'active' | 'completed' | 'cancelled'
  created_at: string
}

export interface AssignmentSubmission {
  id: string
  assignment_id: string
  student_id: string
  submission_text?: string
  attachment_urls?: string[]
  submitted_at: string
  marks_obtained?: number
  feedback?: string
  graded_at?: string
  graded_by?: string
}

export interface Attendance {
  id: string
  student_id: string
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  marked_by: string
  notes?: string
  marked_at: string
}

export interface Message {
  id: string
  sender_id: string
  recipient_id: string
  subject?: string
  content: string
  attachment_urls?: string[]
  is_read: boolean
  message_type: 'direct' | 'announcement' | 'group'
  parent_message_id?: string
  created_at: string
}

export interface Event {
  id: string
  school_id: string
  created_by: string
  title: string
  description?: string
  event_type: 'class' | 'exam' | 'holiday' | 'meeting' | 'sports' | 'cultural' | 'other'
  start_date: string
  end_date?: string
  location?: string
  target_audience?: string[]
  max_participants?: number
  registration_required: boolean
  created_at: string
}

export interface BusRoute {
  id: string
  school_id: string
  route_name: string
  driver_name?: string
  driver_phone?: string
  bus_number?: string
  capacity?: number
  status: 'active' | 'inactive' | 'maintenance'
  created_at: string
}

export interface BusStop {
  id: string
  route_id: string
  stop_name: string
  latitude?: number
  longitude?: number
  estimated_time?: string
  stop_order: number
  created_at: string
}

export interface BusTracking {
  id: string
  route_id: string
  latitude: number
  longitude: number
  speed?: number
  heading?: number
  timestamp: string
  driver_id?: string
}

export interface HealthRecord {
  id: string
  student_id: string
  record_type: 'checkup' | 'vaccination' | 'illness' | 'injury' | 'fitness_test'
  date: string
  description?: string
  height_cm?: number
  weight_kg?: number
  bmi?: number
  blood_pressure?: string
  notes?: string
  recorded_by: string
  created_at: string
}

export interface Exam {
  id: string
  subject_id: string
  section_id: string
  teacher_id: string
  academic_term_id: string
  title: string
  exam_date: string
  max_marks: number
  duration_minutes?: number
  exam_type: 'quiz' | 'unit_test' | 'midterm' | 'final' | 'practical'
  created_at: string
}

export interface ExamResult {
  id: string
  exam_id: string
  student_id: string
  marks_obtained: number
  grade?: string
  remarks?: string
  created_at: string
}