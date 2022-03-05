export default class InputHandler {
    constructor(game) {
        this.game = game;
        this.numKeyHold = 0;

        document.addEventListener("keydown", (event) => {
            switch (event.keyCode) {
                case 37:
                    if (this.game.paddle.speed >= 0) {
                        this.numKeyHold++;
                        this.game.paddle.moveLeft();
                    }
                    break;
                case 39:
                    if (this.game.paddle.speed <= 0) {
                        this.numKeyHold++;
                        this.game.paddle.moveRight();
                    }
                    break;
                case 27:
                    this.game.togglePaused();
                    break;
                case 32:
                    this.game.start();
                    break;
                default:
                // console.log(event.keyCode);
            }
        });

        document.addEventListener("keyup", (event) => {
            switch (event.keyCode) {
                case 37:
                    this.numKeyHold--;
                    if (this.numKeyHold === 0) {
                        this.game.paddle.stop();
                    } else {
                        this.game.paddle.moveRight();
                    }
                    break;
                case 39:
                    this.numKeyHold--;
                    if (this.numKeyHold === 0) {
                        this.game.paddle.stop();
                    } else {
                        this.game.paddle.moveLeft();
                    }
                    break;
                default:
            }
        });
    }
}
