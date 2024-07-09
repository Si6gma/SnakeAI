import { blockSize } from "./game";

// Define a simple grid node
class Node {
    constructor(x, y, isWall = false) {
        this.x = x;
        this.y = y;
        this.isWall = isWall;
        this.parent = null;
        this.g = 0; // Cost from start to node
        this.h = 0; // Heuristic cost from node to end
        this.f = 0; // Total cost (g + h)
    }
}

// A* Pathfinding
function aStar(start, end, grid) {
    let openSet = [];
    let closedSet = [];
    openSet.push(start);

    while (openSet.length > 0) {
        let lowestIndex = 0;
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[lowestIndex].f) {
                lowestIndex = i;
            }
        }

        let current = openSet[lowestIndex];
        if (current === end) {
            let path = [];
            let temp = current;
            while (temp.parent) {
                path.push(temp);
                temp = temp.parent;
            }
            return path.reverse();
        }

        openSet = openSet.filter((item) => item !== current);
        closedSet.push(current);

        let neighbors = getNeighbors(current, grid);
        for (let neighbor of neighbors) {
            if (closedSet.includes(neighbor) || neighbor.isWall) {
                continue;
            }

            let tempG = current.g + 1;

            let newPath = false;
            if (openSet.includes(neighbor)) {
                if (tempG < neighbor.g) {
                    neighbor.g = tempG;
                    newPath = true;
                }
            } else {
                neighbor.g = tempG;
                newPath = true;
                openSet.push(neighbor);
            }

            if (newPath) {
                neighbor.h = heuristic(neighbor, end);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = current;
            }
        }
    }

    return [];
}

// Heuristic function for estimating distance to the end
function heuristic(a, b) {
    let d = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    return d;
}

// Function to get valid neighbors of a node
function getNeighbors(node, grid) {
    let neighbors = [];
    let directions = [[1, 0], [0, 1], [-1, 0], [0, -1]]; // Right, Down, Left, Up
    for (let [dx, dy] of directions) {
        let x = node.x + dx;
        let y = node.y + dy;
        if (x >= 0 && y >= 0 && x < grid.length && y < grid[0].length && !grid[x][y].isWall) {
            neighbors.push(grid[x][y]);
        }
    }
    return neighbors;
}

// Example usage:
// Assuming you have a grid and the snake's head and food positions as Node objects
// let path = aStar(snakeHeadNode, foodNode, grid);
// Use this path to update the snake's direction
