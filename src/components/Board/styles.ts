import { styled } from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

export const BoardContainer = styled.div`
    flex-grow: 1;
`;

export const BoardWrapper = styled.div`
    position: relative;
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
    color: #efefef;
`;

export const Hexagon = styled.div`
    position: absolute;
    width: 100px; /* hexagon size */
    line-height: 32px;
    text-align: center;

    /* define hexagon shape */
    aspect-ratio: 1 / cos(30deg);
    clip-path: polygon(50% -50%, 100% 50%, 50% 150%, 0 50%);

    /* accounts for the fact that we have the shape's center coordinates, but are using top and left positions */
    transform: translate(-50%, -50%);

    &:hover {
        background: #efefef !important;
    }
`;

export const Corner = styled.div`
    cursor: pointer;
    position: absolute;
    width: 20px;
    height: 20px;
    clip-path: circle(10px);
    background-color: black;
    color: white;
    font-size: 8px;
    line-height: 18px;

    /* accounts for the fact that we have the shape's center coordinates, but are using top and left positions */
    transform: translate(-50%, -50%);

    &:hover {
        background: #efefef !important;
    }
`;

export const Edge = styled.div`
    cursor: pointer;
    position: absolute;
    height: 5px; /* line thickness */

    background-color: #b57112;
    border: 1px solid black;

    /* accounts for the fact that we have the shape's center coordinates, but are using top and left positions */
    transform: translate(-50%, -50%);

    &:hover {
        background: #efefef !important;
    }
`;
