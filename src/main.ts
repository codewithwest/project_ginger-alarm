import { app, BrowserWindow, ipcMain, dialog, Tray, Menu, Notification } from 'electron';
import path from 'path';
import { autoUpdater } from 'electron-updater';

// CLI Arguments Handler
function handleCLIArgs() {
  const args = process.argv.slice(2);

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--create-alarm' && args[i + 1]) {
      // Format: --create-alarm "07:00" "Wake up" "alarm.mp3"
      const time = args[i + 1];
      const label = args[i + 2] || 'Alarm';
      const sound = args[i + 3] || 'alarm.mp3';

      // Will be initialized after DB is ready
      setTimeout(() => {
        try {
          addAlarm(time, label, sound);
          console.log(`✓ Alarm created: ${time} - ${label}`);
        } catch (e) {
          console.error('Failed to create alarm:', e);
        }
      }, 1000);

      i += 3;
    } else if (args[i] === '--create-timer' && args[i + 1]) {
      // Format: --create-timer 900 "15 minute timer"
      const duration = parseInt(args[i + 1]);
      const label = args[i + 2] || 'Timer';

      setTimeout(() => {
        try {
          addTimer(duration, label);
          console.log(`✓ Timer created: ${duration}s - ${label}`);
        } catch (e) {
          console.error('Failed to create timer:', e);
        }
      }, 1000);

      i += 2;
    }
  }
}

let tray: Tray | null = null;
let mainWindow: BrowserWindow | null = null;

function createTray() {
  try {
    const iconPath = path.join(__dirname, '../../assets/ginger-alarm-16x16.png');
    tray = new Tray(iconPath);
    console.log('✓ Tray icon loaded');
  } catch (e) {
    console.warn('Tray icon error:', e);
    return;
  }

  const contextMenu = Menu.buildFromTemplate([
    { label: '⏰ Show Ginger Alarm', click: () => { mainWindow?.show(); mainWindow?.focus(); } },
    { type: 'separator' },
    { label: 'Alarms', click: () => { mainWindow?.show(); } },
    { label: 'Timer', click: () => { mainWindow?.show(); } },
    { label: 'World Clock', click: () => { mainWindow?.show(); } },
    { type: 'separator' },
    { label: 'Settings', click: () => { mainWindow?.show(); } },
    { type: 'separator' },
    { label: 'Quit', click: () => { (app as any).isQuitting = true; app.quit(); } }
  ]);

  tray.setToolTip('Ginger Alarm - Running in background');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    mainWindow?.show();
  });
}

function createWindow() {
  const win = new BrowserWindow({
    icon: path.join(__dirname, '../assets/ginger-alarm-128x128.png'),
    width: 1000,
    height: 920,
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

  win.on('close', (event) => {
    if (!(app as any).isQuitting) {
      event.preventDefault();
      win.hide();
    }
  });

  mainWindow = win;
  return win;
}

app.whenReady().then(() => {
  const win = createWindow();
  createTray();
  handleCLIArgs();

  // Only check for updates in production builds
  const isDev = MAIN_WINDOW_VITE_DEV_SERVER_URL !== undefined;
  if (!isDev) {
    autoUpdater.checkForUpdatesAndNotify();

    setInterval(() => {
      autoUpdater.checkForUpdatesAndNotify();
    }, 60 * 60 * 1000);

    autoUpdater.on('update-available', () => {
      win.webContents.send('update-available');
    });

    autoUpdater.on('update-downloaded', () => {
      win.webContents.send('update-downloaded');
    });
  }

  // Background alarm checker -runs every second
  setInterval(() => {
    try {
      const alarms = getAlarms();
      const now = new Date();
      const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

      alarms.forEach((alarm: any) => {
        if (alarm.active && alarm.time === currentTime && now.getSeconds() === 0) {
          if (Notification.isSupported()) {
            const notification = new Notification({
              title: 'ALARM!',
              body: `${alarm.label || 'Alarm'} - ${alarm.time}`,
              urgency: 'critical',
              timeoutType: 'never'
            });

            notification.show();
            notification.on('click', () => {
              win.show();
            });
          }

          win.show();
          win.focus();
          win.webContents.send('trigger-alarm', alarm);
        }
      });
    } catch (e) {
      // Silently handle errors in alarm checking
      console.error('Alarm check error:', e);
    }
  }, 1000);
});

app.on('window-all-closed', () => {
  if ((app as any).isQuitting) {
    app.quit();
  }
  // Keep running in background/tray
});

import { initDB, getAlarms, addAlarm, deleteAlarm, toggleAlarm, updateAlarm, getTimers, addTimer, deleteTimer, updateTimer, getWorldClocks, addWorldClock, deleteWorldClock } from './db';
import fs from 'fs';

// Initialize DB immediately
initDB();

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

ipcMain.handle('get-worldclocks', () => getWorldClocks());
ipcMain.handle('add-worldclock', (_event, city, timezone, removable) => addWorldClock(city, timezone, removable));
ipcMain.handle('delete-worldclock', (_event, id) => deleteWorldClock(id));

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
  if (!serverUrl || !syncId) {
    return { success: false, error: 'Missing server URL or sync ID' };
  }

  try {
    const alarms = getAlarms();
    const timers = getTimers();
    const worldclocks = getWorldClocks();

    // Node 24 supports fetch natively
    const response = await fetch(`${serverUrl}/api/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ syncId, alarms, timers, worldclocks }),
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });

    if (!response.ok) {
      console.warn(`Sync failed: HTTP ${response.status}`);
      return { success: false, error: `HTTP ${response.status}` };
    }

    const result = await response.json();

    // Merge server data back to local
    if (result.alarms) {
      result.alarms.forEach((alarm: any) => {
        if (!alarms.find((a: any) => a.id === alarm.id)) {
          addAlarm(alarm.time, alarm.label, alarm.sound);
        }
      });
    }

    if (result.timers) {
      result.timers.forEach((timer: any) => {
        if (!timers.find((t: any) => t.id === timer.id)) {
          addTimer(timer.duration, timer.label);
        }
      });
    }

    if (result.worldclocks) {
      result.worldclocks.forEach((clock: any) => {
        if (!worldclocks.find((c: any) => c.id === clock.id)) {
          addWorldClock(clock.city, clock.timezone, clock.removable);
        }
      });
    }

    console.log('✓ Sync successful');
    return { success: true };
  } catch (error: any) {
    // Silently handle network errors - don't spam console
    if (error.name === 'AbortError' || error.message?.includes('fetch')) {
      // Timeout or network error - expected when offline
      return { success: false, error: 'Network unavailable' };
    }
    console.warn('Sync error:', error.message);
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

// Get all release notes files
ipcMain.handle('get-release-notes', async () => {
  try {
    const releaseDir = path.join(__dirname, '../../docs/release');
    if (!fs.existsSync(releaseDir)) {
      return [];
    }
    const files = fs.readdirSync(releaseDir).filter(f => f.endsWith('.md'));

    const releases = files.map(file => {
      const content = fs.readFileSync(path.join(releaseDir, file), 'utf-8');
      return { filename: file, content };
    });

    // Sort by filename (newest first)
    return releases.sort((a, b) => b.filename.localeCompare(a.filename));
  } catch (e) {
    console.error('Failed to read release notes:', e);
    return [];
  }
});

// Auto-update handlers
ipcMain.handle('install-update', () => {
  autoUpdater.quitAndInstall();
});

// Start initial sync interval
startSyncInterval();
