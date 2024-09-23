import type { BoardProps } from "boardgame.io/dist/types/packages/react";
import { GameState } from "./lib/types";
import "./Board.css";
import { BOARD_OFFSET, RESOURCE_COLORS } from "./constants";

export function HexBoard({ ctx, G, moves }: BoardProps<GameState>) {
    const onClickBoardPiece = (id?: string) => moves.onClickBoardPiece(id);

    let winner;
    if (ctx.gameover) {
        winner =
            ctx.gameover.winner !== undefined ? (
                <div id="winner">Winner: {ctx.gameover.winner}</div>
            ) : (
                <div id="winner">Draw!</div>
            );
    }

    let tiles = [];
    for (const tile of G.board.tiles) {
        tiles.push(
            <div
                key={tile.id}
                onClick={() => onClickBoardPiece(tile.id)}
                style={{
                    top: tile.center.y + BOARD_OFFSET,
                    left: tile.center.x + BOARD_OFFSET,
                    backgroundColor:
                        RESOURCE_COLORS[
                            (tile.type ?? "sea") as keyof typeof RESOURCE_COLORS
                        ],
                }}
                className="hexagon"
            >
                {tile.type}
            </div>
        );
    }

    let corners = [];
    for (const corner of G.board.corners) {
        const player = G.players.find((p) => p.id === corner.player);
        corners.push(
            <div
                key={corner.id}
                onClick={() => onClickBoardPiece(corner.id)}
                className="corner"
                style={{
                    top: corner.center.y + BOARD_OFFSET,
                    left: corner.center.x + BOARD_OFFSET,
                    backgroundColor: player?.color,
                }}
            />
        );
    }

    let edges = [];
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
                    left: centerX + BOARD_OFFSET,
                    top: centerY + BOARD_OFFSET,
                    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                    backgroundColor: player?.color,
                }}
            />
        );
    }

    return (
        <div>
            {tiles}
            {edges}
            {corners}
            {winner}
        </div>
    );
}
