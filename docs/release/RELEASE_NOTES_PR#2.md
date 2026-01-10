# Release Notes - v1.1.0 (PR #2)

## Overview
This release introduces significant UI/UX enhancements, new utility features like audio ducking, and improved data persistence. We've overhauled the window design, componentized the navigation, and added deep integration for application settings and backend synchronization.

---

## 🚀 Features & Enhancements

### 1. Modern Window Design & UI Overhaul
Significant improvements to the application's look and feel.
- **Frameless Window**: Switched to a frameless, rounded window design for a more integrated OS experience.
- **Custom Title Bar**: Implemented a bespoke `TitleBar` component for window controls and branding.
- **Concave Navigation Bar**: A new, visually striking SVG-based bottom navigation bar with fluid animations.
- **Scrollbar Hiding**: Global styling to hide scrollbars for a cleaner, app-like appearance.
- **Network Status Animation**: Improved the network status indicator with `framer-motion` animations.

### 2. Intelligent Audio Management
Enhanced the audio experience for alarms.
- **Audio Ducking**: Automatically reduces the volume of other system/app audio when an alarm rings and restores it once stopped.
- **SoundPicker Component**: A new dedicated UI component for selecting alarm sounds with better organization.
- **Asset Refactoring**: Expanded and reorganized the built-in alarm sound collection.

### 3. Persistent Application Settings
Centralized and persistent configuration.
- **SQLite Settings Storage**: App settings are now stored in the SQLite database for reliability.
- **IPC Communication**: Updated IPC handlers to handle settings fetching and updates seamlessly.
- **Global Configuration**: Support for persistent UI and behavioral settings.

### 4. Stopwatch Enhancements
Added precision and visibility to the stopwatch.
- **Lap Tracking**: Detailed lap time recording with beautiful animations.
- **Stopwatch UI Refinement**: Improved layout and readability of the stopwatch interface.

### 5. Backend Synchronization & Architectural Cleanup
Solidifying the core infrastructure.
- **Sync Refactoring**: Re-engineered the backend synchronization logic for better reliability and performance.
- **Component Refactoring**: Optimized the `Timer` components and `WorldClock` styling.
- **Dependency Updates**: Updated `react-router-dom` and added `react-router` for improved routing handling.

---

## 🛠 Refactoring & Improvements

### 1. Layout & Styling
- **Layout Structure**: Unified the layout structure to support the new frameless design and title bar.
- **Navbar Animations**: Smooth transitions between pages using the new concave nav design.
- **World Clock Styling**: Refined the timezone list and clock displays for better consistency.

### 2. Core Logic
- **useTimer Hook**: Updated the timer logic to support more robust state management and asset loading.
- **Sound Asset Management**: Renamed and organized sound files for better maintainability.

---

## 📦 Technical Stack Changes
- **Dependencies**: 
  - Updated `react-router-dom` to latest.
  - Added `react-router`.
- **Styling**: Increased usage of `framer-motion` for complex UI transitions.

---

## 🏗 Architecture Highlights
- **SQLite Schema Extension**: Added a `settings` table to persist application state.
- **Preload Script Updates**: Expanded the context bridge to expose new settings and audio control methods.

---

## ⚠️ Breaking Changes
- **Window Management**: The app now uses a custom title bar; default OS window controls are no longer present.
- **Config Path**: Settings have moved from local storage/JSON to the SQLite database.

---

## 📋 Installation & Update
Existing users can update via the in-app auto-updater or by downloading the latest `.deb` package.

```bash
sudo dpkg -i ginger-alarm_v1.1.0_amd64.deb
```

---

**Release Date**: January 10, 2026  
**Version**: 1.1.0  
**PR**: #2  
**Maintainer**: Jonas Lekgau (@codewithwest)

**Repository**: https://github.com/codewithwest/project_ginger-alarm  
**Full Changelog**: https://github.com/codewithwest/project_ginger-alarm/compare/v1.0.0...v1.1.0
