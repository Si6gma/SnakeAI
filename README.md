<!--
GitHub Topics: snake-game, a-star-algorithm, pathfinding, javascript-game, html5-canvas, ai, algorithm, vanilla-js, browser-game
-->

# 🐍 SnakeAI

A classic Snake game powered by the A* pathfinding algorithm that autonomously navigates the snake to food while avoiding collisions.

**[🎮 Play Live Demo](https://si6gma.github.io/SnakeAI/)**

![Game Preview](./preview.jpeg)

## Why This Project Exists

This project was built to demonstrate practical implementation of the A* pathfinding algorithm in a real-time game environment. It bridges the gap between theoretical algorithm knowledge and applied game development, showcasing how classic AI techniques can solve dynamic pathfinding problems.

## Tech Stack

- **JavaScript (ES6+)** - Core game logic and A* implementation with class-based architecture
- **HTML5 Canvas** - Rendering engine for the game board
- **CSS3** - Responsive styling and layout
- **Jest** - Testing framework for unit tests
- **No Runtime Dependencies** - Pure vanilla JavaScript implementation

## How to Run

Since this is a browser-based game with no build step required:

### Option 1: Open Directly
Simply open `index.html` in any modern web browser.

```bash
# On macOS
open index.html

# On Linux
xdg-open index.html
```

### Option 2: Local Server (Recommended)
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx serve .
```
Then visit `http://localhost:8000`

### Controls
| Key | Action |
|-----|--------|
| `H` | Hold to speed up |
| `G` | Hold for maximum speed |
| `K` | Pause/Resume game |
| `J` (while paused) | Step forward one frame |

## Project Structure

```
SnakeAI/
├── index.html          # Main HTML entry point with Open Graph meta tags
├── game.js             # Game engine: SnakeGame class with rendering, input, game loop
├── aStar.js            # A* pathfinding algorithm with priority queue
├── package.json        # NPM configuration with Jest testing
├── .babelrc            # Babel configuration for ES6+ transpilation
├── .github/
│   └── workflows/
│       └── ci.yml      # GitHub Actions CI workflow
├── tests/
│   ├── game.test.js    # Unit tests for SnakeGame class
│   └── aStar.test.js   # Unit tests for A* algorithm
├── assets/             # Favicons and icons
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   └── ...
├── README.md           # Project documentation
└── LICENSE             # MIT License
```

## Testing

This project includes a comprehensive test suite using Jest.

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Key Learnings

- **A* Pathfinding Implementation**: Implemented true A* algorithm with open/closed sets and priority queue, calculating `f(n) = g(n) + h(n)` where g(n) is the cost from start and h(n) is the Manhattan distance heuristic to the goal. Includes fallback to safe moves when no optimal path exists.

- **Real-time Game Loop Management**: Learned to manage game state updates, collision detection, and smooth rendering using `requestAnimationFrame` and interval-based updates.

- **Collision Detection & Edge Cases**: Implemented boundary checking, self-collision detection, and neighbor validation to prevent the snake from making invalid moves or reversing into itself.

- **Class-based Architecture**: Refactored from procedural code to ES6 classes (`SnakeGame`, `AStar`, `PriorityQueue`) for better encapsulation, maintainability, and testability.

- **Input Validation**: Added null checks for DOM elements and validation for user inputs to ensure robust error handling.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

*Built with 🎮 and ☕ for learning and fun.*
