export const blockSize = 50;
const hardMode = false;
const showGrid = true;
const bodyCollision = true;
const pacManMode = false;

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

window.onload = function () {
    console.log(`Version: v5`);
    logSettings();
    startGame();
    document.addEventListener("keydown", changeDirection);
};

function logSettings() {
    if (hardMode) console.log(`Hard mode enabled!`);
    if (!showGrid) console.log(`Grid disabled!`);
    if (!bodyCollision) console.log('Body collision disabled!');
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
}

function initializeBoard() {
    board = document.getElementById("board");
    board.height = Math.floor((window.innerHeight - 4) / blockSize) * blockSize;
    board.width = Math.floor((window.innerWidth - 4) / blockSize) * blockSize;
    total_row = Math.floor(board.height / blockSize) - 1;
    total_col = Math.floor(board.width / blockSize) - 1;
    context = board.getContext("2d");
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
    drawGridlines();
    drawFood();
    if (checkSnakeFoodCollision()) {
        score++;
        document.title = "Score: " + score;
        placeFood();
        adjustGameSpeed();
    }
    updateSnakeBody();
    moveSnake();
    drawSnake();
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

function checkSnakeFoodCollision() {
    return snake.x == food.x && snake.y == food.y ? (snake.body.push([food.x, food.y]), true) : false;
}

function adjustGameSpeed() {
    if (hardMode && gameSpeed > 10) {
        gameSpeed -= 10;
        clearInterval(gameInterval);
        gameInterval = setInterval(update, gameSpeed);
    }
}

function updateSnakeBody() {
    for (let i = snake.body.length - 1; i > 0; i--) snake.body[i] = snake.body[i - 1];
    if (snake.body.length) snake.body[0] = [snake.x, snake.y];
}

function moveSnake() {
    snake.x += snake.speedX * blockSize;
    snake.y += snake.speedY * blockSize;

    // Pac-Man Mode: If the snake hits the border, it appears on the other side
    if (pacManMode) {
        if (snake.x < 0) snake.x = total_col * blockSize;
        else if (snake.x > total_col * blockSize) snake.x = 0;
        else if (snake.y < 0) snake.y = total_row * blockSize;
        else if (snake.y > total_row * blockSize) snake.y = 0;
    }
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
    // In Pac-Man Mode, the game only ends if the snake collides with its own body
    if (snake.x < 0 || snake.x > total_col * blockSize || snake.y < 0 || snake.y > total_row * blockSize) gameOver = !pacManMode;
    if (bodyCollision && snake.body.some(bodyPart => snake.x == bodyPart[0] && snake.y == bodyPart[1])) gameOver = true;
    if (gameOver) console.log(`Score: ` + score);
}

function changeDirection(movement) {
    const direction = movement.code.replace("Arrow", "").replace("Key", "");
    if ((direction == "Up" || direction == "W") && snake.speedY != 1) setDirection(0, -1);
    else if ((direction == "Down" || direction == "S") && snake.speedY != -1) setDirection(0, 1);
    else if ((direction == "Left" || direction == "A") && snake.speedX != 1) setDirection(-1, 0);
    else if ((direction == "Right" || direction == "D") && snake.speedX != -1) setDirection(1, 0);
}

function setDirection(x, y) {
    snake.speedX = x;
    snake.speedY = y;
}
