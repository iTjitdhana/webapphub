"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit,
  Users,
  Calculator,
  Monitor,
  Megaphone,
  Settings,
  FileText,
  CreditCard,
  UserCheck,
  BarChart3,
  Shield,
  Headphones,
  Package,
  Truck,
  Target,
  Calendar,
  Mail,
  Database,
  Zap,
  Building2,
} from "lucide-react"

// Available icons for selection
const availableIcons = [
  { name: "Users", icon: Users },
  { name: "Calculator", icon: Calculator },
  { name: "Monitor", icon: Monitor },
  { name: "Megaphone", icon: Megaphone },
  { name: "Settings", icon: Settings },
  { name: "FileText", icon: FileText },
  { name: "CreditCard", icon: CreditCard },
  { name: "UserCheck", icon: UserCheck },
  { name: "BarChart3", icon: BarChart3 },
  { name: "Shield", icon: Shield },
  { name: "Headphones", icon: Headphones },
  { name: "Package", icon: Package },
  { name: "Truck", icon: Truck },
  { name: "Target", icon: Target },
  { name: "Calendar", icon: Calendar },
  { name: "Mail", icon: Mail },
  { name: "Database", icon: Database },
  { name: "Zap", icon: Zap },
  { name: "Building2", icon: Building2 },
]

const iconMap = {
  Users,
  Calculator,
  Monitor,
  Megaphone,
  Settings,
  FileText,
  CreditCard,
  UserCheck,
  BarChart3,
  Shield,
  Headphones,
  Package,
  Truck,
  Target,
  Calendar,
  Mail,
  Database,
  Zap,
  Building2,
}

const colorOptions = [
  { name: "Blue", value: "text-blue-600", bg: "bg-blue-50" },
  { name: "Green", value: "text-green-600", bg: "bg-green-50" },
  { name: "Purple", value: "text-purple-600", bg: "bg-purple-50" },
  { name: "Orange", value: "text-orange-600", bg: "bg-orange-50" },
  { name: "Red", value: "text-red-600", bg: "bg-red-50" },
  { name: "Yellow", value: "text-yellow-600", bg: "bg-yellow-50" },
  { name: "Pink", value: "text-pink-600", bg: "bg-pink-50" },
  { name: "Indigo", value: "text-indigo-600", bg: "bg-indigo-50" },
]

interface Department {
  id: string
  name: string
  icon: string
  color: string
  bgColor: string
  description: string
  employeeCount: number
  apps: App[]
}

interface App {
  id: string
  name: string
  description: string
  icon: string
  url: string
  status: string
}

interface AdminPanelProps {
  departments: Department[]
  setDepartments: (departments: Department[]) => void
  onBack: () => void
}

export default function AdminPanel({ departments, setDepartments, onBack }: AdminPanelProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("")
  const [showDepartmentDialog, setShowDepartmentDialog] = useState(false)
  const [showAppDialog, setShowAppDialog] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [editingApp, setEditingApp] = useState<App | null>(null)

  // Department form state
  const [deptForm, setDeptForm] = useState({
    name: "",
    icon: "Building2",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description: "",
    employeeCount: 0,
  })

  // App form state
  const [appForm, setAppForm] = useState({
    name: "",
    description: "",
    icon: "Package",
    url: "",
    status: "active",
  })

  const handleAddDepartment = () => {
    const newDept: Department = {
      id: Date.now().toString(),
      ...deptForm,
      apps: [],
    }
    setDepartments([...departments, newDept])
    setDeptForm({
      name: "",
      icon: "Building2",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "",
      employeeCount: 0,
    })
    setShowDepartmentDialog(false)
  }

  const handleEditDepartment = (dept: Department) => {
    setEditingDepartment(dept)
    setDeptForm({
      name: dept.name,
      icon: dept.icon,
      color: dept.color,
      bgColor: dept.bgColor,
      description: dept.description,
      employeeCount: dept.employeeCount,
    })
    setShowDepartmentDialog(true)
  }

  const handleUpdateDepartment = () => {
    if (!editingDepartment) return
    const updatedDepts = departments.map((dept) => (dept.id === editingDepartment.id ? { ...dept, ...deptForm } : dept))
    setDepartments(updatedDepts)
    setEditingDepartment(null)
    setShowDepartmentDialog(false)
  }

  const handleDeleteDepartment = (deptId: string) => {
    setDepartments(departments.filter((dept) => dept.id !== deptId))
  }

  const handleAddApp = () => {
    if (!selectedDepartment) return
    const newApp: App = {
      id: Date.now().toString(),
      ...appForm,
    }
    const updatedDepts = departments.map((dept) =>
      dept.id === selectedDepartment ? { ...dept, apps: [...dept.apps, newApp] } : dept,
    )
    setDepartments(updatedDepts)
    setAppForm({
      name: "",
      description: "",
      icon: "Package",
      url: "",
      status: "active",
    })
    setShowAppDialog(false)
  }

  const handleEditApp = (app: App) => {
    setEditingApp(app)
    setAppForm({
      name: app.name,
      description: app.description,
      icon: app.icon,
      url: app.url,
      status: app.status,
    })
    setShowAppDialog(true)
  }

  const handleUpdateApp = () => {
    if (!editingApp || !selectedDepartment) return
    const updatedDepts = departments.map((dept) =>
      dept.id === selectedDepartment
        ? {
            ...dept,
            apps: dept.apps.map((app) => (app.id === editingApp.id ? { ...app, ...appForm } : app)),
          }
        : dept,
    )
    setDepartments(updatedDepts)
    setEditingApp(null)
    setShowAppDialog(false)
  }

  const handleDeleteApp = (appId: string) => {
    if (!selectedDepartment) return
    const updatedDepts = departments.map((dept) =>
      dept.id === selectedDepartment ? { ...dept, apps: dept.apps.filter((app) => app.id !== appId) } : dept,
    )
    setDepartments(updatedDepts)
  }

  const selectedDept = departments.find((d) => d.id === selectedDepartment)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>กลับ</span>
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">จัดการแผนกและแอพ</h1>
                <p className="mt-1 text-gray-600">เพิ่ม แก้ไข หรือลบแผนกและแอพพลิเคชัน</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {!selectedDepartment ? (
          <div>
            {/* Department Management */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-gray-900">จัดการแผนก</h2>
              <Dialog open={showDepartmentDialog} onOpenChange={setShowDepartmentDialog}>
                <DialogTrigger asChild>
                  <Button className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>เพิ่มแผนก</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingDepartment ? "แก้ไขแผนก" : "เพิ่มแผนกใหม่"}</DialogTitle>
                    <DialogDescription>กรอกข้อมูลแผนกที่ต้องการเพิ่ม</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="dept-name">ชื่อแผนก</Label>
                      <Input
                        id="dept-name"
                        value={deptForm.name}
                        onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                        placeholder="เช่น ทรัพยากรบุคคล"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dept-desc">คำอธิบาย</Label>
                      <Textarea
                        id="dept-desc"
                        value={deptForm.description}
                        onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                        placeholder="คำอธิบายแผนก"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dept-employees">จำนวนพนักงาน</Label>
                      <Input
                        id="dept-employees"
                        type="number"
                        value={deptForm.employeeCount}
                        onChange={(e) =>
                          setDeptForm({ ...deptForm, employeeCount: Number.parseInt(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <div>
                      <Label>ไอคอน</Label>
                      <div className="grid grid-cols-6 gap-2 mt-2">
                        {availableIcons.map((iconOption) => {
                          const IconComponent = iconOption.icon
                          return (
                            <button
                              key={iconOption.name}
                              type="button"
                              onClick={() => setDeptForm({ ...deptForm, icon: iconOption.name })}
                              className={`p-2 rounded border ${
                                deptForm.icon === iconOption.name ? "border-blue-500 bg-blue-50" : "border-gray-300"
                              }`}
                            >
                              <IconComponent className="h-5 w-5" />
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    <div>
                      <Label>สี</Label>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {colorOptions.map((colorOption) => (
                          <button
                            key={colorOption.name}
                            type="button"
                            onClick={() =>
                              setDeptForm({ ...deptForm, color: colorOption.value, bgColor: colorOption.bg })
                            }
                            className={`p-2 rounded border text-sm ${
                              deptForm.color === colorOption.value ? "border-blue-500 bg-blue-50" : "border-gray-300"
                            }`}
                          >
                            {colorOption.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Button
                      onClick={editingDepartment ? handleUpdateDepartment : handleAddDepartment}
                      className="w-full"
                      disabled={!deptForm.name}
                    >
                      {editingDepartment ? "อัพเดท" : "เพิ่มแผนก"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((dept) => {
                const IconComponent = iconMap[dept.icon as keyof typeof iconMap]
                return (
                  <Card key={dept.id} className="border border-gray-200">
                    <CardHeader className="text-center pb-4">
                      <div className="flex justify-end space-x-2 mb-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditDepartment(dept)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDepartment(dept.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div
                        className={`mx-auto p-3 ${dept.bgColor} rounded-lg w-16 h-16 flex items-center justify-center mb-4`}
                      >
                        <IconComponent className={`h-8 w-8 ${dept.color}`} />
                      </div>
                      <CardTitle className="text-lg font-medium text-gray-900">{dept.name}</CardTitle>
                      <p className="text-sm text-gray-500">{dept.employeeCount} คน</p>
                    </CardHeader>
                    <CardContent className="text-center pt-0">
                      <CardDescription className="text-sm text-gray-600 mb-4 leading-relaxed">
                        {dept.description}
                      </CardDescription>
                      <div className="space-y-2">
                        <Badge variant="outline" className="text-gray-600 border-gray-300">
                          {dept.apps.length} แอพ
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedDepartment(dept.id)}
                          className="w-full"
                        >
                          จัดการแอพ
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ) : (
          <div>
            {/* App Management */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedDepartment("")}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>กลับ</span>
                </Button>
                <div>
                  <h2 className="text-xl font-medium text-gray-900">จัดการแอพ - {selectedDept?.name}</h2>
                  <p className="text-gray-600">{selectedDept?.apps.length} แอพ</p>
                </div>
              </div>
              <Dialog open={showAppDialog} onOpenChange={setShowAppDialog}>
                <DialogTrigger asChild>
                  <Button className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>เพิ่มแอพ</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingApp ? "แก้ไขแอพ" : "เพิ่มแอพใหม่"}</DialogTitle>
                    <DialogDescription>กรอกข้อมูลแอพพลิเคชันที่ต้องการเพิ่ม</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="app-name">ชื่อแอพ</Label>
                      <Input
                        id="app-name"
                        value={appForm.name}
                        onChange={(e) => setAppForm({ ...appForm, name: e.target.value })}
                        placeholder="เช่น HRIS"
                      />
                    </div>
                    <div>
                      <Label htmlFor="app-desc">คำอธิบาย</Label>
                      <Textarea
                        id="app-desc"
                        value={appForm.description}
                        onChange={(e) => setAppForm({ ...appForm, description: e.target.value })}
                        placeholder="คำอธิบายแอพ"
                      />
                    </div>
                    <div>
                      <Label htmlFor="app-url">URL</Label>
                      <Input
                        id="app-url"
                        value={appForm.url}
                        onChange={(e) => setAppForm({ ...appForm, url: e.target.value })}
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <Label>สถานะ</Label>
                      <Select
                        value={appForm.status}
                        onValueChange={(value) => setAppForm({ ...appForm, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">ใช้งานได้</SelectItem>
                          <SelectItem value="maintenance">ปรับปรุง</SelectItem>
                          <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>ไอคอน</Label>
                      <div className="grid grid-cols-6 gap-2 mt-2">
                        {availableIcons.map((iconOption) => {
                          const IconComponent = iconOption.icon
                          return (
                            <button
                              key={iconOption.name}
                              type="button"
                              onClick={() => setAppForm({ ...appForm, icon: iconOption.name })}
                              className={`p-2 rounded border ${
                                appForm.icon === iconOption.name ? "border-blue-500 bg-blue-50" : "border-gray-300"
                              }`}
                            >
                              <IconComponent className="h-5 w-5" />
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    <Button
                      onClick={editingApp ? handleUpdateApp : handleAddApp}
                      className="w-full"
                      disabled={!appForm.name || !appForm.url}
                    >
                      {editingApp ? "อัพเดท" : "เพิ่มแอพ"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {selectedDept?.apps.map((app) => {
                const IconComponent = iconMap[app.icon as keyof typeof iconMap]
                return (
                  <Card key={app.id} className="border border-gray-200">
                    <CardHeader className="pb-3">
                      <div className="flex justify-end space-x-2 mb-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditApp(app)} className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteApp(app.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <IconComponent className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="flex items-center space-x-1">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              app.status === "active"
                                ? "bg-green-500"
                                : app.status === "maintenance"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                          ></div>
                          <span
                            className={`text-xs font-medium ${
                              app.status === "active"
                                ? "text-green-700"
                                : app.status === "maintenance"
                                  ? "text-yellow-700"
                                  : "text-red-700"
                            }`}
                          >
                            {app.status === "active" ? "ใช้งานได้" : app.status === "maintenance" ? "ปรับปรุง" : "ไม่ใช้งาน"}
                          </span>
                        </div>
                      </div>
                      <CardTitle className="text-base font-medium text-gray-900">{app.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-sm text-gray-600 mb-4 leading-relaxed">
                        {app.description}
                      </CardDescription>
                      <p className="text-xs text-gray-500 mb-4 break-all">{app.url}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-gray-700 border-gray-300 hover:bg-gray-50 bg-transparent"
                        onClick={() => window.open(app.url, "_blank")}
                      >
                        เปิดแอพ
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
