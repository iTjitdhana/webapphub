# คู่มือการ Deploy App Hub ไปยัง Server

## วิธีที่ 1: Vercel (แนะนำ - ง่ายที่สุด)

### ขั้นตอน:
1. **สร้าง Vercel Account**
   - ไปที่ [vercel.com](https://vercel.com)
   - สมัครด้วย GitHub/GitLab/Bitbucket

2. **Push โค้ดไป GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/your-repo.git
   git push -u origin main
   ```

3. **Deploy บน Vercel**
   - ไปที่ Vercel Dashboard
   - คลิก "New Project"
   - เลือก repository
   - Vercel จะ auto-detect Next.js
   - คลิก "Deploy"

### ข้อดี:
- ฟรี tier ดี
- Auto-deploy เมื่อ push code
- CDN ทั่วโลก
- SSL อัตโนมัติ

---

## วิธีที่ 2: DigitalOcean App Platform

### ขั้นตอน:
1. **สร้าง DigitalOcean Account**
2. **สร้าง App**
   - ไปที่ DigitalOcean Dashboard
   - เลือก "Apps" → "Create App"
   - เลือก GitHub repository
   - ตั้งค่า Build Command: `npm run build`
   - ตั้งค่า Run Command: `npm start`

### ข้อดี:
- ราคาถูก
- ควบคุมได้มาก
- หลาย region

---

## วิธีที่ 3: Docker + VPS

### 1. สร้าง Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### 2. สร้าง docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

### 3. Deploy บน VPS
```bash
# บน VPS
git clone https://github.com/username/your-repo.git
cd your-repo
docker-compose up -d
```

---

## วิธีที่ 4: PM2 + VPS

### 1. ติดตั้ง PM2 บน VPS
```bash
npm install -g pm2
```

### 2. สร้าง ecosystem.config.js
```javascript
module.exports = {
  apps: [{
    name: 'app-hub',
    script: 'npm',
    args: 'start',
    cwd: '/path/to/your/app',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

### 3. Deploy
```bash
# บน VPS
git clone https://github.com/username/your-repo.git
cd your-repo
npm install
npm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## การตั้งค่า Environment Variables

### สร้างไฟล์ .env.local
```env
# สำหรับ Production
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

### หรือตั้งค่าใน Vercel/DigitalOcean
- ไปที่ Project Settings
- เลือก Environment Variables
- เพิ่มตัวแปรที่ต้องการ

---

## การตั้งค่า Domain

### 1. ซื้อ Domain
- Namecheap, GoDaddy, หรือ registrar อื่น

### 2. ตั้งค่า DNS
```
Type: A
Name: @
Value: [IP ของ server]
```

### 3. ตั้งค่าใน Vercel/DigitalOcean
- เพิ่ม custom domain
- ตั้งค่า SSL certificate

---

## การ Backup ข้อมูล

### ถ้าใช้ฐานข้อมูล
```bash
# Backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql
```

### ถ้าใช้ localStorage
- ข้อมูลจะหายเมื่อ deploy ใหม่
- แนะนำให้ย้ายไปฐานข้อมูล

---

## การ Monitor และ Logs

### Vercel
- ดู logs ได้ใน Dashboard
- มี analytics และ performance monitoring

### PM2
```bash
pm2 logs app-hub
pm2 monit
```

### Docker
```bash
docker logs container-name
docker stats
```

---

## คำแนะนำสำหรับ Production

### 1. ใช้ฐานข้อมูล
```typescript
// แทน localStorage ด้วย Supabase/Firebase
const [departments, setDepartments] = useState([])
useEffect(() => {
  fetchDepartments() // ดึงจาก API
}, [])
```

### 2. เพิ่ม Error Handling
```typescript
try {
  const response = await fetch('/api/departments')
  if (!response.ok) throw new Error('Failed to fetch')
  const data = await response.json()
  setDepartments(data)
} catch (error) {
  console.error('Error:', error)
  // แสดง error message ให้ user
}
```

### 3. เพิ่ม Loading States
```typescript
const [loading, setLoading] = useState(true)
// แสดง skeleton หรือ spinner
```

### 4. ตั้งค่า Security Headers
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ]
  }
}
```

---

## สรุป

**แนะนำสำหรับเริ่มต้น:**
1. **Vercel** - ง่าย ฟรี เร็ว
2. **DigitalOcean App Platform** - ราคาถูก ควบคุมได้
3. **Docker + VPS** - ควบคุมได้มากที่สุด

**ขั้นตอน:**
1. Push โค้ดไป GitHub
2. Deploy บน platform ที่เลือก
3. ตั้งค่า domain และ SSL
4. Monitor และ optimize 