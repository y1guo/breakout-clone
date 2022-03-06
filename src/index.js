import { Game } from "./game";

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let game = new Game(ctx);

let lastTime = 0;
function gameLoop(timeStamp) {
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    game.update(deltaTime);
    game.draw();

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
