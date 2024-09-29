import { Coordinates, MathHelper } from "./MathHelper";
import { Corner, Edge, GameState, Player, Tile } from "./types";

export function isCorner(id: string): boolean {
    return id[0] === "C";
}

export function isEdge(id: string): boolean {
    return id[0] === "E";
}

// TODO: rename getPlayer
export function findPlayer(G: GameState, id: string): Player {
    const player = G.players.find((p) => p.id === id);
    if (!player) {
        throw new Error("player not found");
    }
    return player;
}

// TODO: rename getCorner
export function findCorner(G: GameState, id: string): Corner {
    const corner = G.board.corners.find((c) => c.id === id);
    if (!corner) {
        throw new Error("corner not found");
    }
    return corner;
}

// TODO: rename getEdge
export function findEdge(G: GameState, id: string): Edge {
    const edge = G.board.edges.find((e) => e.id === id);
    if (!edge) {
        throw new Error("edge not found");
    }
    return edge;
}

export function findTile(G: GameState, id: string): Tile {
    const tile = G.board.tiles.find((t) => t.id === id);
    if (!tile) {
        throw new Error("tile not found");
    }
    return tile;
}

// edge is adjacent to corner if one of the edge ends' coordinates
// matches the coordinates of the corner's center
export function isEdgeAdjacentToCorner(edge: Edge, corner: Corner): boolean {
    return (
        MathHelper.areCoordinatesEqual(edge.ends[0], corner.center) ||
        MathHelper.areCoordinatesEqual(edge.ends[1], corner.center)
    );
}

function findCornerByCoordinates(
    G: GameState,
    coordinates: Coordinates
): Corner | undefined {
    return G.board.corners.find((c) =>
        MathHelper.areCoordinatesEqual(coordinates, c.center)
    );
}

export function findAdjacentCorners(G: GameState, corner: Corner): Corner[] {
    const adjacentEdges = G.board.edges.filter((edge) => {
        return isEdgeAdjacentToCorner(edge, corner);
    });

    // find corners at other end of adjacent edge
    const adjacentCornerCoords: Corner[] = [];
    adjacentEdges.forEach((edge) => {
        for (const end of edge.ends) {
            if (MathHelper.areCoordinatesEqual(end, corner.center)) continue;

            const adjacentCorner = findCornerByCoordinates(G, end);
            if (adjacentCorner) adjacentCornerCoords.push(adjacentCorner);
        }
    });
    return adjacentCornerCoords;
}
