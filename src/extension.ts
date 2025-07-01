// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { PomodoroWebviewProvider } from "./pomodoroWebviewProvider";

enum SessionType {
  Work = "Work",
  Break = "Break",
}

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "paulie-pomodoro" is now active!'
  );

  const provider = new PomodoroWebviewProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      PomodoroWebviewProvider.viewType,
      provider
    )
  );

  let statusBarItem: vscode.StatusBarItem;
  let remainingSeconds: number = 0;
  let currentSessionType: SessionType = SessionType.Work;
  let isPaused: boolean = true;

  const updateUI = () => {
    updateStatusBar();
    provider.updateTimer(remainingSeconds, currentSessionType, isPaused);
  };

  const updateStatusBar = () => {
    // Fetch defaults from configuration, matching package.json
    const workDurationConfig = vscode.workspace
      .getConfiguration("paulie-pomodoro")
      .get<number>("workingSessionLength", 24);
    const breakDurationConfig = vscode.workspace
      .getConfiguration("paulie-pomodoro")
      .get<number>("breakSessionLength", 6);
    const workDuration = workDurationConfig * 60;
    const breakDuration = breakDurationConfig * 60;

    if (!statusBarItem) {
      // Initialize if not already done
      statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        100
      ); // Changed to Left alignment
      context.subscriptions.push(statusBarItem);
      statusBarItem.show();
    }

    const sessionEmoji = currentSessionType === SessionType.Work ? "👷" : "😴";

    if (isPaused) {
      if (remainingSeconds === 0) {
        // Initial state or after reset/session switch
        remainingSeconds =
          currentSessionType === SessionType.Work
            ? workDuration
            : breakDuration;
      }
      statusBarItem.text = `$(play) ${formatTime(
        remainingSeconds
      )} ${sessionEmoji}`;
      statusBarItem.tooltip = "Paulie Pomodoro"; // Updated tooltip
    } else {
      statusBarItem.text = `$(debug-pause) ${formatTime(
        remainingSeconds
      )} ${sessionEmoji}`;
      statusBarItem.tooltip = "Paulie Pomodoro"; // Updated tooltip
    }
    statusBarItem.command = "paulie-pomodoro.statusBarClick"; // New command for combined actions
    // Remove the direct call to provider.updateTimer from here
  };

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (totalSeconds >= 60) {
      return `${minutes}m`;
    } else {
      return `${seconds}s`;
    }
  };

  const startTimer = () => {
    isPaused = false;
    const workDuration =
      vscode.workspace
        .getConfiguration("paulie-pomodoro")
        .get<number>("workingSessionLength", 24) * 60;
    const breakDuration =
      vscode.workspace
        .getConfiguration("paulie-pomodoro")
        .get<number>("breakSessionLength", 6) * 60;

    if (remainingSeconds === 0) {
      remainingSeconds =
        currentSessionType === SessionType.Work ? workDuration : breakDuration;
    }

    if (globalTimerInterval) {
      clearInterval(globalTimerInterval);
    }

    globalTimerInterval = setInterval(() => {
      remainingSeconds--;
      if (remainingSeconds < 0) {
        clearInterval(globalTimerInterval as NodeJS.Timeout);
        globalTimerInterval = undefined;
        const enableNotifications = vscode.workspace
          .getConfiguration("paulie-pomodoro")
          .get<boolean>("enableNotifications", false);
        if (enableNotifications) {
          vscode.window.showInformationMessage(
            `${currentSessionType} session ended!`
          );
        }
        currentSessionType =
          currentSessionType === SessionType.Work
            ? SessionType.Break
            : SessionType.Work;
        isPaused = true;
        remainingSeconds = 0;
        updateUI(); // Update both status bar and webview
        return;
      }
      updateUI(); // Update both status bar and webview
    }, 1000);
    updateUI(); // Update both status bar and webview
  };

  const pauseTimer = () => {
    isPaused = true;
    if (globalTimerInterval) {
      clearInterval(globalTimerInterval);
      globalTimerInterval = undefined;
    }
    updateUI(); // Update both status bar and webview
  };

  const resetTimer = () => {
    isPaused = true;
    if (globalTimerInterval) {
      clearInterval(globalTimerInterval);
      globalTimerInterval = undefined;
    }
    remainingSeconds = 0;
    // This will cause updateStatusBar to pick up the configured duration
    // for the current session type when it's next called (e.g. by start or by itself)
    updateUI(); // Update both status bar and webview
  };

  const switchSessionType = () => {
    pauseTimer(); // This will call updateUI
    currentSessionType =
      currentSessionType === SessionType.Work
        ? SessionType.Break
        : SessionType.Work;
    remainingSeconds = 0;
    isPaused = true;
    updateUI(); // Update both status bar and webview
  };

  const statusBarClickHandler = () => {
    if (isPaused) {
      startTimer();
    } else {
      pauseTimer();
    }
    vscode.commands.executeCommand(
      "workbench.view.extension.paulie-pomodoro-container"
    );
  };

  context.subscriptions.push(
    vscode.commands.registerCommand("paulie-pomodoro.startTimer", startTimer),
    vscode.commands.registerCommand("paulie-pomodoro.pauseTimer", pauseTimer),
    vscode.commands.registerCommand("paulie-pomodoro.resetTimer", resetTimer),
    vscode.commands.registerCommand(
      "paulie-pomodoro.switchSessionType",
      switchSessionType
    ),
    vscode.commands.registerCommand(
      "paulie-pomodoro.statusBarClick",
      statusBarClickHandler
    ), // Register the new command
    vscode.commands.registerCommand("paulie-pomodoro.updateUI", updateUI)
  );

  updateUI(); // Initial setup of the status bar and webview
}

let globalTimerInterval: NodeJS.Timeout | undefined;

export function deactivate() {
  if (globalTimerInterval) {
    // Clear interval if extension is deactivated
    clearInterval(globalTimerInterval);
    globalTimerInterval = undefined;
  }
}
