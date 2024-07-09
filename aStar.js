import { boardProperties, snake, food } from './game.js';

let neighbours = [
    { position: null, posX: null, posY: null, hCost: null, gCost: null, fCost: null, openAreaCost: null },
    { position: null, posX: null, posY: null, hCost: null, gCost: null, fCost: null, openAreaCost: null },
    { position: null, posX: null, posY: null, hCost: null, gCost: null, fCost: null, openAreaCost: null },
    { position: null, posX: null, posY: null, hCost: null, gCost: null, fCost: null, openAreaCost: null }
];

function runAStar() {
    // Initial Locate
    locateNeighbours(snake.posX, snake.posY);
    for (let i = 0; i < 4; i++) {
        if (neighbours[i].posX != 0 && neighbours[i].posY != 0) {
            neighbours[i].hCost = hCost(neighbours[i].posX, neighbours[i].posY);
            neighbours[i].gCost = gCost(neighbours[i].posX, neighbours[i].posY);
            neighbours[i].openAreaCost = openAreaCost(neighbours[i].posX, neighbours[i].posY);
            neighbours[i].fCost = fCost(neighbours[i].hCost, neighbours[i].gCost, neighbours[i].openAreaCost);
        }
    }

    const nextMove = smallestFCost(neighbours);
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

function fCost(hCost, gCost, openAreaCost) {
    // We subtract openAreaCost to prioritize cells with more open areas
    return hCost + gCost - openAreaCost;
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
    return snake.body.some(bodyPart => bodyPart[0] === (posX - 1) * boardProperties.blockSize && bodyPart[1] === (posY - 1) * boardProperties.blockSize);
}

function openAreaCost(posX, posY) {
    let freeSpaces = 0;
    const possibleMoves = [
        { x: posX, y: posY - 1 }, // Up
        { x: posX, y: posY + 1 }, // Down
        { x: posX - 1, y: posY }, // Left
        { x: posX + 1, y: posY }  // Right
    ];

    for (let move of possibleMoves) {
        if (move.x > 0 && move.y > 0 && move.x <= boardProperties.posX && move.y <= boardProperties.posY && !isPositionInSnakeBody(move.x, move.y)) {
            freeSpaces++;
        }
    }

    return freeSpaces;
}

function smallestFCost(neighbours) {
    const oppositeSpeed = { x: -snake.speedX, y: -snake.speedY };

    let minFCost = Infinity;
    let maxOpenAreaCost = -Infinity;
    let minFCostNeighbours = [];

    for (let neighbour of neighbours) {
        if (neighbour.posX === 0 || neighbour.posY === 0) continue;

        const moveX = neighbour.posX - snake.posX;
        const moveY = neighbour.posY - snake.posY;

        if (moveX === oppositeSpeed.x && moveY === oppositeSpeed.y) continue;
        if (isPositionInSnakeBody(neighbour.posX, neighbour.posY)) continue;

        if (neighbour.fCost < minFCost || (neighbour.fCost === minFCost && neighbour.openAreaCost > maxOpenAreaCost)) {
            minFCost = neighbour.fCost;
            maxOpenAreaCost = neighbour.openAreaCost;
            minFCostNeighbours = [neighbour];
        } else if (neighbour.fCost === minFCost && neighbour.openAreaCost === maxOpenAreaCost) {
            minFCostNeighbours.push(neighbour);
        }
    }

    return minFCostNeighbours.length > 0
        ? minFCostNeighbours[Math.floor(Math.random() * minFCostNeighbours.length)]
        : null;
}

export { runAStar };
