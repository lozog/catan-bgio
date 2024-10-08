import { Resource } from "../../../lib/types";
import { Container } from "./styles";

export function TradeResource({
    resource,
    offer,
    changeOffer,
}: {
    resource: Resource;
    offer: number;
    changeOffer: (resource: Resource, amount: number) => void;
}) {
    return (
        <Container>
            <div>{offer < 0 ? -1 * offer : 0}</div>
            <button onClick={() => changeOffer(resource, -1)}>^</button>
            <div>{resource}</div>
            <button onClick={() => changeOffer(resource, 1)}>v</button>
            <div>{offer > 0 ? offer : 0}</div>
        </Container>
    );
}
