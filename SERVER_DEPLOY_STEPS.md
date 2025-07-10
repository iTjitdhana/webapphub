# ขั้นตอนการ Deploy บน Server

## วิธีที่ 1: Deploy บน VPS/Server ธรรมดา

### ขั้นตอนที่ 1: เตรียม Server

#### ติดตั้ง Docker บน Ubuntu/Debian
```bash
# อัพเดทระบบ
sudo apt update && sudo apt upgrade -y

# ติดตั้ง Docker
sudo apt install docker.io docker-compose -y

# เริ่มต้น Docker service
sudo systemctl start docker
sudo systemctl enable docker

# เพิ่ม user ไปยัง docker group
sudo usermod -aG docker $USER

# Logout และ login ใหม่ หรือรันคำสั่งนี้
newgrp docker
```

#### ติดตั้ง Docker บน CentOS/RHEL
```bash
# ติดตั้ง Docker
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# เริ่มต้น Docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

### ขั้นตอนที่ 2: อัพโหลดไฟล์ไปยัง Server

#### วิธีที่ 1: ใช้ Git
```bash
# บน local machine
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/your-repo.git
git push -u origin main

# บน server
git clone https://github.com/username/your-repo.git
cd your-repo
```

#### วิธีที่ 2: ใช้ SCP
```bash
# บน local machine
scp -r company-app-directory user@server-ip:/home/user/
```

#### วิธีที่ 3: ใช้ SFTP
```bash
# ใช้ FileZilla หรือ WinSCP
# อัพโหลดโฟลเดอร์ company-app-directory ไปยัง server
```

### ขั้นตอนที่ 3: รัน Application

```bash
# เข้าไปยังโฟลเดอร์โปรเจกต์
cd company-app-directory

# Build Docker image
docker-compose build

# รัน application
docker-compose up -d

# ตรวจสอบสถานะ
docker-compose ps

# ดู logs
docker-compose logs -f app-hub
```

### ขั้นตอนที่ 4: ตั้งค่า Firewall

```bash
# เปิด port 3002
sudo ufw allow 3002
sudo ufw allow 22  # SSH
sudo ufw enable

# หรือใช้ iptables
sudo iptables -A INPUT -p tcp --dport 3002 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
```

### ขั้นตอนที่ 5: ทดสอบ

```bash
# ทดสอบบน server
curl http://localhost:3002

# หรือเปิดเบราว์เซอร์ไปที่
# http://your-server-ip:3002
```

---

## วิธีที่ 2: Deploy บน Cloud Platform

### DigitalOcean App Platform

1. **สร้าง DigitalOcean Account**
2. **สร้าง App**
   - ไปที่ DigitalOcean Dashboard
   - เลือก "Apps" → "Create App"
   - เลือก GitHub repository
   - ตั้งค่า:
     - Build Command: `npm run build`
     - Run Command: `npm start`
     - Port: 3000

### AWS EC2

```bash
# ติดตั้ง Docker บน EC2
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user

# Clone และรัน
git clone https://github.com/username/your-repo.git
cd your-repo/company-app-directory
docker-compose up -d
```

### Google Cloud Platform

```bash
# ติดตั้ง Docker
sudo apt-get update
sudo apt-get install docker.io -y
sudo systemctl start docker
sudo usermod -aG docker $USER

# Clone และรัน
git clone https://github.com/username/your-repo.git
cd your-repo/company-app-directory
docker-compose up -d
```

---

## วิธีที่ 3: ใช้ CI/CD Pipeline

### GitHub Actions

สร้างไฟล์ `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Server

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.KEY }}
        script: |
          cd /home/user/company-app-directory
          git pull
          docker-compose down
          docker-compose build
          docker-compose up -d
```

---

## การตั้งค่า Domain และ SSL

### 1. ซื้อ Domain
- Namecheap, GoDaddy, หรือ registrar อื่น

### 2. ตั้งค่า DNS
```
Type: A
Name: @
Value: [IP ของ server]
```

### 3. ติดตั้ง SSL Certificate

#### ใช้ Let's Encrypt
```bash
# ติดตั้ง Certbot
sudo apt install certbot

# สร้าง certificate
sudo certbot certonly --standalone -d your-domain.com

# Copy certificate
sudo mkdir -p ./ssl
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./ssl/key.pem
```

#### แก้ไข nginx.conf
```nginx
# Uncomment HTTPS section ใน nginx.conf
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    # ... rest of config
}
```

---

## คำสั่งที่มีประโยชน์

### ดูสถานะ
```bash
# ดู containers
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

### Backup
```bash
# Backup image
docker save app-hub:latest > app-hub-backup.tar

# Backup data (ถ้ามี volume)
tar -czf data-backup.tar.gz ./data
```

### Troubleshooting
```bash
# ดู logs
docker-compose logs app-hub

# เข้าไปใน container
docker-compose exec app-hub sh

# รีสตาร์ท
docker-compose restart app-hub

# ลบและสร้างใหม่
docker-compose down
docker-compose up -d
```

---

## การ Monitor และ Maintenance

### ตั้งค่า Auto-restart
```bash
# สร้าง systemd service
sudo nano /etc/systemd/system/app-hub.service

[Unit]
Description=App Hub Docker Compose
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/user/company-app-directory
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target

# เปิดใช้งาน
sudo systemctl enable app-hub.service
sudo systemctl start app-hub.service
```

### ตั้งค่า Log Rotation
```bash
# สร้างไฟล์ /etc/logrotate.d/docker
/home/user/company-app-directory/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
}
```

---

## สรุปขั้นตอน

1. **เตรียม Server** - ติดตั้ง Docker
2. **อัพโหลดไฟล์** - ใช้ Git หรือ SCP
3. **รัน Application** - `docker-compose up -d`
4. **ตั้งค่า Firewall** - เปิด port 3002
5. **ทดสอบ** - เข้าใช้งานที่ http://server-ip:3002
6. **ตั้งค่า Domain** - (optional) ซื้อ domain และ SSL

**ผลลัพธ์:** เว็บจะ accessible จาก internet ที่ http://your-domain.com หรือ http://server-ip:3002 