import type { BoardProps } from "boardgame.io/dist/types/packages/react";
import { GameState } from "./Game";
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
const BOARD_OFFSET = 400;

export function HexBoard({ ctx, G, moves }: BoardProps<GameState>) {
    const onClick = (id?: string) => moves.clickTile(id);

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
    for (const tile of G.scenario.board.tiles) {
        tiles.push(
            <div
                key={tile.id}
                onClick={() => onClick(tile.id)}
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
    for (const corner of G.scenario.board.corners) {
        corners.push(
            <div
                key={corner.id}
                onClick={() => onClick(corner.id)}
                className="corner"
                style={{
                    top: corner.center.y + BOARD_OFFSET, // TODO: why these offsets different?
                    left: corner.center.x + BOARD_OFFSET,
                }}
            />
        );
    }

    return (
        <div>
            {tiles}
            {corners}
            {winner}
        </div>
    );
}
