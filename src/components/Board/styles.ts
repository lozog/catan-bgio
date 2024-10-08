import { styled } from "styled-components";
import { Building, TileType } from "../../lib/types";
import {
    CORNER_SIZE,
    HEXAGON_SIZE,
    ROAD_WIDTH,
    TILE_COLORS,
    Color,
} from "../../constants";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

export const BoardContainer = styled.div`
    flex-grow: 1;
`;

export const BoardWrapper = styled.div<{ height: number; width: number }>`
    position: relative;

    height: ${(props) => props.height}px;
    width: ${(props) => props.width}px;
`;

export const Hud = styled.div`
    background: beige;
    display: flex;
    flex-grow: 0;
    flex-shrink: 0;
    height: 300px;
`;

export const Controls = styled.div`
    width: 35%;
    height: 100%;
`;

export const TurnInfo = styled.div`
    width: 50%;
    height: 100%;
`;

export const PlayerResource = styled.div`
    display: inline-block;
    margin-right: 8px;
`;

export const TileValue = styled.div`
    line-height: normal;
    font-size: 20px;
    font-weight: bold;
    color: ${Color.hover};
`;

export const Hexagon = styled.div<{
    $centerX: number;
    $centerY: number;
    $tileType: TileType;
}>`
    position: absolute;
    width: ${HEXAGON_SIZE}px;
    line-height: 32px;
    text-align: center;

    /* define hexagon shape */
    aspect-ratio: 1 / cos(30deg);
    clip-path: polygon(50% -50%, 100% 50%, 50% 150%, 0 50%);

    left: ${(props) => props.$centerX}px;
    top: ${(props) => props.$centerY}px;
    background-color: ${(props) => TILE_COLORS[props.$tileType]};

    /* accounts for the fact that we have the shape's center coordinates, but are using top and left positions */
    transform: translate(-50%, -50%);

    &:hover {
        background: ${Color.hover};
    }

    &:hover ${TileValue} {
        color: black;
    }
`;

export const Corner = styled.div<{
    $centerX: number;
    $centerY: number;
    $building?: Building;
    $playerColor?: string;
}>`
    cursor: pointer;
    position: absolute;
    width: ${CORNER_SIZE}px;
    height: ${CORNER_SIZE}px;
    clip-path: circle(${CORNER_SIZE / 2}px);
    color: white;
    font-size: 8px;
    line-height: 18px;

    left: ${(props) => props.$centerX}px;
    top: ${(props) => props.$centerY}px;
    background-color: ${(props) =>
        props.$playerColor ? props.$playerColor : "black"};
    clip-path: ${(props) =>
        props.$building === "city"
            ? "polygon(50% 0, 0 100%, 100% 100%)" // draw city as a triangle
            : "circle(10px)"};

    /* accounts for the fact that we have the shape's center coordinates, but are using top and left positions */
    transform: translate(-50%, -50%);

    &:hover {
        color: black;
        background: ${Color.hover};
    }
`;

export const Edge = styled.div<{
    $width: number;
    $centerX: number;
    $centerY: number;
    $angle: number;
    $playerColor?: string;
}>`
    cursor: pointer;
    position: absolute;
    height: ${ROAD_WIDTH}px; /* line thickness */

    width: ${(props) => props.$width}px;
    left: ${(props) => props.$centerX}px;
    top: ${(props) => props.$centerY}px;
    transform: translate(-50%, -50%) rotate(${(props) => props.$angle}deg);
    background-color: ${(props) =>
        props.$playerColor ? props.$playerColor : Color.road};

    &:hover {
        color: black;
        background: ${Color.hover};
    }
`;
