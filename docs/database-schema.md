# SchoolConnect Database Schema Design

## Database Recommendation: Supabase (PostgreSQL)

For this SchoolConnect application, I recommend **Supabase** as the backend database solution because:

- **PostgreSQL-based**: Robust, ACID-compliant relational database
- **Real-time capabilities**: Perfect for messaging and live updates
- **Built-in authentication**: Seamless integration with your existing auth system
- **Row Level Security (RLS)**: Essential for multi-tenant school data
- **File storage**: For handling attachments, profile pictures, documents
- **Edge functions**: For custom business logic
- **React Native SDK**: Excellent Expo/React Native support

## Core Database Tables

### 1. Authentication & Users

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role user_role NOT NULL,
  phone TEXT,
  address TEXT,
  date_of_birth DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User roles enum
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin', 'parent');
```

### 2. School Structure

```sql
-- Schools table
CREATE TABLE schools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Classes/Grades table
CREATE TABLE classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id),
  name TEXT NOT NULL, -- e.g., "Grade 4"
  academic_year TEXT NOT NULL, -- e.g., "2024-2025"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sections table
CREATE TABLE sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID REFERENCES classes(id),
  name TEXT NOT NULL, -- e.g., "A", "B", "C"
  capacity INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subjects table
CREATE TABLE subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id),
  name TEXT NOT NULL,
  code TEXT, -- e.g., "MATH101"
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. Student Management

```sql
-- Students table
CREATE TABLE students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  school_id UUID REFERENCES schools(id),
  section_id UUID REFERENCES sections(id),
  student_id TEXT UNIQUE NOT NULL, -- e.g., "S-12559"
  admission_date DATE,
  status student_status DEFAULT 'active',
  parent_contact TEXT,
  emergency_contact TEXT,
  medical_info JSONB, -- Store medical conditions, allergies, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE student_status AS ENUM ('active', 'inactive', 'graduated', 'transferred');

-- Parent-Student relationships
CREATE TABLE parent_student_relations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id UUID REFERENCES profiles(id),
  student_id UUID REFERENCES students(id),
  relationship_type TEXT NOT NULL, -- 'father', 'mother', 'guardian'
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4. Teacher Management

```sql
-- Teachers table
CREATE TABLE teachers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  school_id UUID REFERENCES schools(id),
  teacher_id TEXT UNIQUE NOT NULL, -- e.g., "T12345"
  department TEXT,
  qualification TEXT,
  experience_years INTEGER,
  hire_date DATE,
  salary DECIMAL(10,2),
  status teacher_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE teacher_status AS ENUM ('active', 'inactive', 'on_leave');

-- Teacher-Subject assignments
CREATE TABLE teacher_subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID REFERENCES teachers(id),
  subject_id UUID REFERENCES subjects(id),
  section_id UUID REFERENCES sections(id),
  academic_year TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5. Academic Management

```sql
-- Academic terms/semesters
CREATE TABLE academic_terms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id),
  name TEXT NOT NULL, -- e.g., "First Term", "Semester 1"
  academic_year TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Timetable/Schedule
CREATE TABLE timetable (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID REFERENCES sections(id),
  subject_id UUID REFERENCES subjects(id),
  teacher_id UUID REFERENCES teachers(id),
  day_of_week INTEGER NOT NULL, -- 1=Monday, 7=Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room_number TEXT,
  academic_term_id UUID REFERENCES academic_terms(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assignments/Homework
CREATE TABLE assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID REFERENCES teachers(id),
  subject_id UUID REFERENCES subjects(id),
  section_id UUID REFERENCES sections(id),
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ NOT NULL,
  max_marks INTEGER,
  attachment_urls TEXT[], -- Array of file URLs
  status assignment_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE assignment_status AS ENUM ('active', 'completed', 'cancelled');

-- Assignment submissions
CREATE TABLE assignment_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID REFERENCES assignments(id),
  student_id UUID REFERENCES students(id),
  submission_text TEXT,
  attachment_urls TEXT[],
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  marks_obtained INTEGER,
  feedback TEXT,
  graded_at TIMESTAMPTZ,
  graded_by UUID REFERENCES teachers(id)
);
```

### 6. Attendance Management

```sql
-- Attendance records
CREATE TABLE attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  date DATE NOT NULL,
  status attendance_status NOT NULL,
  marked_by UUID REFERENCES teachers(id),
  notes TEXT,
  marked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, date)
);

CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'excused');
```

### 7. Grading & Reports

```sql
-- Exams/Tests
CREATE TABLE exams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID REFERENCES subjects(id),
  section_id UUID REFERENCES sections(id),
  teacher_id UUID REFERENCES teachers(id),
  academic_term_id UUID REFERENCES academic_terms(id),
  title TEXT NOT NULL,
  exam_date DATE NOT NULL,
  max_marks INTEGER NOT NULL,
  duration_minutes INTEGER,
  exam_type exam_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE exam_type AS ENUM ('quiz', 'unit_test', 'midterm', 'final', 'practical');

-- Exam results
CREATE TABLE exam_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID REFERENCES exams(id),
  student_id UUID REFERENCES students(id),
  marks_obtained DECIMAL(5,2) NOT NULL,
  grade TEXT,
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(exam_id, student_id)
);

-- Report cards
CREATE TABLE report_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  academic_term_id UUID REFERENCES academic_terms(id),
  overall_grade TEXT,
  overall_percentage DECIMAL(5,2),
  rank_in_class INTEGER,
  total_students INTEGER,
  attendance_percentage DECIMAL(5,2),
  teacher_remarks TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, academic_term_id)
);
```

### 8. Communication System

```sql
-- Messages/Chat
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id),
  recipient_id UUID REFERENCES profiles(id),
  subject TEXT,
  content TEXT NOT NULL,
  attachment_urls TEXT[],
  is_read BOOLEAN DEFAULT FALSE,
  message_type message_type DEFAULT 'direct',
  parent_message_id UUID REFERENCES messages(id), -- For replies
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE message_type AS ENUM ('direct', 'announcement', 'group');

-- Announcements
CREATE TABLE announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id),
  created_by UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  target_audience TEXT[], -- ['students', 'teachers', 'parents']
  priority announcement_priority DEFAULT 'normal',
  attachment_urls TEXT[],
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE announcement_priority AS ENUM ('low', 'normal', 'high', 'urgent');
```

### 9. Events & Calendar

```sql
-- School events
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id),
  created_by UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  event_type event_type NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location TEXT,
  target_audience TEXT[], -- ['students', 'teachers', 'parents']
  max_participants INTEGER,
  registration_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE event_type AS ENUM ('class', 'exam', 'holiday', 'meeting', 'sports', 'cultural', 'other');

-- Event registrations
CREATE TABLE event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id),
  user_id UUID REFERENCES profiles(id),
  registration_date TIMESTAMPTZ DEFAULT NOW(),
  status registration_status DEFAULT 'registered',
  UNIQUE(event_id, user_id)
);

CREATE TYPE registration_status AS ENUM ('registered', 'attended', 'cancelled');
```

### 10. Transportation

```sql
-- Bus routes
CREATE TABLE bus_routes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id),
  route_name TEXT NOT NULL,
  driver_name TEXT,
  driver_phone TEXT,
  bus_number TEXT,
  capacity INTEGER,
  status route_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE route_status AS ENUM ('active', 'inactive', 'maintenance');

-- Bus stops
CREATE TABLE bus_stops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  route_id UUID REFERENCES bus_routes(id),
  stop_name TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  estimated_time TIME,
  stop_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student bus assignments
CREATE TABLE student_bus_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  route_id UUID REFERENCES bus_routes(id),
  pickup_stop_id UUID REFERENCES bus_stops(id),
  drop_stop_id UUID REFERENCES bus_stops(id),
  assigned_date DATE DEFAULT CURRENT_DATE,
  status assignment_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE assignment_status AS ENUM ('active', 'inactive', 'suspended');

-- Bus tracking (real-time location)
CREATE TABLE bus_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  route_id UUID REFERENCES bus_routes(id),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  speed DECIMAL(5, 2),
  heading INTEGER, -- Direction in degrees
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  driver_id UUID REFERENCES profiles(id)
);
```

### 11. Health Records

```sql
-- Student health records
CREATE TABLE health_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  record_type health_record_type NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  height_cm DECIMAL(5, 2),
  weight_kg DECIMAL(5, 2),
  bmi DECIMAL(4, 2),
  blood_pressure TEXT,
  notes TEXT,
  recorded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE health_record_type AS ENUM ('checkup', 'vaccination', 'illness', 'injury', 'fitness_test');

-- Medical conditions
CREATE TABLE medical_conditions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  condition_name TEXT NOT NULL,
  severity condition_severity,
  medications TEXT[],
  notes TEXT,
  diagnosed_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE condition_severity AS ENUM ('mild', 'moderate', 'severe');
```

### 12. File Management

```sql
-- File uploads/documents
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  uploaded_by UUID REFERENCES profiles(id),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  category document_category,
  related_entity_type TEXT, -- 'student', 'teacher', 'assignment', etc.
  related_entity_id UUID,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE document_category AS ENUM ('profile_picture', 'assignment', 'report', 'certificate', 'medical', 'other');
```

## Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
-- ... (enable for all tables)

-- Example policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Students can view own data" ON students
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Teachers can view their students" ON students
  FOR SELECT USING (
    section_id IN (
      SELECT DISTINCT ts.section_id 
      FROM teacher_subjects ts 
      JOIN teachers t ON t.id = ts.teacher_id 
      WHERE t.user_id = auth.uid()
    )
  );
```

## Indexes for Performance

```sql
-- Critical indexes
CREATE INDEX idx_students_section_id ON students(section_id);
CREATE INDEX idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX idx_messages_recipient_created ON messages(recipient_id, created_at);
CREATE INDEX idx_timetable_section_day ON timetable(section_id, day_of_week);
CREATE INDEX idx_bus_tracking_route_timestamp ON bus_tracking(route_id, timestamp);
```

## Implementation Steps

1. **Set up Supabase project**
2. **Run migration scripts** to create tables
3. **Configure RLS policies** for security
4. **Set up real-time subscriptions** for messaging and tracking
5. **Configure file storage** for documents and images
6. **Implement edge functions** for complex business logic

This schema provides a solid foundation for a production-ready school management system with proper relationships, security, and scalability considerations.