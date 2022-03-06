import { SquareObject } from "./object";

export class Paddle extends SquareObject {
    constructor(gamePanel) {
        super();
        this.gamePanel = gamePanel;
        this.maxSpeed = gamePanel.game.settings.paddleMaxSpeed;
    }

    setVelocityAngle(angle) {
        angle *= Math.PI / 180;
        let vx = this.maxSpeed * Math.cos(angle);
        let vy = -this.maxSpeed * Math.sin(angle);
        this.setVelocity(vx, vy);
    }

    stop() {
        this.setVelocity(0, 0);
    }

    update(deltaTime) {
        this.autoMove(deltaTime);

        // paddle stops at the walls
        let wall = this.gamePanel.edge();
        let velocity = this.velocity();
        if (this.edge().left < wall.left) {
            this.setPosition(wall.left, this.position().y);
            this.setVelocity(0, velocity.y);
        } else if (this.edge().right > wall.right) {
            this.setPosition(wall.right - this.width(), this.position().y);
            this.setVelocity(0, velocity.y);
        }
        if (this.edge().top < wall.top) {
            this.setPosition(this.position().x, wall.top);
            this.setVelocity(velocity.x, 0);
        } else if (this.edge().bottom > wall.bottom) {
            this.setPosition(this.position().x, wall.bottom - this.height());
            this.setVelocity(velocity.x, 0);
        }
    }

    draw() {
        let ctx = this.gamePanel.game.ctx;
        ctx.fillStyle = "#fce";
        ctx.fillRect(
            this.position().x,
            this.position().y,
            this.width(),
            this.height()
        );
    }
}
