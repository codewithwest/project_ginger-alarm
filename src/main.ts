import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      // Vite provides this path automatically via the forge-vite plugin
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Check if we are in development mode to load from the Vite dev server
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    // In production, load the built index.html from the .vite folder
    win.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

import { initDB, getAlarms, addAlarm, deleteAlarm, toggleAlarm, updateAlarm, getTimers, addTimer, deleteTimer, updateTimer } from './db';

// IPC handlers (same as before)
ipcMain.handle('get-version', () => app.getVersion());
ipcMain.handle('show-dialog', () => dialog.showMessageBox({ message: 'Hello!' }));

// DB Handlers
ipcMain.handle('get-alarms', () => getAlarms());
ipcMain.handle('add-alarm', (_event, time, label, sound) => addAlarm(time, label, sound));
ipcMain.handle('delete-alarm', (_event, id) => deleteAlarm(id));
ipcMain.handle('toggle-alarm', (_event, id, active) => toggleAlarm(id, active));
ipcMain.handle('update-alarm', (_event, id, time, label, sound) => {
  console.log('IPC update-alarm:', { id, time, label, sound });
  return updateAlarm(id, time, label, sound);
});

ipcMain.handle('get-timers', () => getTimers());
ipcMain.handle('add-timer', (_event, duration, label) => addTimer(duration, label));
ipcMain.handle('delete-timer', (_event, id) => deleteTimer(id));
ipcMain.handle('update-timer', (_event, id, duration, label) => updateTimer(id, duration, label));

// Initialize DB
// Initialize DB
initDB();

// Sync Logic
let syncInterval: NodeJS.Timeout;
let appSettings = {
  serverUrl: 'http://localhost:3000',
  syncId: 'default-user'
};

const performSync = async (serverUrl: string, syncId: string) => {
  try {
    const alarms = getAlarms();
    const timers = getTimers();

    // Node 24 support fetch natively
    const response = await fetch(`${serverUrl}/api/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ syncId, alarms, timers })
    });

    if (!response.ok) {
      throw new Error(`Sync failed with status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Sync successful:', result);
    return { success: true };
  } catch (error) {
    console.error('Sync failed:', error);
    return { success: false, error: String(error) };
  }
};

// Start background sync
const startSyncInterval = () => {
  if (syncInterval) clearInterval(syncInterval);
  // Sync every 1 minute (60000 ms) as requested
  syncInterval = setInterval(() => {
    if (appSettings.serverUrl && appSettings.syncId) {
      performSync(appSettings.serverUrl, appSettings.syncId);
    }
  }, 60 * 1000);
};

// Handlers
ipcMain.on('update-settings', (_event, serverUrl, syncId) => {
  appSettings = { serverUrl, syncId };
  console.log('Settings updated:', appSettings);
  startSyncInterval(); // Restart interval with new settings
});

ipcMain.handle('sync-data', (_event, serverUrl, syncId) => {
  // Update settings immediately on manual sync attempt too
  appSettings = { serverUrl, syncId };
  startSyncInterval();
  return performSync(serverUrl, syncId);
});

// File System Handlers
import fs from 'fs';

ipcMain.handle('select-audio-file', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Audio', extensions: ['mp3', 'wav', 'ogg'] }]
  });
  if (canceled) return null;
  return filePaths[0];
});

ipcMain.handle('check-file-exists', (_event, filePath) => {
  if (!filePath) return false;
  return fs.existsSync(filePath);
});

// Start initial sync interval
startSyncInterval();
