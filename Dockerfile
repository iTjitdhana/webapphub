# ใช้ Node.js 18 Alpine image (เล็กและเร็ว)
FROM node:18-alpine AS base

# ติดตั้ง dependencies ที่จำเป็น
RUN apk add --no-cache libc6-compat

# ตั้งค่า working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# ติดตั้ง pnpm (ถ้าใช้) หรือ npm
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm run build

# Production image
FROM node:18-alpine AS runner
WORKDIR /app

# ติดตั้ง dependencies ที่จำเป็น
RUN apk add --no-cache libc6-compat

# สร้าง user ที่ไม่ใช่ root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=base /app/public ./public
COPY --from=base /app/.next/standalone ./
COPY --from=base /app/.next/static ./.next/static

# เปลี่ยน ownership ให้ nextjs user
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# ตั้งค่า environment
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# รัน application
CMD ["node", "server.js"] 