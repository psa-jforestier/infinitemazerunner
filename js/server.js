/**
 * Server Communication Module
 * Handles all communication with the backend
 */

class ServerComm {
    /**
     * Initialize the game by fetching player and game IDs from server
     */
    static async initializeGame() {
        try {
            const response = await fetch(`${serverUrl}init.php`);
            const data = await response.json();

            const playerId = data.playerid;
            if (!localStorage.getItem("MazePlayerId")) {
                localStorage.setItem("MazePlayerId", playerId);
            } else {
                const storedId = localStorage.getItem("MazePlayerId");
                gameState.currentPlayerId = storedId;
            }

            await gameState.initializeWithServerData(data.seed, playerId, data.gameid);
            return true;
        } catch (error) {
            console.error('Failed to initialize game:', error);
            return this.initializeGameLocally();
        }
    }

    /**
     * Initialize game locally (fallback)
     */
    static initializeGameLocally() {
        const playerId = this.generatePlayerId();
        if (!localStorage.getItem("MazePlayerId")) {
            localStorage.setItem("MazePlayerId", playerId);
        } else {
            gameState.currentPlayerId = localStorage.getItem("MazePlayerId");
        }

        const seed = 10000;
        const gameId = `local-${seed}`;
        gameState.initializeWithServerData(seed, playerId, gameId);
        return true;
    }

    /**
     * Generate unique player identifier
     */
    static generatePlayerId(length = 10) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let playerId = '';
        for (let i = 0; i < length; i++) {
            playerId += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return playerId;
    }

    /**
     * Send player position to server
     */
    static sendPositionToServer() {
        const url = `${serverUrl}me.php?gid=${gameState.currentGameId}&pid=${gameState.currentPlayerId}&x=${gameState.playerX}&y=${gameState.playerY}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.players) {
                    gameState.otherPlayers = data.players;
                    updateOtherPlayersCount();
                }
                if (data && data.highscores) {
                    gameState.highscores = data.highscores;
                    updateScoreboard();
                }
            })
            .catch(error => {
                console.debug('Server communication error:', error);
            });
    }

    /**
     * Notify server of player death
     */
    static notifyPlayerDeath(reason) {
        const url = `${serverUrl}die.php?gid=${gameState.currentGameId}&pid=${gameState.currentPlayerId}&x=${gameState.playerX}&y=${gameState.playerY}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.highscores) {
                    gameState.highscores = data.highscores;
                    updateScoreboard();
                }
            })
            .catch(error => console.debug('Die notification error:', error));
    }
}

// Periodic server sync
let serverSyncInterval = null;

function startServerSync() {
    ServerComm.sendPositionToServer();
    serverSyncInterval = setInterval(() => {
        ServerComm.sendPositionToServer();
    }, SERVER_REFRESH_INTERVAL);
}

function stopServerSync() {
    if (serverSyncInterval) {
        clearInterval(serverSyncInterval);
        serverSyncInterval = null;
    }
}
