import { styled } from "styled-components";

export const Container = styled.div`
    background: beige;
    display: flex;
    flex-grow: 0;
    flex-shrink: 0;
    height: 300px;
`;

export const Controls = styled.div`
    flex: 4;
    height: 100%;
`;

export const TurnInfo = styled.div`
    flex: 5;
    height: 100%;
`;

export const PlayerResource = styled.div`
    display: inline-block;
    margin-right: 8px;
`;
