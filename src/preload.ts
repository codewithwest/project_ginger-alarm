import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
   getVersion: () => ipcRenderer.invoke('get-version'),
   showDialog: () => ipcRenderer.invoke('show-dialog'),
   platform: process.platform,
   // Database
   getAlarms: () => ipcRenderer.invoke('get-alarms'),
   addAlarm: (time: string, label: string, sound: string) => ipcRenderer.invoke('add-alarm', time, label, sound),
   deleteAlarm: (id: number) => ipcRenderer.invoke('delete-alarm', id),
   toggleAlarm: (id: number, active: number) => ipcRenderer.invoke('toggle-alarm', id, active),
   updateAlarm: (id: number, time: string, label: string, sound: string) => ipcRenderer.invoke('update-alarm', id, time, label, sound),

   getTimers: () => ipcRenderer.invoke('get-timers'),
   addTimer: (duration: number, label: string) => ipcRenderer.invoke('add-timer', duration, label),
   deleteTimer: (id: number) => ipcRenderer.invoke('delete-timer', id),
   updateTimer: (id: number, duration: number, label: string) => ipcRenderer.invoke('update-timer', id, duration, label),

   getWorldClocks: () => ipcRenderer.invoke('get-worldclocks'),
   addWorldClock: (city: string, timezone: string, removable: number) => ipcRenderer.invoke('add-worldclock', city, timezone, removable),
   deleteWorldClock: (id: number) => ipcRenderer.invoke('delete-worldclock', id),

   updateSettings: (serverUrl: string, syncId: string) => ipcRenderer.send('update-settings', serverUrl, syncId),
   syncData: (serverUrl: string, syncId: string) => ipcRenderer.invoke('sync-data', serverUrl, syncId),

   selectAudioFile: () => ipcRenderer.invoke('select-audio-file'),
   checkFileExists: (path: string) => ipcRenderer.invoke('check-file-exists', path),
   getGingerAlarmSounds: () => ipcRenderer.invoke('get-ginger-alarm-sounds'),

   getReleaseNotes: () => ipcRenderer.invoke('get-release-notes'),

   // Auto-update
   installUpdate: () => ipcRenderer.invoke('install-update'),
   onUpdateAvailable: (callback: () => void) => ipcRenderer.on('update-available', callback),
   onUpdateDownloaded: (callback: () => void) => ipcRenderer.on('update-downloaded', callback)
});