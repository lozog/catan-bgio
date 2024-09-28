import type { BoardProps } from "boardgame.io/dist/types/packages/react";
import { GameState } from "./lib/types";
import "./Board.css";
import { BOARD_OFFSET, TILE_COLORS } from "./constants";

export function HexBoard({ ctx, G, moves }: BoardProps<GameState>) {
    const onClickBoardPiece = (id?: string) => moves.onClickBoardPiece(id);

    const tiles = [];
    for (const tile of G.board.tiles) {
        tiles.push(
            <div
                key={tile.id}
                onClick={() => onClickBoardPiece(tile.id)}
                style={{
                    top: tile.center.y,
                    left: tile.center.x,
                    backgroundColor:
                        TILE_COLORS[
                            (tile.type ?? "sea") as keyof typeof TILE_COLORS
                        ],
                }}
                className="hexagon"
            >
                {tile.id}
                <div className="tile-value">{tile.value}</div>
            </div>
        );
    }

    const corners = [];
    for (const corner of G.board.corners) {
        const player = G.players.find((p) => p.id === corner.player);
        corners.push(
            <div
                key={corner.id}
                onClick={() => onClickBoardPiece(corner.id)}
                className="corner"
                style={{
                    top: corner.center.y,
                    left: corner.center.x,
                    backgroundColor: player?.color,
                    color: "white",
                    fontSize: "8px",
                    lineHeight: "18px",
                }}
            >
                {corner.id}
            </div>
        );
    }

    const edges = [];
    for (const edge of G.board.edges) {
        const { x: x1, y: y1 } = edge.ends[0];
        const { x: x2, y: y2 } = edge.ends[1];
        const { x: centerX, y: centerY } = edge.center;

        const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
        const player = G.players.find((p) => p.id === edge.player);
        edges.push(
            <div
                key={edge.id}
                onClick={() => onClickBoardPiece(edge.id)}
                className="edge"
                style={{
                    width: length,
                    left: centerX,
                    top: centerY,
                    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                    backgroundColor: player?.color,
                }}
            />
        );
    }

    return (
        <div>
            <div
                className="board"
                style={{
                    top: BOARD_OFFSET,
                    left: BOARD_OFFSET,
                    height: G.board.height,
                }}
            >
                {tiles}
                {edges}
                {corners}
            </div>

            <div className="controls">
                <button onClick={() => moves.rollDice()}>Roll dice</button>
                <button disabled>Build</button>
                <button disabled>Trade</button>
                <button onClick={() => moves.endTurn()}>End turn</button>
            </div>
        </div>
    );
}
