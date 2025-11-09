# 📋 Deployment Checklist

## Pre-Deployment

### Code Preparation
- [ ] All code committed to GitHub
- [ ] No sensitive data in code (use .env files)
- [ ] `.gitignore` includes `.env` files
- [ ] Dockerfiles are up to date
- [ ] `docker-compose.yml` is configured

### Cloud Services Setup
- [ ] MongoDB Atlas cluster created
  - [ ] Database user created
  - [ ] IP whitelist configured (0.0.0.0/0 for Render)
  - [ ] Connection string obtained
- [ ] Redis Cloud database created
  - [ ] Connection details obtained (host, port, password)
- [ ] Google Gemini API key obtained
  - [ ] API enabled in Google Cloud Console

### Local Testing
- [ ] `docker-compose up` works locally
- [ ] Frontend loads at http://localhost:5173
- [ ] Backend API responds at http://localhost:8080
- [ ] Can signup/login
- [ ] Can create summaries
- [ ] Redis caching works (check logs)
- [ ] No errors in console/logs

---

## Backend Deployment (Render)

### Create Web Service
- [ ] Go to render.com/dashboard
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Service name: `foundation-summarizer-backend`
- [ ] Environment: `Node`
- [ ] Build command: `npm install`
- [ ] Start command: `node server.js`
- [ ] Plan: Free or Paid

### Environment Variables
- [ ] `MONGO_URL` = MongoDB Atlas connection string
- [ ] `JWT_SECRET` = Strong random string
- [ ] `GEMINI_API_KEY` = Your API key
- [ ] `REDIS_HOST` = Redis Cloud host
- [ ] `REDIS_PORT` = 6379
- [ ] `REDIS_PASSWORD` = Your Redis password
- [ ] `FRONTEND_URL` = https://foundation-summarizer-frontend.onrender.com
- [ ] `NODE_ENV` = production
- [ ] `PORT` = 8080

### Deployment
- [ ] Click "Create Web Service"
- [ ] Wait for build to complete (~5 minutes)
- [ ] Check logs for errors
- [ ] Note backend URL: `https://foundation-sumariser-backend.onrender.com`
- [ ] Test health endpoint: `https://foundation-sumariser-backend.onrender.com/health`

---

## Frontend Deployment (Render)

### Create Web Service
- [ ] Go to render.com/dashboard
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository (same repo)
- [ ] Service name: `foundation-summarizer-frontend`
- [ ] Environment: `Docker`
- [ ] Dockerfile path: `/frontend/Dockerfile`
- [ ] Build command: (leave empty)
- [ ] Start command: (leave empty)
- [ ] Plan: Free or Paid

### Environment Variables
- [ ] `VITE_API_URL` = https://foundation-sumariser-backend.onrender.com

### Deployment
- [ ] Click "Create Web Service"
- [ ] Wait for build to complete (~5 minutes)
- [ ] Check logs for errors
- [ ] Note frontend URL: `https://foundation-summarizer-frontend.onrender.com`

---

## Post-Deployment Verification

### Frontend Testing
- [ ] Open frontend URL in browser
- [ ] Page loads without errors
- [ ] Can navigate to login page
- [ ] Can signup with new account
- [ ] Can login with credentials
- [ ] Dashboard loads

### Backend Testing
- [ ] Create a summary
- [ ] Summary appears in history
- [ ] Can regenerate summary
- [ ] Can delete summary
- [ ] No CORS errors in console

### Logging & Monitoring
- [ ] Check backend logs for:
  - [ ] `✅ Redis: Successfully connected`
  - [ ] `✅ MongoDB: Connected successfully`
  - [ ] `✅ Cache SET: ai-summary:...`
  - [ ] `✅ Cache HIT: ai-summary:...`
- [ ] Check frontend logs for errors
- [ ] Monitor Render dashboard for crashes

### Performance Check
- [ ] First summary generation: ~2-5 seconds
- [ ] Cached summary retrieval: ~50ms
- [ ] Dashboard load: <1 second
- [ ] No timeout errors

---

## Troubleshooting

### If Backend Fails
- [ ] Check all environment variables are set
- [ ] Verify MongoDB Atlas IP whitelist
- [ ] Verify Redis Cloud connection details
- [ ] Check Render logs for specific errors
- [ ] Redeploy: Click "Manual Deploy"

### If Frontend Fails
- [ ] Check VITE_API_URL is set correctly
- [ ] Verify backend URL is accessible
- [ ] Check browser console for errors
- [ ] Redeploy frontend

### If CORS Error
- [ ] Verify FRONTEND_URL in backend env vars
- [ ] Verify VITE_API_URL in frontend env vars
- [ ] Redeploy both services
- [ ] Clear browser cache

---

## Final Sign-Off

- [ ] All services deployed successfully
- [ ] All tests passing
- [ ] No errors in logs
- [ ] Performance acceptable
- [ ] Ready for production use

**Deployment Date**: _______________
**Deployed By**: _______________
**Notes**: _______________

