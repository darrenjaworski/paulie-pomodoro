# Paulie Pomodoro

A beautiful, theme-aware Pomodoro timer for VS Code, designed to help you stay focused and productive.

---

## Features

- **Pomodoro Timer**: Start, pause, reset, and switch between work and break sessions directly from the Activity Bar or the webview panel.
- **Status Bar Integration**: See your timer and session type at a glance in the VS Code status bar. Click to start/pause and open the controls.
- **Webview Panel**: Modern, responsive UI with large timer display, session type, and intuitive controls.
- **Theme Awareness**: All UI elements (timer, buttons, footer) adapt to your VS Code color theme, both light and dark.
- **Customizable Durations**: Configure your work and break session lengths in the extension settings.
- **Activity Bar Icon**: Uses a codicon or custom SVG for a native look.
- **Footer**: Shows "Developed with love ❤️ by darrenjaworski and Copilot" at the bottom of the webview.

![Screenshot](images/feature-x.png)

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

- The timer does not persist if VS Code is closed or reloaded.
- Only one timer can run at a time.

---

## Release Notes

### 0.0.1
- Initial release: Pomodoro timer, webview controls, status bar integration, theme support, and settings.

---

## Contributing

Pull requests and suggestions are welcome!

---

## License

MIT

---

**Developed with love ❤️ by [darrenjaworski](https://github.com/darrenjaworski) and Copilot.**
