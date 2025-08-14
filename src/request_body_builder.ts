import {Coordinate, GameRequest, Snake} from './types';

// Before using this body, you need to add at least one food, and at least one snake (yourself)
export function getEmptyRequestBody(width: number = 20, height: number = 20, turn: number = 0): GameRequest {
    return {
        game: {
            id: 1,
            ruleset: {
                name: "standard",
                version: "v.1.2.3"
            },
            timeout: 500
        },
        turn: turn,
        board: {
            height: height,
            width: width,
            food: [],
            hazards: [],
            snakes: [],
        },
        you: {} as Snake
    };
}

export function addFood(body: GameRequest, x: number, y: number): void {
    const food: Coordinate = {
        x: x,
        y: y
    };

    body.board.food.push(food);
}

// Taken from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
export function makeRandomString(): string {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 10; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

export function addSnake(body: GameRequest, snakeCoords: Coordinate[], health: number = 100, name: string = makeRandomString(), id: string = makeRandomString()): void {
    const snakeBody: Coordinate[] = [];
    let head: Coordinate = {
        x: 0, y: 0
    };
    
    for (let i = 0; i < snakeCoords.length; i++) {
        if (i === 0) {
            head = {
                x: snakeCoords[i].x,
                y: snakeCoords[i].y
            };
        }
        const point: Coordinate = {
            x: snakeCoords[i].x,
            y: snakeCoords[i].y
        };

        snakeBody.push(point);
    }

    const snake: Snake = {
        body: snakeBody,
        length: snakeCoords.length,
        health: health,
        name: name,
        id: id,
        head: head,
        latency: 10,
        squad: "",
        shout: "",
    };

    body.board.snakes.push(snake);
}

export function addYou(body: GameRequest, snakeCoords: Coordinate[], health: number = 100, name: string = makeRandomString(), id: string = makeRandomString()): void {
    // You need to be in the snakes array also
    addSnake(body, snakeCoords, health, name, id);

    const yourBody: Coordinate[] = [];
    let head: Coordinate = { x: 0, y: 0 };
    
    for (let i = 0; i < snakeCoords.length; i++) {
        if (i === 0) {
            head = {
                x: snakeCoords[i].x,
                y: snakeCoords[i].y
            };
        }
        const point: Coordinate = {
            x: snakeCoords[i].x,
            y: snakeCoords[i].y
        };

        yourBody.push(point);
    }

    body.you = {
        body: yourBody,
        length: snakeCoords.length,
        health: health,
        name: name,
        id: id,
        head: head,
        latency: 10,
        squad: "",
        shout: "",
    };
}

export function printBoard(body: GameRequest): void {
    // Create board
    const board: string[][] = [];
    for (let i = 0; i < body.board.height; i++) {
        const row: string[] = [];
        for (let j = 0; j < body.board.width; j++) {
            row.push('-');
        }
        board.push(row);
    }

    // Add food (fixing coordinate swap issue)
    for (let i = 0; i < body.board.food.length; i++) {
        const food = body.board.food[i];
        board[food.y][food.x] = 'F';
    }

    // Find your snake id
    const yourId = body.you.id;

    // Add snakes (fixing coordinate swap issue)
    for (let i = 0; i < body.board.snakes.length; i++) {
        const snake = body.board.snakes[i];
        for (let j = 0; j < snake.length; j++) {
            const coord = snake.body[j];
            // Print your snake differently
            if (j === 0) {
                if (snake.id === yourId) {
                    board[coord.y][coord.x] = 'y';
                } else {
                    board[coord.y][coord.x] = 'e';
                }
            } else {
                if (snake.id === yourId) {
                    board[coord.y][coord.x] = '*';
                } else {
                    board[coord.y][coord.x] = '#';
                }
            }
        }
    }

    // Print how much health you have
    console.log("\n\nYou have " + body.you.health + " health.\nBoard:");
    for (let i = 0; i < body.board.height; i++) {
        let rowString = '';
        for (let j = 0; j < body.board.width; j++) {
            rowString += board[i][j] + ' ';
        }
        console.log(rowString);
    }
}
