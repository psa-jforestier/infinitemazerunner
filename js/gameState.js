/**
 * Game State and Logic
 */

class GameState {
    constructor() {
        // Player identification
        this.currentPlayerId = '';
        this.currentGameId = '';
        this.currentGameSeed = 0;

        

        // Powerup system
        this.collectedPowerups = new Set();
 

        // Multiplayer
        this.otherPlayers = {};

        // Game timing
        this.gameStartedAt = null;

        // Maze instance
        this.maze = null;

        // Grid settings
        this.gridSize = INITIAL_GRID_SIZE;
        this.cellSize = 0;

        // High scores tracking
        this.highscores = {};

        this.resetPlayer();
    }

    /**
     * Initialize game state with IDs from server
     */
    async initializeWithServerData(seed, playerId, gameId) {
        this.currentGameSeed = seed;
        this.currentGameId = gameId;
        this.currentPlayerId = playerId;

        // Persist player ID in localStorage
        if (!localStorage.getItem("MazePlayerId")) {
            localStorage.setItem("MazePlayerId", playerId);
        } else {
            this.currentPlayerId = localStorage.getItem("MazePlayerId");
        }

        this.maze = new InfiniteMaze(this.currentGameSeed);
    }

    /**
     * Reset player to origin
     */
    resetPlayer() {
        // reset Player position, 
        this.playerX = 0;
        this.playerY = 0;
        this.playerIconIndex = 0;
        this.hasLeftOrigin = false;
        this.ghostMovesRemaining = 0;
        this.collectedPowerups.clear();
        this.gameStartedAt = null;
        this.isDead = false;
        this.isZoomedOut = false;
        this.gridSize = ZOOM_IN_SIZE;
    }

    /**
     * Move player to new position
     */
    movePlayer(newX, newY) {
        if (!this.maze.canMove(this.playerX, this.playerY, newX, newY, this.ghostMovesRemaining)) {
            return false;
        }

        // Check if player is trapped
        if (this.ghostMovesRemaining === 0 && this.maze.getWallCount(this.playerX, this.playerY) === 4) {
            return false;
        }

        this.playerX = newX;
        this.playerY = newY;

        if (this.playerX !== 0 || this.playerY !== 0) {
            this.hasLeftOrigin = true;
        }

        this.playerIconIndex = (this.playerIconIndex + 1) % PLAYER_ICONS.length;

        // Decrement ghost mode
        if (this.ghostMovesRemaining > 0) {
            this.ghostMovesRemaining--;
        }

        this.checkPowerupCollection();
        return true;
    }

    /**
     * Check and collect powerup at current position
     */
    checkPowerupCollection() {
        const powerupKey = `${this.playerX},${this.playerY}`;
        const powerupType = this.maze.getPowerupType(this.playerX, this.playerY);

        if (powerupType && !this.collectedPowerups.has(powerupKey)) {
            this.collectedPowerups.add(powerupKey);
            this.applyPowerup(powerupType);
        }
    }

    /**
     * Apply powerup effect
     */
    applyPowerup(type) {
        if (type === 'ZOOM') {
            if (this.isZoomedOut) {
                this.gridSize = ZOOM_IN_SIZE;
                this.isZoomedOut = false;
            } else {
                this.gridSize = ZOOM_OUT_SIZE;
                this.isZoomedOut = true;
            }
        } else if (type === 'GHOST') {
            this.ghostMovesRemaining = GHOST_MODE_DURATION;
        }
    }

    /**
     * Get current distance from origin
     */
    getDistance() {
        return Math.sqrt(this.playerX * this.playerX + this.playerY * this.playerY);
    }

    /**
     * Start the game timer
     */
    startTimer() {
        if (this.gameStartedAt === null) {
            this.gameStartedAt = new Date();
        }
    }

    /**
     * Get remaining game time in seconds
     */
    getRemainingTime() {
        if (this.gameStartedAt === null) return GAME_DURATION;
        const now = new Date();
        const elapsedMs = now - this.gameStartedAt;
        const elapsedSeconds = elapsedMs / 1000;
        return Math.max(0, GAME_DURATION - elapsedSeconds);
    }

    /**
     * Check if game time is up
     */
    isTimeUp() {
        return this.getRemainingTime() <= 0;
    }
}

// Global game state instance
const gameState = new GameState();
