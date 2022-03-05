import Brick from "/src/brick";

export default function buildLevel(game) {
    let bricks = [];

    let numRow = 4 + Math.random() * 6;
    for (let i = 0; i < numRow; i++) {
        for (let j = 0; j < 10; j++) {
            if (Math.random() < 0.7) {
                let position = {
                    x: game.brickWidth * j,
                    y: game.brickHeight * i
                };
                bricks.push(new Brick(game, position));
            }
        }
    }

    return bricks;
}
