"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  UserPlus,
  CalendarPlus,
  FileText,
  BarChart3,
  Settings,
  Bell,
} from "lucide-react"
import { mockStudents, mockClasses, mockPayments, mockAttendance } from "@/lib/mock-data"
import Link from "next/link"

export default function AdminDashboard() {
  // Calculate comprehensive stats
  const totalStudents = mockStudents.length
  const activeStudents = mockStudents.filter((s) => s.status === "active").length
  const inactiveStudents = mockStudents.filter((s) => s.status === "inactive").length
  const onHoldStudents = mockStudents.filter((s) => s.status === "on-hold").length

  const totalClasses = mockClasses.length
  const totalRevenue = mockPayments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0)
  const pendingPayments = mockPayments.filter((p) => p.status === "pending").length
  const overduePayments = mockPayments.filter((p) => p.status === "overdue").length

  const totalAttendanceRecords = mockAttendance.length
  const presentCount = mockAttendance.filter((a) => a.status === "present").length
  const attendanceRate = totalAttendanceRecords > 0 ? Math.round((presentCount / totalAttendanceRecords) * 100) : 0

  // Class utilization
  const classUtilization = mockClasses.map((cls) => ({
    ...cls,
    utilizationRate: Math.round((cls.currentStudents / cls.maxStudents) * 100),
  }))

  // Recent activities
  const recentActivities = [
    {
      id: 1,
      type: "enrollment",
      message: "Emma Johnson enrolled in Ballet Basics",
      time: "2 hours ago",
      icon: <UserPlus className="w-4 h-4 text-green-600" />,
    },
    {
      id: 2,
      type: "payment",
      message: "Payment received from Sophia Martinez ($95)",
      time: "4 hours ago",
      icon: <DollarSign className="w-4 h-4 text-blue-600" />,
    },
    {
      id: 3,
      type: "attendance",
      message: "Attendance marked for Jazz Intermediate class",
      time: "6 hours ago",
      icon: <CheckCircle className="w-4 h-4 text-green-600" />,
    },
    {
      id: 4,
      type: "alert",
      message: "Payment overdue for Ava Chen",
      time: "1 day ago",
      icon: <AlertTriangle className="w-4 h-4 text-red-600" />,
    },
  ]

  // Alerts and notifications
  const alerts = [
    {
      id: 1,
      type: "payment",
      message: `${overduePayments} overdue payments require attention`,
      severity: "high",
      action: "View Payments",
      link: "/payments",
    },
    {
      id: 2,
      type: "capacity",
      message: "Hip Hop Advanced class is at 75% capacity",
      severity: "medium",
      action: "View Classes",
      link: "/classes",
    },
    {
      id: 3,
      type: "attendance",
      message: `Overall attendance rate is ${attendanceRate}%`,
      severity: attendanceRate < 80 ? "medium" : "low",
      action: "View Attendance",
      link: "/attendance",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-semibold text-slate-900">DanceFlow Studio</h1>
              </Link>
            </div>
            <nav className="flex items-center gap-6">
              <Link href="/">
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" className="text-slate-900 bg-slate-100">
                Admin
              </Button>
              <Link href="/students">
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                  Students
                </Button>
              </Link>
              <Link href="/attendance">
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                  Attendance
                </Button>
              </Link>
              <Link href="/payments">
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                  Payments
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Admin Dashboard</h2>
            <p className="text-slate-600">Comprehensive overview and management tools</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Students</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{totalStudents}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-green-100 text-green-800 text-xs">{activeStudents} active</Badge>
                <Badge className="bg-yellow-100 text-yellow-800 text-xs">{onHoldStudents} on hold</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">${totalRevenue}</div>
              <p className="text-xs text-green-600 mt-1">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Attendance Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{attendanceRate}%</div>
              <Progress value={attendanceRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Active Classes</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{totalClasses}</div>
              <p className="text-xs text-slate-500 mt-1">Across all levels</p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts & Notifications */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Alerts & Notifications
              </CardTitle>
              <Badge variant="outline">{alerts.length} active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    alert.severity === "high"
                      ? "bg-red-50 border border-red-200"
                      : alert.severity === "medium"
                        ? "bg-yellow-50 border border-yellow-200"
                        : "bg-blue-50 border border-blue-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        alert.severity === "high"
                          ? "bg-red-500"
                          : alert.severity === "medium"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                      }`}
                    />
                    <p className="text-sm font-medium text-slate-900">{alert.message}</p>
                  </div>
                  <Link href={alert.link}>
                    <Button variant="outline" size="sm">
                      {alert.action}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Class Utilization */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">Class Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classUtilization.map((cls) => (
                  <div key={cls.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">{cls.name}</p>
                        <p className="text-sm text-slate-500">{cls.instructor}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">
                          {cls.currentStudents}/{cls.maxStudents}
                        </p>
                        <p className="text-xs text-slate-500">{cls.utilizationRate}% full</p>
                      </div>
                    </div>
                    <Progress value={cls.utilizationRate} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="mt-1">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{activity.message}</p>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/students">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                  <UserPlus className="w-6 h-6" />
                  <span className="text-sm">Add Student</span>
                </Button>
              </Link>
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                <CalendarPlus className="w-6 h-6" />
                <span className="text-sm">New Class</span>
              </Button>
              <Link href="/payments">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                  <DollarSign className="w-6 h-6" />
                  <span className="text-sm">Process Payment</span>
                </Button>
              </Link>
              <Link href="/attendance">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                  <CheckCircle className="w-6 h-6" />
                  <span className="text-sm">Mark Attendance</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
