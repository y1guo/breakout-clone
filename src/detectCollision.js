export function detectCollision(squareObjectA, squareObjectB) {
    let a = squareObjectA.collisionEdge();
    let b = squareObjectB.collisionEdge();

    // if a and b overlap, then they collided
    if (
        Math.max(a.top, b.top) < Math.min(a.bottom, b.bottom) &&
        Math.max(a.left, b.left) < Math.min(a.right, b.right)
    ) {
        return true;
    } else {
        return false;
    }
}
