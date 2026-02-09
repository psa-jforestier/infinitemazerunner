/**
 * Game Main Entry Point
 * Initializes and starts the game
 */

async function initializeGame() {
    try {
        // Initialize server communication and fetch game data
        await ServerComm.initializeGame();

        // Initialize UI manager
        initializeUIManager();

        // Initialize renderer
        initializeRenderer();

        // Initialize input handler
        initializeInputHandler();

        // Start server synchronization
        startServerSync();

        // Initial render
        renderer.draw();
        updateUI();

        // Start the game
        startGame();
    } catch (error) {
        console.error('Failed to start game:', error);
    }
}

/**
 * Start the actual game
 */
function startGame() {
    // Start timer when player leaves origin
    renderer.canvas.addEventListener('click', () => {
        if (gameState.hasLeftOrigin && gameState.gameStartedAt === null) {
            uiManager.startTimer();
        }
    });

    // Also start timer on first movement
    const originalMovePlayer = gameState.movePlayer.bind(gameState);
    gameState.movePlayer = function(newX, newY) {
        const result = originalMovePlayer(newX, newY);
        if (result && this.hasLeftOrigin && this.gameStartedAt === null) {
            uiManager.startTimer();
        }
        return result;
    };
}

// Start the game when page loads
window.addEventListener('load', initializeGame);
