import type { BoardProps } from "boardgame.io/dist/types/packages/react";

export function TicTacToeBoard({ ctx, G, moves }: BoardProps) {
    const onClick = (id: number) => moves.clickCell(id);

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
