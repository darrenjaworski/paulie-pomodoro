# Paulie Pomodoro

A beautiful, theme-aware Pomodoro timer for VS Code, designed to help you stay focused and productive. "Hey Paulie! Paulie. More wine."

---

## Features

- **Pomodoro Timer**: Start, pause, reset, and switch between work and break sessions directly from the Activity Bar or the webview panel.
- **Status Bar Integration**: See your timer and session type at a glance in the VS Code status bar. Click to start/pause and open the controls.
- **Webview Panel**: Modern, responsive UI with large timer display, session type, and intuitive controls.
- **Theme Awareness**: All UI elements (timer, buttons, footer) adapt to your VS Code color theme, both light and dark.
- **Customizable Durations**: Configure your work and break session lengths in the extension settings.

![Preview](https://raw.githubusercontent.com/darrenjaworski/paulie-pomodoro/refs/heads/main/paulie-pomodoro-preview.png)

---

## Requirements

No special requirements. Just install and start using!

---

## Extension Settings

This extension contributes the following settings:

- `paulie-pomodoro.workingSessionLength`: Length of the working session in minutes (default: 24)
- `paulie-pomodoro.breakSessionLength`: Length of the break session in minutes (default: 6)

---

## Commands

- **Paulie Pomodoro: Start Timer**: Start the Pomodoro timer
- **Paulie Pomodoro: Pause Timer**: Pause the timer
- **Paulie Pomodoro: Reset Timer**: Reset the timer to the beginning of the current session
- **Paulie Pomodoro: Switch Session Type**: Switch between work and break sessions

You can access these commands from the Command Palette or via the webview controls.

---

## Known Issues

[Please report any bugs or issues on the extension's Github repo.](https://github.com/darrenjaworski/paulie-pomodoro/issues/new)

---

## Release Notes

### 1.0.0

- feat: Pomodoro timer
- feat: webview controls
- feat: status bar integration
- feat: theme support
- feat: settings
- feat: commands
