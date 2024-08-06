import { boardProperties, snake, food } from './game.js';

let neighbours = [
    { position: null, posX: null, posY: null, hCost: null, gCost: null, fCost: null },
    { position: null, posX: null, posY: null, hCost: null, gCost: null, fCost: null },
    { position: null, posX: null, posY: null, hCost: null, gCost: null, fCost: null },
    { position: null, posX: null, posY: null, hCost: null, gCost: null, fCost: null }
];

function runAStar() {
    // Initial Locate
    locateNeighbours(snake.posX, snake.posY);
    for (let i = 0; i < 4; i++) {
        if (neighbours[i].posX != 0 && neighbours[i].posY != 0) {
            neighbours[i].hCost = hCost(neighbours[i].posX, neighbours[i].posY);
            neighbours[i].gCost = gCost(neighbours[i].posX, neighbours[i].posY);
            neighbours[i].fCost = fCost(neighbours[i].hCost, neighbours[i].gCost);
        }
    }

    const nextMove = findSmallestFCost(neighbours);
    if (nextMove) {
        return nextMove.position;
    }
    return null;
}

// Mini Functions
function hCost(blockX, blockY) {
    return Math.abs(food.posX - blockX) + Math.abs(food.posY - blockY);
}

function gCost(blockX, blockY) {
    return Math.abs(snake.posX - blockX) + Math.abs(snake.posY - blockY);
}

function fCost(hCost, gCost) {
    return hCost + gCost;
}

function locateNeighbours(posX, posY) {
    // Neighbour Orientation: Up, Down, Left, Right
    neighbours[0] = { position: "Up", posX: posX, posY: posY - 1 };
    neighbours[1] = { position: "Down", posX: posX, posY: posY + 1 };
    neighbours[2] = { position: "Left", posX: posX - 1, posY: posY };
    neighbours[3] = { position: "Right", posX: posX + 1, posY: posY };

    // Remove invalid neighbours
    for (let i = 0; i < neighbours.length; i++) {
        if (neighbours[i].posX <= 0 || neighbours[i].posY <= 0 || neighbours[i].posX > boardProperties.posX || neighbours[i].posY > boardProperties.posY) {
            neighbours[i].posX = 0;
            neighbours[i].posY = 0;
        }
    }
}

function isPositionInSnakeBody(posX, posY) {
    for (let i = 0; i < snake.body.length; i++) {
        if (snake.body[i][0] === (posX - 1) * boardProperties.blockSize && snake.body[i][1] === (posY - 1) * boardProperties.blockSize) {
            return true;
        }
    }
    return false;
}

function findSmallestFCost(neighbours) {
    const oppositeSpeed = { x: -snake.speedX, y: -snake.speedY };
    let minFCost = Infinity;
    let bestNeighbour = null;

    for (let i = 0; i < neighbours.length; i++) {
        const neighbour = neighbours[i];

        if (neighbour.posX === 0 || neighbour.posY === 0) continue;

        const moveX = neighbour.posX - snake.posX;
        const moveY = neighbour.posY - snake.posY;

        if (moveX === oppositeSpeed.x && moveY === oppositeSpeed.y) continue;
        if (isPositionInSnakeBody(neighbour.posX, neighbour.posY)) continue;

        if (neighbour.fCost < minFCost) {
            minFCost = neighbour.fCost;
            bestNeighbour = neighbour;
        }
    }

    return bestNeighbour;
}

export { runAStar };
