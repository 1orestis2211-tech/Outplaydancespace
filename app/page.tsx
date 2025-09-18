"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "@/components/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Users, Calendar, DollarSign, TrendingUp, AlertTriangle, BarChart3, PieChart, Activity } from "lucide-react"
import { useData } from "@/lib/data-context"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function DashboardPage() {
  const { students, classes, payments, attendance } = useData()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <Navigation />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-slate-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  const totalStudents = students.length
  const activeStudents = students.filter((s) => s.status === "active").length
  const totalClasses = classes.length
  const pendingPayments = payments.filter((p) => p.status === "pending" || p.status === "overdue").length
  const monthlyRevenue = payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0)
  const overduePayments = payments.filter((p) => p.status === "overdue").length

  // Advanced analytics
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0)
  const paidRevenue = payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0)
  const revenuePercentage = totalRevenue > 0 ? Math.round((paidRevenue / totalRevenue) * 100) : 0

  const todayDate = new Date().toISOString().split("T")[0]
  const todayAttendance = attendance.filter((a) => a.date === todayDate)
  const presentToday = todayAttendance.filter((a) => a.status === "present").length
  const totalExpectedToday = todayAttendance.length
  const attendanceRate = totalExpectedToday > 0 ? Math.round((presentToday / totalExpectedToday) * 100) : 0

  // Class capacity analytics
  const classCapacityData = classes.map((cls) => ({
    name: cls.name,
    current: cls.currentStudents,
    max: cls.maxStudents,
    percentage: Math.round((cls.currentStudents / cls.maxStudents) * 100),
  }))

  // Student status breakdown
  const studentStatusBreakdown = {
    active: students.filter((s) => s.status === "active").length,
    inactive: students.filter((s) => s.status === "inactive").length,
    onHold: students.filter((s) => s.status === "on-hold").length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <Navigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-heading font-bold text-slate-900 mb-2">Welcome back!</h2>
          <p className="text-slate-600 text-lg">Here's what's happening at your dance studio today.</p>
        </div>

        {/* Alert Section */}
        {(overduePayments > 0 || attendanceRate < 70) && (
          <div className="mb-8">
            <Card className="border-l-4 border-l-red-500 bg-red-50/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-2">Attention Required</h3>
                    <div className="space-y-1 text-sm text-red-800">
                      {overduePayments > 0 && (
                        <p>
                          • {overduePayments} overdue payment{overduePayments > 1 ? "s" : ""} need immediate attention
                        </p>
                      )}
                      {attendanceRate < 70 && (
                        <p>
                          • Today's attendance rate is {attendanceRate}% - consider following up with absent students
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Students</CardTitle>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-bold text-slate-900 mb-1">{totalStudents}</div>
              <p className="text-sm text-green-600 font-medium">{activeStudents} active students</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Active Classes</CardTitle>
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Calendar className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-bold text-slate-900 mb-1">{totalClasses}</div>
              <p className="text-sm text-slate-500">Running this month</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Pending Payments</CardTitle>
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-bold text-slate-900 mb-1">{pendingPayments}</div>
              <p className="text-sm text-amber-600 font-medium">
                {overduePayments > 0 ? `${overduePayments} overdue` : "Require attention"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Monthly Revenue</CardTitle>
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-bold text-slate-900 mb-1">${monthlyRevenue}</div>
              <p className="text-sm text-green-600 font-medium">{revenuePercentage}% collected</p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Revenue Analytics */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-heading font-semibold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Revenue Analytics
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">Collection Rate</span>
                    <span className="font-medium">{revenuePercentage}%</span>
                  </div>
                  <Progress value={revenuePercentage} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">${paidRevenue}</div>
                    <div className="text-xs text-slate-500">Collected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-400">${totalRevenue - paidRevenue}</div>
                    <div className="text-xs text-slate-500">Pending</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Analytics */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-heading font-semibold text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  Today's Attendance
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900 mb-1">{attendanceRate}%</div>
                  <div className="text-sm text-slate-500">
                    {presentToday} of {totalExpectedToday} present
                  </div>
                </div>
                <div>
                  <Progress value={attendanceRate} className="h-2" />
                </div>
                <div className="flex justify-center">
                  <Badge
                    variant={attendanceRate >= 80 ? "default" : attendanceRate >= 60 ? "secondary" : "destructive"}
                  >
                    {attendanceRate >= 80 ? "Excellent" : attendanceRate >= 60 ? "Good" : "Needs Attention"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student Status Breakdown */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-heading font-semibold text-slate-900 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-indigo-600" />
                  Student Status
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-slate-600">Active</span>
                  </div>
                  <span className="font-semibold">{studentStatusBreakdown.active}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-slate-600">On Hold</span>
                  </div>
                  <span className="font-semibold">{studentStatusBreakdown.onHold}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="text-sm text-slate-600">Inactive</span>
                  </div>
                  <span className="font-semibold">{studentStatusBreakdown.inactive}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Class Capacity Overview */}
        <div className="mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-heading font-semibold text-slate-900">
                Class Capacity Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classCapacityData.map((cls, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-slate-900">{cls.name}</h4>
                      <span className="text-sm text-slate-500">
                        {cls.current}/{cls.max}
                      </span>
                    </div>
                    <Progress value={cls.percentage} className="h-2 mb-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">{cls.percentage}% full</span>
                      <Badge
                        variant={cls.percentage >= 90 ? "destructive" : cls.percentage >= 70 ? "secondary" : "default"}
                      >
                        {cls.percentage >= 90 ? "Full" : cls.percentage >= 70 ? "Nearly Full" : "Available"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Students */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-heading font-semibold text-slate-900">Recent Students</CardTitle>
                <Link href="/students">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students.slice(0, 4).map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-heading font-semibold text-blue-700">
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
                    <Badge
                      variant={student.status === "active" ? "default" : "secondary"}
                      className={student.status === "active" ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                    >
                      {student.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Today's Classes */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-heading font-semibold text-slate-900">Today's Classes</CardTitle>
                <Link href="/attendance">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                    Take Attendance
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classes.slice(0, 4).map((danceClass) => (
                  <div
                    key={danceClass.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{danceClass.name}</p>
                        <p className="text-sm text-slate-500">
                          {danceClass.instructor} • {danceClass.schedule.startTime} - {danceClass.schedule.endTime}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900">
                        {danceClass.currentStudents}/{danceClass.maxStudents}
                      </p>
                      <p className="text-xs text-slate-500">students</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
