import type { BoardProps } from "boardgame.io/dist/types/packages/react";
import { GameState } from "./lib/types";
import "./Board.css";

enum Color {
    wood = "#385626",
    brick = "#b36127",
    ore = "#aa998f",
    sea = "#3777bb",
    wheat = "#f7bc36",
    sheep = "#92bb50",
    desert = "#c79f56",
}

const RESOURCE_COLORS = {
    wood: Color.wood,
    brick: Color.brick,
    ore: Color.ore,
    sea: Color.sea,
    wheat: Color.wheat,
    sheep: Color.sheep,
    desert: Color.desert,
};

// TODO: implement camera
const BOARD_OFFSET = 300;

export function HexBoard({ ctx, G, moves }: BoardProps<GameState>) {
    const onClickTile = (id?: string) => moves.clickTile(id);
    const onClickCorner = (id?: string) => moves.clickCorner(id);
    const onClickEdge = (id?: string) => moves.clickEdge(id);

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
                onClick={() => onClickTile(tile.id)}
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
        corners.push(
            <div
                key={corner.id}
                onClick={() => onClickCorner(corner.id)}
                className="corner"
                style={{
                    top: corner.center.y + BOARD_OFFSET,
                    left: corner.center.x + BOARD_OFFSET,
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
        edges.push(
            <div
                key={edge.id}
                onClick={() => onClickEdge(edge.id)}
                className="edge"
                style={{
                    width: length,
                    left: centerX + BOARD_OFFSET,
                    top: centerY + BOARD_OFFSET,
                    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
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
