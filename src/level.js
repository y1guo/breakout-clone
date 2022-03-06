import { Brick } from "./brick";

export function buildLevel(gamePanel) {
    let bricks = [];
    let settings = gamePanel.game.settings;
    let rowMin = settings.brickNumRowMin;
    let rowMax = settings.brickNumRowMax;
    let numCol = settings.brickNumCol;
    let brickWidth = gamePanel.width() / numCol;
    let brickHeight = brickWidth / 2;

    let numRow = rowMin + Math.random() * (rowMax - rowMin);
    for (let i = 0; i < numRow; i++) {
        for (let j = 0; j < numCol; j++) {
            if (Math.random() < 0.7) {
                let size = {
                    x: brickWidth,
                    y: brickHeight,
                };
                let position = {
                    x: gamePanel.position().x + brickWidth * j,
                    y: gamePanel.position().y + brickHeight * i,
                };
                bricks.push(new Brick(gamePanel, size, position));
            }
        }
    }

    return bricks;
}
