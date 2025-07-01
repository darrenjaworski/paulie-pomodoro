window.addEventListener("message", (event) => {
  const message = event.data; // The JSON data our extension sent
  const timerDisplay = document.getElementById("timer-display");
  const sessionTypeDisplay = document.getElementById("session-type-display");
  const statusDisplay = document.getElementById("status-display");
  const startButton = document.getElementById("start-button");
  const pauseButton = document.getElementById("pause-button");

  switch (message.type) {
    case "updateTimer":
      if (timerDisplay) {
        timerDisplay.textContent = `${message.minutes.toString()}:${message.seconds
          .toString()
          .padStart(2, "0")}`;
      }
      if (sessionTypeDisplay) {
        sessionTypeDisplay.textContent =
          message.sessionType.charAt(0).toUpperCase() +
          message.sessionType.slice(1);
      }
      if (statusDisplay) {
        statusDisplay.textContent = message.isActive ? "Running" : "Paused";
      }
      if (startButton && pauseButton) {
        startButton.style.display = message.isActive ? "none" : "inline-block";
        pauseButton.style.display = message.isActive ? "inline-block" : "none";
      }
      break;
  }
});

const vscode = acquireVsCodeApi();

document.getElementById("start-button")?.addEventListener("click", () => {
  vscode.postMessage({ type: "startTimer" });
});

document.getElementById("pause-button")?.addEventListener("click", () => {
  vscode.postMessage({ type: "pauseTimer" });
});

document.getElementById("reset-button")?.addEventListener("click", () => {
  vscode.postMessage({ type: "resetTimer" });
});

document.getElementById("switch-button")?.addEventListener("click", () => {
  vscode.postMessage({ type: "switchSession" });
});
