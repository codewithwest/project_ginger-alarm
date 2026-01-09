import { Request, Response } from 'express';
import { SyncService } from '../services/sync.service';

export class SyncController {
   static async sync(req: Request, res: Response) {
      try {
         const { syncId, alarms, timers } = req.body;

         if (!syncId) {
            return res.status(400).json({ error: 'Sync ID is required' });
         }

         const result = await SyncService.syncData(syncId, alarms, timers);
         
         res.json({ 
            success: true, 
            message: 'Sync successful',
            data: result
         });
      } catch (error) {
         console.error('Sync controller error:', error);
         res.status(500).json({ error: 'Internal server error' });
      }
   }
}
