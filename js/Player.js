import { context } from './assets.js';

class Player {
  constructor(game, playerNumber) {
    this.game = game;

    this.w = 10; // width
    this.h = 70; // height
    this.x = playerNumber === 1 ? 20 : canvas.width - 20 - this.w; // x position - depends if p1 or p2
    this.y = canvas.height / 2 - this.h / 2; // y position
    this.v = 0; // vertical speed
    this.score = 0; // score
  }

  reset() {
    // reset y position
    this.y = canvas.height / 2 - this.h / 2;
    // reset vertical speed
    this.v = 0;
  }

  get right() {
    return this.x + this.w;
  }

  get bottom() {
    return this.y + this.h;
  }

  // update player paddle position when using keyboard controls
  // if controlling using mouse, paddle will simply follow mouse
  updatePos() {
    // only allow update if the new position will be within bounds
    if (
      this.y + this.v >= -this.h / 2 &&
      this.y + this.v <= canvas.height - this.h / 2
    ) {
      this.y += this.v;
    }
  }

  draw() {
    context.fillStyle = '#fff';
    context.fillRect(this.x, this.y, this.w, this.h);
  }

  // set y position to same as ball -- for AI in 1 player mode
  followBall() {
    this.y = this.game.ball.y + this.game.ball.h / 2 - this.h / 2;
  }
}

export default Player;
