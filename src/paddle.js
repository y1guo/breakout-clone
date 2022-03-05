export default class Paddle {
    constructor(game) {
        this.game = game;
        this.width = game.paddleWidth;
        this.height = game.paddleHeight;
        this.maxSpeed = game.gameWidth / 1000;
        this.reset();
    }

    reset() {
        this.position = {
            x: (this.game.gameWidth - this.width) / 2,
            y: this.game.gameHeight * 0.98 - this.height
        };
        this.speed = 0;
    }

    draw() {
        this.game.ctx.fillStyle = "#fce";
        this.game.ctx.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }

    moveLeft() {
        this.speed = -this.maxSpeed;
    }

    moveRight() {
        this.speed = this.maxSpeed;
    }

    stop() {
        this.speed = 0;
    }

    update(deltaTime) {
        this.position.x += this.speed * deltaTime;

        // paddle stops at the edges
        if (this.position.x < 0) {
            this.position.x = 0;
        } else if (this.position.x > this.game.gameWidth - this.width) {
            this.position.x = this.game.gameWidth - this.width;
        }
    }
}
