import { detectCollision } from "./detectCollision";
import { SquareObject } from "./object";

export class Ball extends SquareObject {
    constructor(gamePanel) {
        super();
        this.image = document.getElementById("img-ball");
        this.gamePanel = gamePanel;
        let settings = gamePanel.game.settings;
        let { frictionFactor, gravityFactor } =
            gamePanel.game.difficultyFactor();
        this.friction = settings.friction * frictionFactor;
        this.gravity = settings.gravity * gravityFactor;
        this.bounceLoss = settings.bounceLoss;
    }

    update(deltaTime) {
        this.autoMove(deltaTime);

        // friction and gravity
        let velocity = this.velocity();
        velocity.x *= 1 - this.friction;
        velocity.y *= 1 - this.friction;
        velocity.y += this.gravity * deltaTime;
        this.setVelocity(velocity.x, velocity.y);

        // wall bounce
        let center = this.center();
        let wall = this.gamePanel.edge();
        velocity = this.velocity();
        if (center.x < wall.left) {
            this.setCenter(2 * wall.left - center.x, center.y);
            this.setVelocity(-velocity.x * (1 - this.bounceLoss), velocity.y);
        }
        if (center.x > wall.right) {
            this.setCenter(2 * wall.right - center.x, center.y);
            this.setVelocity(-velocity.x * (1 - this.bounceLoss), velocity.y);
        }
        if (center.y < wall.top) {
            this.setCenter(center.x, 2 * wall.top - center.y);
            this.setVelocity(velocity.x, -velocity.y * (1 - this.bounceLoss));
        }

        // paddle bounce
        let angularVelocity = this.angularVelocity();
        let paddle = this.gamePanel.paddle;
        center = this.center();
        velocity = this.velocity();
        if (detectCollision(this, paddle)) {
            this.setCenter(center.x, 2 * paddle.edge().top - center.y);
            this.setVelocity(
                0.6 * velocity.x + 0.4 * paddle.velocity().x,
                (-velocity.y + 1.5 * paddle.velocity().y) *
                    (1 - this.bounceLoss)
            );
            angularVelocity +=
                (velocity.x - paddle.velocity().x) / (this.width() / 2);
            this.setAngularVelocity(angularVelocity);
        }
    }

    draw() {
        let ctx = this.gamePanel.game.ctx;
        ctx.translate(this.center().x, this.center().y);
        ctx.rotate(this.angle());
        ctx.drawImage(
            this.image,
            -this.width() / 2,
            -this.height() / 2,
            this.width(),
            this.height()
        );
        ctx.rotate(-this.angle());
        ctx.translate(-this.center().x, -this.center().y);
    }
}
