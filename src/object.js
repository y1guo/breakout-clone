export class SquareObject {
    #center;
    #size;
    #collisionSize;
    #angle;
    #velocity;
    #angularVelocity;

    constructor() {
        this.#center = {
            x: 0,
            y: 0,
        };
        this.#size = {
            x: 0,
            y: 0,
        };
        this.#collisionSize = {
            x: 0,
            y: 0,
        };
        this.#angle = 0;
        this.#velocity = {
            x: 0,
            y: 0,
        };
        this.#angularVelocity = 0;
    }

    setPosition(x, y) {
        this.#center.x = x + this.#size.x / 2;
        this.#center.y = y + this.#size.y / 2;
    }

    setSize(width, height) {
        this.#size.x = width;
        this.#size.y = height;
        this.setCollisionSize(width, height);
    }

    setCollisionSize(width, height) {
        this.#collisionSize.x = width;
        this.#collisionSize.y = height;
    }

    setAngle(angle) {
        this.#angle = angle;
    }

    setVelocity(vx, vy) {
        this.#velocity.x = vx;
        this.#velocity.y = vy;
    }

    setAngularVelocity(angularVelocity) {
        this.#angularVelocity = angularVelocity;
    }

    setCenter(x, y) {
        this.#center.x = x;
        this.#center.y = y;
    }

    displace(dx, dy) {
        this.#center.x += dx;
        this.#center.y += dy;
    }

    autoMove(dt) {
        let dx = this.#velocity.x * dt;
        let dy = this.#velocity.y * dt;
        let deltaAngle = this.#angularVelocity * dt;
        this.displace(dx, dy);
        this.rotate(deltaAngle);
    }

    rotate(deltaAngle) {
        this.#angle += deltaAngle;
    }

    position() {
        return {
            x: this.#center.x - this.#size.x / 2,
            y: this.#center.y - this.#size.y / 2,
        };
    }

    center() {
        return this.#center;
    }

    edge() {
        return {
            left: this.#center.x - this.#size.x / 2,
            right: this.#center.x + this.#size.x / 2,
            top: this.#center.y - this.#size.y / 2,
            bottom: this.#center.y + this.#size.y / 2,
        };
    }

    collisionEdge() {
        return {
            left: this.#center.x - this.#collisionSize.x / 2,
            right: this.#center.x + this.#collisionSize.x / 2,
            top: this.#center.y - this.#collisionSize.y / 2,
            bottom: this.#center.y + this.#collisionSize.y / 2,
        };
    }

    width() {
        return this.#size.x;
    }

    height() {
        return this.#size.y;
    }

    collisionSize() {
        return this.#collisionSize;
    }

    angle() {
        return this.#angle;
    }

    velocity() {
        return this.#velocity;
    }

    angularVelocity() {
        return this.#angularVelocity;
    }
}
