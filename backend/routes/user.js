import express from 'express';
import mongoose from 'mongoose';
import User from '../models/user.js';
import {signup, login} from "../controllers/auth.js";
import { authLimiter } from '../middlewares/rateLimiter.js';

// import {googleAuth} from "../controllers/auth.js";
const router = express.Router();

// Apply strict rate limiting to auth routes
router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);

// router.get("/google",googleAuth)
export default router;
