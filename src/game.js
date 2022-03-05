import Paddle from "./paddle";
import InputHandler from "./input";
import Ball from "./ball";
import buildLevel from "./level";

const GAMESTATE = {
    PAUSED: 0,
    RUNNING: 1,
    MENU: 2,
    GAMEOVER: 3,
    VICTORY: 4
};

export default class Game {
    constructor(ctx) {
        this.ctx = ctx;
        if (window.innerWidth / window.innerHeight > 4 / 3) {
            this.gameHeight = window.innerHeight;
            this.gameWidth = (this.gameHeight / 3) * 4;
        } else {
            this.gameWidth = window.innerWidth;
            this.gameHeight = (this.gameWidth / 4) * 3;
        }

        this.ctx.canvas.width = this.gameWidth;
        this.ctx.canvas.height = this.gameHeight;
        this.paddleWidth = this.gameWidth * 0.25;
        this.paddleHeight = this.gameWidth * 0.025;
        this.ballSize = this.gameWidth * 0.08;
        this.brickWidth = this.gameWidth * 0.1;
        this.brickHeight = this.brickWidth * 0.5;

        this.paddle = new Paddle(this);
        this.ball = new Ball(this);
        this.gameState = GAMESTATE.MENU;
        new InputHandler(this);
    }

    reset() {
        this.bricks = buildLevel(this);
        this.paddle.reset();
        this.ball.reset();
        this.gameObjects = [...this.bricks, this.paddle, this.ball];
    }

    start() {
        if (
            this.gameState === GAMESTATE.MENU ||
            this.gameState === GAMESTATE.GAMEOVER ||
            this.gameState === GAMESTATE.VICTORY
        ) {
            this.reset();
            this.gameState = GAMESTATE.RUNNING;
        }
    }

    update(deltaTime) {
        if (this.gameState === GAMESTATE.RUNNING) {
            this.gameObjects.forEach((object) => {
                object.update(deltaTime);
            });
            this.gameObjects = this.gameObjects.filter(
                (object) => !object.markedForDeletion
            );
            if (this.gameObjects.length === 2) {
                this.gameState = GAMESTATE.VICTORY;
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);

        if (this.gameState === GAMESTATE.MENU) {
            this.ctx.fillStyle = "#222";
            this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);

            this.ctx.font = this.gameHeight * 0.1 + "px Serif";
            this.ctx.fillStyle = "#fff";
            this.ctx.textAlign = "center";
            this.ctx.fillText(
                "PRESS SPACE TO START",
                this.gameWidth / 2,
                this.gameHeight / 2
            );
        }

        if (this.gameState === GAMESTATE.RUNNING) {
            this.gameObjects.forEach((object) => {
                object.draw();
            });
        }

        if (this.gameState === GAMESTATE.PAUSED) {
            this.gameObjects.forEach((object) => {
                object.draw();
            });

            this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
            this.ctx.font = this.gameHeight * 0.1 + "px Serif";
            this.ctx.fillStyle = "#fff";
            this.ctx.textAlign = "center";
            this.ctx.fillText(
                "PAUSED",
                this.gameWidth / 2,
                this.gameHeight / 2
            );
        }

        if (this.gameState === GAMESTATE.GAMEOVER) {
            this.gameObjects.forEach((object) => {
                object.draw();
            });

            this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
            this.ctx.font = this.gameHeight * 0.1 + "px Serif";
            this.ctx.fillStyle = "#fff";
            this.ctx.textAlign = "center";
            this.ctx.fillText(
                "GAME OVER",
                this.gameWidth / 2,
                this.gameHeight / 2
            );
        }

        if (this.gameState === GAMESTATE.VICTORY) {
            this.gameObjects.forEach((object) => {
                object.draw();
            });

            this.ctx.fillStyle = "rgba(240, 192, 224, 0.5)";
            this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
            this.ctx.font = this.gameHeight * 0.1 + "px Serif";
            this.ctx.fillStyle = "#fff";
            this.ctx.textAlign = "center";
            this.ctx.fillText(
                "VICTORY",
                this.gameWidth / 2,
                this.gameHeight / 2
            );
        }
    }

    togglePaused() {
        if (this.gameState === GAMESTATE.RUNNING) {
            this.gameState = GAMESTATE.PAUSED;
        } else if (this.gameState === GAMESTATE.PAUSED) {
            this.gameState = GAMESTATE.RUNNING;
        }
    }

    gameover() {
        this.gameState = GAMESTATE.GAMEOVER;
    }
}
