/**
 * A* Pathfinding Algorithm Implementation
 * Uses priority queue with open/closed sets for optimal pathfinding
 */

class PriorityQueue {
    constructor() {
        this.items = [];
    }

    enqueue(item, priority) {
        this.items.push({ item, priority });
        this.items.sort((a, b) => a.priority - b.priority);
    }

    dequeue() {
        return this.items.shift()?.item;
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }
}

class AStar {
    constructor(boardProperties, snake, food) {
        this.validateDependencies(boardProperties, snake, food);
        this.boardProperties = boardProperties;
        this.snake = snake;
        this.food = food;
    }

    validateDependencies(boardProperties, snake, food) {
        if (!boardProperties || typeof boardProperties !== 'object') {
            throw new Error('Invalid boardProperties: expected object');
        }
        if (!snake || typeof snake !== 'object') {
            throw new Error('Invalid snake: expected object');
        }
        if (!food || typeof food !== 'object') {
            throw new Error('Invalid food: expected object');
        }
    }

    /**
     * Run A* algorithm to find optimal path
     * @returns {string|null} Direction to move ("Up", "Down", "Left", "Right") or null
     */
    run() {
        // Get current snake head position
        const startX = this.snake.posX;
        const startY = this.snake.posY;
        const goalX = this.food.posX;
        const goalY = this.food.posY;

        // Initialize open set (priority queue) and closed set
        const openSet = new PriorityQueue();
        const closedSet = new Set();
        const cameFrom = new Map();
        const gScore = new Map();
        const fScore = new Map();

        const startKey = this.getKey(startX, startY);
        gScore.set(startKey, 0);
        fScore.set(startKey, this.heuristic(startX, startY, goalX, goalY));
        openSet.enqueue({ x: startX, y: startY }, fScore.get(startKey));

        while (!openSet.isEmpty()) {
            const current = openSet.dequeue();
            const currentKey = this.getKey(current.x, current.y);

            // Check if we reached the goal
            if (current.x === goalX && current.y === goalY) {
                return this.getFirstMove(cameFrom, current, startX, startY);
            }

            closedSet.add(currentKey);

            // Explore neighbors
            const neighbors = this.getNeighbors(current.x, current.y);
            
            for (const neighbor of neighbors) {
                const neighborKey = this.getKey(neighbor.x, neighbor.y);

                if (closedSet.has(neighborKey)) continue;
                if (this.isSnakeBody(neighbor.x, neighbor.y)) continue;

                const tentativeGScore = (gScore.get(currentKey) || Infinity) + 1;

                if (tentativeGScore < (gScore.get(neighborKey) || Infinity)) {
                    cameFrom.set(neighborKey, { x: current.x, y: current.y, direction: neighbor.direction });
                    gScore.set(neighborKey, tentativeGScore);
                    fScore.set(neighborKey, tentativeGScore + this.heuristic(neighbor.x, neighbor.y, goalX, goalY));
                    
                    openSet.enqueue({ x: neighbor.x, y: neighbor.y }, fScore.get(neighborKey));
                }
            }
        }

        // No path found - fallback to safe move
        return this.findSafeMove();
    }

    getKey(x, y) {
        return `${x},${y}`;
    }

    heuristic(x1, y1, x2, y2) {
        // Manhattan distance
        return Math.abs(x2 - x1) + Math.abs(y2 - y1);
    }

    getNeighbors(x, y) {
        const neighbors = [];
        const maxX = this.boardProperties.posX;
        const maxY = this.boardProperties.posY;

        // Up
        if (y > 1) neighbors.push({ x, y: y - 1, direction: "Up" });
        // Down
        if (y < maxY) neighbors.push({ x, y: y + 1, direction: "Down" });
        // Left
        if (x > 1) neighbors.push({ x: x - 1, y, direction: "Left" });
        // Right
        if (x < maxX) neighbors.push({ x: x + 1, y, direction: "Right" });

        return neighbors;
    }

    isSnakeBody(posX, posY) {
        const blockSize = this.boardProperties.blockSize;
        for (let i = 0; i < this.snake.body.length; i++) {
            const bodyPartX = this.snake.body[i][0] / blockSize + 1;
            const bodyPartY = this.snake.body[i][1] / blockSize + 1;
            if (bodyPartX === posX && bodyPartY === posY) {
                return true;
            }
        }
        return false;
    }

    getFirstMove(cameFrom, current, startX, startY) {
        // Trace back to find the first move from start
        let move = current;
        let prev = cameFrom.get(this.getKey(move.x, move.y));

        while (prev) {
            if (prev.x === startX && prev.y === startY) {
                return move.direction || prev.direction;
            }
            move = prev;
            prev = cameFrom.get(this.getKey(move.x, move.y));
        }

        return null;
    }

    findSafeMove() {
        // When no path to food exists, find any safe move
        const posX = this.snake.posX;
        const posY = this.snake.posY;
        const oppositeSpeed = { x: -this.snake.speedX, y: -this.snake.speedY };

        const directions = [
            { position: "Up", posX: posX, posY: posY - 1, dx: 0, dy: -1 },
            { position: "Down", posX: posX, posY: posY + 1, dx: 0, dy: 1 },
            { position: "Left", posX: posX - 1, posY: posY, dx: -1, dy: 0 },
            { position: "Right", posX: posX + 1, posY: posY, dx: 1, dy: 0 }
        ];

        let bestMove = null;
        let minDistance = Infinity;

        for (const dir of directions) {
            // Check bounds
            if (dir.posX <= 0 || dir.posY <= 0 || 
                dir.posX > this.boardProperties.posX || 
                dir.posY > this.boardProperties.posY) {
                continue;
            }

            // Check opposite direction (can't reverse)
            if (dir.dx === oppositeSpeed.x && dir.dy === oppositeSpeed.y) {
                continue;
            }

            // Check collision with body
            if (this.isSnakeBody(dir.posX, dir.posY)) {
                continue;
            }

            // Pick the move closest to food
            const dist = this.heuristic(dir.posX, dir.posY, this.food.posX, this.food.posY);
            if (dist < minDistance) {
                minDistance = dist;
                bestMove = dir.position;
            }
        }

        return bestMove;
    }
}

/**
 * Factory function for backward compatibility
 * @param {Object} boardProperties - Board configuration
 * @param {Object} snake - Snake state
 * @param {Object} food - Food position
 * @returns {string|null} Direction to move
 */
function runAStar(boardProperties, snake, food) {
    const aStar = new AStar(boardProperties, snake, food);
    return aStar.run();
}

export { AStar, PriorityQueue, runAStar };
export default AStar;
