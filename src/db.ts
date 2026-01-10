import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

const dbPath = path.join(app.getPath('userData'), 'ginger-alarm.db');
const db = new Database(dbPath);

export const initDB = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS alarms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      time TEXT NOT NULL,
      label TEXT,
      active INTEGER DEFAULT 1,
      sound TEXT DEFAULT 'default'
    );
    CREATE TABLE IF NOT EXISTS timers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      duration INTEGER NOT NULL,
      label TEXT,
      sound TEXT DEFAULT 'alarm.mp3'
    );
    CREATE TABLE IF NOT EXISTS worldclocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      city TEXT NOT NULL,
      timezone TEXT NOT NULL,
      removable INTEGER DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      server_url TEXT NOT NULL,
      sync_id TEXT NOT NULL UNIQUE
    );
  `);

  // Ensure initial settings exist
  const settingsCount = db.prepare('SELECT COUNT(*) as count FROM settings').get() as { count: number };
  if (settingsCount.count === 0) {
    db.prepare("INSERT INTO settings (server_url, sync_id) VALUES ('', '')").run();
  }


  // Migrations
  try {
    db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_settings_sync_id ON settings (sync_id)").run();
    console.log('✓ Database migrated: added unique index to settings.sync_id');
  } catch (error: any) {
    if (!error.message.includes('duplicate') && !error.message.includes('already exists')) {
      console.log('Migration note (settings index):', error.message);
    }
  }

  const columns = db.prepare("PRAGMA table_info(timers)").all() as any[];
  const hasSound = columns.some(c => c.name === 'sound');
  if (!hasSound) {
    try {
      db.prepare("ALTER TABLE timers ADD COLUMN sound TEXT DEFAULT 'alarm.mp3'").run();
      console.log('✓ Database migrated: added sound column to timers');
    } catch (e) {
      console.error('Failed to migrate timers table:', e);
    }
  }

  const alarmCols = db.prepare("PRAGMA table_info(alarms)").all() as any[];
  const alarmHasSound = alarmCols.some(c => c.name === 'sound');
  if (!alarmHasSound) {
    try {
      db.prepare("ALTER TABLE alarms ADD COLUMN sound TEXT DEFAULT 'alarm.mp3'").run();
      console.log('✓ Database migrated: added sound column to alarms');
    } catch (e) {
      console.error('Failed to migrate alarms table:', e);
    }
  }
}

// Alarms API
export const getAlarms = () => db.prepare('SELECT * FROM alarms').all();
export const addAlarm = (time: string, label: string, sound: string) => db.prepare('INSERT INTO alarms (time, label, sound) VALUES (?, ?, ?)').run(time, label, sound);
export const deleteAlarm = (id: number) => db.prepare('DELETE FROM alarms WHERE id = ?').run(id);
export const toggleAlarm = (id: number, active: number) => db.prepare('UPDATE alarms SET active = ? WHERE id = ?').run(active, id);
export const updateAlarm = (id: number, time: string, label: string, sound: string) => db.prepare('UPDATE alarms SET time = ?, label = ?, sound = ? WHERE id = ?').run(time, label, sound, id);

// Timers API
export const getTimers = () => db.prepare('SELECT * FROM timers').all();
export const addTimer = (duration: number, label: string, sound: string) => db.prepare('INSERT INTO timers (duration, label, sound) VALUES (?, ?, ?)').run(duration, label, sound);
export const deleteTimer = (id: number) => db.prepare('DELETE FROM timers WHERE id = ?').run(id);
export const updateTimer = (id: number, duration: number, label: string, sound: string) => db.prepare('UPDATE timers SET duration = ?, label = ?, sound = ? WHERE id = ?').run(duration, label, sound, id);

// World Clocks API
export const getWorldClocks = () => db.prepare('SELECT * FROM worldclocks').all();
export const addWorldClock = (city: string, timezone: string, removable: number = 1) => db.prepare('INSERT INTO worldclocks (city, timezone, removable) VALUES (?, ?, ?)').run(city, timezone, removable);
export const deleteWorldClock = (id: number) => db.prepare('DELETE FROM worldclocks WHERE id = ?').run(id);

// Settings API
export const getSettings = () => { 
  // Always get the first row, no matter the ID
  return db.prepare('SELECT id, server_url AS serverUrl, sync_id AS syncId FROM settings LIMIT 1').get() as { id: number, serverUrl: string, syncId: string } | undefined;
};

export const addSettings = (serverUrl: string, syncId: string) => {
  // Check if any settings already exist
  const existing = getSettings();
  if (existing) {
    return updateSettings(serverUrl, syncId);
  }
  return db.prepare('INSERT INTO settings (server_url, sync_id) VALUES (?, ?)').run(serverUrl, syncId);
};

export const updateSettings = (serverUrl: string, syncId: string) => {
  // Update the row that actually exists, using a subquery to find its ID
  const result = db.prepare(`
    UPDATE settings 
    SET server_url = ?, sync_id = ? 
    WHERE id = (SELECT id FROM settings LIMIT 1)
  `).run(serverUrl, syncId);

  if (result.changes === 0) {
    // If somehow no row exists (even after init), insert one.
    return db.prepare('INSERT INTO settings (server_url, sync_id) VALUES (?, ?)').run(serverUrl, syncId);
  }
  
  // Clean up any accidental duplicate rows that might have been created before this fix
  try {
    db.prepare('DELETE FROM settings WHERE id NOT IN (SELECT id FROM settings LIMIT 1)').run();
  } catch (e) {
    console.error('Settings cleanup error:', e);
  }

  console.log('✓ Settings updated (Singleton logic)');
  return result;
};
export const getSettingsBySyncId = (syncId: string) => {
  return db.prepare('SELECT id, server_url AS serverUrl, sync_id AS syncId FROM settings WHERE sync_id = ?').get() as { id: number, serverUrl: string, syncId: string } | undefined;
};
