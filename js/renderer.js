/**
 * Game Rendering Module
 */

class GameRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        if (DEBUG) {
            this.canvas.style.width = '640px';
            this.canvas.style.height = '640px';
        }
    }

    /**
     * Update canvas dimensions based on grid size
     */
    updateCellSize() {
        gameState.cellSize = this.canvas.width / gameState.gridSize;
    }

    /**
     * Draw the complete maze and game elements
     */
    draw() {
        this.updateCellSize();
        this.drawBackground();
        this.drawMazeCells();
        this.drawOtherPlayers();
        this.drawPlayer();
        this.drawBomb();
    }

    /**
     * Draw background
     */
    drawBackground() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draw all maze cells with walls and powerups
     */
    drawMazeCells() {
        const startX = gameState.playerX - Math.floor(gameState.gridSize / 2);
        const startY = gameState.playerY - Math.floor(gameState.gridSize / 2);

        const wallOpacity = gameState.ghostMovesRemaining > 0 ? 0.5 : 1.0;
        const powerupOpacity = gameState.ghostMovesRemaining > 0 ? 0.5 : 1.0;

        for (let gridY = 0; gridY < gameState.gridSize; gridY++) {
            for (let gridX = 0; gridX < gameState.gridSize; gridX++) {
                const mazeX = startX + gridX;
                const mazeY = startY + gridY;
                const screenX = gridX * gameState.cellSize;
                const screenY = gridY * gameState.cellSize;

                this.drawCell(mazeX, mazeY, screenX, screenY, wallOpacity, powerupOpacity);
            }
        }
    }

    /**
     * Draw a single maze cell
     */
    drawCell(mazeX, mazeY, screenX, screenY, wallOpacity, powerupOpacity) {
        // Draw cell background (chunk color in DEBUG, black otherwise)
        if (DEBUG) {
            const { chunkX, chunkY } = gameState.maze.getChunkAndCellCoordinates(mazeX, mazeY);
            const chunkColor = gameState.maze.getChunkColor(chunkX, chunkY);
            this.ctx.fillStyle = chunkColor;
        } else {
            this.ctx.fillStyle = '#000';
        }
        this.ctx.fillRect(screenX + 1, screenY + 1, gameState.cellSize - 2, gameState.cellSize - 2);

        // Draw walls
        this.ctx.globalAlpha = wallOpacity;
        this.ctx.strokeStyle = '#0af';
        this.ctx.lineWidth = 2;

        if (gameState.maze.hasWall(mazeX, mazeY, mazeX, mazeY - 1)) {
            this.drawLine(screenX, screenY, screenX + gameState.cellSize, screenY);
        }

        if (gameState.maze.hasWall(mazeX, mazeY, mazeX - 1, mazeY)) {
            this.drawLine(screenX, screenY, screenX, screenY + gameState.cellSize);
        }

        if (mazeX + 1 - gameState.playerX + Math.floor(gameState.gridSize / 2) === gameState.gridSize - 1) {
            if (gameState.maze.hasWall(mazeX, mazeY, mazeX + 1, mazeY)) {
                this.drawLine(screenX + gameState.cellSize, screenY, screenX + gameState.cellSize, screenY + gameState.cellSize);
            }
        }

        if (mazeY + 1 - gameState.playerY + Math.floor(gameState.gridSize / 2) === gameState.gridSize - 1) {
            if (gameState.maze.hasWall(mazeX, mazeY, mazeX, mazeY + 1)) {
                this.drawLine(screenX, screenY + gameState.cellSize, screenX + gameState.cellSize, screenY + gameState.cellSize);
            }
        }

        // Draw powerup
        this.ctx.globalAlpha = powerupOpacity;
        this.drawPowerup(mazeX, mazeY, screenX, screenY);

        this.ctx.globalAlpha = 1.0;
    }

    /**
     * Draw a line
     */
    drawLine(x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    /**
     * Draw powerup if present and not collected
     */
    drawPowerup(mazeX, mazeY, screenX, screenY) {
        const powerupKey = `${mazeX},${mazeY}`;
        const powerupType = gameState.maze.getPowerupType(mazeX, mazeY);

        if (powerupType && !gameState.collectedPowerups.has(powerupKey)) {
            this.ctx.font = `${gameState.cellSize * 0.6}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(
                POWERUP_TYPES[powerupType].icon,
                screenX + gameState.cellSize / 2,
                screenY + gameState.cellSize / 2
            );
        }
    }

    /**
     * Draw other players
     */
    drawOtherPlayers() {
        const startX = gameState.playerX - Math.floor(gameState.gridSize / 2);
        const startY = gameState.playerY - Math.floor(gameState.gridSize / 2);

        for (const playerId in gameState.otherPlayers) {
            if (playerId === gameState.currentPlayerId) continue;

            const otherPlayer = gameState.otherPlayers[playerId];
            const screenX = (otherPlayer.x - startX) * gameState.cellSize;
            const screenY = (otherPlayer.y - startY) * gameState.cellSize;

            if (screenX >= 0 && screenX < this.canvas.width && screenY >= 0 && screenY < this.canvas.height) {
                this.ctx.font = `${gameState.cellSize * 0.8}px Arial`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(ENEMY_EMOJI, screenX + gameState.cellSize / 2, screenY + gameState.cellSize / 2);
            }
        }
    }

    /**
     * Draw the current player at center
     */
    drawPlayer() {
        const centerX = Math.floor(gameState.gridSize / 2) * gameState.cellSize;
        const centerY = Math.floor(gameState.gridSize / 2) * gameState.cellSize;

        this.ctx.font = `${gameState.cellSize * 0.8}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(
            PLAYER_ICONS[gameState.playerIconIndex],
            centerX + gameState.cellSize / 2,
            centerY + gameState.cellSize / 2
        );
    }

    /**
     * Draw bomb at origin if player has left
     */
    drawBomb() {
        if (!gameState.hasLeftOrigin) return;

        const startX = gameState.playerX - Math.floor(gameState.gridSize / 2);
        const startY = gameState.playerY - Math.floor(gameState.gridSize / 2);

        const originScreenX = (0 - startX) * gameState.cellSize;
        const originScreenY = (0 - startY) * gameState.cellSize;

        if (originScreenX >= 0 && originScreenX < this.canvas.width &&
            originScreenY >= 0 && originScreenY < this.canvas.height) {
            this.ctx.font = `${gameState.cellSize * 0.8}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(BOMB_EMOJI, originScreenX + gameState.cellSize / 2, originScreenY + gameState.cellSize / 2);
        }
    }
}

// Global renderer instance
let renderer = null;

function initializeRenderer() {
    renderer = new GameRenderer('gameCanvas');
}
