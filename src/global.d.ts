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
   addTimer: (duration: number, label: string, sound: string) => Promise<any>;
   deleteTimer: (id: number) => Promise<any>;
   updateTimer: (id: number, duration: number, label: string, sound: string) => Promise<any>;

   getWorldClocks: () => Promise<any[]>;
   addWorldClock: (city: string, timezone: string, removable: number) => Promise<any>;
   deleteWorldClock: (id: number) => Promise<any>;

   syncData: (serverUrl: string, syncId: string) => Promise<{ success: boolean, error?: string }>;

   selectAudioFile: () => Promise<string | null>;
   checkFileExists: (path: string) => Promise<boolean>;
   getGingerAlarmSounds: () => Promise<{ label: string; value: string }[]>;

   getReleaseNotes: () => Promise<Array<{ filename: string; content: string }>>;

   // Auto-update
   installUpdate: () => Promise<void>;
   onUpdateAvailable: (callback: () => void) => void;
   onUpdateDownloaded: (callback: () => void) => void;

   getSettings: () => Promise<any>;
   updateSettings: (settings: SettingsDTO) => Promise<void>;
   getSettingsBySyncId: (syncId: string) => Promise<any>;
   addSettings: (settings: SettingsDTO) => Promise<void>;
   deleteSettings: (id: number) => Promise<void>;
}

declare global {
   interface Window {
      electronAPI: IElectronAPI;
   }
}

