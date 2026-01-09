import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Alarm } from './models/Alarm';
import { Timer } from './models/Timer';
import { User } from './models/User';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27018/ginger-alarm';

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI)
   .then(() => console.log('Connected to MongoDB'))
   .catch((err) => console.error('MongoDB connection error:', err));

// Sync Endpoint
app.post('/api/sync', async (req, res) => {
   try {
      const { syncId, alarms, timers } = req.body;

      if (!syncId) {
         return res.status(400).json({ error: 'Sync ID is required' });
      }

      // Ensure user exists (Registers user on first sync)
      await User.findOneAndUpdate(
         { syncId },
         { $setOnInsert: { syncId } },
         { upsert: true, new: true }
      );

      // Clear existing data for this syncId (Simple full sync strategy)
      // In a production app, you might want more complex diffing
      await Alarm.deleteMany({ syncId });
      await Timer.deleteMany({ syncId });

      if (alarms && alarms.length > 0) {
         const alarmDocs = alarms.map((a: any) => ({
            localId: a.id,
            time: a.time,
            label: a.label,
            active: !!a.active,
            syncId
         }));
         await Alarm.insertMany(alarmDocs);
      }

      if (timers && timers.length > 0) {
         const timerDocs = timers.map((t: any) => ({
            localId: t.id,
            duration: t.duration,
            label: t.label,
            syncId
         }));
         await Timer.insertMany(timerDocs);
      }

      res.json({ success: true, message: 'Sync successful' });
   } catch (error) {
      console.error('Sync error:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
});

app.get('/', (req, res) => {
   res.send('Ginger Alarm Backend is running');
});

app.listen(PORT, () => {
   console.log(`Server running on http://localhost:${PORT}`);
});
