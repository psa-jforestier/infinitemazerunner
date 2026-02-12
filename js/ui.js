/**
 * UI Update Module
 * Handles all UI display updates
 */

class UIManager {
    constructor() {
        this.positionDisplay = document.getElementById('position');
        this.playerIdDisplay = document.getElementById('playerId');
        this.gameIdDisplay = document.getElementById('gameId');
        this.otherPlayersDisplay = document.getElementById('otherPlayers');
        this.countdownDisplay = document.getElementById('countdownId');
        this.scoreboardList = document.getElementById('scoreboardList');
        this.deathOverlay = document.getElementById('deathOverlay');
        this.deathMessage = document.getElementById('deathMessage');
        this.retryButton = document.getElementById('retryButton');
        this.timerIntervalId = null;

        if (this.retryButton) {
            this.retryButton.addEventListener('click', () => this.handleRetry());
        }
    }

    /**
     * Update player position and game info display
     */
    updatePositionDisplay() {
        const distance = gameState.getDistance().toFixed(1);
        let displayText = `Position: (${gameState.playerX}, ${gameState.playerY}) | Distance: ${distance}`;

        if (gameState.ghostMovesRemaining > 0) {
            displayText += ` - Ghost: ${gameState.ghostMovesRemaining}`;
        }

        this.positionDisplay.textContent = displayText;
    }

    /**
     * Update IDs display
     */
    updateIdsDisplay() {
        this.playerIdDisplay.textContent = `Player ID: ${gameState.currentPlayerId}`;
        this.gameIdDisplay.textContent = `Game ID: ${gameState.currentGameId}`;
    }

    /**
     * Update other players count
     */
    updateOtherPlayersCount() {
        this.otherPlayersDisplay.textContent = `Other Players: ${Object.keys(gameState.otherPlayers).length}`;
    }

    /**
     * Update countdown timer
     */
    updateCountdown() {
        const remaining = gameState.getRemainingTime();
        this.countdownDisplay.textContent = `${remaining.toFixed(1)}s`;

        if (gameState.isTimeUp()) {
            this.handleGameOver();
        }
    }

    /**
     * Start the timer display update
     */
    startTimer() {
        gameState.startTimer();
        if (!this.timerIntervalId) {
            this.timerIntervalId = setInterval(() => this.updateCountdown(), TIMER_UPDATE_INTERVAL);
        }
    }

    /**
     * Stop the timer
     */
    stopTimer() {
        if (this.timerIntervalId) {
            clearInterval(this.timerIntervalId);
            this.timerIntervalId = null;
        }
    }

    /**
     * Handle game over
     */
    handleGameOver() {
        die("Boom! The bomb exploded!");
    }

    /**
     * Show death popup
     */
    showDeathPopup(reason) {
        gameState.isDead = true;
        if (this.deathMessage) {
            this.deathMessage.textContent = reason;
        }
        if (this.deathOverlay) {
            this.deathOverlay.classList.remove('hidden');
            this.deathOverlay.setAttribute('aria-hidden', 'false');
        }
    }

    /**
     * Hide death popup
     */
    hideDeathPopup() {
        if (this.deathOverlay) {
            this.deathOverlay.classList.add('hidden');
            this.deathOverlay.setAttribute('aria-hidden', 'true');
        }
    }

    /**
     * Handle retry click
     */
    handleRetry() {
        this.hideDeathPopup();
        gameState.resetPlayer();
        this.updatePositionDisplay();
        renderer.draw();
    }

    /**
     * Update scoreboard display
     */
    updateScoreboard() {
        const scores = [];
        for (const [playerName, playerData] of Object.entries(gameState.highscores)) {
            scores.push({
                name: playerName,
                distance: playerData.score || 0
            });
        }

        scores.sort((a, b) => b.distance - a.distance);
        const top10 = scores.slice(0, SCOREBOARD_LIMIT);

        let html = '';
        top10.forEach((entry, index) => {
            const distance = Math.round(entry.distance * 10) / 10;
            html += `<div class="scoreboard-entry">
                <span class="scoreboard-rank">#${index + 1}</span>
                <span class="scoreboard-name">${entry.name}</span>
                <span class="scoreboard-distance">${distance}</span>
            </div>`;
        });

        this.scoreboardList.innerHTML = html;
    }
}

// Global UI manager instance
let uiManager = null;

function initializeUIManager() {
    uiManager = new UIManager();
    uiManager.updateIdsDisplay();
    uiManager.updateOtherPlayersCount();
}

/**
 * Update all UI elements
 */
function updateUI() {
    uiManager.updatePositionDisplay();
    renderer.draw();
}

/**
 * Update other players count
 */
function updateOtherPlayersCount() {
    uiManager.updateOtherPlayersCount();
}

/**
 * Update scoreboard
 */
function updateScoreboard() {
    uiManager.updateScoreboard();
}

/**
 * Handle player death
 */
function die(reason) {
    uiManager.stopTimer();
    ServerComm.notifyPlayerDeath(reason);
    uiManager.showDeathPopup(reason);
}
