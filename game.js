export { boardProperties, snake, food };
import { runAStar } from "./aStar.js";

const showGrid = true;
const blockSize = 50;

let gameSpeed;
let total_row;
let total_col;
let board;
let context;
let gameOver;
let gameInterval;
let score;
let paused = false;

let boardProperties = {
    blockSize: 50,
    height: null,
    width: null,
    x: null,
    y: null
};

let snake = {
    x: null,
    y: null,
    posX: null,
    posY: null,
    speedX: null,
    speedY: null,
    body: []
};

let food = {
    x: null,
    y: null,
    posX: null,
    posY: null
};

window.onload = function () {
    console.log(`Version: v5`);
    logSettings();
    startGame();
    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("keyup", resetSpeed);
};

function logSettings() {
    if (!showGrid) console.log(`Grid disabled!`);
}

function startGame() {
    resetGame();
    placeFood();

    score = 0;
    gameSpeed = 100;
    gameInterval = setInterval(update, gameSpeed);
}

function resetGame() {
    if (gameInterval) clearInterval(gameInterval);
    initializeBoard();
    initializeSnake();
    gameOver = false;
    paused = false;
}

function initializeBoard() {
    board = document.getElementById("board");
    board.height = Math.floor((window.innerHeight - 4) / blockSize) * blockSize;
    board.width = Math.floor((window.innerWidth - 4) / blockSize) * blockSize;
    total_row = Math.floor(board.height / blockSize) - 1;
    total_col = Math.floor(board.width / blockSize) - 1;
    context = board.getContext("2d");

    boardProperties.height = board.height;
    boardProperties.width = board.width;
    boardProperties.posX = board.width / blockSize;
    boardProperties.posY = board.height / blockSize;
}

function initializeSnake() {
    snake.x = Math.floor(Math.random() * total_col) * blockSize;
    snake.y = Math.floor(Math.random() * total_row) * blockSize;
    snake.speedX = 0;
    snake.speedY = 0;
    snake.body = [];
}

function update() {
    if (gameOver) return startGame();
    if (paused) return;
    nextUpdate();
}

function nextUpdate() {
    drawGridlines();
    drawFood();
    if (checkSnakeFoodCollision()) {
        score++;
        document.title = "Score: " + score;
        placeFood();
    }

    updateSnakeBody();
    moveSnake();
    drawSnake();
    updatePosition();
    changeDirectionAuto(runAStar());

    checkAndEndGame();
}

function drawGridlines() {
    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);
    if (showGrid) drawLines();
}

function drawLines() {
    context.strokeStyle = "gray";
    for (let i = 0; i <= total_row; i++) drawHorizontalLine(i);
    for (let i = 0; i <= total_col; i++) drawVerticalLine(i);
}

function drawHorizontalLine(i) {
    context.beginPath();
    context.moveTo(0, i * blockSize);
    context.lineTo(board.width, i * blockSize);
    context.stroke();
}

function drawVerticalLine(i) {
    context.beginPath();
    context.moveTo(i * blockSize, 0);
    context.lineTo(i * blockSize, board.height);
    context.stroke();
}

function drawFood() {
    context.fillStyle = "red";
    context.fillRect(food.x + (blockSize * .1), food.y + (blockSize * .1), blockSize - (blockSize * .2), blockSize - (blockSize * .2));
}

function updatePosition() {
    snake.posX = snake.x / blockSize + 1;
    snake.posY = snake.y / blockSize + 1;
    food.posX = food.x / blockSize + 1;
    food.posY = food.y / blockSize + 1;
}

function checkSnakeFoodCollision() {
    return snake.x == food.x && snake.y == food.y ? (snake.body.push([food.x, food.y]), true) : false;
}

function updateSnakeBody() {
    for (let i = snake.body.length - 1; i > 0; i--) snake.body[i] = snake.body[i - 1];
    if (snake.body.length) snake.body[0] = [snake.x, snake.y];
}

function moveSnake() {
    snake.x += snake.speedX * blockSize;
    snake.y += snake.speedY * blockSize;
}

function drawSnake() {
    context.fillStyle = "#3cc41c";
    context.fillRect(snake.x, snake.y, blockSize, blockSize);
    drawSnakeBody();
}

function drawSnakeBody() {
    for (let i = 0; i < snake.body.length; i++) {
        let bodySize = showGrid ? blockSize - (blockSize * .1) : blockSize;
        let offsetX = showGrid ? (blockSize * .05) : 0;
        let offsetY = showGrid ? (blockSize * .05) : 0;
        context.fillRect(snake.body[i][0] + offsetX, snake.body[i][1] + offsetY, bodySize, bodySize);
    }
}

function placeFood() {
    while (true) {
        food.x = Math.floor(Math.random() * total_col) * blockSize;
        food.y = Math.floor(Math.random() * total_row) * blockSize;
        if (!snake.body.some(bodyPart => bodyPart[0] === food.x && bodyPart[1] === food.y)) break;
    }
}

function checkAndEndGame() {
    if (snake.x < 0 || snake.x > total_col * blockSize || snake.y < 0 || snake.y > total_row * blockSize) gameOver = true;
    if (snake.body.some(bodyPart => snake.x == bodyPart[0] && snake.y == bodyPart[1])) gameOver = true;
    if (gameOver) console.log(`Score: ` + score);
}

function changeDirectionAuto(direction) {
    if (direction === "Up" && snake.speedY != 1) setDirection(0, -1);
    else if (direction === "Down" && snake.speedY != -1) setDirection(0, 1);
    else if (direction === "Left" && snake.speedX != 1) setDirection(-1, 0);
    else if (direction === "Right" && snake.speedX != -1) setDirection(1, 0);
}

function setDirection(x, y) {
    snake.speedX = x;
    snake.speedY = y;
}

function handleKeydown(event) {
    if (paused && event.code === 'KeyJ') {
        nextUpdate();
    } else if (!paused) {
        changeSpeed(event);
    }

    if (event.code === 'KeyK') {
        togglePause();
    }
}

function changeSpeed(event) {
    if (event.code === 'KeyH') {
        clearInterval(gameInterval);
        gameSpeed = 25;
        gameInterval = setInterval(update, gameSpeed);
    }
}

function resetSpeed(event) {
    if ((event.code === 'KeyH')) {
        clearInterval(gameInterval);
        gameSpeed = 100;
        gameInterval = setInterval(update, gameSpeed);
    }
}

function togglePause() {
    paused = !paused;
    if (!paused) {
        gameInterval = setInterval(update, gameSpeed);
    } else {
        clearInterval(gameInterval);
    }
}
