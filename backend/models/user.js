import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  // Basic Info
  username: {
    type: String,
    required: [true, 'Username is required'],
    // unique: true,
    trim: true,
    minlength: [1, 'Username must be at least 3 characters'],
    maxlength: [300, 'Username cannot exceed 30 characters']
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password by default when we try to access the dara
  },
  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});
// Indexes for performance
// userSchema.index({ email: 1 });
// userSchema.index({ username: 1 });

export default mongoose.model('User', userSchema);
