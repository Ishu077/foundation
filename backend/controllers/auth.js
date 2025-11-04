import express from 'express';
import mongoose from 'mongoose'; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const signup = async(req,res)=>{
    try{    
        let {username,email,password}=req.body;
        let user=await User.findOne({email});
        console.log("user created");
        if(user){
            return res.status(400).json({message:"User already exists"});
        }
        user=new User({
            username,
            email,
            password //will be automatically hashed
        });
        
        await user.save();
        //generate token
        const token=jwt.sign(
            {userId:user._id},process.env.JWT_SECRET,
            {expiresIn:'7d'}
        );
        ///returninf for the frontend check
        console.log("user created");
        res.status(201).json({token,user:{id:user._id,username:user.username,email:user.email}});
    }catch(err){
         res.status(500).json({ error: err.message });
    }
};

export const login = async(req,res)=>{
    try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log(user.email);
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


