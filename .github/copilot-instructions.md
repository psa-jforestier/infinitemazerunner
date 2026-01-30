# Copilot Instructions: Infinite Maze Runner

## Project Overview
A real-time multiplayer maze game where players compete to escape an infinitely-generated maze within 60 seconds. Architecture: vanilla JavaScript frontend + PHP backend with JSON file persistence.

## Architecture & Components

### Frontend ([index.html](index.html))
- Canvas-based rendering (HTML5 Canvas with pixelated styling)
- Game loop handling: keyboard input, maze rendering, player/NPC positions
- Two power-up mechanics: Ghost Mode (walk through walls for 20 steps) and Zoom Mode (expanded field of view)
- Real-time rendering of player (😀 yellow), enemies (😈 red), and collectibles
- Communicates with backend every 10 seconds to sync multiplayer positions

### Backend
- **[init.php](init.php)**: Initialization endpoint - generates player ID (randomized) and game ID (deterministic, based on minute). Game ID ensures all players joining within the same minute see the same maze layout.
- **[me.php](me.php)**: Polling endpoint - receives player's (x,y) position and returns positions of all players in the same game session. Uses MD5 hash of game ID as the data file identifier.

### Data Storage
- **[data/](data/)** folder: JSON files storing game state (format: `{created, updated, gameid, players}`). One file per unique game ID (hashed). Simple file-based persistence without database. Old game files can be periodically cleaned up

## Key Patterns & Conventions

### Game ID Generation (Critical for Multiplayer Sync)
Pseudo-random seeding based on current timestamp (YmdHi format). This ensures:
- Same maze generated for all players starting in the same minute
- Maze changes every minute (players get new random layout)
- Deterministic generation from seed using modulo operations on word arrays

### Coordinate System & Maze Generation
Maze is "infinite" (procedurally generated on-demand). Coordinates tracked as (x, y). Frontend renders viewport around player position; backend doesn't validate collision—client-side handles this.

### Player Synchronization
- Clients poll `/me.php` every ~10 seconds with their current position
- Response includes all players in the session (no filtering by distance)
- Data persisted per game session in hashed JSON files
- CORS headers enabled for cross-origin frontend hosting

## Developer Workflows

### Setup
1. Place all files in web root (index.html, init.php, me.php)
2. Create `/data` folder with read-write permissions for PHP process
3. Serve via HTTP/HTTPS (CORS enabled, works cross-origin)

### Testing/Debugging
- Open index.html in browser—no build step required
- Browser console logs game events
- JSON files in `/data` show real-time player positions
- Adjust game seed in init.php to force same maze regeneration

### Extending Functionality
- New power-ups: Add emoji constants in frontend, implement step/duration logic in game loop
- New player stats: Extend JSON schema in me.php (players array objects)
- Maze algorithm: JavaScript procedural generation likely uses seed-based PRNGs (inspect canvas rendering)

## Critical Dependencies & Integration Points
- **No external libraries assumed**—pure vanilla JS, standard PHP
- **File system permissions**—PHP must write to `/data` folder
- **Time-based logic**—system clock drives game ID generation; ensure server time is accurate
- **Client-server contract**: init.php returns `{seed, playerid, gameid}`; me.php expects `?gid=X&pid=Y&x=Z&y=W`
