import { MathHelper } from "./MathHelper";
import { Corner, Edge, GameState, Player } from "./types";

export function isCorner(id: string): boolean {
    return id[0] === "C";
}

export function isEdge(id: string): boolean {
    return id[0] === "E";
}

export function findPlayer(G: GameState, id: string): Player {
    const player = G.players.find((p) => p.id === id);
    if (!player) {
        throw new Error("player not found");
    }
    return player;
}

export function findCorner(G: GameState, id: string): Corner {
    const corner = G.board.corners.find((c) => c.id === id);
    if (!corner) {
        throw new Error("corner not found");
    }
    return corner;
}

export function findEdge(G: GameState, id: string): Edge {
    const edge = G.board.edges.find((c) => c.id === id);
    if (!edge) {
        throw new Error("edge not found");
    }
    return edge;
}

// edge is adjacent to corner if one of the edge ends' coordinates
// matches the coordinates of the corner's center
export function isEdgeAdjacentToCorner(edge: Edge, corner: Corner): boolean {
    return (
        MathHelper.areCoordinatesEqual(edge.ends[0], corner.center) ||
        MathHelper.areCoordinatesEqual(edge.ends[1], corner.center)
    );
}
