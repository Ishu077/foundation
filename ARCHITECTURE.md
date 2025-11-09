# System Architecture

This document provides a detailed overview of the AI Text Summarization application architecture.

## Table of Contents
- [High-Level Architecture](#high-level-architecture)
- [Component Breakdown](#component-breakdown)
- [Data Flow](#data-flow)
- [Technology Stack](#technology-stack)
- [Database Schema](#database-schema)
- [API Architecture](#api-architecture)
- [Caching Strategy](#caching-strategy)
- [Security Architecture](#security-architecture)

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  React Frontend (Vite)                                    │   │
│  │  - Dashboard UI                                           │   │
│  │  - Authentication Pages                                   │   │
│  │  - Summary Management                                     │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS
                              │ REST API
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Express.js Backend                                       │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │   │
│  │  │ Auth       │  │ Summary    │  │ Rate       │         │   │
│  │  │ Controller │  │ Controller │  │ Limiter    │         │   │
│  │  └────────────┘  └────────────┘  └────────────┘         │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │   │
│  │  │ JWT        │  │ Cache      │  │ Helmet     │         │   │
│  │  │ Middleware │  │ Wrapper    │  │ Security   │         │   │
│  │  └────────────┘  └────────────┘  └────────────┘         │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                    │                    │
                    │                    │
        ┌───────────┴──────┐   ┌────────┴──────────┐
        │                  │   │                   │
        ▼                  ▼   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────────┐
│   MongoDB    │   │    Redis     │   │  Google Gemini   │
│   Database   │   │    Cache     │   │      AI API      │
│              │   │              │   │                  │
│ - Users      │   │ - AI Cache   │   │ - Text Summary   │
│ - Summaries  │   │ - User Cache │   │ - Generation     │
│ - Articles   │   │ - Rate Limit │   │                  │
└──────────────┘   └──────────────┘   └──────────────────┘
```

---

## Component Breakdown

### Frontend Components

```diff
frontend/
├── public/                      # Static public assets
├── src/
│   ├── App.jsx                  # Main app component (routing)
│   ├── Dashboard.jsx            # Dashboard page
│   ├── Pagenotfound.jsx         # 404 page
│   ├── RefreshHandler.jsx       # Handles refresh logic
│   ├── index.css                # Global CSS
│   ├── App.css                  # App-specific CSS
│   ├── main.jsx                 # Entry point
│   ├── assets/                  # Images and other static assets
│   ├── components/              # Reusable UI components
│   │   ├── Alert.jsx
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Checkbox.jsx
│   │   ├── Header.jsx
│   │   ├── Input.jsx
│   │   ├── Textarea.jsx
│   │   └── index.js             # Components barrel file
│   ├── config/
│   │   └── api.js               # API endpoint config
│   ├── pages/                   # Main pages
│   │   ├── History.jsx          # History page
│   │   ├── Login.jsx            # Login page
│   │   └── Signup.jsx           # Signup page
│   └── ...                      # (Other files as needed)
├── index.html                   # HTML template
├── package.json                 # Project dependencies
├── tailwind.config.js           # Tailwind CSS config
├── postcss.config.js            # PostCSS config
├── vite.config.js               # Vite config
└── ...                          # (Other config and dotfiles)
```

### Backend Components

```
backend/
├── server.js                    # Express server entry point
├── config/
│   └── redis.js                # Redis client configuration
├── controllers/
│   ├── auth.js                 # Authentication logic (signup, login)
│   └── summary.js              # Summary CRUD operations
├── middlewares/
│   ├── auth.js                 # JWT verification middleware
│   └── rateLimiter.js          # Rate limiting middleware
├── models/
│   ├── user.js                 # User schema (name, email, password)
│   ├── summary.js              # Summary schema (title, text, user)
│   └── article.js              # Article schema (content, summary)
├── routes/
│   ├── user.js                 # Auth routes (/auth/signup, /auth/login)
│   └── summary.js              # Summary routes (/summaries/*)
├── helper/
│   └── summariser.js           # Gemini AI integration
└── utils/
    └── cache.js                # Redis caching utilities
```

---

## Data Flow

### 1. User Authentication Flow

```
┌──────┐     ┌─────────┐     ┌──────────┐     ┌─────────┐
│Client│     │ Express │     │  bcrypt  │     │ MongoDB │
└──┬───┘     └────┬────┘     └────┬─────┘     └────┬────┘
   │              │               │                │
   │ POST /auth/signup            │                │
   │ {email, password}            │                │
   ├─────────────>│               │                │
   │              │ Hash password │                │
   │              ├──────────────>│                │
   │              │               │                │
   │              │ Hashed pwd    │                │
   │              │<──────────────┤                │
   │              │                                │
   │              │ Save user                      │
   │              ├───────────────────────────────>│
   │              │                                │
   │              │ User saved                     │
   │              │<───────────────────────────────┤
   │              │                                │
   │              │ Generate JWT                   │
   │              │ (userId + secret)              │
   │              │                                │
   │ 201 Created  │                                │
   │ {token, userId, name}                         │
   │<─────────────┤                                │
   │              │                                │
```

### 2. Summary Generation Flow (Cache Miss)

```
┌──────┐  ┌─────────┐  ┌───────┐  ┌────────┐  ┌─────────┐
│Client│  │ Express │  │ Redis │  │ Gemini │  │ MongoDB │
└──┬───┘  └────┬────┘  └───┬───┘  └───┬────┘  └────┬────┘
   │           │            │          │            │
   │ POST /summaries        │          │            │
   │ {title, text}          │          │            │
   ├──────────>│            │          │            │
   │           │ Verify JWT │          │            │
   │           │            │          │            │
   │           │ Check cache│          │            │
   │           ├───────────>│          │            │
   │           │            │          │            │
   │           │ Cache MISS │          │            │
   │           │<───────────┤          │            │
   │           │                       │            │
   │           │ Call Gemini API       │            │
   │           ├──────────────────────>│            │
   │           │                       │            │
   │           │ AI Summary            │            │
   │           │<──────────────────────┤            │
   │           │                       │            │
   │           │ Store in cache (7d)   │            │
   │           ├──────────────────────>│            │
   │           │                                    │
   │           │ Save to MongoDB                    │
   │           ├───────────────────────────────────>│
   │           │                                    │
   │           │ Summary saved                      │
   │           │<───────────────────────────────────┤
   │           │                                    │
   │           │ Invalidate user cache              │
   │           ├───────────>│                       │
   │           │            │                       │
   │ 201 Created            │                       │
   │ {summary, article}     │                       │
   │<──────────┤            │                       │
   │           │            │                       │
```

### 3. Summary Generation Flow (Cache Hit)

```
┌──────┐  ┌─────────┐  ┌───────┐  ┌─────────┐
│Client│  │ Express │  │ Redis │  │ MongoDB │
└──┬───┘  └────┬────┘  └───┬───┘  └────┬────┘
   │           │            │            │
   │ POST /summaries        │            │
   │ {title, text}          │            │
   ├──────────>│            │            │
   │           │ Verify JWT │            │
   │           │            │            │
   │           │ Check cache│            │
   │           ├───────────>│            │
   │           │            │            │
   │           │ Cache HIT  │            │
   │           │ (50ms!)    │            │
   │           │<───────────┤            │
   │           │                         │
   │           │ Save to MongoDB         │
   │           ├────────────────────────>│
   │           │                         │
   │           │ Summary saved           │
   │           │<────────────────────────┤
   │           │                         │
   │ 201 Created                         │
   │ {summary, article}                  │
   │<──────────┤                         │
   │           │                         │
```

### 4. Regenerate Summary Flow

```
┌──────┐  ┌─────────┐  ┌───────┐  ┌────────┐  ┌─────────┐
│Client│  │ Express │  │ Redis │  │ Gemini │  │ MongoDB │
└──┬───┘  └────┬────┘  └───┬───┘  └───┬────┘  └────┬────┘
   │           │            │          │            │
   │ POST /summaries/:id/regenerate    │            │
   │ {summaryText}          │          │            │
   ├──────────>│            │          │            │
   │           │ Verify JWT │          │            │
   │           │            │          │            │
   │           │ DELETE cache key      │            │
   │           ├───────────>│          │            │
   │           │            │          │            │
   │           │ Cache deleted         │            │
   │           │<───────────┤          │            │
   │           │                       │            │
   │           │ Call Gemini API       │            │
   │           │ (fresh generation)    │            │
   │           ├──────────────────────>│            │
   │           │                       │            │
   │           │ NEW AI Summary        │            │
   │           │<──────────────────────┤            │
   │           │                       │            │
   │           │ Store new cache       │            │
   │           ├──────────────────────>│            │
   │           │                                    │
   │           │ Update MongoDB                     │
   │           ├───────────────────────────────────>│
   │           │                                    │
   │           │ Updated                            │
   │           │<───────────────────────────────────┤
   │           │                                    │
   │ 200 OK                                         │
   │ {summary}                                      │
   │<──────────┤                                    │
   │           │                                    │
```

---

## Technology Stack

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.1.1 | UI library |
| Vite | 7.1.7 | Build tool & dev server |
| React Router DOM | 7.9.4 | Client-side routing |
| Tailwind CSS | 3.4.18 | Styling |
| @react-oauth/google | 0.12.2 | Google OAuth (future) |

### Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime environment |
| Express | 5.1.0 | Web framework |
| Mongoose | 8.19.2 | MongoDB ODM |
| Redis | 5.9.0 | Caching & rate limiting |
| @google/generative-ai | 0.24.1 | Gemini AI integration |
| jsonwebtoken | 9.0.2 | JWT authentication |
| bcryptjs | 3.0.2 | Password hashing |
| helmet | 8.1.0 | Security headers |
| cors | 2.8.5 | CORS middleware |
| express-rate-limit | 8.1.0 | Rate limiting |
| rate-limit-redis | 4.2.3 | Redis rate limit store |
| dotenv | 17.2.3 | Environment variables |

---

## Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  name: String,           // User's full name
  email: String,          // Unique email (indexed)
  password: String,       // Bcrypt hashed password
  createdAt: Date,        // Account creation timestamp
  updatedAt: Date         // Last update timestamp
}
```

### Summary Collection

```javascript
{
  _id: ObjectId,
  title: String,          // Summary title
  summaryText: String,    // AI-generated summary (min 20 chars)
  summaryLength: Number,  // Word count of summary
  user: ObjectId,         // Reference to User
  createdAt: Date,        // Creation timestamp
  updatedAt: Date         // Last update timestamp
}
```

### Article Collection

```javascript
{
  _id: ObjectId,
  title: String,          // Article title
  content: String,        // Original article text
  author: ObjectId,       // Reference to User
  summary: ObjectId,      // Reference to Summary
  createdAt: Date         // Creation timestamp
}
```

**Indexes:**
- `summary`: Index for article lookup by summary
- `author`: Index for user's articles

---

## API Architecture

### RESTful Endpoints

```
Authentication:
POST   /auth/signup          Create new user
POST   /auth/login           Authenticate user

Summaries:
POST   /summaries            Create new summary (AI generation)
GET    /summaries            Get all user's summaries
GET    /summaries/:id        Get specific summary
POST   /summaries/:id/regenerate  Regenerate summary (bypass cache)
DELETE /summaries/:id        Delete summary
```

### Middleware Chain

```
Request → CORS → Helmet → Rate Limiter → Body Parser → Route Handler
                                                      ↓
                                              JWT Verification (protected routes)
                                                      ↓
                                              Controller Logic
                                                      ↓
                                              Response
```

---

## Caching Strategy

### Cache Layers

```
┌─────────────────────────────────────────────────────┐
│                   Application                        │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│              Redis Cache Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │ AI Summaries │  │ User Lists   │  │ Rate      │ │
│  │ (7 days)     │  │ (5 minutes)  │  │ Limits    │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│              MongoDB Database                        │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │ Users        │  │ Summaries    │  │ Articles  │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
└─────────────────────────────────────────────────────┘
```

### Cache Key Strategy

- **Content-based keys**: MD5 hash of text for AI summaries
- **User-based keys**: User ID for summaries lists
- **IP-based keys**: IP address for rate limiting

---

## Security Architecture

### Security Layers

```
┌─────────────────────────────────────────────────────┐
│  1. Network Layer                                    │
│     - HTTPS/TLS encryption                          │
│     - CORS policy                                   │
│     - Firewall rules                                │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│  2. Application Layer                                │
│     - Helmet.js security headers                    │
│     - Rate limiting                                 │
│     - Input validation                              │
│     - JWT authentication                            │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│  3. Data Layer                                       │
│     - Password hashing (bcrypt)                     │
│     - MongoDB authentication                        │
│     - Redis password protection                     │
│     - Environment variable encryption               │
└─────────────────────────────────────────────────────┘
```

### Authentication Flow

```
1. User submits credentials
2. Backend validates input
3. Password hashed with bcrypt (10 rounds)
4. Compared with stored hash
5. JWT token generated (userId + secret)
6. Token sent to client
7. Client stores token (localStorage)
8. Token included in Authorization header
9. Backend verifies token on each request
10. Request processed if valid
```

---

## Scalability Considerations

### Horizontal Scaling

- **Stateless backend**: No session storage, uses JWT
- **Redis for shared state**: Rate limits work across instances
- **Load balancer ready**: Can run multiple backend instances
- **Database sharding**: MongoDB supports horizontal scaling

### Vertical Scaling

- **Optimized queries**: Indexed database fields
- **Caching layer**: Reduces database load
- **Connection pooling**: Efficient resource usage

---

## Monitoring & Observability

### Logging Points

- Authentication events
- API requests/responses
- Cache hits/misses
- Database operations
- Error events
- Performance metrics

### Metrics to Track

- Response times
- Cache hit ratio
- API call frequency
- Error rates
- Database query performance
- Memory usage
- CPU usage

---

**For more details, see:**
- [Main README](../README.md)
- [API Documentation](./API.md)
- [Redis Caching Guide](./REDIS_CACHING.md)
- [Deployment Guide](./DEPLOYMENT.md)
