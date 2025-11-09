# 🚀 Quick Start Guide

## Local Development with Docker Compose

### 1. Setup
```bash
# Clone repository
git clone <repository-url>
cd foundation

# Create .env file
cat > .env << EOF
MONGO_URL=mongodb+srv://user:password@cluster.mongodb.net/text-summarizer
JWT_SECRET=your_secret_key_here
GEMINI_API_KEY=your_gemini_key_here
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=
EOF
```

### 2. Start Everything
```bash
# Start all services (MongoDB, Redis, Backend, Frontend)
docker-compose up

# Or run in background
docker-compose up -d
```

### 3. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080

### 4. Useful Commands
```bash
# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down

# Rebuild images
docker-compose up --build

# Remove everything including data
docker-compose down -v
```

---

## Cloud Deployment to Render

### 1. Prerequisites
- GitHub repository
- MongoDB Atlas account (free tier available)
- Redis Cloud account (free tier available)
- Google Gemini API key

### 2. Deploy Backend
```bash
# Push to GitHub
git add .
git commit -m "Deploy to Render"
git push origin main

# On Render Dashboard:
# 1. New Web Service
# 2. Connect GitHub repo
# 3. Name: foundation-summarizer-backend
# 4. Environment: Node
# 5. Build: npm install
# 6. Start: node server.js
# 7. Add environment variables (see README)
# 8. Create Web Service
```

### 3. Deploy Frontend
```bash
# On Render Dashboard:
# 1. New Web Service
# 2. Connect GitHub repo (same)
# 3. Name: foundation-summarizer-frontend
# 4. Environment: Docker
# 5. Dockerfile Path: /frontend/Dockerfile
# 6. Add VITE_API_URL=<backend-url>
# 7. Create Web Service
```

### 4. Verify Deployment
- Open frontend URL
- Try signup/login
- Create a summary
- Check backend logs for Redis connection

---

## Environment Variables

### Backend (.env)
```env
MONGO_URL=mongodb+srv://...
JWT_SECRET=your_secret
GEMINI_API_KEY=your_key
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
FRONTEND_URL=http://localhost:5173
PORT=8080
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8080
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port already in use | `docker-compose down` then restart |
| Redis not connecting | Check REDIS_HOST, REDIS_PORT, REDIS_PASSWORD |
| MongoDB connection failed | Verify MONGO_URL and IP whitelist |
| CORS error | Ensure VITE_API_URL and FRONTEND_URL are correct |
| Build failed | Check Render logs, verify all env vars set |

---

**For detailed information, see README.md**

