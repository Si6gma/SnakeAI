let blockSize = 50;
let hardMode = false;
let showGrid = true;
let gameSpeed;
let total_row;
let total_col;
let board;
let context;
let snakeX;
let snakeY;
let speedX;
let speedY;
let snakeBody;
let foodX;
let foodY;
let gameOver;
let gameInterval;
let score;
let borderSize = 2;

/* Initialization */
window.onload = function () {
    startGame();
    document.addEventListener("keyup", changeDirection);
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

    console.log(`Window Size: ` + board.height + `:` + board.width);
    console.log(`Grid Size: ` + total_col + `:` + total_row);
    context = board.getContext("2d");

    // Randomly generate where snake starts 
    snakeX = Math.floor(Math.random() * total_col) * blockSize;
    snakeY = Math.floor(Math.random() * total_row) * blockSize;

    speedX = 0;
    speedY = 0;

    snakeBody = [];
    gameOver = false;

    placeFood();
    score = 0;
    gameSpeed = 100;

    gameInterval = setInterval(update, gameSpeed);
}

/* Game update logic */
function update() {
    if (gameOver) {
        startGame(); // Restart the game
        return;
    }
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

    context.fillStyle = "red";
    context.fillRect(foodX + (blockSize * .1), foodY + (blockSize * .1), blockSize - (blockSize * .2), blockSize - (blockSize * .2));

    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push([foodX, foodY]);
        score++;
        placeFood();

        if (hardMode == true) {
            if (gameSpeed > 50) {
                gameSpeed -= 10;
            }
            console.log(`Speed:` + gameSpeed);
            clearInterval(gameInterval);
            gameInterval = setInterval(update, gameSpeed);
        }
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }
    context.fillStyle = "#3cc41c";

    snakeX += speedX * blockSize;
    snakeY += speedY * blockSize;

    context.fillRect(snakeX, snakeY, blockSize, blockSize);

    for (let i = 0; i < snakeBody.length; i++) {
        let bodySize = showGrid ? blockSize - (blockSize * .1) : blockSize;
        let offsetX = showGrid ? (blockSize * .05) : 0;
        let offsetY = showGrid ? (blockSize * .05) : 0;
        context.fillRect(snakeBody[i][0] + offsetX, snakeBody[i][1] + offsetY, bodySize, bodySize);
    }

    /* Game Ending */
    if (snakeX < 0 || snakeX > total_col * blockSize || snakeY < 0 || snakeY > total_row * blockSize) {
        gameOver = true;
        gameEnd();
    }
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            gameEnd();
        }
    }
}

/* Direction change logic */
function changeDirection(movement) {
    if (movement.code == "ArrowUp" && speedY != 1) {
        speedX = 0;
        speedY = -1;
    } else if (movement.code == "ArrowDown" && speedY != -1) {
        speedX = 0;
        speedY = 1;
    } else if (movement.code == "ArrowLeft" && speedX != 1) {
        speedX = -1;
        speedY = 0;
    } else if (movement.code == "ArrowRight" && speedX != -1) {
        speedX = 1;
        speedY = 0;
    }
}

/* Food placement logic */
function placeFood() {
    while (true) {
        foodX = Math.floor(Math.random() * total_col) * blockSize;
        foodY = Math.floor(Math.random() * total_row) * blockSize;

        let collision = snakeBody.some(function (bodyPart) {
            return bodyPart[0] === foodX && bodyPart[1] === foodY;
        });

        if (!collision) break;
    }
}

function gameEnd() {
    gameOver = true;
    alert(`Game Over, Total Score: ` + score);
}
