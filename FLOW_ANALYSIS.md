# การทำงานของระบบ Company App Directory

## โครงสร้างหลัก

### ไฟล์หลัก
- `app/page.tsx` - หน้าหลักของแอพพลิเคชัน
- `app/admin-panel.tsx` - หน้าจัดการสำหรับผู้ดูแลระบบ

## Flow การทำงาน

### 1. หน้าหลัก (`page.tsx`)

#### การเริ่มต้น
```typescript
// ข้อมูลเริ่มต้นของแผนก
const initialDepartments = [
  {
    id: "hr",
    name: "ทรัพยากรบุคคล",
    icon: "Users",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description: "จัดการข้อมูลพนักงาน เงินเดือน และการประเมินผล",
    employeeCount: 12,
    apps: [...]
  },
  // ... แผนกอื่นๆ
]
```

#### State Management
```typescript
const [currentView, setCurrentView] = useState<"departments" | "apps" | "admin">("departments")
const [selectedDepartment, setSelectedDepartment] = useState<string>("")
const [searchTerm, setSearchTerm] = useState("")
const [departments, setDepartments] = useState(initialDepartments)
```

#### การแสดงผล 3 โหมด
1. **departments** - แสดงรายการแผนก
2. **apps** - แสดงแอพในแผนกที่เลือก
3. **admin** - แสดงหน้าจัดการ

### 2. หน้าจัดการ (`admin-panel.tsx`)

#### Props ที่รับ
```typescript
interface AdminPanelProps {
  departments: Department[]
  setDepartments: (departments: Department[]) => void
  onBack: () => void
}
```

#### ฟีเจอร์หลัก
- เพิ่ม/แก้ไข/ลบแผนก
- เพิ่ม/แก้ไข/ลบแอพในแผนก
- เลือกไอคอนและสีสำหรับแผนก/แอพ

## ไฟล์ที่เกี่ยวข้อง

### UI Components (`@/components/ui/`)
```
button.tsx          - ปุ่มต่างๆ
input.tsx           - ช่องกรอกข้อมูล
card.tsx            - การ์ดแสดงข้อมูล
badge.tsx           - แบดจ์แสดงสถานะ
dialog.tsx          - หน้าต่าง popup
label.tsx           - ป้ายกำกับ
textarea.tsx        - ช่องกรอกข้อความยาว
select.tsx          - dropdown เลือกตัวเลือก
```

### Icons (`lucide-react`)
```
Users, Calculator, Monitor, Megaphone, Settings,
FileText, CreditCard, UserCheck, BarChart3, Shield,
Headphones, Package, Truck, Target, Calendar, Mail,
Database, Zap, ArrowLeft, Building2, SettingsIcon,
Plus, Trash2, Edit, Search
```

### Utilities (`@/lib/utils.ts`)
```typescript
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Flow การทำงาน

### 1. การนำทาง
```
หน้าแรก (departments) 
    ↓ คลิกแผนก
หน้าแอพ (apps) 
    ↓ คลิกปุ่มจัดการ
หน้าจัดการ (admin)
    ↓ คลิกปุ่มกลับ
หน้าแรก (departments)
```

### 2. การจัดการข้อมูล
```
หน้าจัดการ
    ↓ เพิ่มแผนก
ฟอร์มสร้างแผนก → บันทึก → อัพเดท state
    ↓ เพิ่มแอพ
ฟอร์มสร้างแอพ → บันทึก → อัพเดท state
```

### 3. การค้นหา
```
หน้าแอพ
    ↓ พิมพ์คำค้นหา
กรองแอพตามชื่อ/คำอธิบาย
    ↓ แสดงผลลัพธ์
```

## โครงสร้างข้อมูล

### Department
```typescript
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
```

### App
```typescript
interface App {
  id: string
  name: string
  description: string
  icon: string
  url: string
  status: string // "active" | "maintenance" | "inactive"
}
```

## การเชื่อมต่อระหว่างไฟล์

```
page.tsx
    ↓ import
AdminPanel
    ↓ props
departments, setDepartments, onBack
    ↓ shared
UI Components, Icons, Utils
```

## สรุป

ระบบนี้เป็น React application ที่ใช้:
- **Next.js** เป็น framework
- **shadcn/ui** สำหรับ UI components
- **lucide-react** สำหรับ icons
- **Tailwind CSS** สำหรับ styling
- **TypeScript** สำหรับ type safety

การทำงานหลักคือการแสดงรายการแผนกและแอพพลิเคชัน พร้อมระบบจัดการสำหรับผู้ดูแลระบบ 