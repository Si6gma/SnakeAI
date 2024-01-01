import { blockSize } from './game.js';

class MinHeap {
    constructor() {
        this.heap = [];
    }

    // Helper Methods
    getLeftChildIndex(parentIndex) {
        return 2 * parentIndex + 1;
    }
    getRightChildIndex(parentIndex) {
        return 2 * parentIndex + 2;
    }
    getParentIndex(childIndex) {
        return Math.floor((childIndex - 1) / 2);
    }
    hasLeftChild(index) {
        return this.getLeftChildIndex(index) < this.heap.length;
    }
    hasRightChild(index) {
        return this.getRightChildIndex(index) < this.heap.length;
    }
    hasParent(index) {
        return this.getParentIndex(index) >= 0;
    }
    leftChild(index) {
        return this.heap[this.getLeftChildIndex(index)];
    }
    rightChild(index) {
        return this.heap[this.getRightChildIndex(index)];
    }
    parent(index) {
        return this.heap[this.getParentIndex(index)];
    }

    // Functions to create Min Heap

    swap(indexOne, indexTwo) {
        const temp = this.heap[indexOne];
        this.heap[indexOne] = this.heap[indexTwo];
        this.heap[indexTwo] = temp;
    }

    peek() {
        if (this.heap.length === 0) {
            return null;
        }
        return this.heap[0];
    }

    // Removing an element will remove the
    // top element with highest priority then
    // heapifyDown will be called 
    remove() {
        if (this.heap.length === 0) {
            return null;
        }
        const item = this.heap[0];
        this.heap[0] = this.heap[this.heap.length - 1];
        this.heap.pop();
        this.heapifyDown();
        return item;
    }

    add(item) {
        this.heap.push(item);
        this.heapifyUp();
    }

    heapifyUp() {
        let index = this.heap.length - 1;
        while (this.hasParent(index) && this.parent(index) > this.heap[index]) {
            this.swap(this.getParentIndex(index), index);
            index = this.getParentIndex(index);
        }
    }

    heapifyDown() {
        let index = 0;
        while (this.hasLeftChild(index)) {
            let smallerChildIndex = this.getLeftChildIndex(index);
            if (this.hasRightChild(index) && this.rightChild(index) < this.leftChild(index)) {
                smallerChildIndex = this.getRightChildIndex(index);
            }
            if (this.heap[index] < this.heap[smallerChildIndex]) {
                break;
            } else {
                this.swap(index, smallerChildIndex);
            }
            index = smallerChildIndex;
        }
    }

    printHeap() {
        let heap = ` ${this.heap[0]} `;
        for (let i = 1; i < this.heap.length; i++) {
            heap += ` ${this.heap[i]} `;
        }
        console.log('heap');
        console.log(heap);
    }
}

function reconstruct_path(cameFrom, current) {
    let total_path = [current];
    while (cameFrom.has(current)) {
        current = cameFrom.get(current);
        total_path.unshift(current);
    }
    return total_path;
}

function getNeighbors(node, total_col, total_row) {
    let neighbors = [];
    let potentialNeighbors = [
        { x: node.x / blockSize, y: (node.y / blockSize) - 1 }, // Up
        { x: node.x / blockSize, y: (node.y / blockSize) + 1 }, // Down
        { x: (node.x / blockSize) - 1, y: node.y / blockSize }, // Left
        { x: (node.x / blockSize) + 1, y: node.y / blockSize }  // Right
    ];
    for (let neighbor of potentialNeighbors) {
        // Check if the neighbor is within the grid
        console.log(node.x / blockSize, node.y / blockSize);
        console.log("neighbor.x: " + neighbor.x);
        console.log("neighbor.y: " + neighbor.y);
        if (neighbor.x >= 0 && neighbor.x < total_col && neighbor.y >= 0 && neighbor.y < total_row) {
            neighbors.push(neighbor);
        }
    }
    return neighbors;
}

function getScore(scoreMap, node) {
    return scoreMap.has(node) ? scoreMap.get(node) : Number.POSITIVE_INFINITY;
}

export function A_Star(start, goal, h, total_col, total_row) {

    // console.log(goal.x);
    let openSet = new MinHeap();
    openSet.add(start);
    let cameFrom = new Map(); // Create a new map to store cameFrom values
    let gScore = new Map(); // Create a new map to store gScores
    let fScore = new Map(); // Create a new map to store fScores

    // Set the gScore of the start node to 0
    gScore.set(start, 0);

    // Set the fScore of the start node to the heuristic estimate
    fScore.set(start, h(start, goal));

    while (openSet.peek() !== null) {
        let current = openSet.peek();
        if (current == goal) {
            console.log(`Path`);
            console.log(reconstruct_path(cameFrom, current));
            return reconstruct_path(cameFrom, current);
        }
        openSet.remove(current);

        let neighbors = getNeighbors(current, total_col, total_row);
        // console.log(current);
        // console.log(total_col);
        // console.log(total_row);
        console.log(neighbors);
        let currentGScore = gScore.get(current); // Get the gScore of 'current'
        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];
            let tentative_gScore = currentGScore + 1;
            if (tentative_gScore < gScore.get(neighbor)) {
                cameFrom.set(neighbor, current);
                gScore.set(neighbor, tentative_gScore);
                fScore.set(neighbor, tentative_gScore + h(neighbor, goal));
                if (!openSet.contains(neighbor)) {
                    openSet.add(neighbor);
                }
            }
        }

    }
    // console.log("Start: ", start);
    // console.log("Goal: ", goal);
    // let path = reconstruct_path(cameFrom, current);
    // console.log("Path: ", path);
}

export function h(n, goal) {
    // console.log('N:');
    // console.log(n);
    // console.log('Goal: ');
    // console.log(goal);
    // console.log(`Goal: ` + goal.x);
    let dx = Math.abs(n.x - goal.x);
    let dy = Math.abs(n.y - goal.y);
    return dx + dy;
}