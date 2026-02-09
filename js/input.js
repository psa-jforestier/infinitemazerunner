/**
 * Input Handling Module
 * Handles keyboard, touch, and mouse input
 */

class InputHandler {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.mouseDirection = { dx: 0, dy: 0 };
        this.isMouseOverCanvas = false;
        this.lastMoveTime = 0;
        this.gameLoopId = null;

        this.attachEventListeners();
    }

    /**
     * Attach all event listeners
     */
    attachEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        this.canvas.addEventListener('touchstart', (e) => this.handleTouch(e), { passive: false });
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseleave', (e) => this.handleMouseLeave(e));
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    /**
     * Handle keyboard input
     */
    handleKeyPress(event) {
        if (gameState.isDead) return;
        
        let newX = gameState.playerX;
        let newY = gameState.playerY;

        switch (event.key.toLowerCase()) {
            case 'arrowup':
            case 'w':
            case 'z':
                newY = gameState.playerY - 1;
                break;
            case 'arrowdown':
            case 's':
                newY = gameState.playerY + 1;
                break;
            case 'arrowleft':
            case 'a':
            case 'q':
                newX = gameState.playerX - 1;
                break;
            case 'arrowright':
            case 'd':
                newX = gameState.playerX + 1;
                break;
            case 'r':
                gameState.resetPlayer();
                renderer.draw();
                updateUI();
                return;
            default:
                return;
        }

        this.attemptMove(newX, newY);
        event.preventDefault();
    }

    /**
     * Handle touch input
     */
    handleTouch(event) {
        event.preventDefault();

        if (gameState.isDead || event.touches.length === 0) return;

        const rect = this.canvas.getBoundingClientRect();
        const touchX = event.touches[0].clientX - rect.left;
        const touchY = event.touches[0].clientY - rect.top;

        this.attemptMoveBasedOnPosition(touchX, touchY);
    }

    /**
     * Handle mouse movement
     */
    handleMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (mouseX < 0 || mouseX >= this.canvas.width || mouseY < 0 || mouseY >= this.canvas.height) {
            this.isMouseOverCanvas = false;
            this.mouseDirection = { dx: 0, dy: 0 };
            return;
        }

        this.isMouseOverCanvas = true;
        this.updateMouseDirection(mouseX, mouseY);
    }

    /**
     * Handle mouse leaving canvas
     */
    handleMouseLeave() {
        this.isMouseOverCanvas = false;
        this.mouseDirection = { dx: 0, dy: 0 };
    }

    /**
     * Update mouse direction based on position
     */
    updateMouseDirection(mouseX, mouseY) {
        const cellX = Math.floor(mouseX / gameState.cellSize);
        const cellY = Math.floor(mouseY / gameState.cellSize);

        const playerCellX = Math.floor(gameState.gridSize / 2);
        const playerCellY = Math.floor(gameState.gridSize / 2);

        const cellDx = cellX - playerCellX;
        const cellDy = cellY - playerCellY;

        this.mouseDirection = { dx: 0, dy: 0 };

        if (cellDx === 0 && cellDy === 0) {
            return;
        }

        if (Math.abs(cellDx) > Math.abs(cellDy)) {
            this.mouseDirection.dx = cellDx > 0 ? 1 : -1;
        } else {
            this.mouseDirection.dy = cellDy > 0 ? 1 : -1;
        }
    }

    /**
     * Attempt movement based on touch/click position
     */
    attemptMoveBasedOnPosition(posX, posY) {
        const cellX = Math.floor(posX / gameState.cellSize);
        const cellY = Math.floor(posY / gameState.cellSize);

        const playerCellX = Math.floor(gameState.gridSize / 2);
        const playerCellY = Math.floor(gameState.gridSize / 2);

        const cellDx = cellX - playerCellX;
        const cellDy = cellY - playerCellY;

        let newX = gameState.playerX;
        let newY = gameState.playerY;

        if (Math.abs(cellDx) > Math.abs(cellDy)) {
            newX = gameState.playerX + (cellDx > 0 ? 1 : -1);
        } else if (cellDy !== 0) {
            newY = gameState.playerY + (cellDy > 0 ? 1 : -1);
        }

        this.attemptMove(newX, newY);
    }

    /**
     * Attempt to move player to new position
     */
    attemptMove(newX, newY) {
        if (gameState.movePlayer(newX, newY)) {
            // Start timer on first move after reset
            if (gameState.gameStartedAt === null) {
                uiManager.startTimer();
            }
            renderer.draw();
            updateUI();
        }
    }

    /**
     * Start the game loop for continuous mouse movement
     */
    startGameLoop() {
        this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
    }

    /**
     * Main game loop
     */
    gameLoop() {
        const now = Date.now();

        if (!gameState.isDead && this.isMouseOverCanvas && (this.mouseDirection.dx !== 0 || this.mouseDirection.dy !== 0)) {
            if (now - this.lastMoveTime >= MOVE_DELAY) {
                const newX = gameState.playerX + this.mouseDirection.dx;
                const newY = gameState.playerY + this.mouseDirection.dy;

                if (gameState.movePlayer(newX, newY)) {
                    this.lastMoveTime = now;
                    renderer.draw();
                    updateUI();
                }
            }
        }

        this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
    }
}

// Global input handler instance
let inputHandler = null;

function initializeInputHandler() {
    inputHandler = new InputHandler('gameCanvas');
    inputHandler.startGameLoop();
}
