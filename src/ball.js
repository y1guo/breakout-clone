import detectCollision from "/src/detectCollision";

export default class Ball {
    constructor(game) {
        this.image = document.getElementById("imgBall");
        this.game = game;
        this.size = game.ballSize;
        this.reset();
    }

    reset() {
        this.position = {
            x: (this.game.gameWidth - this.size) * 0.5,
            y: this.game.gameHeight * 0.9
        };
        this.speed = {
            x: (this.game.gameWidth / 5000) * Math.random(),
            y: -this.game.gameWidth / 2000
        };
        this.angle = 0;
        this.angularSpeed = -this.speed.x / (0.5 * this.size);
    }

    update(deltaTime) {
        this.position.x += this.speed.x * deltaTime;
        this.position.y += this.speed.y * deltaTime;
        this.angle += this.angularSpeed * deltaTime;

        let center = {
            x: this.position.x + this.size / 2,
            y: this.position.y + this.size / 2
        };

        // wall bounce
        if (center.x < 0) {
            center.x = -center.x;
            this.speed.x = -this.speed.x;
        } else if (center.x > this.game.gameWidth) {
            center.x = 2 * this.game.gameWidth - center.x;
            this.speed.x = -this.speed.x;
        }
        if (center.y < 0) {
            center.y = -center.y;
            this.speed.y = -this.speed.y;
        }
        if (this.position.y > this.game.gameHeight) {
            this.game.gameover();
        }

        // paddle bounce
        if (detectCollision(this, this.game.paddle)) {
            center.y = 2 * this.game.paddle.position.y - center.y;
            this.speed.y = -this.speed.y;
            this.speed.x += this.game.paddle.speed * 0.2;
            this.angularSpeed = -this.speed.x / (0.5 * this.size);
        }

        this.position = {
            x: center.x - this.size / 2,
            y: center.y - this.size / 2
        };
    }

    draw() {
        let center = {
            x: this.position.x + this.size / 2,
            y: this.position.y + this.size / 2
        };

        this.game.ctx.translate(center.x, center.y);
        this.game.ctx.rotate(this.angle);
        this.game.ctx.drawImage(
            this.image,
            -this.size / 2,
            -this.size / 2,
            this.size,
            this.size
        );
        this.game.ctx.rotate(-this.angle);
        this.game.ctx.translate(-center.x, -center.y);
    }
}
