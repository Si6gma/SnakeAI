import { A_Star, h } from './aStar.js';

export const blockSize = 50;
const hardMode = true;
const showGrid = true;
const borderSize = 2;

let gameSpeed;
let total_row;
let total_col;
let board;
let context;
let gameOver;
let gameInterval;
let score;

let snake = {
    x: null,
    y: null,
    speedX: null,
    speedY: null,
    body: []
};

let food = {
    x: null,
    y: null
};

/* Initialization */
window.onload = function () {
    startGame();
    document.addEventListener("keydown", changeDirection);
};

function startGame() {
    if (gameInterval) {
        clearInterval(gameInterval);
    }

    board = document.getElementById("board");

    board.height = Math.floor((window.innerHeight - borderSize * 2) / blockSize) * blockSize;
    board.width = Math.floor((window.innerWidth - borderSize * 2) / blockSize) * blockSize;

    total_row = Math.floor(board.height / blockSize) - 1;
    total_col = Math.floor(board.width / blockSize) - 1;

    // console.log(`Window Size: ` + board.height + `:` + board.width);
    // console.log(`Grid Size: ` + total_col + `:` + total_row);
    context = board.getContext("2d");

    // Randomly generate where snake starts 
    snake.x = Math.floor(Math.random() * total_col) * blockSize;
    snake.y = Math.floor(Math.random() * total_row) * blockSize;

    snake.speedX = 0;
    snake.speedY = 0;

    snake.body = [];
    gameOver = false;

    placeFood();
    score = 0;
    gameSpeed = 100;

    gameInterval = setInterval(update, gameSpeed);
    // console.log(snake);
    // console.log(food);
}

/* Game update logic */
function update() {
    if (gameOver) {
        startGame(); // Restart the game
        return;
    }
    gridlineCreator();

    context.fillStyle = "red";
    context.fillRect(food.x + (blockSize * .1), food.y + (blockSize * .1), blockSize - (blockSize * .2), blockSize - (blockSize * .2));

    if (snake.x == food.x && snake.y == food.y) {
        snake.body.push([food.x, food.y]);
        score++;
        placeFood();

        if (hardMode) {
            if (gameSpeed > 50) {
                gameSpeed -= 10;
            }
            console.log(`Speed: ` + gameSpeed);
            clearInterval(gameInterval);
            gameInterval = setInterval(update, gameSpeed);
        }
    }

    for (let i = snake.body.length - 1; i > 0; i--) {
        snake.body[i] = snake.body[i - 1];
    }
    if (snake.body.length) {
        snake.body[0] = [snake.x, snake.y];
    }
    context.fillStyle = "#3cc41c";

    snake.x += snake.speedX * blockSize;
    snake.y += snake.speedY * blockSize;

    context.fillRect(snake.x, snake.y, blockSize, blockSize);

    for (let i = 0; i < snake.body.length; i++) {
        let bodySize = showGrid ? blockSize - (blockSize * .1) : blockSize;
        let offsetX = showGrid ? (blockSize * .05) : 0;
        let offsetY = showGrid ? (blockSize * .05) : 0;
        context.fillRect(snake.body[i][0] + offsetX, snake.body[i][1] + offsetY, bodySize, bodySize);
    }

    /* Game Ending */
    endChecker();
}

/* Create the game */
function gridlineCreator() {
    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    // Draw gridlines
    if (showGrid) {
        context.strokeStyle = "gray";
        for (let i = 0; i <= total_row; i++) {
            context.beginPath();
            context.moveTo(0, i * blockSize);
            context.lineTo(board.width, i * blockSize);
            context.stroke();
        }
        for (let i = 0; i <= total_col; i++) {
            context.beginPath();
            context.moveTo(i * blockSize, 0);
            context.lineTo(i * blockSize, board.height);
            context.stroke();
        }
    }
}

function changeDirection() {
    let path = A_Star(snake, food, h, total_col, total_row); // Get the path from the snake's head to the goal

    // console.log(path);
    if (path.length > 1) { // If there's more than one node in the path
        let nextStep = path[1]; // Get the next step
        let dx = nextStep.x - snake.x;
        let dy = nextStep.y - snake.y;

        if (dx == 1) {
            move(1, 0); // Move right
        } else if (dx == -1) {
            move(-1, 0); // Move left
        } else if (dy == 1) {
            move(0, 1); // Move down
        } else if (dy == -1) {
            move(0, -1); // Move up
        }
    }
}

function move(speedX, speedY) {
    snake.speedX = speedX;
    snake.speedY = speedY;
}


/* Food placement logic */
function placeFood() {
    while (true) {
        food.x = Math.floor(Math.random() * total_col) * blockSize;
        food.y = Math.floor(Math.random() * total_row) * blockSize;

        let collision = snake.body.some(function (bodyPart) {
            return bodyPart[0] === food.x && bodyPart[1] === food.y;
        });

        if (!collision) break;
    }
}

/* Checks if the game ends */
function endChecker() {
    if (snake.x < 0 || snake.x > total_col * blockSize || snake.y < 0 || snake.y > total_row * blockSize) {
        gameEnd();
    }
    for (let i = 0; i < snake.body.length; i++) {
        if (snake.x == snake.body[i][0] && snake.y == snake.body[i][1]) {
            gameEnd();
        }
    }
}

/* When the game ends */
function gameEnd() {
    gameOver = true;
    alert(`Game Over, Total Score: ` + score);
};