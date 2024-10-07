import type { BoardProps } from "boardgame.io/dist/types/packages/react";
import { Building, GameState } from "./lib/types";
import "./Board.css";
import { BOARD_OFFSET, TILE_COLORS } from "./constants";
import { getPlayer } from "./lib/helpers";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

export function HexBoard({ ctx, G, moves, playerID }: BoardProps<GameState>) {
    const onClickCorner = (id: string, building: Building | null) => {
        console.log("clicking with build", building);
        if (building === "settlement") {
            moves.onBuildCity(id);
        } else {
            moves.onBuildSettlement(id);
        }
    };
    const onClickEdge = (id: string) => moves.onBuildRoad(id);

    let currentPlayer;
    if (!playerID) {
        // spectator mode
        currentPlayer = getPlayer(G, ctx.currentPlayer);
    } else {
        currentPlayer = getPlayer(G, playerID);
    }

    const tiles = [];
    for (const tile of G.board.tiles) {
        tiles.push(
            <div
                key={tile.id}
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
                onClick={() => onClickCorner(corner.id, corner.building)}
                className="corner"
                style={{
                    top: corner.center.y,
                    left: corner.center.x,
                    backgroundColor: player?.color,
                    color: "white",
                    fontSize: "8px",
                    lineHeight: "18px",
                    clipPath:
                        corner.building === "city"
                            ? "polygon(50% 0, 0 100%, 100% 100%)"
                            : "default",
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
                onClick={() => onClickEdge(edge.id)}
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
        <div className="container">
            <TransformWrapper
                limitToBounds={false}
                initialPositionX={BOARD_OFFSET}
                initialPositionY={BOARD_OFFSET}
                maxScale={2.5}
            >
                <TransformComponent>
                    <div
                        className="board"
                        style={{
                            height: G.board.height,
                            width: G.board.width + BOARD_OFFSET,
                        }}
                    >
                        {tiles}
                        {edges}
                        {corners}
                    </div>
                </TransformComponent>
            </TransformWrapper>

            <div className="controls">
                <button onClick={() => moves.rollDice()}>Roll dice</button>
                <button disabled>Trade</button>
                <button onClick={() => moves.endTurn()}>End turn</button>
            </div>
            <div className="turn-info">
                <div>Current phase: {ctx.phase}</div>
                <div>player: {currentPlayer.id}</div>

                <div>
                    Roll:{" "}
                    {G.diceRoll.length ? G.diceRoll[0] + G.diceRoll[1] : "--"}
                </div>
                <div>wood: {currentPlayer.hand["wood"]}</div>
                <div>brick: {currentPlayer.hand["brick"]}</div>
                <div>sheep: {currentPlayer.hand["sheep"]}</div>
                <div>wheat: {currentPlayer.hand["wheat"]}</div>
                <div>ore: {currentPlayer.hand["ore"]}</div>
            </div>
        </div>
    );
}
