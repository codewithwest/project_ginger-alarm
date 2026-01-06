export interface IElectronAPI {
   platform: string;
   getVersion: () => Promise<string>;
   showDialog: () => Promise<void>;

   getAlarms: () => Promise<any[]>;
   addAlarm: (time: string, label: string, sound: string) => Promise<void>;
   deleteAlarm: (id: number) => Promise<void>;
   toggleAlarm: (id: number, active: number) => Promise<void>;
   updateAlarm: (id: number, time: string, label: string, sound: string) => Promise<void>;

   getTimers: () => Promise<any[]>;
   addTimer: (duration: number, label: string) => Promise<void>;
   deleteTimer: (id: number) => Promise<void>;
   updateTimer: (id: number, duration: number, label: string) => Promise<void>;

   updateSettings: (serverUrl: string, syncId: string) => Promise<void>;
   syncData: (serverUrl: string, syncId: string) => Promise<{ success: boolean, error?: string }>;

   selectAudioFile: () => Promise<string | null>;
   checkFileExists: (path: string) => Promise<boolean>;
}

declare global {
   interface Window {
      electronAPI: IElectronAPI;
   }
}
