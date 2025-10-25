# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BattlesnakeTester is a TypeScript-based testing framework for Battlesnake AI servers. It sends HTTP requests with specific game state scenarios to test edge cases and validate snake behavior, ensuring Battlesnake implementations handle critical situations correctly.

## Build and Development Commands

**Build the project:**
```bash
npm run build
```
This compiles TypeScript from `src/` to `dist/` using the TypeScript compiler.

**Type checking without compilation:**
```bash
npx tsc --noEmit
```

**Run normal tests:**
```bash
# Using npm config (original method)
npm --host=localhost --port=8000 run test
# or with just hostname
npm --host=snake.example.com run test

# Using environment variables (recommended)
BATTLESNAKE_HOST=localhost BATTLESNAKE_PORT=8000 npm run test
# or with just hostname
BATTLESNAKE_HOST=snake.example.com npm run test
```
Normal tests cover scenarios where failing means certain death or very high probability of death.

**Run hard tests:**
```bash
# Using npm config
npm --host=localhost --port=8000 run hard_test

# Using environment variables (recommended)
BATTLESNAKE_HOST=localhost BATTLESNAKE_PORT=8000 npm run hard_test
```
Hard tests cover arguable situations requiring lookahead or prediction, where moves might be better but don't necessarily mean certain death.

**Configuration Priority:**
The test runner checks for host/port in the following priority order:
1. `BATTLESNAKE_HOST` and `BATTLESNAKE_PORT` environment variables (highest priority)
2. `npm_config_host` and `npm_config_port` (from npm --host/--port flags)
3. Default: `localhost` (no default port)

If no port is specified, the URL will be constructed as `http://host` without a port number.

**Install dependencies:**
```bash
npm install
```

## Architecture

### Core Type System (`src/types.ts`)
Defines the Battlesnake API data structures:
- `Coordinate`: x/y position on board
- `Snake`: Complete snake state including body, health, head position
- `GameBoard`: Board dimensions, food, hazards, and all snakes
- `GameRequest`: Full game state sent to Battlesnake servers

### Request Body Builder (`src/request_body_builder.ts`)
Central module for constructing test scenarios programmatically:

**Key functions:**
- `getEmptyRequestBody(width, height, turn)`: Creates base game state
- `addFood(body, x, y)`: Places food on board
- `addSnake(body, coords, health, name, id)`: Adds opponent snake
- `addYou(body, coords, health, name, id)`: Adds your snake (automatically added to snakes array)
- `printBoard(body)`: Console visualization of game state with legend:
  - `y` = your snake head
  - `*` = your snake body
  - `e` = enemy snake head
  - `#` = enemy snake body
  - `F` = food
  - `-` = empty space

**Important:** When using `addYou()`, the snake is automatically added to the `board.snakes` array, so you don't need to call `addSnake()` separately for your own snake.

### Test Helper (`src/test_helper.ts`)
Utilities for test execution:
- `getUrl()`: Extracts host/port from npm config environment variables
- `sendMoveRequest()`: Sends POST to `/move` endpoint (sends request twice with 1s sleep in between)
- `checkForGoodResponse()`: Validates HTTP 200 response

### Test Files
**`src/test.ts`**: Normal test suite covering critical scenarios:
- Flood fill / space detection
- Food at 1hp survival
- Tail growth edge cases
- Head-to-head collision avoidance
- Dead-end food detection
- Tail-chasing logic

**`src/hard_test.ts`**: Advanced test suite for nuanced decisions:
- Risk assessment at different health levels
- Dangerous food evaluation

## Test Execution Pattern

All tests follow this structure:
1. Build game state using `getEmptyRequestBody()` + builder functions
2. Print board for visual debugging with `printBoard()`
3. Send request to Battlesnake server via `sendMoveRequest()`
4. Validate response contains expected move direction

Example:
```typescript
const requestBody = requestBodyBuilder.getEmptyRequestBody(20, 20);
requestBodyBuilder.addFood(requestBody, 7, 7);
requestBodyBuilder.addSnake(requestBody, [{x: 7, y: 8}, {x: 6, y: 8}, {x: 5, y: 8}]);
requestBodyBuilder.addYou(requestBody, [{x: 11, y: 11}, {x: 11, y: 12}, {x: 11, y: 13}]);
requestBodyBuilder.printBoard(requestBody);

sendMoveRequest(url, requestBody, (err, res) => {
    checkForGoodResponse(err, res);
    const response: MoveResponse = JSON.parse(res.text);
    expect(response).to.have.property('move').with.equal('right');
    done();
});
```

## TypeScript Configuration

- **Target**: ES2020
- **Module**: CommonJS
- **Output**: `dist/` directory
- **Source**: `src/` directory
- Strict mode enabled
- Source maps and declarations generated

## CI/CD

GitHub Actions workflow (`.github/workflows/build.yaml.yml`) runs on push/PR to master:
- Tests Node.js versions: 18.x, 20.x, 22.x
- Type checks with `tsc --noEmit`
- Builds project with `npm run build`
- Validates `dist/` directory exists

## Coordinate System Notes

The board uses standard x/y coordinates:
- Origin (0,0) is bottom-left
- x increases going right
- y increases going up
- Board dimensions are configurable via `getEmptyRequestBody(width, height)`

When working with board visualization in `printBoard()`, note that the internal board array uses `[y][x]` indexing for proper 2D array layout.
