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
};

class TitleScreen extends SquareObject {
    constructor(game) {
        super();
        this.game = game;
    }

    draw() {
        let ctx = this.game.ctx;
        ctx.fillStyle = "#222";
        ctx.fillRect(
            this.position().x,
            this.position().y,
            this.width(),
            this.height()
        );

        ctx.font = this.height() * 0.05 + "px Serif";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.fillText("PRESS SPACE TO START", this.center().x, this.center().y);
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
        ctx.fillText("PAUSED", this.center().x, this.center().y);
    }
}

class VictoryScreen extends SquareObject {
    constructor(game) {
        super();
        this.game = game;
    }

    draw() {
        let ctx = this.game.ctx;
        ctx.fillStyle = "rgba(240, 192, 224, 0.5)";
        ctx.fillRect(
            this.position().x,
            this.position().y,
            this.width(),
            this.height()
        );

        ctx.font = this.height() * 0.1 + "px Serif";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.fillText("VICTORY", this.center().x, this.center().y);
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
        ctx.fillText("GAMEOVER", this.center().x, this.center().y);
    }
}

class InfoPanel extends SquareObject {
    constructor(game) {
        super();
        this.game = game;
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
    }
}

class GamePanel extends SquareObject {
    constructor(game) {
        super();
        this.game = game;
    }

    init() {
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

        this.bricks = buildLevel(this);

        this.gameObjects = [...this.bricks, this.paddle, this.ball];
    }

    update(deltaTime) {
        this.gameObjects.forEach((object) => {
            object.update(deltaTime);
        });
        this.gameObjects = this.gameObjects.filter(
            (object) => !object.markedForDeletion
        );
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
            brickNumRowMin: 4,
            brickNumRowMax: 10,
            brickNumCol: 10,
        };

        this.gameState = GAMESTATE.MENU;
        new InputHandler(this);
    }

    newGame() {
        if (
            this.gameState === GAMESTATE.MENU ||
            this.gameState === GAMESTATE.GAMEOVER ||
            this.gameState === GAMESTATE.VICTORY
        ) {
            this.gameState = GAMESTATE.RUNNING;
            // add del paddle, ball, bricks
            this.gamePanel.init();
        }
    }

    update(deltaTime) {
        if (this.gameState === GAMESTATE.RUNNING) {
            this.gamePanel.update(deltaTime);
            if (this.gamePanel.gameObjects.length === 2) {
                this.gameState = GAMESTATE.VICTORY;
            }
            if (this.gamePanel.ball.edge().top > this.gamePanel.edge().bottom) {
                this.gameState = GAMESTATE.GAMEOVER;
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
    }

    togglePaused() {
        if (this.gameState === GAMESTATE.RUNNING) {
            this.gameState = GAMESTATE.PAUSED;
        } else if (this.gameState === GAMESTATE.PAUSED) {
            this.gameState = GAMESTATE.RUNNING;
        }
    }
}
