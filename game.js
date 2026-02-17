/**
 * Snake Game - Class-based implementation
 * Handles game state, rendering, and game loop
 */

import { AStar } from "./aStar.js";

class SnakeGame {
    constructor(options = {}) {
        this.showGrid = options.showGrid ?? true;
        this.blockSize = options.blockSize ?? 50;
        this.defaultGameSpeed = options.defaultGameSpeed ?? 50;
        
        this.gameSpeed = this.defaultGameSpeed;
        this.totalRow = 0;
        this.totalCol = 0;
        this.board = null;
        this.context = null;
        this.gameOver = false;
        this.gameInterval = null;
        this.score = 0;
        this.percentage = 0;
        this.paused = false;
        this.version = options.version ?? 'v6';

        this.boardProperties = {
            blockSize: this.blockSize,
            height: null,
            width: null,
            posX: null,
            posY: null
        };

        this.snake = {
            x: null,
            y: null,
            posX: null,
            posY: null,
            speedX: 0,
            speedY: 0,
            body: []
        };

        this.food = {
            x: null,
            y: null,
            posX: null,
            posY: null
        };

        this.keydownHandler = this.handleKeydown.bind(this);
        this.keyupHandler = this.resetSpeed.bind(this);
    }

    /**
     * Validate DOM element exists
     * @param {string} id - Element ID
     * @returns {HTMLElement}
     * @throws {Error} If element not found
     */
    validateElement(id) {
        const element = document.getElementById(id);
        if (!element) {
            throw new Error(`Required DOM element "${id}" not found`);
        }
        return element;
    }

    /**
     * Validate and sanitize numeric input
     * @param {*} value - Input value
     * @param {number} defaultValue - Default if invalid
     * @param {number} min - Minimum allowed value
     * @param {number} max - Maximum allowed value
     * @returns {number}
     */
    validateNumber(value, defaultValue, min, max) {
        const num = Number(value);
        if (isNaN(num) || !isFinite(num)) {
            return defaultValue;
        }
        return Math.max(min, Math.min(max, num));
    }

    /**
     * Initialize and start the game
     */
    init() {
        console.log(`Version: ${this.version}`);
        this.logSettings();
        this.setupEventListeners();
        this.startGame();
    }

    logSettings() {
        if (!this.showGrid) console.log('Grid disabled!');
    }

    setupEventListeners() {
        document.addEventListener('keydown', this.keydownHandler);
        document.addEventListener('keyup', this.keyupHandler);
    }

    removeEventListeners() {
        document.removeEventListener('keydown', this.keydownHandler);
        document.removeEventListener('keyup', this.keyupHandler);
    }

    startGame() {
        this.resetGame();
        this.placeFood();
        this.score = 0;
        this.percentage = 0;
        this.gameSpeed = this.defaultGameSpeed;
        this.gameInterval = setInterval(() => this.update(), this.gameSpeed);
    }

    resetGame() {
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
            this.gameInterval = null;
        }
        this.initializeBoard();
        this.initializeSnake();
        this.gameOver = false;
        this.paused = false;
    }

    initializeBoard() {
        this.board = this.validateElement('board');
        
        const windowHeight = this.validateNumber(window.innerHeight, 600, 200, 4000);
        const windowWidth = this.validateNumber(window.innerWidth, 800, 200, 4000);
        
        this.board.height = Math.floor((windowHeight - 4) / this.blockSize) * this.blockSize;
        this.board.width = Math.floor((windowWidth - 4) / this.blockSize) * this.blockSize;
        this.totalRow = Math.floor(this.board.height / this.blockSize) - 1;
        this.totalCol = Math.floor(this.board.width / this.blockSize) - 1;
        
        this.context = this.board.getContext('2d');
        if (!this.context) {
            throw new Error('Failed to get 2D context from canvas');
        }

        this.boardProperties.height = this.board.height;
        this.boardProperties.width = this.board.width;
        this.boardProperties.posX = this.board.width / this.blockSize;
        this.boardProperties.posY = this.board.height / this.blockSize;
    }

    initializeSnake() {
        if (this.totalCol <= 0 || this.totalRow <= 0) {
            throw new Error('Invalid board dimensions');
        }
        this.snake.x = Math.floor(Math.random() * this.totalCol) * this.blockSize;
        this.snake.y = Math.floor(Math.random() * this.totalRow) * this.blockSize;
        this.snake.speedX = 0;
        this.snake.speedY = 0;
        this.snake.body = [];
    }

    update() {
        if (this.gameOver) {
            this.startGame();
            return;
        }
        if (this.paused) return;
        this.nextUpdate();
    }

    nextUpdate() {
        this.drawGridlines();
        this.drawFood();
        
        if (this.checkSnakeFoodCollision()) {
            this.score++;
            const totalCells = this.boardProperties.posX * this.boardProperties.posY;
            this.percentage = Math.floor((this.score / totalCells) * 100);
            document.title = `Score: ${this.score}`;
            this.placeFood();
        }

        this.updateSnakeBody();
        this.moveSnake();
        this.drawSnake();
        this.updatePosition();
        
        const direction = this.getNextDirection();
        if (direction) {
            this.changeDirectionAuto(direction);
        }

        this.checkAndEndGame();
    }

    getNextDirection() {
        try {
            const aStar = new AStar(this.boardProperties, this.snake, this.food);
            return aStar.run();
        } catch (error) {
            console.error('A* error:', error);
            return null;
        }
    }

    drawGridlines() {
        if (!this.context) return;
        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, this.board.width, this.board.height);
        if (this.showGrid) this.drawLines();
    }

    drawLines() {
        this.context.strokeStyle = 'gray';
        for (let i = 0; i <= this.totalRow; i++) this.drawHorizontalLine(i);
        for (let i = 0; i <= this.totalCol; i++) this.drawVerticalLine(i);
    }

    drawHorizontalLine(i) {
        this.context.beginPath();
        this.context.moveTo(0, i * this.blockSize);
        this.context.lineTo(this.board.width, i * this.blockSize);
        this.context.stroke();
    }

    drawVerticalLine(i) {
        this.context.beginPath();
        this.context.moveTo(i * this.blockSize, 0);
        this.context.lineTo(i * this.blockSize, this.board.height);
        this.context.stroke();
    }

    drawFood() {
        if (!this.context) return;
        this.context.fillStyle = 'red';
        const padding = this.blockSize * 0.1;
        this.context.fillRect(
            this.food.x + padding,
            this.food.y + padding,
            this.blockSize - padding * 2,
            this.blockSize - padding * 2
        );
    }

    updatePosition() {
        this.snake.posX = this.snake.x / this.blockSize + 1;
        this.snake.posY = this.snake.y / this.blockSize + 1;
        this.food.posX = this.food.x / this.blockSize + 1;
        this.food.posY = this.food.y / this.blockSize + 1;
    }

    checkSnakeFoodCollision() {
        if (this.snake.x === this.food.x && this.snake.y === this.food.y) {
            this.snake.body.push([this.food.x, this.food.y]);
            return true;
        }
        return false;
    }

    updateSnakeBody() {
        for (let i = this.snake.body.length - 1; i > 0; i--) {
            this.snake.body[i] = this.snake.body[i - 1];
        }
        if (this.snake.body.length) {
            this.snake.body[0] = [this.snake.x, this.snake.y];
        }
    }

    moveSnake() {
        this.snake.x += this.snake.speedX * this.blockSize;
        this.snake.y += this.snake.speedY * this.blockSize;
    }

    drawSnake() {
        if (!this.context) return;
        this.context.fillStyle = '#3cc41c';
        this.context.fillRect(this.snake.x, this.snake.y, this.blockSize, this.blockSize);
        this.drawSnakeBody();
    }

    drawSnakeBody() {
        for (let i = 0; i < this.snake.body.length; i++) {
            const bodySize = this.showGrid ? this.blockSize - (this.blockSize * 0.1) : this.blockSize;
            const offset = this.showGrid ? (this.blockSize * 0.05) : 0;
            this.context.fillRect(
                this.snake.body[i][0] + offset,
                this.snake.body[i][1] + offset,
                bodySize,
                bodySize
            );
        }
    }

    placeFood() {
        if (this.totalCol <= 0 || this.totalRow <= 0) return;
        
        let attempts = 0;
        const maxAttempts = this.totalCol * this.totalRow;
        
        while (attempts < maxAttempts) {
            this.food.x = Math.floor(Math.random() * this.totalCol) * this.blockSize;
            this.food.y = Math.floor(Math.random() * this.totalRow) * this.blockSize;
            
            const onSnakeBody = this.snake.body.some(
                bodyPart => bodyPart[0] === this.food.x && bodyPart[1] === this.food.y
            );
            const onSnakeHead = this.snake.x === this.food.x && this.snake.y === this.food.y;
            
            if (!onSnakeBody && !onSnakeHead) break;
            attempts++;
        }
    }

    checkAndEndGame() {
        const outOfBounds = 
            this.snake.x < 0 || 
            this.snake.x > this.totalCol * this.blockSize || 
            this.snake.y < 0 || 
            this.snake.y > this.totalRow * this.blockSize;

        const selfCollision = this.snake.body.some(
            bodyPart => this.snake.x === bodyPart[0] && this.snake.y === bodyPart[1]
        );

        if (outOfBounds || selfCollision) {
            this.gameOver = true;
            console.log(`Percentage: ${this.percentage}%`);
            console.log(this.boardProperties);
        }
    }

    changeDirectionAuto(direction) {
        if (direction === 'Up' && this.snake.speedY !== 1) this.setDirection(0, -1);
        else if (direction === 'Down' && this.snake.speedY !== -1) this.setDirection(0, 1);
        else if (direction === 'Left' && this.snake.speedX !== 1) this.setDirection(-1, 0);
        else if (direction === 'Right' && this.snake.speedX !== -1) this.setDirection(1, 0);
    }

    setDirection(x, y) {
        this.snake.speedX = x;
        this.snake.speedY = y;
    }

    handleKeydown(event) {
        if (!event || !event.code) return;
        
        if (this.paused && event.code === 'KeyJ') {
            this.nextUpdate();
        } else if (!this.paused) {
            this.changeSpeed(event);
        }

        if (event.code === 'KeyK') {
            this.togglePause();
        }
    }

    changeSpeed(event) {
        if (event.code === 'KeyH') {
            this.setGameSpeed(25);
        } else if (event.code === 'KeyG') {
            this.setGameSpeed(0);
        }
    }

    setGameSpeed(speed) {
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
        }
        this.gameSpeed = speed;
        this.gameInterval = setInterval(() => this.update(), this.gameSpeed);
    }

    resetSpeed(event) {
        if (!event || !event.code) return;
        
        if (event.code === 'KeyH' || event.code === 'KeyG') {
            this.setGameSpeed(this.defaultGameSpeed);
        }
    }

    togglePause() {
        this.paused = !this.paused;
        if (!this.paused) {
            this.gameInterval = setInterval(() => this.update(), this.gameSpeed);
        } else {
            if (this.gameInterval) {
                clearInterval(this.gameInterval);
                this.gameInterval = null;
            }
        }
    }

    /**
     * Clean up resources
     */
    destroy() {
        this.removeEventListeners();
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
            this.gameInterval = null;
        }
    }

    /**
     * Get current game state (useful for testing)
     */
    getState() {
        return {
            snake: { ...this.snake },
            food: { ...this.food },
            boardProperties: { ...this.boardProperties },
            score: this.score,
            gameOver: this.gameOver,
            paused: this.paused
        };
    }
}

// Backward compatibility - auto-initialize when DOM is ready
let gameInstance = null;

function initGame() {
    try {
        gameInstance = new SnakeGame();
        gameInstance.init();
    } catch (error) {
        console.error('Failed to initialize game:', error);
    }
}

if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGame);
    } else {
        initGame();
    }
}

export { SnakeGame, initGame };
export default SnakeGame;
