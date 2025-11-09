# 📝 AI-Powered Text Summarization Application

A full-stack web application that leverages Google's Gemini AI to generate intelligent text summaries with Redis caching for optimal performance and cost efficiency. Fully containerized with Docker and ready for cloud deployment.

![Tech Stack](https://img.shields.io/badge/React-19.1.1-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB%20Atlas-Cloud-brightgreen)
![Redis](https://img.shields.io/badge/Redis%20Cloud-5.9.0-red)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue)
![AI](https://img.shields.io/badge/AI-Google%20Gemini-orange)
![Deployment](https://img.shields.io/badge/Deployment-Render-purple)

## 📖 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Docker Setup](#-docker-setup)
- [Deployment to Render](#-deployment-to-render)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Usage Guide](#-usage-guide)
- [Development](#-development)
- [Redis Caching Strategy](#-redis-caching-strategy)
- [Security Features](#-security-features)
- [Environment Variables](#-environment-variables)
- [Troubleshooting](#-troubleshooting)
- [Performance Metrics](#-performance-metrics)
- [Contributing](#-contributing)

## 🌟 Features

- **🤖 AI-Powered Summarization**: Utilizes Google Gemini AI to generate concise, intelligent summaries
- **⚡ Redis Caching**: 
  - AI summaries cached for 7 days (saves API costs)
  - User summaries list cached for 5 minutes (faster dashboard loading)
  - Smart cache invalidation on data changes
- **🔄 Regenerate Functionality**: Force fresh AI summaries by bypassing cache
- **🔐 User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **📊 Summary History**: View and manage all your generated summaries
- **📋 Copy to Clipboard**: One-click copy functionality for summaries
- **🛡️ Rate Limiting**: Redis-backed rate limiting to prevent abuse
  - General API: 100 requests per 15 minutes
  - AI Operations: 20 requests per hour
  - Authentication: 5 requests per 15 minutes
- **🎨 Modern UI**: Responsive design with Tailwind CSS

## 🏗️ Architecture

### Tech Stack

#### Frontend
- **React 19.1.1** - UI library
- **Vite 7.1.7** - Build tool and dev server
- **React Router DOM 7.9.4** - Client-side routing
- **Tailwind CSS 3.4.18** - Utility-first CSS framework
- **@react-oauth/google** - Google OAuth integration

#### Backend
- **Node.js** with **Express 5.1.0** - Web framework
- **MongoDB 8.19.2** (Mongoose) - Database
- **Redis 5.9.0** - Caching and rate limiting
- **Google Generative AI 0.24.1** - Gemini AI integration
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

### System Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   React     │────────▶│   Express    │────────▶│   MongoDB   │
│  Frontend   │         │   Backend    │         │  Database   │
└─────────────┘         └──────────────┘         └─────────────┘
                               │
                               │
                        ┌──────┴──────┐
                        │             │
                   ┌────▼────┐   ┌────▼─────┐
                   │  Redis  │   │  Gemini  │
                   │  Cache  │   │    AI    │
                   └─────────┘   └──────────┘
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas account)
- **Redis** (local installation or cloud service)
- **Google Gemini API Key** (from [Google AI Studio](https://makersuite.google.com/app/apikey))

## 🚀 Installation & Setup

You can run this application in three ways:

### Option 1: Docker Compose (Recommended for Local Development) 🐳

**Fastest way to get started!** Docker handles all dependencies automatically.

```bash
# 1. Clone the repository
git clone <repository-url>
cd foundation

# 2. Create .env file with your credentials
cat > .env << EOF
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/text-summarizer
JWT_SECRET=your_super_secret_jwt_key_here
GEMINI_API_KEY=your_gemini_api_key_here
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=
EOF

# 3. Start all services (MongoDB, Redis, Backend, Frontend)
docker-compose up

# 4. Access the application
# Frontend: http://localhost:5173
# Backend: http://localhost:8080
```

**What Docker Compose does:**
- ✅ Starts MongoDB container
- ✅ Starts Redis container
- ✅ Builds and starts Backend (with hot reload)
- ✅ Builds and starts Frontend (with hot reload)
- ✅ Sets up networking between services
- ✅ Manages volumes for data persistence

**Useful Docker Commands:**
```bash
# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop all services
docker-compose down

# Stop and remove volumes (clears all data)
docker-compose down -v

# Rebuild images
docker-compose up --build
```

### Option 2: Cloud Deployment (Render) 🌐

**Deploy to production with automatic CI/CD!**

See [Deployment to Render](#-deployment-to-render) section below.

### Option 3: Manual Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd foundation
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env
```

Edit `backend/.env` with your credentials:

```env
# MongoDB Connection
MONGO_URL=mongodb://localhost:27017/text-summarizer
# Or use MongoDB Atlas:
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/text-summarizer

# JWT Secret (use a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here_change_this

# Google Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Redis Configuration (optional if using default localhost:6379)
REDIS_HOST=localhost
REDIS_PORT=6379
# REDIS_PASSWORD=your_redis_password (if required)

# Server Port
PORT=8080
```

#### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

#### 4. Install and Start Redis

#### On Windows (WSL):
```bash
# Install Redis
sudo apt update
sudo apt install redis-server

# Start Redis
sudo service redis-server start

# Verify Redis is running
redis-cli ping
# Should return: PONG
```

#### 5. Start MongoDB

**Local MongoDB:**
```bash
# Start MongoDB service
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

**MongoDB Atlas:**
- Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get your connection string and add it to `.env`

## 🐳 Docker Setup

### Multi-Stage Dockerfiles

Both frontend and backend use optimized multi-stage Dockerfiles:

#### Frontend Dockerfile
- **Stage 1 (Development)**: Vite dev server with hot reload
- **Stage 2 (Build)**: Builds optimized production bundle
- **Stage 3 (Production)**: Lightweight Node.js server using `serve`

**Key Feature**: `VITE_API_URL` is passed as a build argument during the build stage, ensuring the correct backend URL is embedded in the production bundle.

```dockerfile
ARG VITE_API_URL=http://localhost:8080
RUN VITE_API_URL=$VITE_API_URL npm run build
```

#### Backend Dockerfile
- **Stage 1 (Development)**: Full dependencies with nodemon for hot reload
- **Stage 2 (Dependencies)**: Production dependencies only
- **Stage 3 (Production)**: Minimal production image with non-root user

**Key Feature**: Runtime environment variables are read when the app starts, not during build.

### Environment Variables in Docker

#### Frontend (Build-time)
- `VITE_API_URL` - Backend API URL (must be set during Docker build)

#### Backend (Runtime)
- `MONGO_URL` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `GEMINI_API_KEY` - Google Gemini API key
- `REDIS_HOST` - Redis host
- `REDIS_PORT` - Redis port
- `REDIS_PASSWORD` - Redis password (optional)
- `FRONTEND_URL` - Frontend URL for CORS
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port

## 🌐 Deployment to Render

### Prerequisites
- GitHub repository with your code
- Render account (https://render.com)
- MongoDB Atlas account (cloud database)
- Redis Cloud account (cloud cache)
- Google Gemini API key

### Step-by-Step Deployment

#### 1. Set Up MongoDB Atlas (Cloud Database)

```bash
# 1. Go to https://www.mongodb.com/cloud/atlas
# 2. Create a free cluster
# 3. Create a database user
# 4. Whitelist your IP (or allow all: 0.0.0.0/0)
# 5. Get connection string: mongodb+srv://user:password@cluster.mongodb.net/text-summarizer
```

#### 2. Set Up Redis Cloud (Cloud Cache)

```bash
# 1. Go to https://redis.com/try-free/
# 2. Create a free Redis database
# 3. Get connection details:
#    - REDIS_HOST: your-redis-host.redis.cloud.com
#    - REDIS_PORT: 6379
#    - REDIS_PASSWORD: your-redis-password
```

#### 3. Deploy Backend to Render

```bash
# 1. Push code to GitHub
git add .
git commit -m "Deploy to Render"
git push origin main

# 2. Go to https://render.com/dashboard
# 3. Click "New +" → "Web Service"
# 4. Connect your GitHub repository
# 5. Configure:
#    - Name: foundation-summarizer-backend
#    - Environment: Node
#    - Build Command: npm install
#    - Start Command: node server.js
#    - Plan: Free (or paid)

# 6. Add Environment Variables:
MONGO_URL=mongodb+srv://user:password@cluster.mongodb.net/text-summarizer
JWT_SECRET=your_super_secret_jwt_key_here
GEMINI_API_KEY=your_gemini_api_key_here
REDIS_HOST=your-redis-host.redis.cloud.com
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
FRONTEND_URL=https://foundation-summarizer-frontend.onrender.com
NODE_ENV=production
PORT=8080

# 7. Click "Create Web Service"
# 8. Wait for deployment (~5 minutes)
# 9. Get your backend URL: https://foundation-sumariser-backend.onrender.com
```

#### 4. Deploy Frontend to Render

```bash
# 1. Go to https://render.com/dashboard
# 2. Click "New +" → "Web Service"
# 3. Connect your GitHub repository (same repo)
# 4. Configure:
#    - Name: foundation-summarizer-frontend
#    - Environment: Docker
#    - Dockerfile Path: /frontend/Dockerfile
#    - Build Command: (leave empty)
#    - Start Command: (leave empty)
#    - Plan: Free (or paid)

# 5. Add Environment Variables:
VITE_API_URL=https://foundation-sumariser-backend.onrender.com

# 6. Click "Create Web Service"
# 7. Wait for deployment (~5 minutes)
# 8. Get your frontend URL: https://foundation-summarizer-frontend.onrender.com
```

#### 5. Verify Deployment

```bash
# 1. Open frontend: https://foundation-summarizer-frontend.onrender.com
# 2. Try to sign up / login
# 3. Create a summary
# 4. Check backend logs for:
#    - ✅ Redis: Successfully connected
#    - ✅ Cache SET: ai-summary:...
#    - ✅ Cache HIT: ai-summary:...
```

### Important Notes

**Frontend Build-time Variables:**
- `VITE_API_URL` must be set in Render environment variables
- Render automatically passes it to Docker during build
- The value is embedded in the production bundle
- Cannot be changed after build without rebuilding

**Backend Runtime Variables:**
- All variables are read when the app starts
- Can be changed anytime without rebuilding
- Set in Render environment variables

**CORS Configuration:**
- Backend uses `FRONTEND_URL` environment variable
- Automatically allows requests from your frontend URL
- Prevents CORS errors

### Troubleshooting Deployment

**CORS Error After Deployment:**
```
Access to fetch at 'http://localhost:8080' from origin 'https://foundation-summarizer-frontend.onrender.com' has been blocked
```

**Solution:**
1. Check that `VITE_API_URL` is set in frontend environment variables
2. Redeploy frontend: Click "Manual Deploy" in Render dashboard
3. Wait for build to complete
4. Check backend logs for correct `FRONTEND_URL`

**Redis Not Connecting:**
```
⚠️ Rate limiter: Using memory store (Redis not available)
```

**Solution:**
1. Verify `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` are correct
2. Check Redis Cloud dashboard for connection details
3. Ensure Render can reach Redis (check firewall/network)
4. Redeploy backend

## 🎮 Running the Application

### With Docker Compose (Local Development)

```bash
# Start all services
docker-compose up

# Or run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Setup

#### Start Backend Server

```bash
cd backend
npx nodemon server.js
```

You should see:
```
✅ Server: Listening on port 8080
✅ MongoDB: Connected successfully
✅ Redis: Connecting...
✅ Redis: Client is ready and connected
✅ Redis: Successfully connected
✅ All connections initialized
```

#### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v7.1.7  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Access the Application

Open your browser and navigate to: **http://localhost:5173**

## 📚 API Documentation

### Base URL
```
http://localhost:8080
```

### Authentication Endpoints

#### 1. Sign Up
```http
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "507f1f77bcf86cd799439011",
  "name": "John Doe"
}
```

#### 2. Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "507f1f77bcf86cd799439011",
  "name": "John Doe"
}
```

### Summary Endpoints

All summary endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

#### 3. Create Summary (Generate AI Summary)
```http
POST /summaries
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Article Summary",
  "summaryText": "Long article text to be summarized..."
}
```

**Response:**
```json
{
  "message": "Summary created successfully",
  "summary": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "My Article Summary",
    "summaryText": "• Key point 1\n• Key point 2\n• Key point 3",
    "summaryLength": 15,
    "user": "507f1f77bcf86cd799439011",
    "createdAt": "2025-11-06T10:30:00.000Z",
    "updatedAt": "2025-11-06T10:30:00.000Z"
  },
  "article": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "My Article Summary",
    "content": "Long article text...",
    "summary": "507f1f77bcf86cd799439011"
  }
}
```

#### 4. Get All Summaries
```http
GET /summaries
Authorization: Bearer <token>
```

**Response:**
```json
{
  "summaries": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "My Article Summary",
      "summaryText": "• Key point 1...",
      "summaryLength": 15,
      "createdAt": "2025-11-06T10:30:00.000Z"
    }
  ]
}
```

#### 5. Get Summary by ID
```http
GET /summaries/:id
Authorization: Bearer <token>
```

#### 6. Regenerate Summary
```http
POST /summaries/:id/regenerate
Authorization: Bearer <token>
Content-Type: application/json

{
  "summaryText": "Original article text..."
}
```

**Note:** This bypasses the cache and forces a fresh AI generation.

#### 7. Delete Summary
```http
DELETE /summaries/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Summary and associated article deleted successfully"
}
```

### Rate Limits

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| General API | 100 requests | 15 minutes |
| AI Operations (Create/Regenerate) | 20 requests | 1 hour |
| Authentication (Signup/Login) | 5 requests | 15 minutes |

## 🎯 Usage Guide

### For End Users

1. **Sign Up / Login**
   - Navigate to the application
   - Create an account or login with existing credentials

2. **Generate a Summary**
   - Enter a title for your summary
   - Paste or type the article text you want to summarize
   - Click "Generate Summary"
   - Wait 2-5 seconds for AI to process

3. **View Summary**
   - The AI-generated summary appears in bullet points
   - Click "Copy" to copy the summary to clipboard

4. **Regenerate Summary**
   - If you want a different variation, click "Regenerate"
   - This forces a fresh AI call (bypasses cache)

5. **View History**
   - Access your summary history from the dashboard
   - View all previously generated summaries

6. **Delete Summary**
   - Click delete on any summary to remove it permanently

## 🔧 Development

### Project Structure

```
foundation/
├── backend/
│   ├── config/
│   │   └── redis.js           # Redis client configuration
│   ├── controllers/
│   │   ├── auth.js            # Authentication logic
│   │   └── summary.js         # Summary CRUD operations
│   ├── helper/
│   │   └── summariser.js      # Gemini AI integration
│   ├── middlewares/
│   │   ├── auth.js            # JWT verification
│   │   └── rateLimiter.js     # Rate limiting middleware
│   ├── models/
│   │   ├── user.js            # User schema
│   │   ├── summary.js         # Summary schema
│   │   └── article.js         # Article schema
│   ├── routes/
│   │   ├── user.js            # Auth routes
│   │   └── summary.js         # Summary routes
│   ├── utils/
│   │   └── cache.js           # Redis caching utilities
│   ├── server.js              # Express server entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/        # Reusable UI components
    │   ├── pages/             # Page components
    │   ├── Dashboard.jsx      # Main dashboard
    │   ├── App.jsx            # App router
    │   └── main.jsx           # Entry point
    ├── public/
    ├── index.html
    ├── vite.config.js
    └── package.json
```

### Build for Production

#### Frontend Build
```bash
cd frontend
npm run build

```

## 🔍 Redis Caching Strategy

### Cache Keys and TTL

| Cache Type | Key Pattern | TTL | Purpose |
|------------|-------------|-----|---------|
| AI Summaries | `ai-summary:{md5_hash}` | 7 days | Cache identical text summaries |
| User Summaries List | `summaries:{userId}` | 5 minutes | Fast dashboard loading |
| Rate Limiting | `rl:{ip}:{endpoint}` | 15 min - 1 hour | Prevent abuse |

### How Caching Works

1. **First Summary Generation**
   ```
   User submits text → Check cache (MISS) → Call Gemini API → Store in Redis (7 days)
   Time: ~2-5 seconds
   ```

2. **Same Text Again**
   ```
   User submits same text → Check cache (HIT) → Return cached summary
   Time: ~50ms (60x faster!)
   Cost: $0 (no API call)
   ```

3. **Regenerate Button**
   ```
   User clicks regenerate → Delete cache → Call Gemini API → Store new result
   Time: ~2-5 seconds
   Result: Fresh, potentially different summary
   ```

### Cache Invalidation

Cache is automatically cleared when:
- User creates a new summary (clears summaries list cache)
- User deletes a summary (clears summaries list cache)
- User regenerates a summary (clears specific AI summary cache)
- TTL expires (automatic Redis cleanup)

### Verify Redis Caching

```bash
# Monitor Redis in real-time
redis-cli MONITOR

# Check all keys
redis-cli KEYS "*"

# Check AI summary keys
redis-cli KEYS "ai-summary:*"

# Check user summaries cache
redis-cli KEYS "summaries:*"

# Check rate limit keys
redis-cli KEYS "rl:*"

# Get a specific key's value
redis-cli GET "ai-summary:5d41402abc4b2a76b9719d911017c592"

# Check TTL (time to live)
redis-cli TTL "ai-summary:5d41402abc4b2a76b9719d911017c592"
```

## � Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# ============================================
# Database Configuration
# ============================================
# MongoDB Atlas (Cloud - Recommended)
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/text-summarizer

# Or Local MongoDB
# MONGO_URL=mongodb://localhost:27017/text-summarizer

# ============================================
# Authentication
# ============================================
# JWT Secret (use a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# ============================================
# Google Gemini AI API Key
# ============================================
# Get from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# ============================================
# Redis Configuration
# ============================================
# Local Redis (for development)
REDIS_HOST=localhost
REDIS_PORT=6379
# REDIS_PASSWORD=  # Leave empty for local

# Or Redis Cloud (for production)
# REDIS_HOST=your-redis-host.redis.cloud.com
# REDIS_PORT=6379
# REDIS_PASSWORD=your_redis_password

# ============================================
# Server Configuration
# ============================================
PORT=8080
NODE_ENV=development

# ============================================
# CORS Configuration
# ============================================
# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
# Backend API URL
# For development
VITE_API_URL=http://localhost:8080

# For production (Render)
# VITE_API_URL=https://foundation-sumariser-backend.onrender.com
```

### Environment Variable Types

| Variable | Type | Where to Set | Why |
|----------|------|-------------|-----|
| `VITE_API_URL` | Build-time | Docker build arg + Render env | Embedded during `npm run build` |
| `MONGO_URL` | Runtime | Render env only | Read when app starts |
| `JWT_SECRET` | Runtime | Render env only | Read when app starts |
| `GEMINI_API_KEY` | Runtime | Render env only | Read when app starts |
| `REDIS_HOST` | Runtime | Render env only | Read when app starts |
| `REDIS_PORT` | Runtime | Render env only | Read when app starts |
| `REDIS_PASSWORD` | Runtime | Render env only | Read when app starts |
| `FRONTEND_URL` | Runtime | Render env only | Read when app starts |
| `NODE_ENV` | Runtime | Render env only | Read when app starts |
| `PORT` | Runtime | Render env only | Read when app starts |

**Key Difference:**
- **Build-time variables** (like `VITE_API_URL`): Must be available during Docker build, embedded in compiled code
- **Runtime variables** (like `MONGO_URL`): Read when app starts, can be changed anytime

## �🛡️ Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth with 7-day expiration
- **Helmet.js**: Security headers
- **CORS**: Configured for specific origin (prevents cross-origin attacks)
- **Rate Limiting**: Redis-backed rate limiting
  - General API: 100 requests per 15 minutes
  - AI Operations: 20 requests per hour
  - Authentication: 5 requests per 15 minutes
- **Input Validation**: Server-side validation
- **Environment Variables**: Sensitive data in .env (never committed)
- **Non-root User**: Docker containers run as non-root user
- **Health Checks**: Automated health checks for all services

## 🐛 Troubleshooting

### Docker Issues

**Problem**: `docker-compose: command not found`

**Solution**:
```bash
# Install Docker Desktop (includes docker-compose)
# https://www.docker.com/products/docker-desktop

# Or install docker-compose separately
sudo apt install docker-compose  # Linux
brew install docker-compose      # macOS
```

**Problem**: `Cannot connect to Docker daemon`

**Solution**:
```bash
# Start Docker Desktop (macOS/Windows)
# Or start Docker service (Linux)
sudo systemctl start docker

# Add user to docker group (Linux)
sudo usermod -aG docker $USER
newgrp docker
```

**Problem**: `Port already in use`

**Solution**:
```bash
# Find process using port
lsof -i :5173   # Frontend
lsof -i :8080   # Backend
lsof -i :27017  # MongoDB
lsof -i :6379   # Redis

# Kill the process
kill -9 <PID>
```

### Redis Connection Issues

**Problem**: `⚠️ Rate limiter: Using memory store (Redis not available)`

**Solution (Local Development):**
```bash
# Check if Redis is running
redis-cli ping

# If not running, start Redis
sudo service redis-server start  # WSL/Linux
brew services start redis         # macOS

# Check Redis logs
sudo tail -f /var/log/redis/redis-server.log
```

**Solution (Render Deployment):**
1. Verify `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` in Render environment
2. Check Redis Cloud dashboard for connection details
3. Ensure IP whitelist allows Render's IP
4. Redeploy backend: Click "Manual Deploy" in Render dashboard

**Verify Redis Connection:**
```bash
# Check backend logs for
✅ Redis: Successfully connected

# Monitor Redis operations
redis-cli MONITOR

# Check cache keys
redis-cli KEYS "*"
redis-cli KEYS "ai-summary:*"
redis-cli KEYS "summaries:*"
```

### MongoDB Connection Issues

**Problem**: `❌ MongoDB: Connection failed`

**Solution (Local Development):**
```bash
# Check if MongoDB is running
sudo systemctl status mongod  # Linux
brew services list            # macOS

# Start MongoDB
sudo systemctl start mongod   # Linux
brew services start mongodb-community  # macOS
```

**Solution (Render Deployment):**
1. Verify `MONGO_URL` in Render environment variables
2. Check MongoDB Atlas dashboard:
   - Verify cluster is running
   - Check IP whitelist (add Render's IP or 0.0.0.0/0)
   - Verify database user credentials
3. Test connection string locally first
4. Redeploy backend

**Verify MongoDB Connection:**
```bash
# Check backend logs for
✅ MongoDB: Connected successfully

# Test connection string
mongosh "mongodb+srv://user:password@cluster.mongodb.net/text-summarizer"
```

### Gemini API Issues

**Problem**: `❌ Gemini API Error: API key not valid`

**Solution**:
1. Verify API key in `.env` file (no extra spaces)
2. Get a new key from [Google AI Studio](https://makersuite.google.com/app/apikey)
3. Check API quota limits in Google Cloud Console
4. Ensure API is enabled in Google Cloud project

**Verify Gemini Connection:**
```bash
# Check backend logs for successful summary generation
✅ Summary generated successfully
```

### CORS Errors

**Problem**: `Access to fetch at 'http://localhost:8080' from origin 'https://foundation-summarizer-frontend.onrender.com' has been blocked by CORS policy`

**Solution (Local Development):**
```bash
# Ensure FRONTEND_URL in backend/.env matches frontend URL
FRONTEND_URL=http://localhost:5173

# Restart backend
```

**Solution (Render Deployment):**
1. Verify `VITE_API_URL` is set in frontend environment variables
2. Verify `FRONTEND_URL` is set in backend environment variables
3. Redeploy frontend: Click "Manual Deploy"
4. Wait for build to complete
5. Check backend logs for correct CORS origin

**Debug CORS:**
```bash
# Check backend CORS configuration
# Should show: origin: process.env.FRONTEND_URL || 'http://localhost:5173'

# Check frontend API URL
# Should show: const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
```

### Cache Not Working

**Problem**: Summaries not being cached

**Solution**:
1. Check Redis connection in backend logs
2. Monitor Redis: `redis-cli MONITOR`
3. Check for cache keys: `redis-cli KEYS "*"`
4. Verify backend logs show cache SET/HIT messages:
   ```
   ✅ Cache SET: ai-summary:hash123 (TTL: 604800s)
   ✅ Cache HIT: ai-summary:hash123
   ```
5. If using memory store, ensure Redis is connected

### Frontend Build Issues

**Problem**: `VITE_API_URL is undefined in production`

**Solution**:
1. Ensure `VITE_API_URL` is set in Render environment variables
2. Redeploy frontend to rebuild with new environment variable
3. Check that Dockerfile has: `ARG VITE_API_URL=...`
4. Verify frontend code uses: `import.meta.env.VITE_API_URL`

### Deployment Issues

**Problem**: `Build failed on Render`

**Solution**:
1. Check Render build logs for specific error
2. Verify all environment variables are set
3. Ensure Dockerfile path is correct:
   - Frontend: `/frontend/Dockerfile`
   - Backend: `/backend/Dockerfile`
4. Check that dependencies are installed: `npm install`
5. Verify Node.js version compatibility

**Problem**: `Application crashes after deployment`

**Solution**:
1. Check Render logs for error messages
2. Verify all environment variables are set correctly
3. Check MongoDB and Redis connectivity
4. Ensure API keys are valid
5. Check for port conflicts (Render uses PORT env var)

## 📊 Performance Metrics

### With Redis Caching

- **Cache Hit Response Time**: ~50ms
- **Cache Miss Response Time**: ~2-5 seconds
- **API Cost Savings**: 50-80% (for repeated text)
- **Dashboard Load Time**: ~100ms (with cache)

### Without Redis Caching

- **Every Request**: ~2-5 seconds
- **API Costs**: 100% (every request)
- **Dashboard Load Time**: ~500ms-1s

## 📝 Recent Changes & Updates

### Version 2.0 - Docker & Cloud Deployment

#### New Features
- ✅ **Docker Support**: Multi-stage Dockerfiles for both frontend and backend
- ✅ **Docker Compose**: Complete local development environment with MongoDB, Redis, Backend, and Frontend
- ✅ **Render Deployment**: Production-ready deployment configuration
- ✅ **Cloud Databases**: MongoDB Atlas and Redis Cloud integration
- ✅ **Environment Variable Management**: Proper handling of build-time vs runtime variables
- ✅ **CORS Configuration**: Dynamic CORS based on `FRONTEND_URL` environment variable
- ✅ **Health Checks**: Automated health checks for all services
- ✅ **Non-root User**: Docker containers run as non-root user for security

#### Improvements
- 🔧 **Frontend Build Optimization**: `VITE_API_URL` passed as build argument for correct API URL embedding
- 🔧 **Backend Optimization**: Runtime environment variables for flexibility
- 🔧 **Rate Limiting**: Redis-backed rate limiting with memory fallback
- 🔧 **Logging**: Enhanced logging for cache operations and connections
- 🔧 **Error Handling**: Better error messages and troubleshooting

#### Files Modified
- `frontend/Dockerfile` - Added build argument for `VITE_API_URL`
- `backend/Dockerfile` - Added documentation for runtime variables
- `docker-compose.yml` - Complete local development setup
- `README.md` - Comprehensive documentation

#### Migration Guide

**If upgrading from v1.x:**

1. **Update Dockerfiles** (already done)
2. **Create `.env` files** in backend and frontend directories
3. **Update environment variables** for your setup
4. **Test locally with Docker Compose**:
   ```bash
   docker-compose up
   ```
5. **Deploy to Render** following the deployment guide

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📚 Additional Resources

- **[Docker Documentation](https://docs.docker.com/)** - Learn Docker
- **[Render Documentation](https://render.com/docs)** - Learn Render deployment
- **[MongoDB Atlas Guide](https://docs.atlas.mongodb.com/)** - Cloud database setup
- **[Redis Cloud Guide](https://redis.com/docs/cloud/)** - Cloud cache setup
- **[Google Gemini API](https://ai.google.dev/)** - AI API documentation
- **[Vite Documentation](https://vitejs.dev/)** - Frontend build tool
- **[Express.js Guide](https://expressjs.com/)** - Backend framework

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful text summarization
- **Redis** for blazing-fast caching
- **MongoDB** for flexible data storage
- **React** and **Vite** for modern frontend development
- **Docker** for containerization
- **Render** for easy cloud deployment




---

**Built with ❤️ using React, Node.js, MongoDB, Redis, and Google Gemini AI**


