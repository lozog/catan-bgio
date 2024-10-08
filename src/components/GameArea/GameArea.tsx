import type { BoardProps } from "boardgame.io/dist/types/packages/react";
import { GameState } from "../../lib/types";
import { Container } from "./styles";
import { Board } from "../Board/Board";
import { Hud } from "../Hud/Hud";

export function GameArea(props: BoardProps<GameState>) {
    return (
        <Container>
            <Board {...props} />
            <Hud {...props} />
        </Container>
    );
}
