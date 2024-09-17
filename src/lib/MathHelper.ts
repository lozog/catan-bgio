// adapted from https://github.com/sibartlett/colonizers

export interface Coordinates {
    x: number;
    y: number;
}

export class MathHelper {
    static round(num: number, dp: number) {
        const dp2 = Math.pow(10, dp);
        return Math.round(num * dp2) / dp2;
    }

    static getAngle(p1: Coordinates, p2: Coordinates) {
        return (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
    }

    static getDistance(p1: Coordinates, p2: Coordinates) {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }

    static getEndpoint(origin: Coordinates, angle: number, distance: number) {
        const radians = (angle * Math.PI) / 180;
        return {
            // dividing by 2 here makes the edges in the right places, but the corners to be wrong
            x: MathHelper.round(origin.x + distance * Math.cos(radians), 3),
            y: MathHelper.round(origin.y + distance * Math.sin(radians), 3),
        };
    }
}
