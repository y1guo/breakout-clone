export class InputHandler {
    constructor(game) {
        this.game = game;
        this.keyInput = new KeyInput(game);

        document.addEventListener("keydown", (event) => {
            this.keyInput.keyDown(event.key);
        });

        document.addEventListener("keyup", (event) => {
            this.keyInput.keyUp(event.key);
        });
    }
}

class KeyInput {
    constructor(game) {
        this.game = game;
        this.keyHeld = [];
        this.conflictingKeys = [
            ["ArrowLeft", "ArrowRight"],
            ["ArrowUp", "ArrowDown"],
        ];
        this.equivalentKeys = {
            a: "ArrowLeft",
            d: "ArrowRight",
            w: "ArrowUp",
            s: "ArrowDown",
        };
    }

    keyDown(key) {
        this.keyHeld = this.keyHeld.filter((item) => item != key);
        this.keyHeld.push(key);
        this.keyAction();
    }

    keyUp(key) {
        if (!this.keyHeld.includes(key)) {
            console.log("Error: keyHeld does not have keys that're pressed!");
        }
        this.keyHeld.splice(this.keyHeld.indexOf(key), 1);
        this.keyAction();
    }

    keyAction() {
        let lastKey = this.keyHeld[this.keyHeld.length - 1];

        if (lastKey === " ") {
            this.game.newGame();
        } else if (lastKey === "Escape" || lastKey === "p") {
            this.game.togglePaused();
        } else if (lastKey === "=") {
            this.game.gameState = 4;
        }

        let paddle = this.game.gamePanel.paddle;
        let activeConflictingKeys = this.activeConflictingKeys();
        if (activeConflictingKeys.includes("ArrowLeft")) {
            if (activeConflictingKeys.includes("ArrowUp")) {
                paddle.setVelocityAngle(135);
            } else if (activeConflictingKeys.includes("ArrowDown")) {
                paddle.setVelocityAngle(-135);
            } else {
                paddle.setVelocityAngle(180);
            }
        } else if (activeConflictingKeys.includes("ArrowRight")) {
            if (activeConflictingKeys.includes("ArrowUp")) {
                paddle.setVelocityAngle(45);
            } else if (activeConflictingKeys.includes("ArrowDown")) {
                paddle.setVelocityAngle(-45);
            } else {
                paddle.setVelocityAngle(0);
            }
        } else {
            if (activeConflictingKeys.includes("ArrowUp")) {
                paddle.setVelocityAngle(90);
            } else if (activeConflictingKeys.includes("ArrowDown")) {
                paddle.setVelocityAngle(-90);
            } else {
                paddle.stop();
            }
        }
    }

    activeConflictingKeys() {
        let activeConflictingKeys = [];
        let keys = [...this.keyHeld];
        let conflictingKeysOccupied = Array(this.conflictingKeys.length).fill(
            false
        );

        while (keys.length > 0) {
            let key = keys.pop();
            if (key in this.equivalentKeys) {
                key = this.equivalentKeys[key];
            }
            for (let i = 0; i < this.conflictingKeys.length; i++) {
                if (
                    !conflictingKeysOccupied[i] &&
                    this.conflictingKeys[i].includes(key)
                ) {
                    conflictingKeysOccupied[i] = true;
                    activeConflictingKeys.push(key);
                    break;
                }
            }
        }
        return activeConflictingKeys;
    }
}
