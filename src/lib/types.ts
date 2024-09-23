import { Coordinates } from "./MathHelper";

export interface Edge {
    id?: string;
    center: Coordinates;
    ends: Coordinates[];
}

export interface Tile {
    id: string;
    center: Coordinates;
    type?: string;
    value?: number;
    tileType?: string;
}

export interface Corner {
    id?: string;
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

// TODO: rename to Scenario
export interface ScenarioInput {
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

export interface GameState {
    allowance: Allowance;
    board: Board;
    victoryPoints: number;
}
