let blockSize = 50;
let hardMode = false;
let showGrid = true;
let borderSize = 2;
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

    console.log(`Window Size: ` + board.height + `:` + board.width);
    console.log(`Grid Size: ` + total_col + `:` + total_row);
    context = board.getContext("2d");

    // Randomly generate where snake starts 
    snake.x = Math.floor(Math.random() * total_col) * blockSize;
    snake.y = Math.floor(Math.random() * total_row) * blockSize;

    snake.speedX = 0;
    snake.speedy = 0;

    snake.body = [];
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
    context.fillRect(food.x + (blockSize * .1), food.y + (blockSize * .1), blockSize - (blockSize * .2), blockSize - (blockSize * .2));

    if (snake.x == food.x && snake.y == food.y) {
        snake.body.push([food.x, food.y]);
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

    for (let i = snake.body.length - 1; i > 0; i--) {
        snake.body[i] = snake.body[i - 1];
    }
    if (snake.body.length) {
        snake.body[0] = [snake.x, snake.y];
    }
    context.fillStyle = "#3cc41c";

    snake.x += snake.speedX * blockSize;
    snake.y += snake.speedy * blockSize;

    context.fillRect(snake.x, snake.y, blockSize, blockSize);

    for (let i = 0; i < snake.body.length; i++) {
        let bodySize = showGrid ? blockSize - (blockSize * .1) : blockSize;
        let offsetX = showGrid ? (blockSize * .05) : 0;
        let offsetY = showGrid ? (blockSize * .05) : 0;
        context.fillRect(snake.body[i][0] + offsetX, snake.body[i][1] + offsetY, bodySize, bodySize);
    }

    /* Game Ending */
    if (snake.x < 0 || snake.x > total_col * blockSize || snake.y < 0 || snake.y > total_row * blockSize) {
        gameOver = true;
        gameEnd();
    }
    for (let i = 0; i < snake.body.length; i++) {
        if (snake.x == snake.body[i][0] && snake.y == snake.body[i][1]) {
            gameEnd();
        }
    }
}

/* Direction change logic */
function changeDirection(movement) {
    if (movement.code == "ArrowUp" && snake.speedy != 1) {
        snake.speedX = 0;
        snake.speedy = -1;
    } else if (movement.code == "ArrowDown" && snake.speedy != -1) {
        snake.speedX = 0;
        snake.speedy = 1;
    } else if (movement.code == "ArrowLeft" && snake.speedX != 1) {
        snake.speedX = -1;
        snake.speedy = 0;
    } else if (movement.code == "ArrowRight" && snake.speedX != -1) {
        snake.speedX = 1;
        snake.speedy = 0;
    }
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

function gameEnd() {
    gameOver = true;
    alert(`Game Over, Total Score: ` + score);
}
