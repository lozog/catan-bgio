import type { BoardProps } from "boardgame.io/dist/types/packages/react";
import { GameState } from "./Game";
import { Ctx } from "boardgame.io";

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

export function TicTacToeBoard({ ctx, G, moves }: BoardProps<GameState>) {
    const onClick = (id: string) => moves.clickCell(id);

    let winner;
    if (ctx.gameover) {
        winner =
            ctx.gameover.winner !== undefined ? (
                <div id="winner">Winner: {ctx.gameover.winner}</div>
            ) : (
                <div id="winner">Draw!</div>
            );
    }

    const cellStyle = {
        border: "1px solid #555",
        width: "64px",
        height: "64px",
        lineHeight: "64px",
        textAlign: "center" as const,
        cursor: "pointer",
        position: "absolute" as const,
    };

    let tiles = [];
    for (const tile of G.scenario.board.tiles) {
        tiles.push(
            <button
                key={tile.id}
                onClick={() => onClick(tile.id)}
                style={{
                    ...cellStyle,
                    top: tile.center.y + 300,
                    left: tile.center.x + 300,
                    backgroundColor:
                        RESOURCE_COLORS[
                            (tile.type ?? "sea") as keyof typeof RESOURCE_COLORS
                        ],
                }}
            >
                {tile.type}
            </button>
        );
    }

    return (
        <div>
            {tiles}
            {winner}
        </div>
    );
}
