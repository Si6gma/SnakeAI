# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2024-02-17

### Added
- Complete test suite with Jest (68 tests covering game and A* algorithm)
- Code coverage reporting with 50%+ threshold
- GitHub Actions CI workflow for automated testing on Node.js 18.x and 20.x
- ES6+ module system with proper imports/exports
- Babel configuration for transpilation
- Comprehensive JSDoc documentation
- Input validation for DOM elements and numeric values
- Error handling with graceful degradation
- `destroy()` method for proper resource cleanup
- `getState()` method for accessing game state

### Changed
- Refactored from procedural to class-based architecture
  - `SnakeGame` class for game logic
  - `AStar` class for pathfinding
  - `PriorityQueue` class for A* algorithm
- Improved A* algorithm with proper open/closed sets
- Better collision detection and edge case handling
- Enhanced code organization and modularity

### Fixed
- Self-collision detection accuracy
- Food placement algorithm (no longer spawns on snake)
- Boundary checking for all game objects
- Memory leak potential with proper interval cleanup

### Security
- Input sanitization for all user-facing numeric values
- DOM element validation to prevent runtime errors

## [1.0.0] - 2024 (Initial Release)

### Added
- Basic Snake game implementation
- A* pathfinding algorithm for AI movement
- HTML5 Canvas rendering
- Keyboard controls (H for speed up, G for max speed, K for pause, J for step)
- Open Graph and Twitter Card metadata
- Favicon and app icons
- Responsive design
