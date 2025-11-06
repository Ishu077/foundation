import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

import express from 'express';
import cors from 'cors';

import helmet from 'helmet';
import authroutes from "./routes/user.js";
import summaryRoutes from "./routes/summary.js";
import { connectRedis, disconnectRedis } from './config/redis.js';
import { generalLimiter } from './middlewares/rateLimiter.js';


const app = express();

//security
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(generalLimiter); // Redis-backed rate limiter
app.use(helmet());
app.use(cors({
    origin: 'http://localhost:5173', //will change
    credentials: true
}))

// read MONGO_URL from environment before calling main()
const MONGO_URL = process.env.MONGO_URL;

// Initialize database and Redis connections
async function initializeConnections(){
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGO_URL);
        console.log("✅ MongoDB: Connected successfully");

        // Connect to Redis
        await connectRedis();
    } catch (err) {
        console.error("❌ Connection Error:", err);
        throw err;
    }
}

initializeConnections().then(()=>{
    console.log("✅ All connections initialized");
}).catch((err)=>{
    console.error("❌ Failed to initialize connections:", err);
    process.exit(1);
});
app.get("/",(req,res)=>{
    res.send("Hello World");
})

app.use("/auth",authroutes);  //  /auth/signup and /auth/login
app.use("/summaries", summaryRoutes);  // /summaries CRUD routes

//error handler!
app.use((err,req,res,next)=>{
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
});

const server = app.listen(8080,()=>{
    console.log("✅ Server: Listening on port 8080");
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('⚠️  SIGTERM signal received: closing HTTP server');
    server.close(async () => {
        console.log('✅ HTTP server closed');
        await disconnectRedis();
        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed');
        process.exit(0);
    });
});

process.on('SIGINT', async () => {
    console.log('⚠️  SIGINT signal received: closing HTTP server');
    server.close(async () => {
        console.log('✅ HTTP server closed');
        await disconnectRedis();
        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed');
        process.exit(0);
    });
});
