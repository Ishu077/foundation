# 📝 AI-Powered Text Summarization Application

A full-stack web application that leverages Google's Gemini AI to generate intelligent text summaries with Redis caching for optimal performance and cost efficiency.

![Tech Stack](https://img.shields.io/badge/React-19.1.1-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-8.19.2-brightgreen)
![Redis](https://img.shields.io/badge/Redis-5.9.0-red)
![AI](https://img.shields.io/badge/AI-Google%20Gemini-orange)

## 📚 Documentation

- **[Quick Start Guide](docs/QUICK_START.md)** - Get up and running in 10 minutes ⚡
- **[Docker Setup Guide](docs/DOCKER.md)** - Containerize with Docker & Docker Compose 🐳
- **[Architecture Overview](docs/ARCHITECTURE.md)** - System design and component breakdown 🏗️
- **[API Documentation](docs/API.md)** - Complete API reference with examples 🔌
- **[Redis Caching Guide](docs/REDIS_CACHING.md)** - Deep dive into caching strategy 🚀
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment instructions 🌐
- **[Contributing Guidelines](CONTRIBUTING.md)** - How to contribute to the project 🤝
- **[Changelog](CHANGELOG.md)** - Version history and release notes 📝

## 📖 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Usage Guide](#-usage-guide)
- [Development](#-development)
- [Redis Caching Strategy](#-redis-caching-strategy)
- [Security Features](#-security-features)
- [Troubleshooting](#-troubleshooting)
- [Performance Metrics](#-performance-metrics)
- [Contributing](#-contributing)
- [License](#-license)
- [Future Enhancements](#-future-enhancements)

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

You can run this application in two ways:

### Option 1: Docker (Recommended) 🐳

**Fastest way to get started!** Docker handles all dependencies automatically.

```bash
# 1. Copy environment file
cp .env.docker.example .env.docker

# 2. Add your Gemini API key to .env.docker
# Edit .env.docker and set GEMINI_API_KEY

# 3. Start all services
docker-compose up

# 4. Access the application
# Frontend: http://localhost:5173
# Backend: http://localhost:8080
```

**See the complete [Docker Setup Guide](docs/DOCKER.md)** for:
- Development and production configurations
- Hot reload setup
- Troubleshooting
- Advanced configuration

### Option 2: Manual Installation

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
cp .env.example .env
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

#### On macOS:
```bash
# Install Redis using Homebrew
brew install redis

# Start Redis
brew services start redis

# Verify
redis-cli ping
```

#### On Linux:
```bash
# Install Redis
sudo apt update
sudo apt install redis-server

# Start Redis
sudo systemctl start redis-server

# Verify
redis-cli ping
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

## 🎮 Running the Application

### With Docker (Recommended)

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

See [Docker Setup Guide](docs/DOCKER.md) for more commands.

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

This creates an optimized production build in the `dist/` folder.

#### Preview Production Build
```bash
npm run preview
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

## 🛡️ Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Helmet.js**: Security headers
- **CORS**: Configured for specific origin
- **Rate Limiting**: Redis-backed rate limiting
- **Input Validation**: Server-side validation
- **Environment Variables**: Sensitive data in .env

## 🐛 Troubleshooting

### Redis Connection Issues

**Problem**: `⚠️ Rate limiter: Using memory store (Redis not available)`

**Solution**:
```bash
# Check if Redis is running
redis-cli ping

# If not running, start Redis
sudo service redis-server start  # WSL/Linux
brew services start redis         # macOS

# Check Redis logs
sudo tail -f /var/log/redis/redis-server.log
```

### MongoDB Connection Issues

**Problem**: `❌ MongoDB: Connection failed`

**Solution**:
- Verify MongoDB is running: `sudo systemctl status mongod`
- Check connection string in `.env`
- For Atlas: Whitelist your IP address
- Check network connectivity

### Gemini API Issues

**Problem**: `❌ Gemini API Error: API key not valid`

**Solution**:
- Verify API key in `.env` file
- Get a new key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- Check API quota limits

### Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use :::8080`

**Solution**:
```bash
# Find process using port 8080
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Cache Not Working

**Problem**: Summaries not being cached

**Solution**:
1. Check Redis connection in backend logs
2. Monitor Redis: `redis-cli MONITOR`
3. Check for cache keys: `redis-cli KEYS "*"`
4. Verify backend logs show cache SET/HIT messages

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

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful text summarization
- **Redis** for blazing-fast caching
- **MongoDB** for flexible data storage
- **React** and **Vite** for modern frontend development

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: [your-email@example.com]

## 🔮 Future Enhancements

- [ ] Multiple AI model support (GPT, Claude, etc.)
- [ ] Summary export (PDF, DOCX)
- [ ] Summary sharing via unique links
- [ ] Summary templates (academic, business, etc.)
- [ ] Batch summarization
- [ ] Summary analytics and insights
- [ ] Dark mode
- [ ] Mobile app (React Native)
- [ ] Browser extension
- [ ] API for third-party integrations

---

**Built with ❤️ using React, Node.js, MongoDB, Redis, and Google Gemini AI**


