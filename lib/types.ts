export interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  enrollmentDate: string
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  classes: string[]
  status: "active" | "inactive" | "on-hold"
}

export interface DanceClass {
  id: string
  name: string
  instructor: string
  level: "beginner" | "intermediate" | "advanced"
  ageGroup: string
  schedule: {
    day: string
    startTime: string
    endTime: string
  }
  maxStudents: number
  currentStudents: number
  monthlyFee: number
}

export interface Attendance {
  id: string
  studentId: string
  classId: string
  date: string
  status: "present" | "absent" | "late" | "excused"
  notes?: string
}

export interface Payment {
  id: string
  studentId: string
  classId: string
  amount: number
  dueDate: string
  paidDate?: string
  status: "paid" | "pending" | "overdue"
  method?: "cash" | "card" | "bank-transfer"
}
