import mongoose from 'mongoose';

export const connectDB = async () => {
   const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27018/ginger-alarm';
   try {
      await mongoose.connect(MONGO_URI);
      console.log('✓ MongoDB Connected');
   } catch (error) {
      console.error('✗ MongoDB connection error:', error);
      process.exit(1);
   }
};
