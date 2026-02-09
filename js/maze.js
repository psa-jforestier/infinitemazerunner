/**
 * Infinite Maze Generator
 * Uses 8x8 chunk-based maze with 4 different chunk types
 * Chunks are selected pseudo-randomly based on chunk coordinates and seed
 */

class InfiniteMaze {
    constructor(gameSeed = 0) {
        this.gameSeed = gameSeed;
        this.chunkCache = {}; // Cache chunks to avoid recalculation
        this.NUM_CHUNK_TYPES = MAZE_CHUNKS.length;
    }

    /**
     * Generate pseudo-random value based on coordinates and seed
     * Returns a float between 0 and 1
     */
    getPseudoRandom(x, y) {
        const seed = (
            (Math.abs(x * 73856093 ^ y * 19349663) + this.gameSeed)
            % 1000003
        );

        const a = 1664525;      // LCG multiplier
        const c = 1013904223;   // LCG increment
        const m = 4294967296;   // 2^32

        let lcgValue = (a * seed + c) % m;
        return lcgValue / (m - 1);
    }

    /**
     * Convert global coordinates to chunk coordinates and local cell coordinates
     * Returns {chunkX, chunkY, cellX, cellY}
     */
    getChunkAndCellCoordinates(globalX, globalY) {
        // Ensure we handle negative coordinates correctly
        const chunkX = Math.floor(globalX / CHUNK_SIZE);
        const chunkY = Math.floor(globalY / CHUNK_SIZE);
        
        const cellX = ((globalX % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
        const cellY = ((globalY % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
        
        return { chunkX, chunkY, cellX, cellY };
    }

    /**
     * Get the chunk type for given chunk coordinates
     * Returns a number 0-3 representing which of the 4 chunks to use
     */
    getChunkType(chunkX, chunkY) {
        const r = this.getPseudoRandom(chunkX, chunkY);
        return Math.floor(r * this.NUM_CHUNK_TYPES);
    }

    /**
     * Get the chunk for given chunk coordinates
     */
    getChunk(chunkX, chunkY) {
        const cacheKey = `${chunkX},${chunkY}`;
        
        if (this.chunkCache[cacheKey]) {
            return this.chunkCache[cacheKey];
        }
        
        const chunkType = this.getChunkType(chunkX, chunkY);
        const chunk = MAZE_CHUNKS[chunkType];
        
        this.chunkCache[cacheKey] = chunk;
        return chunk;
    }

    /**
     * Get the cell configuration at a global coordinate
     */
    getCell(globalX, globalY) {
        const { chunkX, chunkY, cellX, cellY } = this.getChunkAndCellCoordinates(globalX, globalY);
        const chunk = this.getChunk(chunkX, chunkY);
        return chunk.cells[cellY][cellX];
    }

    /**
     * Get the background color for a chunk (for DEBUG visualization)
     */
    getChunkColor(chunkX, chunkY) {
        const chunk = this.getChunk(chunkX, chunkY);
        return chunk.color;
    }

    /**
     * Check if there's a wall between two adjacent cells
     */
    hasWall(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;

        if (dx === 0 && dy === 0) return true;
        if (Math.abs(dx) + Math.abs(dy) !== 1) return true;

        const cell1 = this.getCell(x1, y1);
        const cell2 = this.getCell(x2, y2);

        if (dy === -1) return cell1.top || cell2.bottom;      // Moving up
        if (dy === 1)  return cell1.bottom || cell2.top;       // Moving down
        if (dx === -1) return cell1.left || cell2.right;       // Moving left
        if (dx === 1)  return cell1.right || cell2.left;       // Moving right

        return true;
    }

    /**
     * Check if a movement is allowed (considering ghost mode)
     */
    canMove(fromX, fromY, toX, toY, ghostMovesRemaining = 0) {
        if (ghostMovesRemaining > 0) return true;
        return !this.hasWall(fromX, fromY, toX, toY);
    }

    /**
     * Count the number of walls surrounding a cell
     */
    getWallCount(x, y) {
        let count = 0;
        if (this.hasWall(x, y, x, y - 1)) count++;
        if (this.hasWall(x, y, x, y + 1)) count++;
        if (this.hasWall(x, y, x - 1, y)) count++;
        if (this.hasWall(x, y, x + 1, y)) count++;
        return count;
    }

    /**
     * Check if a cell contains a powerup
     */
    hasPowerup(x, y) {
        const totalProbability = POWERUP_TYPES.ZOOM.probability + POWERUP_TYPES.GHOST.probability;
        const hash = Math.abs(x * 73856093 ^ y * 19349663) % 10000;
        return (hash / 10000) < totalProbability;
    }

    /**
     * Get powerup type at a specific cell
     */
    getPowerupType(x, y) {
        const r = this.getPseudoRandom(x, y);
        let cumulativeProbability = 0;

        for (const type of Object.keys(POWERUP_TYPES)) {
            cumulativeProbability += POWERUP_TYPES[type].probability;
            if (r <= cumulativeProbability) {
                return type === 'NONE' ? null : type;
            }
        }

        return null;
    }
}
