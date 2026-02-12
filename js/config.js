/**
 * Game Configuration and Constants
 */

// Server URL configuration
const serverUrl = window.location.hostname 
    ? './/' 
    : 'http://localhost:8000/';

// Debug mode
const DEBUG = false;

// Server communication interval
const SERVER_REFRESH_INTERVAL = DEBUG ? 1000000000 : 10000; // 10 seconds

// Grid and display settings
const INITIAL_GRID_SIZE = DEBUG ? 31 : 7;
const MOVE_DELAY = 200; // Milliseconds between moves
const GHOST_MODE_DURATION = 20; // moves
const ZOOM_IN_SIZE = 7;
const ZOOM_OUT_SIZE = 15;

// Game timing
const GAME_DURATION = 20; // seconds
const TIMER_UPDATE_INTERVAL = 100; // milliseconds
const SCOREBOARD_LIMIT = 10; // Top 10 players

// Player icons
const PLAYER_ICONS = ['😀', '😃', '😄', '😊', '😑', '😐', '😏', '😑', '😒', '😐', '😕'];
const PLAYER_EMOJI = '😀';
const ENEMY_EMOJI = '😈';
const BOMB_EMOJI = ['💣', '🧨'];

// Powerup types and probabilities
const POWERUP_TYPES = {
    GHOST: { icon: '👻', probability:   1/200 },
    ZOOM:  { icon: '🔍', probability:   1/150 },
    NONE:  { icon: '❌', probability: 1 }
};

POWERUP_TYPES.TOTAL_PROBABILITY = 
    Object.values(POWERUP_TYPES).reduce((acc, type) => acc + type.probability, 0);
