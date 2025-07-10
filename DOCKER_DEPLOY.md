# คู่มือการ Deploy ด้วย Docker

## ไฟล์ที่สร้างขึ้น

### 1. **Dockerfile**
- Multi-stage build เพื่อลดขนาด image
- ใช้ Node.js 18 Alpine (เล็กและเร็ว)
- สร้าง user ที่ไม่ใช่ root เพื่อความปลอดภัย

### 2. **docker-compose.yml**
- รัน application บน port 3000
- มี Nginx reverse proxy (optional)
- ตั้งค่า restart policy

### 3. **.dockerignore**
- ไม่ copy ไฟล์ที่ไม่จำเป็น
- ลดขนาด image

### 4. **nginx.conf**
- Reverse proxy configuration
- Security headers
- Gzip compression
- Rate limiting

## วิธี Deploy

### ขั้นตอนที่ 1: เตรียม Server

```bash
# ติดตั้ง Docker บน Ubuntu/Debian
sudo apt update
sudo apt install docker.io docker-compose

# เริ่มต้น Docker service
sudo systemctl start docker
sudo systemctl enable docker

# เพิ่ม user ไปยัง docker group
sudo usermod -aG docker $USER
```

### ขั้นตอนที่ 2: Clone โปรเจกต์

```bash
# Clone repository
git clone https://github.com/username/your-repo.git
cd your-repo

# หรือ copy ไฟล์ไปยัง server
scp -r company-app-directory user@server:/home/user/
```

### ขั้นตอนที่ 3: Build และรัน

```bash
# Build Docker image
docker-compose build

# รัน application
docker-compose up -d

# ดู logs
docker-compose logs -f app-hub

# เข้าใช้งานที่ http://localhost:3002
```

### ขั้นตอนที่ 4: ตั้งค่า Domain (Optional)

```bash
# สร้าง SSL certificate ด้วย Let's Encrypt
sudo apt install certbot
sudo certbot certonly --standalone -d your-domain.com

# Copy certificate ไปยัง nginx
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./ssl/key.pem

# แก้ไข nginx.conf และ uncomment HTTPS section
# รีสตาร์ท containers
docker-compose restart
```

## คำสั่งที่มีประโยชน์

### ดูสถานะ
```bash
# ดู containers ที่รันอยู่
docker-compose ps

# ดู logs
docker-compose logs app-hub

# ดู resource usage
docker stats
```

### อัพเดท Application
```bash
# Pull โค้ดใหม่
git pull

# Rebuild และ restart
docker-compose down
docker-compose build
docker-compose up -d
```

### Backup และ Restore
```bash
# Backup image
docker save app-hub:latest > app-hub-backup.tar

# Restore image
docker load < app-hub-backup.tar
```

## การตั้งค่า Production

### 1. Environment Variables
```bash
# สร้างไฟล์ .env
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_URL=https://your-domain.com/api
# หมายเหตุ: Application จะรันบน port 3002 (external)
```

### 2. Security
```bash
# ตั้งค่า firewall
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
sudo ufw enable
```

### 3. Monitoring
```bash
# ติดตั้ง monitoring tools
docker run -d \
  --name prometheus \
  -p 9090:9090 \
  prom/prometheus

docker run -d \
  --name grafana \
  -p 3001:3000 \
  grafana/grafana
```

## Troubleshooting

### ปัญหาที่พบบ่อย

#### 1. Port ถูกใช้งาน
```bash
# เปลี่ยน port ใน docker-compose.yml
ports:
  - "3002:3000"  # เปลี่ยนจาก 3000 เป็น 3002
```

#### 2. Permission denied
```bash
# เปลี่ยน ownership ของไฟล์
sudo chown -R $USER:$USER .
```

#### 3. Memory ไม่พอ
```bash
# เพิ่ม swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

#### 4. Container ไม่รัน
```bash
# ดู logs
docker-compose logs app-hub

# รีสตาร์ท
docker-compose restart app-hub
```

## Performance Optimization

### 1. Multi-stage Build
- ใช้ Dockerfile ที่มีอยู่แล้ว
- ลดขนาด image

### 2. Caching
```yaml
# ใน docker-compose.yml
volumes:
  - node_modules:/app/node_modules
```

### 3. Resource Limits
```yaml
# ใน docker-compose.yml
deploy:
  resources:
    limits:
      memory: 512M
      cpus: '0.5'
```

## สรุป

**ขั้นตอนการ Deploy:**
1. เตรียม server และติดตั้ง Docker
2. Clone โปรเจกต์
3. รัน `docker-compose up -d`
4. ตั้งค่า domain และ SSL (optional)

**ข้อดีของ Docker:**
- Consistent environment
- Easy deployment
- Scalable
- Isolated

**คำแนะนำ:**
- ใช้ Docker Compose สำหรับ development
- ใช้ Kubernetes สำหรับ production scale
- ตั้งค่า monitoring และ logging
- ทำ backup อย่างสม่ำเสมอ 