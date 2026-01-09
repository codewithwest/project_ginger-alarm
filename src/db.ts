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
      label TEXT
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
      sync_id TEXT NOT NULL
    );
  `);


  try {
    db.prepare("ALTER TABLE alarms ADD COLUMN sound TEXT DEFAULT 'alarm.mp3'").run();
  } catch (error: any) {
    if (!error.message.includes('duplicate column name')) {
      console.log('Migration note:', error.message);
    }
  }
};

// Alarms API
export const getAlarms = () => db.prepare('SELECT * FROM alarms').all();
export const addAlarm = (time: string, label: string, sound: string) => db.prepare('INSERT INTO alarms (time, label, sound) VALUES (?, ?, ?)').run(time, label, sound);
export const deleteAlarm = (id: number) => db.prepare('DELETE FROM alarms WHERE id = ?').run(id);
export const toggleAlarm = (id: number, active: number) => db.prepare('UPDATE alarms SET active = ? WHERE id = ?').run(active, id);
export const updateAlarm = (id: number, time: string, label: string, sound: string) => db.prepare('UPDATE alarms SET time = ?, label = ?, sound = ? WHERE id = ?').run(time, label, sound, id);

// Timers API
export const getTimers = () => db.prepare('SELECT * FROM timers').all();
export const addTimer = (duration: number, label: string) => db.prepare('INSERT INTO timers (duration, label) VALUES (?, ?)').run(duration, label);
export const deleteTimer = (id: number) => db.prepare('DELETE FROM timers WHERE id = ?').run(id);
export const updateTimer = (id: number, duration: number, label: string) => db.prepare('UPDATE timers SET duration = ?, label = ? WHERE id = ?').run(duration, label, id);

// World Clocks API
export const getWorldClocks = () => db.prepare('SELECT * FROM worldclocks').all();
export const addWorldClock = (city: string, timezone: string, removable: number = 1) => db.prepare('INSERT INTO worldclocks (city, timezone, removable) VALUES (?, ?, ?)').run(city, timezone, removable);
export const deleteWorldClock = (id: number) => db.prepare('DELETE FROM worldclocks WHERE id = ?').run(id);

// Settings API
export const getSettings = () => { db.prepare('SELECT id, server_url AS serverUrl, sync_id AS syncId FROM settings').get() };
export const addSettings = (serverUrl: string, syncId: string) => db.prepare('INSERT INTO settings (server_url, sync_id) VALUES (?, ?)').run(serverUrl, syncId);
export const updateSettings = (serverUrl: string, syncId: string) => db.prepare('UPDATE settings SET server_url = ?, sync_id = ? WHERE id = 1').run(serverUrl, syncId);
