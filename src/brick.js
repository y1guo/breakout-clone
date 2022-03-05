import detectCollision from "./detectCollision";

export default class Brick {
    constructor(game, position) {
        this.game = game;
        this.width = game.brickWidth;
        this.height = game.brickHeight;
        this.position = position;
        this.markedForDeletion = false;
        this.color = "#f";
        for (let i = 0; i < 2; i++) {
            this.color += Math.floor(8 + Math.random() * 6).toString(16);
        }
    }

    update() {
        if (detectCollision(this.game.ball, this)) {
            this.markedForDeletion = true;
            this.game.ball.speed.y *= -1;
        }
    }

    draw() {
        this.game.ctx.fillStyle = this.color;
        this.game.ctx.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }
}
