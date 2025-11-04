import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

import express from 'express';
import cors from 'cors';

import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet';
import authroutes from "./routes/user.js";
import summaryRoutes from "./routes/summary.js";


const app = express();
const limiter = rateLimit({
    windowMs: 15*60*1000,
    limit:100,
    message: 'Too many requests, try again later.',
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
});

//security
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(limiter);
app.use(helmet());
app.use(cors({
    origin: 'http://localhost:5173', //will change
    credentials: true
}))

// read MONGO_URL from environment before calling main()
const MONGO_URL = process.env.MONGO_URL;

async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("connect to db");
}).catch((err)=>{
    console.log(err);
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

app.listen(8080,()=>{
    console.log("server is listening at the port 8080");
});
