"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, CheckCircle, XCircle, Clock, AlertCircle, ArrowLeft } from "lucide-react"
import { useData } from "@/lib/data-context"
import { Navigation } from "@/components/navigation"
import { Breadcrumbs } from "@/components/breadcrumbs"
import type { DanceClass } from "@/lib/types"

export default function AttendancePage() {
  const { classes, getClassStudents, getAttendanceForDate, updateAttendance } = useData()
  const [selectedClass, setSelectedClass] = useState<DanceClass | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [notes, setNotes] = useState<{ [key: string]: string }>({})

  const handleUpdateAttendance = (studentId: string, status: "present" | "absent" | "late" | "excused") => {
    if (!selectedClass) return
    updateAttendance(studentId, selectedClass.id, selectedDate, status, notes[studentId])
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "absent":
        return <XCircle className="w-5 h-5 text-red-600" />
      case "late":
        return <Clock className="w-5 h-5 text-yellow-600" />
      case "excused":
        return <AlertCircle className="w-5 h-5 text-blue-600" />
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800"
      case "absent":
        return "bg-red-100 text-red-800"
      case "late":
        return "bg-yellow-100 text-yellow-800"
      case "excused":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAttendanceStats = () => {
    if (!selectedClass) return { present: 0, absent: 0, late: 0, excused: 0, total: 0 }

    const classStudents = getClassStudents(selectedClass.id)
    const todayAttendance = classStudents.map((student) =>
      getAttendanceForDate(student.id, selectedClass.id, selectedDate),
    )

    return {
      present: todayAttendance.filter((record) => record?.status === "present").length,
      absent: todayAttendance.filter((record) => record?.status === "absent").length,
      late: todayAttendance.filter((record) => record?.status === "late").length,
      excused: todayAttendance.filter((record) => record?.status === "excused").length,
      total: classStudents.length,
    }
  }

  if (selectedClass) {
    const classStudents = getClassStudents(selectedClass.id)
    const stats = getAttendanceStats()

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation />

        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: "/" },
              { label: "Attendance", href: "/attendance" },
              { label: selectedClass.name },
            ]}
          />

          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" onClick={() => setSelectedClass(null)} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Classes
            </Button>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700">Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-md text-sm"
              />
            </div>
          </div>

          {/* Class Info */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">{selectedClass.name}</h2>
            <p className="text-slate-600">
              {selectedClass.instructor} • {selectedClass.schedule.day}s, {selectedClass.schedule.startTime} -{" "}
              {selectedClass.schedule.endTime}
            </p>
          </div>

          {/* Attendance Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
                  <div className="text-sm text-slate-500">Total</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.present}</div>
                  <div className="text-sm text-slate-500">Present</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
                  <div className="text-sm text-slate-500">Absent</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
                  <div className="text-sm text-slate-500">Late</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.excused}</div>
                  <div className="text-sm text-slate-500">Excused</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Student Attendance List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">
                Student Attendance - {new Date(selectedDate).toLocaleDateString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classStudents.map((student) => {
                  const attendance = getAttendanceForDate(student.id, selectedClass.id, selectedDate)
                  return (
                    <div key={student.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-700">
                            {student.firstName[0]}
                            {student.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-sm text-slate-500">{student.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {attendance && <Badge className={getStatusColor(attendance.status)}>{attendance.status}</Badge>}

                        <div className="flex items-center gap-2">
                          <Button
                            variant={attendance?.status === "present" ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleUpdateAttendance(student.id, "present")}
                            className="w-10 h-10 p-0"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            variant={attendance?.status === "late" ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleUpdateAttendance(student.id, "late")}
                            className="w-10 h-10 p-0"
                          >
                            <Clock className="w-4 h-4" />
                          </Button>
                          <Button
                            variant={attendance?.status === "excused" ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleUpdateAttendance(student.id, "excused")}
                            className="w-10 h-10 p-0"
                          >
                            <AlertCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            variant={attendance?.status === "absent" ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleUpdateAttendance(student.id, "absent")}
                            className="w-10 h-10 p-0"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: "Dashboard", href: "/" }, { label: "Attendance" }]} />

        <div className="flex flex-col gap-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Attendance Tracking</h1>
            <p className="text-gray-600 mt-1">Select a class to mark attendance for today</p>
          </div>

          {/* Date Selector */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Calendar className="w-5 h-5 text-slate-400" />
                <label className="text-sm font-medium text-slate-700">Date:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-md text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((danceClass) => {
              const classStudents = getClassStudents(danceClass.id)
              const attendanceCount = classStudents.filter((student) =>
                getAttendanceForDate(student.id, danceClass.id, selectedDate),
              ).length

              return (
                <Card
                  key={danceClass.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedClass(danceClass)}
                >
                  <CardContent className="pt-6">
                    <div className="mb-4">
                      <h3 className="font-semibold text-slate-900 mb-2">{danceClass.name}</h3>
                      <p className="text-sm text-slate-600">{danceClass.instructor}</p>
                      <p className="text-sm text-slate-500">
                        {danceClass.schedule.day}s, {danceClass.schedule.startTime} - {danceClass.schedule.endTime}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600">{classStudents.length} students</span>
                      </div>
                      <Badge variant="outline" className="text-slate-600">
                        {attendanceCount}/{classStudents.length} marked
                      </Badge>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Level: {danceClass.level}</span>
                        <span className="text-slate-500">{danceClass.ageGroup}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Recent Attendance Summary */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">Recent Attendance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
