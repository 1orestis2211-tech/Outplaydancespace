import type { Student, Payment, Attendance } from "./types"

export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          // Handle nested objects and arrays
          if (typeof value === "object" && value !== null) {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`
          }
          // Escape commas and quotes in strings
          if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value || ""
        })
        .join(","),
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}-${new Date().toISOString().split("T")[0]}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const exportStudentsToCSV = (students: Student[]) => {
  const exportData = students.map((student) => ({
    "First Name": student.firstName,
    "Last Name": student.lastName,
    Email: student.email,
    Phone: student.phone,
    "Date of Birth": student.dateOfBirth,
    "Enrollment Date": student.enrollmentDate,
    Status: student.status,
    "Emergency Contact Name": student.emergencyContact.name,
    "Emergency Contact Phone": student.emergencyContact.phone,
    "Emergency Contact Relationship": student.emergencyContact.relationship,
    "Number of Classes": student.classes.length,
  }))

  exportToCSV(exportData, "students")
}

export const exportPaymentsToCSV = (payments: Payment[], students: Student[]) => {
  const exportData = payments.map((payment) => {
    const student = students.find((s) => s.id === payment.studentId)
    return {
      "Student Name": student ? `${student.firstName} ${student.lastName}` : "Unknown",
      "Student Email": student?.email || "Unknown",
      Amount: payment.amount,
      "Due Date": payment.dueDate,
      "Paid Date": payment.paidDate || "Not Paid",
      Status: payment.status,
      "Payment Method": payment.method || "N/A",
    }
  })

  exportToCSV(exportData, "payments")
}

export const exportAttendanceToCSV = (attendance: Attendance[], students: Student[]) => {
  const exportData = attendance.map((record) => {
    const student = students.find((s) => s.id === record.studentId)
    return {
      "Student Name": student ? `${student.firstName} ${student.lastName}` : "Unknown",
      "Student Email": student?.email || "Unknown",
      Date: record.date,
      Status: record.status,
      Notes: record.notes || "",
    }
  })

  exportToCSV(exportData, "attendance")
}
