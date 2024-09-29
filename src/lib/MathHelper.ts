// adapted from https://github.com/sibartlett/colonizers

export interface Coordinates {
    x: number;
    y: number;
}

// TODO: don't need a class
export class MathHelper {
    static round(num: number, dp: number) {
        const dp2 = Math.pow(10, dp);
        return Math.round(num * dp2) / dp2;
    }

    static areFloatsEqual(a: number, b: number, epsilon = 0.01): boolean {
        return Math.abs(a - b) < epsilon;
    }

    static areCoordinatesEqual(p1: Coordinates, p2: Coordinates): boolean {
        return (
            this.areFloatsEqual(p1.x, p2.x) && this.areFloatsEqual(p1.y, p2.y)
        );
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
            x: MathHelper.round(origin.x + distance * Math.cos(radians), 3),
            y: MathHelper.round(origin.y + distance * Math.sin(radians), 3),
        };
    }
}
