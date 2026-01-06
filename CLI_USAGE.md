# Ginger Alarm - Command Line Interface

You can create alarms and timers directly from the command line:

## Create an Alarm

```bash
# Format: --create-alarm "TIME" "LABEL" "SOUND"
ginger-alarm --create-alarm "07:00" "Wake up" "alarm.mp3"

# With default label and sound
ginger-alarm --create-alarm "18:30"

# Custom sound file
ginger-alarm --create-alarm "12:00" "Lunch" "/path/to/sound.mp3"
```

## Create a Timer

```bash
# Format: --create-timer DURATION_IN_SECONDS "LABEL"
ginger-alarm --create-timer 900 "15 minute break"

# With default label
ginger-alarm --create-timer 300

# Common examples
ginger-alarm --create-timer 1800 "30 minute workout"
ginger-alarm --create-timer 3600 "1 hour study session"
```

## Examples

```bash
# Morning routine
ginger-alarm --create-alarm "06:30" "Wake up" "alarm.mp3"
ginger-alarm --create-alarm "07:00" "Breakfast"

# Work timers
ginger-alarm --create-timer 1500 "25 min Pomodoro"
ginger-alarm --create-timer 300 "5 min break"
```

## Notes

- Time format for alarms: "HH:MM" in 24-hour format
- Duration for timers: seconds (integer)
- Sound files: Use pre-installed sounds or full path to custom audio files
- Default sounds: `alarm.mp3`, `alarm.ogg`
