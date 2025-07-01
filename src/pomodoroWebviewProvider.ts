import * as vscode from "vscode";

export class PomodoroWebviewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "paulie-pomodoro-webview"; // Matches the id in package.json

  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public updateTimerDisplay(
    minutes: number,
    seconds: number,
    sessionType: "work" | "break",
    isActive: boolean
  ) {
    if (this._view) {
      this._view.webview.postMessage({
        type: "updateTimer",
        minutes,
        seconds,
        sessionType,
        isActive,
      });
    }
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;
    // Initially, no badge until timer starts
    // webviewView.badge = undefined;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage((data) => {
      switch (data.type) {
        case "startTimer":
          vscode.commands.executeCommand("paulie-pomodoro.startTimer");
          break;
        case "pauseTimer":
          vscode.commands.executeCommand("paulie-pomodoro.pauseTimer");
          break;
        case "resetTimer":
          vscode.commands.executeCommand("paulie-pomodoro.resetTimer");
          break;
        case "switchSession":
          vscode.commands.executeCommand("paulie-pomodoro.switchSessionType");
          break;
      }
    });

    // Notify extension when the view is disposed
    webviewView.onDidDispose(() => {
      this._view = undefined; // Set to undefined when disposed
    });

    // Send the initial state to the webview
    vscode.commands.executeCommand("paulie-pomodoro.updateUI");
  }

  public updateTimer(
    remainingSeconds: number,
    sessionType: string,
    isPaused: boolean
  ) {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    const sessionTypeForWebview = sessionType.toLowerCase() as "work" | "break";
    const isActive = !isPaused;

    this.updateTimerDisplay(minutes, seconds, sessionTypeForWebview, isActive);
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    // Get the local path to main script run in the webview, then convert it to a URI
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "main.js")
    );

    // Get the local path to CSS styles
    const stylesUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "styles.css")
    );

    // Use a nonce to only allow specific scripts to be run
    const nonce = getNonce();

    return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} https://*.vscode-cdn.net https://cdnjs.cloudflare.com; script-src 'nonce-${nonce}'; font-src ${webview.cspSource} https://*.vscode-cdn.net https://cdnjs.cloudflare.com;">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="${stylesUri}" rel="stylesheet">
                <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet">
                <title>Paulie Pomodoro</title>
            </head>
            <body>
                <div class="container">
                    <h1>Paulie Pomodoro</h1>
                    
                    <div class="timer-info">
                        <div id="timer-display"></div>
                        <div id="session-status-container">
                             <span id="session-type-display">Work</span>
                        </div>
                    </div>

                    <div class="controls">
                        <button id="start-button" title="Start Timer"><i class="fas fa-play"></i></button>
                        <button id="pause-button" title="Pause Timer"><i class="fas fa-pause"></i></button>
                        <button id="reset-button" title="Reset Timer"><i class="fas fa-undo"></i></button>
                        <button id="switch-button" title="Switch Session"><i class="fas fa-exchange-alt"></i></button>
                    </div>
                </div>
                <script nonce="${nonce}" src="${scriptUri}"></script>
                <footer>
                    <p>Developed with love ❤️ by <a href="https://github.com/darrenjaworski" style="color: var(--vscode-textLink-foreground);">darrenjaworski</a> and Copilot.</p>
                </footer>
            </body>
            </html>`;
  }
}

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
