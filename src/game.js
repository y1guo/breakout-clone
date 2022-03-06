import { Paddle } from "./paddle";
import { InputHandler } from "./input";
import { Ball } from "./ball";
import { buildLevel } from "./level";
import { SquareObject } from "./object";

const GAMESTATE = {
    PAUSED: 0,
    RUNNING: 1,
    MENU: 2,
    GAMEOVER: 3,
    VICTORY: 4,
    REVIVED: 5,
};

class TitleScreen extends SquareObject {
    constructor(game) {
        super();
        this.game = game;
    }

    draw() {
        let ctx = this.game.ctx;
        ctx.fillStyle = "#000";
        ctx.fillRect(
            this.position().x,
            this.position().y,
            this.width(),
            this.height()
        );

        ctx.font = this.height() * 0.05 + "px Serif";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.fillText("Press Space To Start", this.center().x, this.center().y);
    }
}

class PauseScreen extends SquareObject {
    constructor(game) {
        super();
        this.game = game;
    }

    draw() {
        let ctx = this.game.ctx;
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(
            this.position().x,
            this.position().y,
            this.width(),
            this.height()
        );

        ctx.font = this.height() * 0.1 + "px Serif";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.fillText("Paused", this.center().x, this.center().y);
    }
}

class VictoryScreen extends SquareObject {
    constructor(game) {
        super();
        this.game = game;
    }

    draw() {
        let ctx = this.game.ctx;
        ctx.fillStyle = "rgba(240, 192, 224, 0.9)";
        ctx.fillRect(
            this.position().x,
            this.position().y,
            this.width(),
            this.height()
        );

        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.font = this.height() * 0.1 + "px Serif";
        ctx.fillText("You Win!", this.center().x, this.center().y);
        ctx.font = this.height() * 0.05 + "px Serif";
        ctx.fillText(
            "Life +1",
            this.center().x,
            this.center().y + this.height() * 0.15
        );
        ctx.fillText(
            "Press Space To Continue",
            this.center().x,
            this.center().y + this.height() * 0.3
        );
    }
}

class GameOverScreen extends SquareObject {
    constructor(game) {
        super();
        this.game = game;
    }

    draw() {
        let ctx = this.game.ctx;
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(
            this.position().x,
            this.position().y,
            this.width(),
            this.height()
        );

        ctx.font = this.height() * 0.1 + "px Serif";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", this.center().x, this.center().y);
    }
}

class InfoPanel extends SquareObject {
    constructor(game) {
        super();
        this.game = game;
    }

    draw() {
        let ctx = this.game.ctx;
        let edge = this.edge();
        let data = this.game.data;
        let settings = this.game.settings;
        let ball = this.game.gamePanel.ball;
        let { levelFactor, spinFactor } = this.game.scoreFactor();
        // ctx.fillStyle = "#fff";
        // ctx.fillRect(
        //     this.position().x,
        //     this.position().y,
        //     this.width(),
        //     this.height()
        // );

        ctx.fillStyle = "#fff";
        ctx.font = this.height() * 0.4 + "px Serif";
        ctx.textAlign = "left";
        ctx.fillText(
            "Level " + data.level.toString(),
            edge.left,
            this.center().y
        );
        ctx.textAlign = "center";
        ctx.fillText(
            "Score " + Math.round(data.score).toString(),
            this.center().x,
            this.center().y
        );
        ctx.textAlign = "right";
        ctx.fillText(
            "Life " + data.life.toString(),
            edge.right,
            this.center().y
        );
        ctx.font = this.height() * 0.2 + "px Serif";
        ctx.textAlign = "left";
        ctx.fillText(
            "Gravity: " +
                Math.round(ball.gravity / settings.gravity).toString(),
            edge.left,
            edge.bottom - this.height() / 4
        );
        ctx.fillText(
            "Friction: " +
                Math.round(ball.friction / settings.friction).toString(),
            edge.left,
            edge.bottom
        );
        ctx.textAlign = "center";
        ctx.fillText(
            "From Level: X " + levelFactor.toString(),
            this.center().x,
            edge.bottom - this.height() / 4
        );
        ctx.fillText(
            "From Spin: X " + spinFactor.toString(),
            this.center().x,
            edge.bottom
        );

        ctx.fillStyle =
            "#f" +
            Math.floor(((8 - spinFactor) / 7) * 15).toString(16) +
            Math.floor(((8 - spinFactor) / 7) * 15).toString(16);
        ctx.font = this.height() * 0.4 + "px Serif";
        ctx.textAlign = "right";
        ctx.fillText(
            "Spin: " +
                Math.round(
                    Math.abs(
                        (ball.angularVelocity() * 1000 * 60) / (2 * Math.PI)
                    )
                ).toString() +
                " rpm",
            edge.right,
            edge.bottom
        );
    }
}

class GamePanel extends SquareObject {
    constructor(game) {
        super();
        this.game = game;
    }

    init(bricks) {
        let settings = this.game.settings;

        this.paddle = new Paddle(this);
        this.ball = new Ball(this);
        this.paddle.setSize(settings.paddleWidth, settings.paddleHeight);
        this.paddle.setCenter(
            this.center().x,
            this.edge().bottom - this.height() * 0.02 - this.paddle.height()
        );
        this.ball.setSize(settings.ballSize, settings.ballSize);
        this.ball.setCollisionSize(1, 1);
        this.ball.setCenter(this.paddle.center().x + 1, this.paddle.edge().top);
        this.ball.setVelocity(0, 0);

        this.bricks = bricks;

        this.gameObjects = [...this.bricks, this.paddle, this.ball];
    }

    update(deltaTime) {
        this.gameObjects.forEach((object) => {
            object.update(deltaTime);
        });
        let numBrick = this.gameObjects.length;
        this.gameObjects = this.gameObjects.filter(
            (object) => !object.markedForDeletion
        );
        let { levelFactor, spinFactor } = this.game.scoreFactor();
        this.game.data.score +=
            (numBrick - this.gameObjects.length) * levelFactor * spinFactor;
    }

    draw() {
        let ctx = this.game.ctx;
        ctx.fillStyle = "#fff";
        ctx.fillRect(
            this.position().x,
            this.position().y,
            this.width(),
            this.height()
        );

        this.gameObjects.forEach((object) => {
            object.draw();
        });
    }
}

export class Game extends SquareObject {
    constructor(ctx) {
        super();
        this.ctx = ctx;

        this.ctx.canvas.width = window.innerWidth;
        this.ctx.canvas.height = window.innerHeight;

        this.setCenter(window.innerWidth / 2, window.innerHeight / 2);
        let size = Math.min(window.innerWidth, window.innerHeight);
        this.setSize(size, size);

        this.titleScreen = new TitleScreen(this);
        this.pauseScreen = new PauseScreen(this);
        this.victoryScreen = new VictoryScreen(this);
        this.gameOverScreen = new GameOverScreen(this);
        this.titleScreen.setSize(this.width(), this.height());
        this.pauseScreen.setSize(this.width(), this.height());
        this.victoryScreen.setSize(this.width(), this.height());
        this.gameOverScreen.setSize(this.width(), this.height());
        this.titleScreen.setCenter(this.center().x, this.center().y);
        this.pauseScreen.setCenter(this.center().x, this.center().y);
        this.victoryScreen.setCenter(this.center().x, this.center().y);
        this.gameOverScreen.setCenter(this.center().x, this.center().y);

        this.infoPanel = new InfoPanel(this);
        this.gamePanel = new GamePanel(this);
        let padding = size * 0.02;
        this.infoPanel.setSize(
            this.width() - 2 * padding,
            0.15 * this.height() - 1.5 * padding
        );
        this.infoPanel.setPosition(
            this.position().x + padding,
            this.position().y + padding
        );
        this.gamePanel.setSize(
            this.width() - 2 * padding,
            this.height() - this.infoPanel.height() - 3 * padding
        );
        this.gamePanel.setPosition(
            this.position().x + padding,
            this.infoPanel.edge().bottom + padding
        );

        this.settings = {
            paddleWidth: 0.25 * this.gamePanel.width(),
            paddleHeight: 0.025 * this.gamePanel.width(),
            paddleMaxSpeed: this.gamePanel.width() / 2000,
            ballSize: this.gamePanel.width() * 0.08,
            friction: 5e-3,
            gravity: 3e-4,
            bounceLoss: 0.1,
            brickNumRowMin: 4,
            brickNumRowMax: 10,
            brickNumCol: 10,
        };

        this.gameState = GAMESTATE.MENU;
        new InputHandler(this);
    }

    newGame() {
        if (
            this.gameState === GAMESTATE.RUNNING ||
            this.gameState === GAMESTATE.PAUSED
        ) {
            return;
        }
        if (
            this.gameState === GAMESTATE.MENU ||
            this.gameState === GAMESTATE.GAMEOVER
        ) {
            this.data = {
                life: 2,
                score: 0,
                level: 1,
            };
            // add del paddle, ball, bricks
            this.gamePanel.init(buildLevel(this.gamePanel));
        } else if (this.gameState === GAMESTATE.VICTORY) {
            this.data.life += 1;
            this.data.level += 1;
            // add del paddle, ball, bricks
            this.gamePanel.init(buildLevel(this.gamePanel));
        } else if (this.gameState === GAMESTATE.REVIVED) {
            this.data.life -= 1;
            let obj = this.gamePanel.gameObjects;
            this.gamePanel.init(obj.slice(0, obj.length - 2));
        } else {
            console.log("Error: Unknown game state!");
        }
        this.gameState = GAMESTATE.RUNNING;
    }

    update(deltaTime) {
        if (this.gameState === GAMESTATE.RUNNING) {
            this.gamePanel.update(deltaTime);
            if (this.gamePanel.gameObjects.length === 2) {
                this.gameState = GAMESTATE.VICTORY;
            }
            if (this.gamePanel.ball.edge().top > this.gamePanel.edge().bottom) {
                if (this.data.life === 0) {
                    this.gameState = GAMESTATE.GAMEOVER;
                } else {
                    this.gameState = GAMESTATE.REVIVED;
                    this.newGame();
                }
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        // this.ctx.fillStyle = "#000";
        // this.ctx.fillRect(
        //     this.position().x,
        //     this.position().y,
        //     this.width(),
        //     this.height()
        // );

        if (this.gameState === GAMESTATE.MENU) {
            this.titleScreen.draw();
        }

        if (this.gameState === GAMESTATE.RUNNING) {
            this.infoPanel.draw();
            this.gamePanel.draw();
        }

        if (this.gameState === GAMESTATE.PAUSED) {
            this.infoPanel.draw();
            this.gamePanel.draw();
            this.pauseScreen.draw();
        }

        if (this.gameState === GAMESTATE.GAMEOVER) {
            this.infoPanel.draw();
            this.gamePanel.draw();
            this.gameOverScreen.draw();
        }

        if (this.gameState === GAMESTATE.VICTORY) {
            this.infoPanel.draw();
            this.gamePanel.draw();
            this.victoryScreen.draw();
        }

        if (this.gameState === GAMESTATE.REVIVED) {
            this.infoPanel.draw();
            this.gamePanel.draw();
        }
    }

    togglePaused() {
        if (this.gameState === GAMESTATE.RUNNING) {
            this.gameState = GAMESTATE.PAUSED;
        } else if (this.gameState === GAMESTATE.PAUSED) {
            this.gameState = GAMESTATE.RUNNING;
        }
    }

    scoreFactor() {
        let levelFactor = this.data.level;
        let angularVelocity = this.gamePanel.ball.angularVelocity();
        let rpm = Math.abs((angularVelocity * 1000 * 60) / (2 * Math.PI));
        let spinFactor = Math.floor(
            1 + (7 * Math.log((100 + rpm) / 100)) / Math.log(21)
        );
        return { levelFactor, spinFactor };
    }

    difficultyFactor() {
        let friction =
            1 - Math.pow(1 - this.settings.friction, this.data.level);
        let frictionFactor = friction / this.settings.friction;
        let gravityFactor = this.data.level;
        return { frictionFactor, gravityFactor };
    }
}
