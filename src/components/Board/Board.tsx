import type { BoardProps } from "boardgame.io/dist/types/packages/react";
import { Building, GameState } from "../../lib/types";
import { BOARD_OFFSET } from "../../constants";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import {
    BoardWrapper,
    Container,
    Corner,
    Edge,
    Hexagon,
    TileValue,
} from "./styles";

export function Board({ G, moves }: BoardProps<GameState>) {
    const onClickCorner = (id: string, currentBuilding: Building | null) => {
        if (currentBuilding === "settlement") {
            moves.buildCity(id);
        } else {
            moves.buildSettlement(id);
        }
    };
    const onClickEdge = (id: string) => moves.buildRoad(id);

    const tiles = [];
    for (const tile of G.board.tiles) {
        tiles.push(
            <Hexagon
                key={tile.id}
                $centerX={tile.center.x}
                $centerY={tile.center.y}
                $tileType={tile.type ?? "sea"}
            >
                {tile.id}
                <TileValue>{tile.value}</TileValue>
            </Hexagon>
        );
    }

    const corners = [];
    for (const corner of G.board.corners) {
        const player = G.players.find((p) => p.id === corner.player);
        corners.push(
            <Corner
                key={corner.id}
                onClick={() => onClickCorner(corner.id, corner.building)}
                $centerX={corner.center.x}
                $centerY={corner.center.y}
                $building={corner.building as Building}
                $playerColor={player?.color}
            >
                {corner.id}
            </Corner>
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
            <Edge
                key={edge.id}
                onClick={() => onClickEdge(edge.id)}
                $width={length}
                $centerX={centerX}
                $centerY={centerY}
                $angle={angle}
                $playerColor={player?.color}
            />
        );
    }
    return (
        <Container>
            <TransformWrapper
                limitToBounds={false}
                initialPositionX={BOARD_OFFSET}
                initialPositionY={BOARD_OFFSET}
                maxScale={2.5}
            >
                <TransformComponent
                    wrapperStyle={{
                        width: "100%",
                        maxWidth: "1000px",
                    }}
                >
                    <BoardWrapper
                        height={G.board.height}
                        width={G.board.width + BOARD_OFFSET}
                    >
                        {tiles}
                        {edges}
                        {corners}
                    </BoardWrapper>
                </TransformComponent>
            </TransformWrapper>
        </Container>
    );
}
