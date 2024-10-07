import { Coordinates } from "./MathHelper";

type TileType = "wood" | "brick" | "ore" | "wheat" | "sheep" | "desert" | "sea";
export type Building = "settlement" | "road" | "city";

export interface Edge {
    id: string;
    center: Coordinates;
    ends: Coordinates[];
    player?: string;
    adjacentEdges: string[];
}

export interface Tile {
    id: string;
    center: Coordinates;
    type?: TileType; // TODO: assigned after initialization
    value?: number; // TODO: only valid for resource tiles
    corners: string[]; // TODO: only valid for resource tiles
}

export interface Corner {
    id: string;
    center: Coordinates;
    player?: string;
    tiles: string[];
    adjacentCorners: string[];
    building: Extract<Building, "settlement" | "city"> | null;
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

export interface Hand {
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
    cities: string[];
    hand: Hand;
}

export interface GameState {
    allowance: Allowance;
    board: Board;
    victoryPoints: number;
    players: Player[];
    diceRoll: number[];
}
