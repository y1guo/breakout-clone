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
        if (this.edge().left < wall.left) {
            this.setPosition(wall.left, this.position().y);
        } else if (this.edge().right > wall.right) {
            this.setPosition(wall.right - this.width(), this.position().y);
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
