"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Users,
  Search,
  Plus,
  Edit,
  Phone,
  Mail,
  Calendar,
  UserCheck,
  ArrowLeft,
  Download,
  Filter,
  Trash2,
  UserX,
} from "lucide-react"
import { useData } from "@/lib/data-context"
import { exportStudentsToCSV } from "@/lib/export-utils"
import type { Student } from "@/lib/types"
import Link from "next/link"

export default function StudentsPage() {
  const { students, addStudent, updateStudent, deleteStudent, getStudentClasses } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isBulkActionOpen, setIsBulkActionOpen] = useState(false)
  const [editStudent, setEditStudent] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
    status: "active" as const,
  })
  const [newStudent, setNewStudent] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
    status: "active" as const,
  })

  const handleAddStudent = () => {
    if (!newStudent.firstName || !newStudent.lastName || !newStudent.email) {
      alert("Please fill in all required fields")
      return
    }

    addStudent({
      firstName: newStudent.firstName,
      lastName: newStudent.lastName,
      email: newStudent.email,
      phone: newStudent.phone,
      dateOfBirth: newStudent.dateOfBirth,
      enrollmentDate: new Date().toISOString(),
      emergencyContact: {
        name: newStudent.emergencyContactName,
        phone: newStudent.emergencyContactPhone,
        relationship: newStudent.emergencyContactRelationship,
      },
      classes: [],
      status: newStudent.status,
    })

    setIsAddDialogOpen(false)
    setNewStudent({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelationship: "",
      status: "active",
    })
  }

  const handleEditStudent = () => {
    if (!selectedStudent || !editStudent.firstName || !editStudent.lastName || !editStudent.email) {
      alert("Please fill in all required fields")
      return
    }

    const updatedData = {
      firstName: editStudent.firstName,
      lastName: editStudent.lastName,
      email: editStudent.email,
      phone: editStudent.phone,
      dateOfBirth: editStudent.dateOfBirth,
      emergencyContact: {
        name: editStudent.emergencyContactName,
        phone: editStudent.emergencyContactPhone,
        relationship: editStudent.emergencyContactRelationship,
      },
      status: editStudent.status,
    }

    updateStudent(selectedStudent.id, updatedData)
    setSelectedStudent({ ...selectedStudent, ...updatedData })
    setIsEditDialogOpen(false)
  }

  const handleBulkStatusUpdate = (status: "active" | "inactive" | "on-hold") => {
    selectedStudents.forEach((studentId) => {
      updateStudent(studentId, { status })
    })
    setSelectedStudents([])
    setIsBulkActionOpen(false)
  }

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedStudents.length} students? This action cannot be undone.`)) {
      selectedStudents.forEach((studentId) => {
        deleteStudent(studentId)
      })
      setSelectedStudents([])
      setIsBulkActionOpen(false)
    }
  }

  const handleExport = () => {
    const studentsToExport =
      selectedStudents.length > 0 ? students.filter((s) => selectedStudents.includes(s.id)) : filteredStudents
    exportStudentsToCSV(studentsToExport)
  }

  const openEditDialog = () => {
    if (selectedStudent) {
      setEditStudent({
        firstName: selectedStudent.firstName,
        lastName: selectedStudent.lastName,
        email: selectedStudent.email,
        phone: selectedStudent.phone,
        dateOfBirth: selectedStudent.dateOfBirth,
        emergencyContactName: selectedStudent.emergencyContact.name,
        emergencyContactPhone: selectedStudent.emergencyContact.phone,
        emergencyContactRelationship: selectedStudent.emergencyContact.relationship,
        status: selectedStudent.status,
      })
      setIsEditDialogOpen(true)
    }
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || student.status === statusFilter

    return matchesSearch && matchesStatus
  })

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

  if (selectedStudent) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedStudent(null)}
                  className="text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Students
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={openEditDialog}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Student
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit Student</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="editFirstName">First Name *</Label>
                        <Input
                          id="editFirstName"
                          value={editStudent.firstName}
                          onChange={(e) => setEditStudent({ ...editStudent, firstName: e.target.value })}
                          placeholder="Enter first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editLastName">Last Name *</Label>
                        <Input
                          id="editLastName"
                          value={editStudent.lastName}
                          onChange={(e) => setEditStudent({ ...editStudent, lastName: e.target.value })}
                          placeholder="Enter last name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editEmail">Email *</Label>
                        <Input
                          id="editEmail"
                          type="email"
                          value={editStudent.email}
                          onChange={(e) => setEditStudent({ ...editStudent, email: e.target.value })}
                          placeholder="Enter email address"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editPhone">Phone</Label>
                        <Input
                          id="editPhone"
                          value={editStudent.phone}
                          onChange={(e) => setEditStudent({ ...editStudent, phone: e.target.value })}
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editDateOfBirth">Date of Birth</Label>
                        <Input
                          id="editDateOfBirth"
                          type="date"
                          value={editStudent.dateOfBirth}
                          onChange={(e) => setEditStudent({ ...editStudent, dateOfBirth: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editStatus">Status</Label>
                        <Select
                          value={editStudent.status}
                          onValueChange={(value: "active" | "inactive" | "on-hold") =>
                            setEditStudent({ ...editStudent, status: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="on-hold">On Hold</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-2">
                        <h3 className="text-lg font-medium text-slate-900 mb-4">Emergency Contact</h3>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editEmergencyName">Contact Name</Label>
                        <Input
                          id="editEmergencyName"
                          value={editStudent.emergencyContactName}
                          onChange={(e) => setEditStudent({ ...editStudent, emergencyContactName: e.target.value })}
                          placeholder="Enter contact name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editEmergencyPhone">Contact Phone</Label>
                        <Input
                          id="editEmergencyPhone"
                          value={editStudent.emergencyContactPhone}
                          onChange={(e) => setEditStudent({ ...editStudent, emergencyContactPhone: e.target.value })}
                          placeholder="Enter contact phone"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="editRelationship">Relationship</Label>
                        <Input
                          id="editRelationship"
                          value={editStudent.emergencyContactRelationship}
                          onChange={(e) =>
                            setEditStudent({ ...editStudent, emergencyContactRelationship: e.target.value })
                          }
                          placeholder="e.g., Parent, Guardian, Spouse"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleEditStudent} className="bg-blue-600 hover:bg-blue-700">
                        Save Changes
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </header>

        {/* Student Details */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Student Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xl font-semibold text-blue-700">
                          {selectedStudent.firstName[0]}
                          {selectedStudent.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-slate-900">
                          {selectedStudent.firstName} {selectedStudent.lastName}
                        </CardTitle>
                        <Badge className={getStatusColor(selectedStudent.status)}>{selectedStudent.status}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-500">Email</p>
                        <p className="font-medium text-slate-900">{selectedStudent.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-500">Phone</p>
                        <p className="font-medium text-slate-900">{selectedStudent.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-500">Date of Birth</p>
                        <p className="font-medium text-slate-900">
                          {new Date(selectedStudent.dateOfBirth).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <UserCheck className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-500">Enrollment Date</p>
                        <p className="font-medium text-slate-900">
                          {new Date(selectedStudent.enrollmentDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-slate-900">Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Name</p>
                      <p className="font-medium text-slate-900">{selectedStudent.emergencyContact.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Phone</p>
                      <p className="font-medium text-slate-900">{selectedStudent.emergencyContact.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Relationship</p>
                      <p className="font-medium text-slate-900">{selectedStudent.emergencyContact.relationship}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enrolled Classes */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-slate-900">Enrolled Classes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getStudentClasses(selectedStudent.classes).map((cls) => (
                      <div key={cls.id} className="p-3 bg-slate-50 rounded-lg">
                        <h4 className="font-medium text-slate-900">{cls.name}</h4>
                        <p className="text-sm text-slate-600">{cls.instructor}</p>
                        <p className="text-sm text-slate-500">
                          {cls.schedule.day}s, {cls.schedule.startTime} - {cls.schedule.endTime}
                        </p>
                        <p className="text-sm font-medium text-slate-900 mt-1">${cls.monthlyFee}/month</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    )
  }

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
                Students
              </Button>
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
            <h2 className="text-2xl font-bold text-slate-900">Students</h2>
            <p className="text-slate-600">Manage your dance school students</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export {selectedStudents.length > 0 ? `(${selectedStudents.length})` : "All"}
            </Button>
            {selectedStudents.length > 0 && (
              <Dialog open={isBulkActionOpen} onOpenChange={setIsBulkActionOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Bulk Actions ({selectedStudents.length})</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Bulk Actions</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                      Apply actions to {selectedStudents.length} selected students
                    </p>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent"
                        onClick={() => handleBulkStatusUpdate("active")}
                      >
                        <UserCheck className="w-4 h-4 mr-2" />
                        Mark as Active
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent"
                        onClick={() => handleBulkStatusUpdate("on-hold")}
                      >
                        <UserX className="w-4 h-4 mr-2" />
                        Mark as On Hold
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent"
                        onClick={() => handleBulkStatusUpdate("inactive")}
                      >
                        <UserX className="w-4 h-4 mr-2" />
                        Mark as Inactive
                      </Button>
                      <Button variant="destructive" className="w-full justify-start" onClick={handleBulkDelete}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Students
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={newStudent.firstName}
                      onChange={(e) => setNewStudent({ ...newStudent, firstName: e.target.value })}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={newStudent.lastName}
                      onChange={(e) => setNewStudent({ ...newStudent, lastName: e.target.value })}
                      placeholder="Enter last name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newStudent.phone}
                      onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={newStudent.dateOfBirth}
                      onChange={(e) => setNewStudent({ ...newStudent, dateOfBirth: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newStudent.status}
                      onValueChange={(value: "active" | "inactive" | "on-hold") =>
                        setNewStudent({ ...newStudent, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="on-hold">On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Emergency Contact</h3>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyName">Contact Name</Label>
                    <Input
                      id="emergencyName"
                      value={newStudent.emergencyContactName}
                      onChange={(e) => setNewStudent({ ...newStudent, emergencyContactName: e.target.value })}
                      placeholder="Enter contact name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Contact Phone</Label>
                    <Input
                      id="emergencyPhone"
                      value={newStudent.emergencyContactPhone}
                      onChange={(e) => setNewStudent({ ...newStudent, emergencyContactPhone: e.target.value })}
                      placeholder="Enter contact phone"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="relationship">Relationship</Label>
                    <Input
                      id="relationship"
                      value={newStudent.emergencyContactRelationship}
                      onChange={(e) => setNewStudent({ ...newStudent, emergencyContactRelationship: e.target.value })}
                      placeholder="e.g., Parent, Guardian, Spouse"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddStudent} className="bg-blue-600 hover:bg-blue-700">
                    Add Student
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-slate-600">
                  {filteredStudents.length} students
                </Badge>
                {selectedStudents.length > 0 && (
                  <Badge variant="default" className="bg-blue-100 text-blue-800">
                    {selectedStudents.length} selected
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="hover:shadow-md transition-shadow cursor-pointer relative">
              <div className="absolute top-4 left-4 z-10">
                <Checkbox
                  checked={selectedStudents.includes(student.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedStudents([...selectedStudents, student.id])
                    } else {
                      setSelectedStudents(selectedStudents.filter((id) => id !== student.id))
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <CardContent className="pt-6" onClick={() => setSelectedStudent(student)}>
                <div className="flex items-start justify-between mb-4 ml-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-700">
                        {student.firstName[0]}
                        {student.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-sm text-slate-500">{student.email}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(student.status)}>{student.status}</Badge>
                </div>

                <div className="space-y-2 ml-6">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="w-4 h-4" />
                    {student.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4" />
                    Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="w-4 h-4" />
                    {student.classes.length} classes
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No students found</h3>
            <p className="text-slate-500">Try adjusting your search terms or add a new student.</p>
          </div>
        )}
      </main>
    </div>
  )
}
