import mongoose from 'mongoose';

export const connectDB = async () => {
   const MONGO_URI = process.env.MONGO_URI || 'mongodb://user:root@localhost:27018/ginger-alarm';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
   // Mask password for safe logging
   const maskedUri = MONGO_URI.replace(/:([^@]+)@/, ':****@');
   console.log(`[DB] Attempting to connect to: ${maskedUri}`);

   try {
      await mongoose.connect(MONGO_URI);
      console.log('✓ MongoDB Connected successfully');
      console.log(`[DB] Using Database: ${mongoose.connection.name}`);
      
      // Proactive permission check
      try {
         // Attempt to ping or run a simple command that requires auth if enabled
         await mongoose.connection.db.admin().listDatabases();
         console.log('✓ Write/Admin permissions verified');
      } catch (e: any) {
         if (e.code === 13 || e.message.includes('requires authentication')) {
            console.warn('⚠️ WARNING: Connected to MongoDB, but your user lacks permissions (findAndModify/Admin).');
            console.warn('   Please ensure your MONGO_URI in .env includes a username/password with readWrite roles.');
         }
      }
   } catch (error) {
      console.error('✗ MongoDB connection error:', error);
      process.exit(1);
   }
};
