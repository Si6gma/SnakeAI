# Snake Game with A\* Algorithm

This project is a simple (not really) implementation of the classic Snake game, enhanced with the A\* algorithm for automated pathfinding.

You can view the A\* algorithm in action by going to [this link](https://si6gma.github.io/SnakeAI/).

## Project Structure

- `game.js`: This file contains the main game logic, including the game initialization, rendering, and user interactions.
- `aStar.js`: This file implements the A\* pathfinding algorithm to automatically direct the snake towards the food.

## Key Features

- **Snake Movement**: The snake is controlled automatically by the A\* algorithm.
- **Dynamic Speed Control**: Use `H` to increase the speed and `J` to decrease the speed. Reset the speed by releasing the `H` or `J` key.
- **Pause and Step**: Use `K` to pause and unpause the game. When the game is paused, pressing `J` will advance the game by one update cycle.
- **Score Tracking**: The game tracks the player's score, which is displayed in the browser's title bar.

## A\* Algorithm Explanation

The A\* algorithm is a popular pathfinding and graph traversal algorithm used to find the shortest path between two points. It combines the benefits of Dijkstra's algorithm and Greedy Best-First-Search. The algorithm evaluates nodes by combining the cost to reach the node and the estimated cost to reach the goal from the node.

The formula used is:
\[ f(n) = g(n) + h(n) \]

Where:

- \( g(n) \) is the actual cost from the start node to the current node.
- \( h(n) \) is the heuristic estimated cost from the current node to the goal node.
- \( f(n) \) is the total estimated cost of the path through the current node to the goal.

The A\* algorithm ensures that the snake makes the most efficient moves towards the food, avoiding obstacles and itself.

## Detailed File Descriptions

### game.js

This file handles the core mechanics and rendering of the game. It includes:

- **Game Initialization**: Functions to set up the game board, initialize the snake, and place the food.
- **Rendering**: Functions to draw the grid, snake, and food on the canvas.
- **Snake Movement**: Functions to update the snake's position and handle collisions.
- **User Input**: Event listeners for keyboard input to control the snake and change the game speed.
- **A\* Algorithm Integration**: Calls the `runAStar` function from `aStar.js` to get the next move direction for the snake.

### aStar.js

This file implements the A\* pathfinding algorithm to find the optimal path for the snake to reach the food. It includes:

- **Neighbor Calculation**: Functions to locate the neighboring cells and calculate the heuristic (`hCost`), cost (`gCost`), and total cost (`fCost`) for each neighbor.
- **Pathfinding**: The `runAStar` function calculates the best move for the snake based on the A\* algorithm.
- **Cost Functions**: Functions to calculate the heuristic, cost, and open area cost to avoid obstacles and make efficient movements.

## How to Customize

- **Grid Size**: Modify the `blockSize` variable in `game.js` to change the size of each grid cell.
- **Game Speed**: Adjust the initial value of `gameSpeed` in `game.js` to set the default speed of the game.
- **Algorithm Parameters**: Tweak the cost functions in `aStar.js` to change the behavior of the A\* algorithm.

## Contributing

Feel free to fork this repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.
