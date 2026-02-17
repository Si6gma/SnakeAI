/**
 * Snake Game Tests
 */

import { SnakeGame } from '../game.js';

// Mock DOM and window
describe('SnakeGame', () => {
    let mockCanvas;
    let mockContext;

    beforeEach(() => {
        // Setup mock canvas and context
        mockContext = {
            fillStyle: '',
            strokeStyle: '',
            fillRect: jest.fn(),
            beginPath: jest.fn(),
            moveTo: jest.fn(),
            lineTo: jest.fn(),
            stroke: jest.fn()
        };

        mockCanvas = {
            getContext: jest.fn(() => mockContext),
            height: 500,
            width: 500
        };

        // Mock document
        document.getElementById = jest.fn((id) => {
            if (id === 'board') return mockCanvas;
            return null;
        });

        document.title = '';

        // Mock window
        global.window = {
            innerHeight: 600,
            innerWidth: 800,
            addEventListener: jest.fn()
        };

        // Mock console
        global.console = {
            log: jest.fn(),
            error: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        test('should create game with default options', () => {
            const game = new SnakeGame();
            
            expect(game.showGrid).toBe(true);
            expect(game.blockSize).toBe(50);
            expect(game.defaultGameSpeed).toBe(50);
            expect(game.score).toBe(0);
            expect(game.gameOver).toBe(false);
            expect(game.paused).toBe(false);
        });

        test('should create game with custom options', () => {
            const game = new SnakeGame({
                showGrid: false,
                blockSize: 30,
                defaultGameSpeed: 100
            });
            
            expect(game.showGrid).toBe(false);
            expect(game.blockSize).toBe(30);
            expect(game.defaultGameSpeed).toBe(100);
        });

        test('should initialize snake object correctly', () => {
            const game = new SnakeGame();
            
            expect(game.snake.speedX).toBe(0);
            expect(game.snake.speedY).toBe(0);
            expect(game.snake.body).toEqual([]);
        });

        test('should initialize food object correctly', () => {
            const game = new SnakeGame();
            
            expect(game.food.x).toBeNull();
            expect(game.food.y).toBeNull();
        });
    });

    describe('validateElement', () => {
        test('should return element if found', () => {
            const game = new SnakeGame();
            const element = game.validateElement('board');
            
            expect(element).toBe(mockCanvas);
        });

        test('should throw error if element not found', () => {
            document.getElementById = jest.fn(() => null);
            const game = new SnakeGame();
            
            expect(() => game.validateElement('nonexistent')).toThrow('Required DOM element "nonexistent" not found');
        });
    });

    describe('validateNumber', () => {
        test('should return valid number within range', () => {
            const game = new SnakeGame();
            
            expect(game.validateNumber(100, 50, 0, 200)).toBe(100);
        });

        test('should clamp to min if below range', () => {
            const game = new SnakeGame();
            
            expect(game.validateNumber(-10, 50, 0, 200)).toBe(0);
        });

        test('should clamp to max if above range', () => {
            const game = new SnakeGame();
            
            expect(game.validateNumber(300, 50, 0, 200)).toBe(200);
        });

        test('should return default for NaN', () => {
            const game = new SnakeGame();
            
            expect(game.validateNumber(NaN, 50, 0, 200)).toBe(50);
            expect(game.validateNumber('abc', 50, 0, 200)).toBe(50);
        });

        test('should return default for Infinity', () => {
            const game = new SnakeGame();
            
            expect(game.validateNumber(Infinity, 50, 0, 200)).toBe(50);
            expect(game.validateNumber(-Infinity, 50, 0, 200)).toBe(50);
        });
    });

    describe('initializeBoard', () => {
        test('should set up board properties correctly', () => {
            const game = new SnakeGame();
            game.initializeBoard();
            
            expect(game.board).toBe(mockCanvas);
            expect(game.context).toBe(mockContext);
            expect(game.boardProperties.height).toBeDefined();
            expect(game.boardProperties.width).toBeDefined();
        });

        test('should throw error if canvas context fails', () => {
            mockCanvas.getContext = jest.fn(() => null);
            const game = new SnakeGame();
            
            expect(() => game.initializeBoard()).toThrow('Failed to get 2D context from canvas');
        });
    });

    describe('initializeSnake', () => {
        test('should initialize snake position within bounds', () => {
            const game = new SnakeGame();
            game.totalCol = 10;
            game.totalRow = 10;
            game.blockSize = 50;
            
            game.initializeSnake();
            
            expect(game.snake.x).toBeGreaterThanOrEqual(0);
            expect(game.snake.x).toBeLessThan(10 * 50);
            expect(game.snake.y).toBeGreaterThanOrEqual(0);
            expect(game.snake.y).toBeLessThan(10 * 50);
            expect(game.snake.speedX).toBe(0);
            expect(game.snake.speedY).toBe(0);
            expect(game.snake.body).toEqual([]);
        });

        test('should throw error for invalid board dimensions', () => {
            const game = new SnakeGame();
            game.totalCol = 0;
            game.totalRow = 0;
            
            expect(() => game.initializeSnake()).toThrow('Invalid board dimensions');
        });
    });

    describe('updatePosition', () => {
        test('should calculate positions correctly', () => {
            const game = new SnakeGame();
            game.blockSize = 50;
            game.snake.x = 100; // 3rd column (0-indexed)
            game.snake.y = 150; // 4th row
            game.food.x = 200;
            game.food.y = 250;
            
            game.updatePosition();
            
            expect(game.snake.posX).toBe(3);
            expect(game.snake.posY).toBe(4);
            expect(game.food.posX).toBe(5);
            expect(game.food.posY).toBe(6);
        });
    });

    describe('checkSnakeFoodCollision', () => {
        test('should return true when snake head is on food', () => {
            const game = new SnakeGame();
            game.snake.x = 100;
            game.snake.y = 100;
            game.snake.body = [];
            game.food.x = 100;
            game.food.y = 100;
            
            const result = game.checkSnakeFoodCollision();
            
            expect(result).toBe(true);
            expect(game.snake.body).toContainEqual([100, 100]);
        });

        test('should return false when snake head is not on food', () => {
            const game = new SnakeGame();
            game.snake.x = 100;
            game.snake.y = 100;
            game.snake.body = [];
            game.food.x = 200;
            game.food.y = 200;
            
            const result = game.checkSnakeFoodCollision();
            
            expect(result).toBe(false);
        });
    });

    describe('updateSnakeBody', () => {
        test('should shift body segments', () => {
            const game = new SnakeGame();
            game.snake.x = 100;
            game.snake.y = 100;
            game.snake.body = [[50, 50], [0, 0]];
            
            game.updateSnakeBody();
            
            expect(game.snake.body[0]).toEqual([100, 100]);
            expect(game.snake.body[1]).toEqual([50, 50]);
        });

        test('should handle empty body', () => {
            const game = new SnakeGame();
            game.snake.body = [];
            
            game.updateSnakeBody();
            
            expect(game.snake.body).toEqual([]);
        });
    });

    describe('moveSnake', () => {
        test('should move snake by speed * blockSize', () => {
            const game = new SnakeGame();
            game.blockSize = 50;
            game.snake.x = 100;
            game.snake.y = 100;
            game.snake.speedX = 1;
            game.snake.speedY = 0;
            
            game.moveSnake();
            
            expect(game.snake.x).toBe(150);
            expect(game.snake.y).toBe(100);
        });

        test('should handle diagonal movement', () => {
            const game = new SnakeGame();
            game.blockSize = 50;
            game.snake.x = 100;
            game.snake.y = 100;
            game.snake.speedX = 1;
            game.snake.speedY = 1;
            
            game.moveSnake();
            
            expect(game.snake.x).toBe(150);
            expect(game.snake.y).toBe(150);
        });
    });

    describe('setDirection', () => {
        test('should set snake direction', () => {
            const game = new SnakeGame();
            
            game.setDirection(1, 0);
            expect(game.snake.speedX).toBe(1);
            expect(game.snake.speedY).toBe(0);
            
            game.setDirection(0, -1);
            expect(game.snake.speedX).toBe(0);
            expect(game.snake.speedY).toBe(-1);
        });
    });

    describe('changeDirectionAuto', () => {
        beforeEach(() => {
            document.getElementById = jest.fn(() => mockCanvas);
        });

        test('should set direction Up when valid', () => {
            const game = new SnakeGame();
            game.snake.speedY = 0;
            
            game.changeDirectionAuto('Up');
            
            expect(game.snake.speedX).toBe(0);
            expect(game.snake.speedY).toBe(-1);
        });

        test('should not reverse direction Up when moving Down', () => {
            const game = new SnakeGame();
            game.snake.speedY = 1;
            
            game.changeDirectionAuto('Up');
            
            expect(game.snake.speedX).toBe(0);
            expect(game.snake.speedY).toBe(1); // Unchanged
        });

        test('should set direction Down when valid', () => {
            const game = new SnakeGame();
            game.snake.speedY = 0;
            
            game.changeDirectionAuto('Down');
            
            expect(game.snake.speedX).toBe(0);
            expect(game.snake.speedY).toBe(1);
        });

        test('should set direction Left when valid', () => {
            const game = new SnakeGame();
            game.snake.speedX = 0;
            
            game.changeDirectionAuto('Left');
            
            expect(game.snake.speedX).toBe(-1);
            expect(game.snake.speedY).toBe(0);
        });

        test('should set direction Right when valid', () => {
            const game = new SnakeGame();
            game.snake.speedX = 0;
            
            game.changeDirectionAuto('Right');
            
            expect(game.snake.speedX).toBe(1);
            expect(game.snake.speedY).toBe(0);
        });
    });

    describe('checkAndEndGame', () => {
        test('should set gameOver when snake hits left boundary', () => {
            const game = new SnakeGame();
            game.totalCol = 10;
            game.totalRow = 10;
            game.blockSize = 50;
            game.snake.x = -50;
            game.snake.y = 100;
            game.snake.body = [];
            
            game.checkAndEndGame();
            
            expect(game.gameOver).toBe(true);
        });

        test('should set gameOver when snake hits right boundary', () => {
            const game = new SnakeGame();
            game.totalCol = 10;
            game.totalRow = 10;
            game.blockSize = 50;
            game.snake.x = 550; // Beyond 10 * 50
            game.snake.y = 100;
            game.snake.body = [];
            
            game.checkAndEndGame();
            
            expect(game.gameOver).toBe(true);
        });

        test('should set gameOver when snake hits top boundary', () => {
            const game = new SnakeGame();
            game.totalCol = 10;
            game.totalRow = 10;
            game.blockSize = 50;
            game.snake.x = 100;
            game.snake.y = -50;
            game.snake.body = [];
            
            game.checkAndEndGame();
            
            expect(game.gameOver).toBe(true);
        });

        test('should set gameOver when snake hits bottom boundary', () => {
            const game = new SnakeGame();
            game.totalCol = 10;
            game.totalRow = 10;
            game.blockSize = 50;
            game.snake.x = 100;
            game.snake.y = 550;
            game.snake.body = [];
            
            game.checkAndEndGame();
            
            expect(game.gameOver).toBe(true);
        });

        test('should set gameOver on self collision', () => {
            const game = new SnakeGame();
            game.totalCol = 10;
            game.totalRow = 10;
            game.blockSize = 50;
            game.snake.x = 100;
            game.snake.y = 100;
            game.snake.body = [[100, 100]]; // Head position in body
            
            game.checkAndEndGame();
            
            expect(game.gameOver).toBe(true);
        });

        test('should not set gameOver when snake is safe', () => {
            const game = new SnakeGame();
            game.totalCol = 10;
            game.totalRow = 10;
            game.blockSize = 50;
            game.snake.x = 100;
            game.snake.y = 100;
            game.snake.body = [[50, 50]];
            
            game.checkAndEndGame();
            
            expect(game.gameOver).toBe(false);
        });
    });

    describe('togglePause', () => {
        test('should toggle paused state', () => {
            const game = new SnakeGame();
            game.gameInterval = null;
            
            expect(game.paused).toBe(false);
            
            game.togglePause();
            expect(game.paused).toBe(true);
            
            game.togglePause();
            expect(game.paused).toBe(false);
        });
    });

    describe('getState', () => {
        test('should return current game state', () => {
            const game = new SnakeGame();
            game.snake = { x: 100, y: 100, posX: 3, posY: 3, speedX: 1, speedY: 0, body: [] };
            game.food = { x: 200, y: 200, posX: 5, posY: 5 };
            game.score = 10;
            game.gameOver = false;
            game.paused = false;
            
            const state = game.getState();
            
            expect(state.snake).toEqual(game.snake);
            expect(state.food).toEqual(game.food);
            expect(state.score).toBe(10);
            expect(state.gameOver).toBe(false);
            expect(state.paused).toBe(false);
        });
    });

    describe('destroy', () => {
        test('should clean up resources', () => {
            const game = new SnakeGame();
            game.gameInterval = setInterval(() => {}, 1000);
            
            game.destroy();
            
            expect(game.gameInterval).toBeNull();
        });
    });

    describe('placeFood', () => {
        test('should place food within bounds', () => {
            const game = new SnakeGame();
            game.totalCol = 10;
            game.totalRow = 10;
            game.blockSize = 50;
            game.snake.body = [];
            
            game.placeFood();
            
            expect(game.food.x).toBeGreaterThanOrEqual(0);
            expect(game.food.x).toBeLessThan(10 * 50);
            expect(game.food.y).toBeGreaterThanOrEqual(0);
            expect(game.food.y).toBeLessThan(10 * 50);
        });

        test('should not place food on snake body', () => {
            const game = new SnakeGame();
            game.totalCol = 3;
            game.totalRow = 3;
            game.blockSize = 50;
            game.snake.body = [[0, 0], [50, 0], [100, 0], [0, 50], [50, 50], [100, 50], [0, 100], [50, 100]];
            
            game.placeFood();
            
            // Food should only be placed at [100, 100]
            expect(game.food.x).toBe(100);
            expect(game.food.y).toBe(100);
        });
    });

    describe('handleKeydown', () => {
        test('should handle null event gracefully', () => {
            const game = new SnakeGame();
            
            expect(() => game.handleKeydown(null)).not.toThrow();
        });

        test('should handle event without code gracefully', () => {
            const game = new SnakeGame();
            
            expect(() => game.handleKeydown({})).not.toThrow();
        });

        test('should toggle pause on KeyK', () => {
            const game = new SnakeGame();
            const initialPaused = game.paused;
            
            game.handleKeydown({ code: 'KeyK' });
            
            expect(game.paused).toBe(!initialPaused);
        });

        test('should step forward when paused and KeyJ pressed', () => {
            const game = new SnakeGame();
            game.paused = true;
            game.nextUpdate = jest.fn();
            
            game.handleKeydown({ code: 'KeyJ' });
            
            expect(game.nextUpdate).toHaveBeenCalled();
        });
    });

    describe('resetSpeed', () => {
        test('should handle null event gracefully', () => {
            const game = new SnakeGame();
            
            expect(() => game.resetSpeed(null)).not.toThrow();
        });

        test('should reset speed on KeyH release', () => {
            const game = new SnakeGame();
            game.setGameSpeed = jest.fn();
            
            game.resetSpeed({ code: 'KeyH' });
            
            expect(game.setGameSpeed).toHaveBeenCalledWith(game.defaultGameSpeed);
        });

        test('should reset speed on KeyG release', () => {
            const game = new SnakeGame();
            game.setGameSpeed = jest.fn();
            
            game.resetSpeed({ code: 'KeyG' });
            
            expect(game.setGameSpeed).toHaveBeenCalledWith(game.defaultGameSpeed);
        });
    });
});
