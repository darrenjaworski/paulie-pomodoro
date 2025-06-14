window.addEventListener('message', event => {
    const message = event.data; // The JSON data our extension sent
    const timerDisplay = document.getElementById('timer-display');
    const sessionTypeDisplay = document.getElementById('session-type-display');
    const statusDisplay = document.getElementById('status-display');
    const startButton = document.getElementById('start-button');
    const pauseButton = document.getElementById('pause-button');

    switch (message.type) {
        case 'updateTimer':
            if (timerDisplay) {
                const minutes = Math.floor(message.remainingSeconds / 60);
                const seconds = message.remainingSeconds % 60;
                timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
            if (sessionTypeDisplay) {
                sessionTypeDisplay.textContent = message.currentSessionType;
            }
            if (statusDisplay) {
                statusDisplay.textContent = message.isPaused ? "Paused" : "Running";
            }
            if (startButton && pauseButton) {
                startButton.style.display = message.isPaused ? 'inline-block' : 'none';
                pauseButton.style.display = message.isPaused ? 'none' : 'inline-block';
            }
            break;
    }
});

const vscode = acquireVsCodeApi();

document.getElementById('start-button')?.addEventListener('click', () => {
    vscode.postMessage({ type: 'startTimer' });
});

document.getElementById('pause-button')?.addEventListener('click', () => {
    vscode.postMessage({ type: 'pauseTimer' });
});

document.getElementById('reset-button')?.addEventListener('click', () => {
    vscode.postMessage({ type: 'resetTimer' });
});

document.getElementById('switch-button')?.addEventListener('click', () => {
    vscode.postMessage({ type: 'switchSession' });
});
