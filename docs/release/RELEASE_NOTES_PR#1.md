# Release Notes - v1.0.0 (PR #1)

## Overview
This is the initial release of **Ginger Alarm**, a beautiful, feature-rich alarm, timer, and world clock application built with Electron, React, and TypeScript. The application combines modern UI/UX design with powerful functionality including background operation, command-line interface, auto-updates, and cloud synchronization.

---

## 🚀 Features & Enhancements

### 1. Core Alarm & Timer Functionality
Built a comprehensive alarm and timer system with modern UI components.
- **Alarms**: Create, edit, delete, and toggle alarms with custom sounds
- **Timers**: Countdown timers with labels and notifications
- **Stopwatch**: Precision timing with lap recording
- **Custom Sounds**: Browse and select custom audio files for alarms
- **File Validation**: Automatic fallback to default sound when custom file is missing
- **Volume Control**: Alarms override current audio at 75% volume for guaranteed audibility

### 2. Command-Line Interface (CLI)
Powerful terminal integration for quick alarm/timer creation.
- **Alarm Creation**: `ginger-alarm --create-alarm "07:00" "Wake up" "alarm.mp3"`
- **Timer Creation**: `ginger-alarm --create-timer 900 "15 minute break"`
- **npm link Integration**: Global command availability after setup
- **Direct Execution**: `./bin/ginger-alarm` for script-based usage
- **Comprehensive Documentation**: `CLI_USAGE.md` and `CLI_INSTALL.md` guides

### 3. World Clock with Timezone Management
Interactive timezone management with beautiful clock displays.
- **Visual Timezone Picker**: Searchable dropdown organized by continent/region
- **Live Time Display**: Shows current time offset and local time for each zone
- **IANA Format**: Full support for IANA timezone database (e.g., `America/Los_Angeles`)
- **Persistent Storage**: Timezones saved to SQLite database
- **Server Sync**: World clocks included in cloud synchronization
- **Regional Organization**: Timezones grouped by Africa, America, Asia, Europe, Pacific, etc.
- **Custom Deletion**: Remove any timezone including defaults

### 4. Background Operation & System Tray
Alarms work even when the application window is closed.
- **System Tray Integration**: App runs in background with tray icon
- **Alarm Monitoring**: Background checker runs every second
- **System Notifications**: Native OS notifications when alarms trigger
- **Enhanced Tray Menu**: Quick access to Alarms, Timer, World Clock, Settings, and Quit
- **Window Management**: Minimize to tray instead of closing
- **Auto-show on Alarm**: Window automatically appears and focuses when alarm rings

### 5. Auto-Update System
Seamless application updates with user control.
- **Hourly Update Checks**: Automatic check for new versions every hour
- **electron-updater Integration**: Robust update mechanism
- **Update Notifications**: Beautiful animated notifications for update status
- **Download Progress**: Shows "Downloading update..." notification
- **One-Click Install**: "Install & Restart" button when update is ready
- **Dev Mode Disabled**: Auto-updater only runs in production builds

### 6. Cloud Synchronization
Bi-directional sync with backend server for data persistence.
- **Background Sync**: Automatic sync every minute
- **Data Coverage**: Syncs alarms, timers, and world clocks
- **Network Error Handling**: 5-second timeout with graceful failure
- **Silent Offline Mode**: No console spam when network is unavailable
- **Conflict Resolution**: Server data merges with local data
- **Settings Integration**: Configure server URL and sync ID

### 7. Premium UI/UX Design
Modern, beautiful interface with attention to detail.
- **3D Animated Background**: Dynamic gradient canvas background
- **Glassmorphism**: Frosted glass effects on cards and modals
- **Smooth Animations**: Framer Motion for fluid transitions
- **Responsive Layout**: Full-screen centered design
- **Network Status Indicator**: Visual green/red dot for connection status
- **Dark Theme**: Eye-friendly dark color scheme with vibrant accents
- **Custom Typography**: Google Fonts (Inter) for premium feel

### 8. Database & Persistence
Local SQLite database for reliable data storage.
- **Schema**: Separate tables for alarms, timers, and worldclocks
- **CRUD Operations**: Full create, read, update, delete functionality
- **Active State Tracking**: Toggle alarms on/off without deletion
- **Auto-initialization**: Database created on first run
- **Type Safety**: TypeScript interfaces for all database operations

### 9. Help & Documentation
Comprehensive in-app and external documentation.
- **Help Page**: `/help` route with full CLI documentation
- **Code Examples**: Syntax-highlighted command examples
- **Common Use Cases**: Pomodoro, Morning Routine templates
- **Footer Links**: Easy access to Help, Privacy, and Terms
- **Markdown Files**: External docs for deployment, features, and troubleshooting

### 10. CI/CD & Deployment
Automated build and release pipeline.
- **GitHub Actions Workflow**: `.github/workflows/release.yml`
- **Automated .deb Packaging**: Builds Debian package on release creation
- **Release Asset Upload**: Automatically attaches package to GitHub release
- **Vercel Backend Support**: `vercel.json` for one-command backend deployment
- **Electron Forge**: Modern build system with Vite integration

---

## 🛠 Bug Fixes

### 1. Module Import Errors
Fixed critical "Cannot find module '/db'" errors causing popup dialogs.
- **Root Cause**: Dynamic `require()` calls in production builds
- **Solution**: Moved all imports to top of file, removed dynamic requires
- **Impact**: Eliminated annoying JavaScript error popups

### 2. Packaging Configuration
Resolved build failures in CI/CD pipeline.
- **Issue**: `.vite` directory was being excluded by ignore patterns
- **Fix**: Removed custom ignore patterns, let Forge plugin handle exclusion
- **Result**: Successful .deb package generation

### 3. Timezone Validation
Improved error handling for invalid timezone input.
- **Added**: Try-catch around timezone validation
- **User Feedback**: Clear error message for invalid timezone strings
- **Fallback**: Graceful handling of malformed input

### 4. Alarm File Handling
Enhanced custom sound file management.
- **File Existence**: Check if custom sound file exists before playing
- **Warning Display**: Show visual indicator when file is missing
- **Automatic Fallback**: Default to `alarm.mp3` when custom file not found

### 5. Development Warnings
Cleaned up console output for better developer experience.
- **Auto-updater**: Only runs in production, not development
- **Sync Errors**: Silent handling of expected network failures
- **Lint Errors**: Fixed TypeScript errors and duplicate imports

---

## 📦 Technical Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: React Router (Hash Router for Electron)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Testing**: Vitest with React Testing Library

### Backend
- **Runtime**: Node.js (Express)
- **Database**: SQLite (better-sqlite3)
- **API**: RESTful endpoints
- **Deployment**: Vercel-ready
- **Testing**: Vitest with Supertest

### Desktop
- **Platform**: Electron
- **Packager**: Electron Forge
- **Updates**: electron-updater
- **IPC**: Context isolation with preload script
- **Security**: Node integration disabled, context isolation enabled

---

## 📚 Documentation

### User  Documentation
- **`README.md`**: Project overview and quick start
- **`FEATURES.md`**: Complete feature list with examples
- **`CLI_USAGE.md`**: Command-line usage examples
- **`CLI_INSTALL.md`**: CLI setup instructions
- **In-app Help**: `/help` page with interactive documentation

### Developer Documentation
- **`PACKAGING_FIX.md`**: Troubleshooting packaging issues
- **`USE_CLIENT_WARNINGS.md`**: Understanding "use client" warnings
- **`LATEST_UPDATES.md`**: Recent changes and improvements
- **`backend/DEPLOY.md`**: Vercel deployment guide

---

## 🏗 Architecture Highlights

### Database Schema
```sql
CREATE TABLE alarms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  time TEXT NOT NULL,
  label TEXT,
  active INTEGER DEFAULT 1,
  sound TEXT DEFAULT 'default'
);

CREATE TABLE timers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  duration INTEGER NOT NULL,
  label TEXT
);

CREATE TABLE worldclocks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  city TEXT NOT NULL,
  timezone TEXT NOT NULL,
  removable INTEGER DEFAULT 1
);
```

### IPC Communication
- **Preload Script**: Secure context bridge for main-renderer communication
- **Type Safety**: Global TypeScript definitions for all IPC methods
- **Event Handlers**: Update notifications, alarm triggers, navigation

### File Structure
```
src/
├── main.ts              # Electron main process
├── preload.ts           # IPC bridge
├── renderer.ts          # React entry point
├── app.tsx              # Root component with routing
├── db.ts                # SQLite database layer
├── pages/               # Route components
│   ├── Alarms.tsx
│   ├── Timer.tsx
│   ├── WorldClock.tsx
│   ├── Stopwatch.tsx
│   ├── Settings.tsx
│   └── Help.tsx
├── components/          # Reusable components
│   ├── AlarmManager.tsx
│   ├── NetworkStatus.tsx
│   ├── UpdateNotification.tsx
│   ├── Background3D.tsx
│   ├── Navbar.tsx
│   └── Footer.tsx
└── utils/
    └── timezoneData.ts  # Timezone database
```

---

## ⚠️ Breaking Changes
None - this is the initial release (v1.0.0).

---

## 🚧 Known Limitations

1. **Tray Icon**: May not display on all Linux desktop environments (fallback provided)
2. **Auto-update**: Only works for installed applications, not in development mode
3. **Timezone List**: Curated list of common timezones (custom IANA strings supported)
4. **Platform Support**: Primarily tested on Linux, macOS and Windows compatibility untested

---

## 📋 Installation

### From Source
```bash
git clone https://github.com/codewithwest/project_ginger-alarm.git
cd project_ginger-alarm
npm install
npm start
```

### From Release
Download the `.deb` package from GitHub releases:
```bash
sudo dpkg -i ginger-alarm_v1.0.0_amd64.deb
```

### CLI Setup
```bash
npm link
ginger-alarm --create-alarm "07:00" "Wake up"
```

---

## 🔮 Future Roadmap

- **Multiple Alarm Sounds**: Play different sounds for each alarm
- **Recurring Alarms**: Daily, weekly, custom repeat patterns
- **Alarm Groups**: Organize alarms by category
- **Themes**: Light/dark mode toggle, custom themes
- **Statistics**: Track usage, alarm reliability
- **Mobile Companion**: Sync with mobile app
- **Voice Commands**: Create alarms via voice
- **Smart Snooze**: AI-powered snooze duration

---

## 🙏 Credits

- **UI Inspiration**: Modern alarm clock applications
- **Icons**: Lucide React icon library
- **Animations**: Framer Motion
- **Timezone Data**: IANA Time Zone Database

---

**Release Date**: January 6, 2026  
**Version**: 1.0.0  
**PR**: #1  
**Maintainer**: Jonas Lekgau (@codewithwest)

## What's Included
* ✅ Alarm, Timer, and Stopwatch functionality
* ✅ World Clock with timezone management
* ✅ Command-line interface (CLI)
* ✅ Background operation with system tray
* ✅ Auto-update system
* ✅ Cloud synchronization
* ✅ Help & documentation pages
* ✅ CI/CD for .deb packages
* ✅ Premium UI/UX design

**Repository**: https://github.com/codewithwest/project_ginger-alarm  
**Full Changelog**: https://github.com/codewithwest/project_ginger-alarm/releases/tag/v1.0.0
