export interface Coordinate {
    x: number;
    y: number;
}

export interface Snake {
    body: Coordinate[];
    length: number;
    health: number;
    name: string;
    id: string;
    head: Coordinate;
    latency: number;
    squad: string;
    shout: string;
}

export interface GameBoard {
    height: number;
    width: number;
    food: Coordinate[];
    hazards: Coordinate[];
    snakes: Snake[];
}

export interface GameRequest {
    game: {
        id: number;
        ruleset: {
            name: string;
            version: string;
        };
        timeout: number;
    };
    turn: number;
    board: GameBoard;
    you: Snake;
}
