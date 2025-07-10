"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
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
  ArrowLeft,
  Building2,
  SettingsIcon,
} from "lucide-react"
import AdminPanel from "./admin-panel"

const initialDepartments = [
  {
    id: "hr",
    name: "ทรัพยากรบุคคล",
    icon: "Users",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description: "จัดการข้อมูลพนักงาน เงินเดือน และการประเมินผล",
    employeeCount: 12,
    apps: [
      {
        id: "hris",
        name: "HRIS",
        description: "ระบบบริหารทรัพยากรบุคคล",
        icon: "Users",
        url: "/hris",
        status: "active",
      },
      {
        id: "payroll",
        name: "Payroll System",
        description: "ระบบคำนวณเงินเดือน",
        icon: "CreditCard",
        url: "/payroll",
        status: "active",
      },
      {
        id: "leave",
        name: "Leave Management",
        description: "ระบบจัดการการลา",
        icon: "Calendar",
        url: "/leave",
        status: "active",
      },
      {
        id: "performance",
        name: "Performance Review",
        description: "ระบบประเมินผลงาน",
        icon: "UserCheck",
        url: "/performance",
        status: "maintenance",
      },
    ],
  },
  {
    id: "finance",
    name: "การเงิน",
    icon: "Calculator",
    color: "text-green-600",
    bgColor: "bg-green-50",
    description: "จัดการงบประมาณ บัญชี และการเงินองค์กร",
    employeeCount: 8,
    apps: [
      {
        id: "erp",
        name: "ERP System",
        description: "ระบบวางแผนทรัพยากรองค์กร",
        icon: "Database",
        url: "/erp",
        status: "active",
      },
      {
        id: "accounting",
        name: "Accounting",
        description: "ระบบบัญชี",
        icon: "Calculator",
        url: "/accounting",
        status: "active",
      },
      {
        id: "budget",
        name: "Budget Planning",
        description: "ระบบวางแผนงบประมาณ",
        icon: "BarChart3",
        url: "/budget",
        status: "active",
      },
      {
        id: "expense",
        name: "Expense Management",
        description: "ระบบจัดการค่าใช้จ่าย",
        icon: "FileText",
        url: "/expense",
        status: "active",
      },
    ],
  },
  {
    id: "it",
    name: "เทคโนโลยีสารสนเทศ",
    icon: "Monitor",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    description: "ดูแลระบบ IT โครงสร้างเครือข่าย และความปลอดภัย",
    employeeCount: 15,
    apps: [
      {
        id: "helpdesk",
        name: "Help Desk",
        description: "ระบบแจ้งปัญหา IT",
        icon: "Headphones",
        url: "/helpdesk",
        status: "active",
      },
      {
        id: "assets",
        name: "Asset Management",
        description: "ระบบจัดการทรัพย์สิน IT",
        icon: "Package",
        url: "/assets",
        status: "active",
      },
      {
        id: "network",
        name: "Network Monitor",
        description: "ระบบตรวจสอบเครือข่าย",
        icon: "Zap",
        url: "/network",
        status: "active",
      },
      {
        id: "security",
        name: "Security Dashboard",
        description: "แดชบอร์ดความปลอดภัย",
        icon: "Shield",
        url: "/security",
        status: "active",
      },
    ],
  },
  {
    id: "marketing",
    name: "การตลาด",
    icon: "Megaphone",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    description: "จัดการลูกค้า แคมเปญ และกิจกรรมทางการตลาด",
    employeeCount: 10,
    apps: [
      {
        id: "crm",
        name: "CRM System",
        description: "ระบบจัดการลูกค้า",
        icon: "Users",
        url: "/crm",
        status: "active",
      },
      {
        id: "campaign",
        name: "Campaign Manager",
        description: "ระบบจัดการแคมเปญ",
        icon: "Target",
        url: "/campaign",
        status: "active",
      },
      {
        id: "analytics",
        name: "Analytics Dashboard",
        description: "แดชบอร์ดวิเคราะห์ข้อมูล",
        icon: "BarChart3",
        url: "/analytics",
        status: "active",
      },
      {
        id: "email",
        name: "Email Marketing",
        description: "ระบบส่งอีเมลการตลาด",
        icon: "Mail",
        url: "/email-marketing",
        status: "active",
      },
    ],
  },
  {
    id: "operations",
    name: "การดำเนินงาน",
    icon: "Settings",
    color: "text-red-600",
    bgColor: "bg-red-50",
    description: "จัดการสินค้าคงคลัง ห่วงโซ่อุปทาน และโครงการ",
    employeeCount: 20,
    apps: [
      {
        id: "inventory",
        name: "Inventory System",
        description: "ระบบจัดการสินค้าคงคลัง",
        icon: "Package",
        url: "/inventory",
        status: "active",
      },
      {
        id: "supply",
        name: "Supply Chain",
        description: "ระบบห่วงโซ่อุปทาน",
        icon: "Truck",
        url: "/supply-chain",
        status: "active",
      },
      {
        id: "quality",
        name: "Quality Control",
        description: "ระบบควบคุมคุณภาพ",
        icon: "UserCheck",
        url: "/quality",
        status: "maintenance",
      },
      {
        id: "projects",
        name: "Project Management",
        description: "ระบบจัดการโครงการ",
        icon: "Calendar",
        url: "/projects",
        status: "active",
      },
    ],
  },
]

// Icon mapping
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

export default function CompanyAppsDirectory() {
  const [currentView, setCurrentView] = useState<"departments" | "apps" | "admin">("departments")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [departments, setDepartments] = useState(initialDepartments)

  const handleDepartmentSelect = (deptId: string) => {
    setSelectedDepartment(deptId)
    setCurrentView("apps")
  }

  const handleBackToDepartments = () => {
    setCurrentView("departments")
    setSelectedDepartment("")
    setSearchTerm("")
  }

  const handleAdminView = () => {
    setCurrentView("admin")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-green-700 font-medium">ใช้งานได้</span>
          </div>
        )
      case "maintenance":
        return (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-xs text-yellow-700 font-medium">ปรับปรุง</span>
          </div>
        )
      case "inactive":
        return (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-xs text-red-700 font-medium">ไม่ใช้งาน</span>
          </div>
        )
      default:
        return (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-xs text-gray-600 font-medium">ไม่ทราบสถานะ</span>
          </div>
        )
    }
  }

  const selectedDept = departments.find((d) => d.id === selectedDepartment)
  const filteredApps = selectedDept
    ? selectedDept.apps.filter(
        (app) =>
          app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : []

  if (currentView === "admin") {
    return <AdminPanel departments={departments} setDepartments={setDepartments} onBack={handleBackToDepartments} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {currentView === "apps" && (
                <Button variant="ghost" onClick={handleBackToDepartments} className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>กลับ</span>
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {currentView === "departments" ? "แผนกองค์กร" : selectedDept?.name}
                </h1>
                <p className="mt-1 text-gray-600">
                  {currentView === "departments" ? "เลือกแผนกเพื่อดูแอพพลิเคชัน" : `แอพพลิเคชันในแผนก${selectedDept?.name}`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {currentView === "departments" && (
                <Button
                  variant="outline"
                  onClick={handleAdminView}
                  className="flex items-center space-x-2 bg-transparent"
                >
                  <SettingsIcon className="h-4 w-4" />
                  <span>จัดการ</span>
                </Button>
              )}
              {currentView === "apps" && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="ค้นหาแอพ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-72 border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {currentView === "departments" ? (
          <div>
            <div className="mb-8 text-center">
              <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h2 className="text-xl font-medium text-gray-900 mb-2">เลือกแผนก</h2>
              <p className="text-gray-600">คลิกที่แผนกเพื่อดูแอพพลิเคชัน</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((dept) => {
                const IconComponent = iconMap[dept.icon as keyof typeof iconMap]
                return (
                  <Card
                    key={dept.id}
                    className="hover:shadow-md transition-shadow cursor-pointer border border-gray-200 hover:border-gray-300"
                    onClick={() => handleDepartmentSelect(dept.id)}
                  >
                    <CardHeader className="text-center pb-4">
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
                      <Badge variant="outline" className="text-gray-600 border-gray-300">
                        {dept.apps.length} แอพ
                      </Badge>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ) : (
          <div>
            {selectedDept && (
              <div className="mb-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`p-3 ${selectedDept.bgColor} rounded-lg`}>
                    {(() => {
                      const IconComponent = iconMap[selectedDept.icon as keyof typeof iconMap]
                      return <IconComponent className={`h-8 w-8 ${selectedDept.color}`} />
                    })()}
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-gray-900">{selectedDept.name}</h2>
                    <p className="text-gray-600">
                      {filteredApps.length} แอพ
                      {searchTerm && ` จากการค้นหา "${searchTerm}"`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {filteredApps.length === 0 ? (
              <div className="text-center py-12">
                <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบแอพ</h3>
                <p className="text-gray-600">{searchTerm ? `ไม่พบแอพที่ตรงกับ "${searchTerm}"` : "ไม่มีแอพในแผนกนี้"}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredApps.map((app, index) => {
                  const IconComponent = iconMap[app.icon as keyof typeof iconMap]
                  return (
                    <Card
                      key={index}
                      className="hover:shadow-md transition-shadow cursor-pointer border border-gray-200 hover:border-gray-300"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <IconComponent className="h-6 w-6 text-gray-600" />
                          </div>
                          {getStatusBadge(app.status)}
                        </div>
                        <CardTitle className="text-base font-medium text-gray-900">{app.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <CardDescription className="text-sm text-gray-600 mb-4 leading-relaxed">
                          {app.description}
                        </CardDescription>
                        <Button
                          variant="outline"
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
            )}
          </div>
        )}
      </div>
    </div>
  )
}
