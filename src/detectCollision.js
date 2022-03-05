export default function detectCollision(ball, squareObject) {
    let ballCenter = {
        x: ball.position.x + ball.size / 2,
        y: ball.position.y + ball.size / 2
    };
    let square = {
        left: squareObject.position.x,
        right: squareObject.position.x + squareObject.width,
        top: squareObject.position.y,
        bottom: squareObject.position.y + squareObject.height
    };

    if (
        square.left <= ballCenter.x &&
        ballCenter.x <= square.right &&
        square.top <= ballCenter.y &&
        ballCenter.y <= square.bottom
    ) {
        return true;
    } else {
        return false;
    }
}
