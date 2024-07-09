import { boardProperties, snake, food } from './game.js';

let neighbours = [
    {
        position: null,
        posX: null,
        posY: null,
        hCost: null,
        gCost: null,
        fCost: null
    },
    {
        position: null,
        posX: null,
        posY: null,
        hCost: null,
        gCost: null,
        fCost: null
    },
    {
        position: null,
        posX: null,
        posY: null,
        hCost: null,
        gCost: null,
        fCost: null
    },
    {
        position: null,
        posX: null,
        posY: null,
        hCost: null,
        gCost: null,
        fCost: null
    }
];

/*
gCost: How far away is it from the starting point
hCost: How far away is it from the ending point
fCost: gCost + hCost

Choose lowest fCost


How do we do this.
1. Locate all the neighbours || DONE
2. Run them through the hcost and gcost
3. Run them through fCost
4. Pick Lowest fCost
5. Make that the main block
6. Repeat until hCost = 0???
*/

// Main AStar Function
function runAStar() {
    // Initial Locate
    locateNeighbours(snake.posX, snake.posY);
    for (let i = 0; i < 4; i++) {
        if (neighbours[i].posX != 0) {

            neighbours[i].hCost = hCost(neighbours[i].posX, neighbours[i].posY);

            neighbours[i].gCost = gCost(neighbours[i].posX, neighbours[i].posY);

            neighbours[i].fCost = fCost(neighbours[i].hCost, neighbours[i].gCost);
        }
    }

    console.log(food);
    console.log("hCost: " + hCost(snake.posX, snake.posY, food.posX, food.posY));

    console.log(smallestFCost(neighbours));


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
    /* 
    Neighbour Orientation
    1. Up
    2. Down
    3. Left
    4. Right
    */

    // Up
    if (posY != 1) {
        neighbours[0].position = "Up";
        neighbours[0].posX = posX;
        neighbours[0].posY = posY - 1;

    } else {
        neighbours[0].posX = 0;
        neighbours[0].posY = 0;
    }

    // Down
    if (posY != boardProperties.posY) {
        neighbours[1].position = "Down";
        neighbours[1].posX = posX;
        neighbours[1].posY = posY + 1;
    } else {
        neighbours[1].posX = 0;
        neighbours[1].posY = 0;
    }

    // Left
    if (posX != 1) {
        neighbours[2].position = "Left";
        neighbours[2].posX = posX - 1;
        neighbours[2].posY = posY;

    } else {
        neighbours[2].posX = 0;
        neighbours[2].posY = 0;
    }

    // Right
    if (posX != boardProperties.posX) {
        neighbours[3].position = "Right";
        neighbours[3].posX = posX + 1;
        neighbours[3].posY = posY;
    } else {
        neighbours[3].posX = 0;
        neighbours[3].posY = 0;
    }



}

function smallestFCost(neighbours) {
    // Determine the opposite movement based on the snake's current speed
    const oppositeSpeed = { x: -snake.speedX, y: -snake.speedY };

    let minFCost = Infinity;
    let minFCostNeighbours = [];

    for (let neighbour of neighbours) {
        // Ignore neighbors with posX or posY of 0
        if (neighbour.posX === 0 || neighbour.posY === 0) continue;

        // Calculate the relative movement direction to this neighbor
        const moveX = neighbour.posX - snake.posX;
        const moveY = neighbour.posY - snake.posY;

        // Ignore the neighbor if it's in the opposite direction
        if (moveX === oppositeSpeed.x && moveY === oppositeSpeed.y) continue;

        if (neighbour.fCost !== null) {
            if (neighbour.fCost < minFCost) {
                minFCost = neighbour.fCost;
                minFCostNeighbours = [neighbour];
            } else if (neighbour.fCost === minFCost) {
                minFCostNeighbours.push(neighbour);
            }
        }
    }

    return minFCostNeighbours.length > 0
        ? minFCostNeighbours[Math.floor(Math.random() * minFCostNeighbours.length)]
        : null;
}



export { runAStar };
