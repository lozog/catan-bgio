import { TradeOffer } from "../../lib/types";
import { Container } from "./styles";

type Props = {
    tradeOffer: TradeOffer;
    onAcceptTrade: () => void;
    onRejectTrade: () => void;
};

export function TradeConfirmationMenu({
    tradeOffer,
    onAcceptTrade,
    onRejectTrade,
}: Props) {
    let receive = "";
    let give = "";
    for (let [resource, value] of Object.entries(tradeOffer.offer)) {
        if (value > 0) {
            receive += ` ${value} ${resource}, `;
        }
        if (value < 0) {
            give += ` ${Math.abs(value)} ${resource}, `;
        }
    }
    return (
        <Container>
            <div>You receive: {receive}</div>
            <div>You give: {give}</div>
            <button
                onClick={() => {
                    onAcceptTrade();
                }}
            >
                Accept trade
            </button>
            <button
                onClick={() => {
                    onRejectTrade();
                }}
            >
                Reject trade
            </button>
        </Container>
    );
}
