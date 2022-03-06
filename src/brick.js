import { detectCollision } from "./detectCollision";
import { SquareObject } from "./object";

export class Brick extends SquareObject {
    constructor(gamePanel, size, position) {
        super();
        this.gamePanel = gamePanel;
        this.setSize(size.x, size.y);
        this.setPosition(position.x, position.y);
        this.markedForDeletion = false;
        this.color = "#f";
        for (let i = 0; i < 2; i++) {
            this.color += Math.floor(8 + Math.random() * 6).toString(16);
        }
    }

    update() {
        if (detectCollision(this.gamePanel.ball, this)) {
            this.markedForDeletion = true;
            let ballVelocity = this.gamePanel.ball.velocity();
            this.gamePanel.ball.setVelocity(ballVelocity.x, -ballVelocity.y);
        }
    }

    draw() {
        let ctx = this.gamePanel.game.ctx;
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.position().x,
            this.position().y,
            this.width(),
            this.height()
        );
    }
}
