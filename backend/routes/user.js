import express from 'express';
import mongoose from 'mongoose';
import User from '../models/user.js';
import {signup, login} from "../controllers/auth.js";

// import {googleAuth} from "../controllers/auth.js";
const router = express.Router();

router.post("/signup",signup);
router.post("/login",login);

// router.get("/google",googleAuth)
export default router;
