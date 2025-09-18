import { supabase } from './supabase'

// Types for our database tables
export interface Student {
  id: string
  student_id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  date_of_birth?: string
  address?: string
  enrollment_date: string
  status: 'active' | 'inactive' | 'graduated' | 'suspended'
  created_at: string
  updated_at: string
}

export interface Class {
  id: string
  class_name: string
  class_code: string
  description?: string
  capacity: number
  start_date?: string
  end_date?: string
  status: 'active' | 'inactive' | 'completed'
  created_at: string
  updated_at: string
}

export interface Enrollment {
  id: string
  student_id: string
  class_id: string
  enrollment_date: string
  status: 'enrolled' | 'dropped' | 'completed'
  created_at: string
}

export interface Attendance {
  id: string
  student_id: string
  class_id: string
  attendance_date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  notes?: string
  created_at: string
}

export interface Payment {
  id: string
  student_id: string
  amount: number
  payment_date: string
  payment_method?: string
  description?: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  created_at: string
}

// Student operations
export const studentService = {
  async getAll(): Promise<Student[]> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Student | null> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async create(student: Omit<Student, 'id' | 'created_at' | 'updated_at'>): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .insert(student)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Student>): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Class operations
export const classService = {
  async getAll(): Promise<Class[]> {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Class | null> {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async create(classData: Omit<Class, 'id' | 'created_at' | 'updated_at'>): Promise<Class> {
    const { data, error } = await supabase
      .from('classes')
      .insert(classData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Class>): Promise<Class> {
    const { data, error } = await supabase
      .from('classes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Attendance operations
export const attendanceService = {
  async getByClassAndDate(classId: string, date: string): Promise<Attendance[]> {
    const { data, error } = await supabase
      .from('attendance')
      .select(`
        *,
        students:student_id (
          id,
          student_id,
          first_name,
          last_name
        )
      `)
      .eq('class_id', classId)
      .eq('attendance_date', date)
    
    if (error) throw error
    return data || []
  },

  async markAttendance(attendance: Omit<Attendance, 'id' | 'created_at'>): Promise<Attendance> {
    const { data, error } = await supabase
      .from('attendance')
      .upsert(attendance, { 
        onConflict: 'student_id,class_id,attendance_date' 
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Payment operations
export const paymentService = {
  async getByStudent(studentId: string): Promise<Payment[]> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('student_id', studentId)
      .order('payment_date', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async create(payment: Omit<Payment, 'id' | 'created_at'>): Promise<Payment> {
    const { data, error } = await supabase
      .from('payments')
      .insert(payment)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}
