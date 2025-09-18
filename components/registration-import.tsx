"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileSpreadsheet, CheckCircle } from "lucide-react"
import { useData } from "@/lib/data-context"

interface RegistrationData {
  studentName: string
  email: string
  phone: string
  className: string
  level: string
  instructor: string
  day: string
  time: string
  fee: number
}

export function RegistrationImport() {
  const { students, classes, addStudent, addClass, enrollStudentInClass } = useData()
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [importData, setImportData] = useState<RegistrationData[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [importResults, setImportResults] = useState<{
    studentsAdded: number
    classesAdded: number
    enrollmentsCreated: number
  } | null>(null)

  // Sample data based on the spreadsheet image
  const sampleRegistrationData: RegistrationData[] = [
    {
      studentName: "Emma Thompson",
      email: "emma.thompson@email.com",
      phone: "(555) 101-2345",
      className: "Ballet Basics",
      level: "beginner",
      instructor: "Ms. Anderson",
      day: "Monday",
      time: "16:00-17:00",
      fee: 80,
    },
    {
      studentName: "Sophia Chen",
      email: "sophia.chen@email.com",
      phone: "(555) 102-3456",
      className: "Contemporary",
      level: "intermediate",
      instructor: "Ms. Rodriguez",
      day: "Wednesday",
      time: "17:30-18:30",
      fee: 110,
    },
    {
      studentName: "Ava Williams",
      email: "ava.williams@email.com",
      phone: "(555) 103-4567",
      className: "Jazz Intermediate",
      level: "intermediate",
      instructor: "Mr. Thompson",
      day: "Friday",
      time: "18:00-19:00",
      fee: 95,
    },
    {
      studentName: "Isabella Garcia",
      email: "isabella.garcia@email.com",
      phone: "(555) 104-5678",
      className: "Hip Hop Beginner",
      level: "beginner",
      instructor: "Mr. Davis",
      day: "Saturday",
      time: "10:00-11:00",
      fee: 85,
    },
    {
      studentName: "Mia Rodriguez",
      email: "mia.rodriguez@email.com",
      phone: "(555) 105-6789",
      className: "Ballet Advanced",
      level: "advanced",
      instructor: "Ms. Anderson",
      day: "Tuesday",
      time: "19:00-20:30",
      fee: 130,
    },
  ]

  const processImport = async () => {
    setIsProcessing(true)
    let studentsAdded = 0
    let classesAdded = 0
    let enrollmentsCreated = 0

    try {
      for (const data of importData) {
        // Check if student exists
        let student = students.find(
          (s) =>
            s.email.toLowerCase() === data.email.toLowerCase() ||
            `${s.firstName} ${s.lastName}`.toLowerCase() === data.studentName.toLowerCase(),
        )

        // Create student if doesn't exist
        if (!student) {
          const [firstName, ...lastNameParts] = data.studentName.split(" ")
          const lastName = lastNameParts.join(" ")

          const newStudentData = {
            firstName,
            lastName,
            email: data.email,
            phone: data.phone,
            dateOfBirth: "2010-01-01", // Default date
            enrollmentDate: new Date().toISOString(),
            emergencyContact: {
              name: "Emergency Contact",
              phone: data.phone,
              relationship: "Parent",
            },
            classes: [],
            status: "active" as const,
          }

          addStudent(newStudentData)
          studentsAdded++

          // Get the newly created student
          student = {
            ...newStudentData,
            id: `student-${Date.now()}-${studentsAdded}`,
          }
        }

        // Check if class exists
        let danceClass = classes.find((c) => c.name.toLowerCase() === data.className.toLowerCase())

        // Create class if doesn't exist
        if (!danceClass) {
          const [startTime, endTime] = data.time.split("-")

          const newClassData = {
            name: data.className,
            instructor: data.instructor,
            level: data.level as "beginner" | "intermediate" | "advanced",
            ageGroup: "All Ages",
            schedule: {
              day: data.day,
              startTime: startTime,
              endTime: endTime,
            },
            maxStudents: 15,
            currentStudents: 0,
            monthlyFee: data.fee,
          }

          addClass(newClassData)
          classesAdded++

          // Get the newly created class
          danceClass = {
            ...newClassData,
            id: `class-${Date.now()}-${classesAdded}`,
          }
        }

        // Enroll student in class
        if (student && danceClass && !student.classes.includes(danceClass.id)) {
          enrollStudentInClass(student.id, danceClass.id)
          enrollmentsCreated++
        }
      }

      setImportResults({
        studentsAdded,
        classesAdded,
        enrollmentsCreated,
      })
    } catch (error) {
      console.error("Import failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const loadSampleData = () => {
    setImportData(sampleRegistrationData)
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-green-600" />
          Import Registration Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src="/images/registration-data.png"
              alt="Registration spreadsheet data"
              className="w-32 h-24 object-cover rounded-lg border border-slate-200"
            />
            <div className="flex-1">
              <h4 className="font-medium text-slate-900 mb-2">Spreadsheet Data Available</h4>
              <p className="text-sm text-slate-600 mb-3">
                Import student registration data from your spreadsheet to automatically create students, classes, and
                enrollments.
              </p>
              <Button onClick={loadSampleData} variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Load Sample Data
              </Button>
            </div>
          </div>

          {importData.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-slate-900">Ready to Import ({importData.length} records)</h4>
                <Button onClick={processImport} disabled={isProcessing} className="bg-green-600 hover:bg-green-700">
                  {isProcessing ? "Processing..." : "Import Data"}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                {importData.map((record, index) => (
                  <div key={index} className="p-3 bg-slate-50 rounded-lg text-sm">
                    <div className="font-medium text-slate-900">{record.studentName}</div>
                    <div className="text-slate-600">{record.className}</div>
                    <div className="text-slate-500">
                      {record.level} • ${record.fee}/month
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {importResults && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="font-medium text-green-900">Import Completed Successfully!</h4>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-700">{importResults.studentsAdded}</div>
                  <div className="text-green-600">Students Added</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-700">{importResults.classesAdded}</div>
                  <div className="text-green-600">Classes Created</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-700">{importResults.enrollmentsCreated}</div>
                  <div className="text-green-600">Enrollments</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
