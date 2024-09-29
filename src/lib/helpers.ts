import { Coordinates, MathHelper } from "./MathHelper";
import { Corner, Edge, GameState, Player, Tile } from "./types";

export function isCorner(id: string): boolean {
    return id[0] === "C";
}

export function isEdge(id: string): boolean {
    return id[0] === "E";
}

export function getPlayer(G: GameState, id: string): Player {
    const player = G.players.find((p) => p.id === id);
    if (!player) {
        throw new Error("player not found");
    }
    return player;
}

export function getCorner(G: GameState, id: string): Corner {
    const corner = G.board.corners.find((c) => c.id === id);
    if (!corner) {
        throw new Error("corner not found");
    }
    return corner;
}

export function getEdge(G: GameState, id: string): Edge {
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
    corners: Corner[],
    coordinates: Coordinates
): Corner | undefined {
    return corners.find((c) =>
        MathHelper.areCoordinatesEqual(coordinates, c.center)
    );
}

export function findAdjacentCorners(
    corner: Corner,
    edges: Edge[],
    corners: Corner[]
): string[] {
    const adjacentEdges = edges.filter((edge) => {
        return isEdgeAdjacentToCorner(edge, corner);
    });

    // find corners at other end of adjacent edge
    const adjacentCorners: string[] = [];
    adjacentEdges.forEach((edge) => {
        for (const end of edge.ends) {
            if (MathHelper.areCoordinatesEqual(end, corner.center)) continue;

            const adjacentCorner = findCornerByCoordinates(corners, end);
            if (adjacentCorner) adjacentCorners.push(adjacentCorner.id);
        }
    });
    return adjacentCorners;
}
