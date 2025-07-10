# การตั้งค่าฐานข้อมูลสำหรับ App Hub

## ทางเลือกสำหรับฐานข้อมูล

### 1. **Supabase (แนะนำ)**
```sql
-- ตารางแผนก
CREATE TABLE departments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(100) NOT NULL,
  color VARCHAR(100) NOT NULL,
  bg_color VARCHAR(100) NOT NULL,
  description TEXT,
  employee_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ตารางแอพ
CREATE TABLE apps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100) NOT NULL,
  url VARCHAR(500) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. **Prisma + PostgreSQL**
```prisma
// schema.prisma
model Department {
  id            String   @id @default(cuid())
  name          String
  icon          String
  color         String
  bgColor       String
  description   String?
  employeeCount Int      @default(0)
  apps          App[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model App {
  id           String     @id @default(cuid())
  name         String
  description  String?
  icon         String
  url          String
  status       String     @default("active")
  department   Department @relation(fields: [departmentId], references: [id], onDelete: Cascade)
  departmentId String
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
}
```

### 3. **Firebase Firestore**
```javascript
// โครงสร้างข้อมูล
departments: {
  [departmentId]: {
    name: "ทรัพยากรบุคคล",
    icon: "Users",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description: "จัดการข้อมูลพนักงาน",
    employeeCount: 12,
    apps: {
      [appId]: {
        name: "HRIS",
        description: "ระบบบริหารทรัพยากรบุคคล",
        icon: "Users",
        url: "https://hris.company.com",
        status: "active"
      }
    }
  }
}
```

## การใช้งานกับระบบปัจจุบัน

### 1. **API Routes (Next.js)**
```typescript
// app/api/departments/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const departments = await db.department.findMany({
    include: { apps: true }
  })
  return NextResponse.json(departments)
}

export async function POST(request: Request) {
  const data = await request.json()
  const department = await db.department.create({
    data,
    include: { apps: true }
  })
  return NextResponse.json(department)
}
```

### 2. **Custom Hooks**
```typescript
// hooks/useDepartments.ts
import { useState, useEffect } from 'react'

export function useDepartments() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departments')
      const data = await response.json()
      setDepartments(data)
    } catch (error) {
      console.error('Error fetching departments:', error)
    } finally {
      setLoading(false)
    }
  }

  const addDepartment = async (department) => {
    try {
      const response = await fetch('/api/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(department)
      })
      const newDepartment = await response.json()
      setDepartments(prev => [...prev, newDepartment])
    } catch (error) {
      console.error('Error adding department:', error)
    }
  }

  return { departments, loading, addDepartment }
}
```

## การปรับปรุงโค้ดปัจจุบัน

### 1. **page.tsx**
```typescript
// เปลี่ยนจาก useState เป็น custom hook
import { useDepartments } from '@/hooks/useDepartments'

export default function CompanyAppsDirectory() {
  const { departments, loading, addDepartment } = useDepartments()
  // ... โค้ดอื่นๆ
}
```

### 2. **admin-panel.tsx**
```typescript
// ใช้ API calls แทน state management
const handleAddDepartment = async () => {
  try {
    await addDepartment(deptForm)
    setShowDepartmentDialog(false)
    // Reset form
  } catch (error) {
    console.error('Error adding department:', error)
  }
}
```

## ข้อดีของการใช้ฐานข้อมูล

1. **ข้อมูลถาวร** - ไม่หายเมื่อ refresh
2. **Multi-user** - หลายคนใช้งานพร้อมกันได้
3. **Backup & Recovery** - มีระบบสำรองข้อมูล
4. **Analytics** - เก็บสถิติการใช้งาน
5. **Security** - ระบบความปลอดภัย

## ข้อเสียของการใช้ localStorage

1. **ข้อมูลหาย** - เมื่อ clear browser data
2. **Single user** - คนเดียวใช้งานได้
3. **No backup** - ไม่มีระบบสำรอง
4. **Limited storage** - จำกัดพื้นที่เก็บข้อมูล

## คำแนะนำ

สำหรับ **App Hub** ที่ใช้เชื่อมต่อกับเว็บอื่น แนะนำให้ใช้:

1. **Supabase** - ง่าย ฟรี tier ดี
2. **Vercel + Supabase** - deploy ง่าย
3. **Firebase** - ถ้าต้องการ real-time features

เริ่มต้นด้วย localStorage ก่อน แล้วค่อยย้ายไปฐานข้อมูลเมื่อระบบเติบโต 