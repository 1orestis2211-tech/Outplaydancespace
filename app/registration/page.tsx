"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Navigation } from "@/components/navigation"
import { RegistrationImport } from "@/components/registration-import"
import { Users, Search, Plus, UserPlus, Calendar, Clock, DollarSign, XCircle, BookOpen } from "lucide-react"
import { useData } from "@/lib/data-context"
import type { Student } from "@/lib/types"

export default function RegistrationPage() {
  const {
    students,
    classes,
    enrollStudentInClass,
    unenrollStudentFromClass,
    bulkEnrollStudent,
    getStudentClasses,
    getClassStudents,
  } = useData()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedClasses, setSelectedClasses] = useState<string[]>([])
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false)
  const [enrollmentMode, setEnrollmentMode] = useState<"single" | "bulk">("single")

  const filteredStudents = students.filter(
    (student) =>
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const availableClasses = selectedStudent
    ? classes.filter((cls) => !selectedStudent.classes.includes(cls.id))
    : classes

  const handleEnrollment = () => {
    if (!selectedStudent || selectedClasses.length === 0) return

    if (enrollmentMode === "bulk") {
      bulkEnrollStudent(selectedStudent.id, selectedClasses)
    } else {
      selectedClasses.forEach((classId) => {
        enrollStudentInClass(selectedStudent.id, classId)
      })
    }

    setSelectedClasses([])
    setIsEnrollDialogOpen(false)
    // Refresh selected student data
    const updatedStudent = students.find((s) => s.id === selectedStudent.id)
    if (updatedStudent) {
      setSelectedStudent(updatedStudent)
    }
  }

  const handleUnenroll = (classId: string) => {
    if (!selectedStudent) return
    unenrollStudentFromClass(selectedStudent.id, classId)
    // Refresh selected student data
    const updatedStudent = students.find((s) => s.id === selectedStudent.id)
    if (updatedStudent) {
      setSelectedStudent(updatedStudent)
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "on-hold":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-heading font-bold text-slate-900 mb-2">Class Registration</h2>
          <p className="text-slate-600 text-lg">Manage student enrollments and class registrations</p>
        </div>

        <div className="mb-8">
          <RegistrationImport />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Student Selection */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Select Student
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedStudent?.id === student.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                        onClick={() => setSelectedStudent(student)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-900">
                              {student.firstName} {student.lastName}
                            </p>
                            <p className="text-sm text-slate-500">{student.email}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge className={getStatusColor(student.status)} variant="secondary">
                              {student.status}
                            </Badge>
                            <span className="text-xs text-slate-500">{student.classes.length} classes</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Registration Management */}
          <div className="lg:col-span-2">
            {selectedStudent ? (
              <div className="space-y-6">
                {/* Student Info */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-heading font-semibold text-blue-700">
                            {selectedStudent.firstName[0]}
                            {selectedStudent.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <CardTitle className="text-xl text-slate-900">
                            {selectedStudent.firstName} {selectedStudent.lastName}
                          </CardTitle>
                          <p className="text-slate-600">{selectedStudent.email}</p>
                        </div>
                      </div>
                      <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Enroll in Classes
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Enroll {selectedStudent.firstName} in Classes</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {availableClasses.map((cls) => {
                                const enrolledCount = getClassStudents(cls.id).length
                                const isAvailable = enrolledCount < cls.maxStudents

                                return (
                                  <div
                                    key={cls.id}
                                    className={`p-4 border rounded-lg ${
                                      selectedClasses.includes(cls.id)
                                        ? "border-blue-500 bg-blue-50"
                                        : isAvailable
                                          ? "border-slate-200 hover:border-slate-300"
                                          : "border-red-200 bg-red-50 opacity-60"
                                    }`}
                                  >
                                    <div className="flex items-start justify-between mb-3">
                                      <div className="flex items-center gap-2">
                                        <Checkbox
                                          checked={selectedClasses.includes(cls.id)}
                                          onCheckedChange={(checked) => {
                                            if (checked) {
                                              setSelectedClasses([...selectedClasses, cls.id])
                                            } else {
                                              setSelectedClasses(selectedClasses.filter((id) => id !== cls.id))
                                            }
                                          }}
                                          disabled={!isAvailable}
                                        />
                                        <div>
                                          <h4 className="font-medium text-slate-900">{cls.name}</h4>
                                          <p className="text-sm text-slate-600">{cls.instructor}</p>
                                        </div>
                                      </div>
                                      <Badge className={getLevelColor(cls.level)} variant="secondary">
                                        {cls.level}
                                      </Badge>
                                    </div>

                                    <div className="space-y-2 text-sm text-slate-600">
                                      <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{cls.schedule.day}s</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span>
                                          {cls.schedule.startTime} - {cls.schedule.endTime}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        <span>
                                          {enrolledCount}/{cls.maxStudents} students
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4" />
                                        <span>${cls.monthlyFee}/month</span>
                                      </div>
                                    </div>

                                    {!isAvailable && (
                                      <div className="mt-2 text-xs text-red-600 font-medium">Class is full</div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>

                            {availableClasses.length === 0 && (
                              <div className="text-center py-8">
                                <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-slate-900 mb-2">All Classes Enrolled</h3>
                                <p className="text-slate-500">
                                  This student is already enrolled in all available classes.
                                </p>
                              </div>
                            )}

                            <div className="flex justify-end gap-3 pt-4 border-t">
                              <Button variant="outline" onClick={() => setIsEnrollDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button
                                onClick={handleEnrollment}
                                disabled={selectedClasses.length === 0}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                Enroll in {selectedClasses.length} Class{selectedClasses.length !== 1 ? "es" : ""}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                </Card>

                {/* Current Enrollments */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-purple-600" />
                      Current Enrollments ({getStudentClasses(selectedStudent.classes).length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {getStudentClasses(selectedStudent.classes).length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {getStudentClasses(selectedStudent.classes).map((cls) => (
                          <div key={cls.id} className="p-4 border border-slate-200 rounded-lg">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-medium text-slate-900">{cls.name}</h4>
                                <p className="text-sm text-slate-600">{cls.instructor}</p>
                              </div>
                              <Badge className={getLevelColor(cls.level)} variant="secondary">
                                {cls.level}
                              </Badge>
                            </div>

                            <div className="space-y-2 text-sm text-slate-600 mb-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{cls.schedule.day}s</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {cls.schedule.startTime} - {cls.schedule.endTime}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                <span>${cls.monthlyFee}/month</span>
                              </div>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUnenroll(cls.id)}
                              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Unenroll
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">No Current Enrollments</h3>
                        <p className="text-slate-500 mb-4">This student is not enrolled in any classes yet.</p>
                        <Button onClick={() => setIsEnrollDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Enroll in Classes
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="border-0 shadow-lg">
                <CardContent className="pt-16 pb-16">
                  <div className="text-center">
                    <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-slate-900 mb-2">Select a Student</h3>
                    <p className="text-slate-500">
                      Choose a student from the list to manage their class registrations.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
