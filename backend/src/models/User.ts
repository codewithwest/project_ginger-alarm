import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
   syncId: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true,
      index: true
   },
   createdAt: { 
      type: Date, 
      default: Date.now 
   }
});

export const User = mongoose.model('User', userSchema);
