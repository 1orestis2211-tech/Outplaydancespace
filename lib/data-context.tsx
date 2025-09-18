"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { mockStudents, mockClasses, mockAttendance, mockPayments } from "./mock-data"
import type { Student, DanceClass, Attendance, Payment } from "./types"

interface DataContextType {
  // Data
  students: Student[]
  classes: DanceClass[]
  attendance: Attendance[]
  payments: Payment[]

  // Student methods
  addStudent: (student: Omit<Student, "id">) => void
  updateStudent: (id: string, student: Partial<Student>) => void
  deleteStudent: (id: string) => void

  // Class methods
  addClass: (danceClass: Omit<DanceClass, "id">) => void
  updateClass: (id: string, danceClass: Partial<DanceClass>) => void
  deleteClass: (id: string) => void

  // Enrollment methods
  enrollStudentInClass: (studentId: string, classId: string) => void
  unenrollStudentFromClass: (studentId: string, classId: string) => void
  bulkEnrollStudent: (studentId: string, classIds: string[]) => void

  // Attendance methods
  updateAttendance: (
    studentId: string,
    classId: string,
    date: string,
    status: "present" | "absent" | "late" | "excused",
    notes?: string,
  ) => void

  // Payment methods
  updatePaymentStatus: (
    paymentId: string,
    status: "paid" | "pending" | "overdue",
    method?: "cash" | "card" | "bank-transfer",
  ) => void

  // Utility methods
  getStudent: (id: string) => Student | undefined
  getClass: (id: string) => DanceClass | undefined
  getStudentClasses: (classIds: string[]) => DanceClass[]
  getClassStudents: (classId: string) => Student[]
  getAttendanceForDate: (studentId: string, classId: string, date: string) => Attendance | undefined
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>(mockStudents)
  const [classes, setClasses] = useState<DanceClass[]>(mockClasses)
  const [attendance, setAttendance] = useState<Attendance[]>(mockAttendance)
  const [payments, setPayments] = useState<Payment[]>(mockPayments)

  // Student methods
  const addStudent = (studentData: Omit<Student, "id">) => {
    const newStudent: Student = {
      ...studentData,
      id: `student-${Date.now()}`,
    }
    setStudents((prev) => [...prev, newStudent])
  }

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents((prev) => prev.map((student) => (student.id === id ? { ...student, ...updates } : student)))
  }

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((student) => student.id !== id))
  }

  // Class methods
  const addClass = (classData: Omit<DanceClass, "id">) => {
    const newClass: DanceClass = {
      ...classData,
      id: `class-${Date.now()}`,
    }
    setClasses((prev) => [...prev, newClass])
  }

  const updateClass = (id: string, updates: Partial<DanceClass>) => {
    setClasses((prev) => prev.map((danceClass) => (danceClass.id === id ? { ...danceClass, ...updates } : danceClass)))
  }

  const deleteClass = (id: string) => {
    setClasses((prev) => prev.filter((danceClass) => danceClass.id !== id))
    // Also remove class from students' enrolled classes
    setStudents((prev) =>
      prev.map((student) => ({
        ...student,
        classes: student.classes.filter((classId) => classId !== id),
      })),
    )
    // Remove related attendance and payment records
    setAttendance((prev) => prev.filter((record) => record.classId !== id))
    setPayments((prev) => prev.filter((payment) => payment.classId !== id))
  }

  // Enrollment methods
  const enrollStudentInClass = (studentId: string, classId: string) => {
    // Update student's classes array
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId && !student.classes.includes(classId)
          ? { ...student, classes: [...student.classes, classId] }
          : student,
      ),
    )

    // Update class current students count
    setClasses((prev) =>
      prev.map((danceClass) =>
        danceClass.id === classId ? { ...danceClass, currentStudents: danceClass.currentStudents + 1 } : danceClass,
      ),
    )

    // Create payment record for the enrollment
    const student = students.find((s) => s.id === studentId)
    const danceClass = classes.find((c) => c.id === classId)
    if (student && danceClass) {
      const newPayment: Payment = {
        id: `payment-${Date.now()}-${Math.random()}`,
        studentId,
        classId,
        amount: danceClass.monthlyFee,
        dueDate: new Date().toISOString().split("T")[0],
        status: "pending",
      }
      setPayments((prev) => [...prev, newPayment])
    }
  }

  const unenrollStudentFromClass = (studentId: string, classId: string) => {
    // Update student's classes array
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId ? { ...student, classes: student.classes.filter((id) => id !== classId) } : student,
      ),
    )

    // Update class current students count
    setClasses((prev) =>
      prev.map((danceClass) =>
        danceClass.id === classId
          ? { ...danceClass, currentStudents: Math.max(0, danceClass.currentStudents - 1) }
          : danceClass,
      ),
    )

    // Remove related attendance and payment records
    setAttendance((prev) => prev.filter((record) => !(record.studentId === studentId && record.classId === classId)))
    setPayments((prev) => prev.filter((payment) => !(payment.studentId === studentId && payment.classId === classId)))
  }

  const bulkEnrollStudent = (studentId: string, classIds: string[]) => {
    classIds.forEach((classId) => {
      enrollStudentInClass(studentId, classId)
    })
  }

  // Attendance methods
  const updateAttendance = (
    studentId: string,
    classId: string,
    date: string,
    status: "present" | "absent" | "late" | "excused",
    notes?: string,
  ) => {
    const existingRecord = attendance.find(
      (record) => record.studentId === studentId && record.classId === classId && record.date === date,
    )

    if (existingRecord) {
      setAttendance((prev) =>
        prev.map((record) =>
          record.id === existingRecord.id ? { ...record, status, notes: notes || record.notes } : record,
        ),
      )
    } else {
      const newRecord: Attendance = {
        id: `attendance-${Date.now()}`,
        studentId,
        classId,
        date,
        status,
        notes,
      }
      setAttendance((prev) => [...prev, newRecord])
    }
  }

  // Payment methods
  const updatePaymentStatus = (
    paymentId: string,
    status: "paid" | "pending" | "overdue",
    method?: "cash" | "card" | "bank-transfer",
  ) => {
    setPayments((prev) =>
      prev.map((payment) =>
        payment.id === paymentId
          ? {
              ...payment,
              status,
              paidDate: status === "paid" ? new Date().toISOString().split("T")[0] : undefined,
              method: status === "paid" ? method : payment.method,
            }
          : payment,
      ),
    )
  }

  // Utility methods
  const getStudent = (id: string) => students.find((s) => s.id === id)
  const getClass = (id: string) => classes.find((c) => c.id === id)
  const getStudentClasses = (classIds: string[]) => classes.filter((cls) => classIds.includes(cls.id))
  const getClassStudents = (classId: string) => students.filter((student) => student.classes.includes(classId))
  const getAttendanceForDate = (studentId: string, classId: string, date: string) => {
    return attendance.find(
      (record) => record.studentId === studentId && record.classId === classId && record.date === date,
    )
  }

  const value: DataContextType = {
    students,
    classes,
    attendance,
    payments,
    addStudent,
    updateStudent,
    deleteStudent,
    addClass,
    updateClass,
    deleteClass,
    enrollStudentInClass,
    unenrollStudentFromClass,
    bulkEnrollStudent,
    updateAttendance,
    updatePaymentStatus,
    getStudent,
    getClass,
    getStudentClasses,
    getClassStudents,
    getAttendanceForDate,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
