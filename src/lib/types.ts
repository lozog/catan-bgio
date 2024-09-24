import { Coordinates } from "./MathHelper";

export interface Edge {
    id?: string; // TODO: should be required
    center: Coordinates;
    ends: Coordinates[];
    player?: string;
}

export interface Tile {
    id: string;
    center: Coordinates;
    type?: string;
    value?: number;
    tileType?: string;
}

export interface Corner {
    id?: string; // TODO: should be required
    center: Coordinates;
    player?: string;
}

export interface Layout {
    players: {
        min: number;
        max: number;
    };
    numberTokens: number[];
    terrainTiles: string;
    tiles: string[];
}

export interface Allowance {
    roads: number;
    settlements: number;
    cities: number;
}

export interface Scenario {
    name: string;
    victoryPoints: number;
    allowance: Allowance;
    layouts: Layout[];
}

export interface Board {
    // hex: ScenarioBuilder;
    height: number;
    width: number;
    tiles: Tile[];
    corners: Corner[];
    edges: Edge[];
}

interface Hand {
    wood: number;
    brick: number;
    ore: number;
    wheat: number;
    sheep: number;
}

export interface Player {
    id: string;
    color: string;
    settlements: string[];
    roads: string[];
    hand: Hand;
}

export interface GameState {
    allowance: Allowance;
    board: Board;
    victoryPoints: number;
    players: Player[];
}
