import { Alarm } from '../models/Alarm';
import { Timer } from '../models/Timer';
import { User } from '../models/User';

export class SyncService {
   static async syncData(syncId: string, alarms: any[], timers: any[]) {
      // 1. Ensure user exists
      await User.findOneAndUpdate(
         { syncId },
         { $setOnInsert: { syncId } },
         { upsert: true, new: true }
      );

      // 2. Sync Alarms (Non-destructive: Upsert by localId)
      if (alarms && alarms.length > 0) {
         for (const alarm of alarms) {
            await Alarm.findOneAndUpdate(
               { syncId, localId: alarm.id },
               { 
                  time: alarm.time,
                  label: alarm.label,
                  active: !!alarm.active,
                  sound: alarm.sound || 'default'
               },
               { upsert: true }
            );
         }
      }

      // 3. Sync Timers (Non-destructive: Upsert by localId)
      if (timers && timers.length > 0) {
         for (const timer of timers) {
            await Timer.findOneAndUpdate(
               { syncId, localId: timer.id },
               { 
                  duration: timer.duration,
                  label: timer.label,
                  sound: timer.sound || 'alarm.mp3'
               },
               { upsert: true }
            );
         }
      }

      // 4. Return the complete consolidated state
      const consolidatedAlarms = await Alarm.find({ syncId });
      const consolidatedTimers = await Timer.find({ syncId });

      return {
         alarms: consolidatedAlarms,
         timers: consolidatedTimers
      };
   }
}
