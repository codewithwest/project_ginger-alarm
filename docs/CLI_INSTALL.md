# Setting Up the CLI Command

The `ginger-alarm` command allows you to create alarms and timers from the terminal.

## Quick Setup

```bash
cd /path/to/project_ginger-alarm
npm link
```

This creates a global symlink to the `ginger-alarm` command.

## Usage

```bash
# Create an alarm
ginger-alarm --create-alarm "14:30" "Afternoon break" "alarm.mp3"

# Create a timer
ginger-alarm --create-timer 300 "5 minute timer"
```

## Alternative: Direct execution

If `npm link` doesn't work, you can use the script directly:

```bash
./bin/ginger-alarm --create-alarm "14:30" "Break time"
```

## How It Works

1. **Background Operation**: The app runs in the system tray when you close the window
2. **Alarm Checking**: Alarms are checked every second in the background
3. **System Notifications**: When an alarm triggers, you get a system notification
4. **CLI Integration**: The CLI sends commands to the running app instance

## Features

- ✓ Alarms ring even when app is closed (running in tray)
- ✓ CLI command for quick alarm/timer creation
- ✓ System notifications for alarms
- ✓ Background sync every minute
- ✓ Network status indicator
- ✓ Auto-updates
