import { context, soundWall } from './assets.js';

class Ball {
  constructor(game) {
    this.game = game;

    this.w = 10; // width
    this.h = 10; // height
    this.reset();
  }

  // set coordinates and speed
  reset() {
    this.x = canvas.width / 2 - this.w / 2; // x position
    this.y = canvas.height / 2 - this.h / 2; // y position
    this.u = 3 * (Math.random() > 0.5 ? 1 : -1); // x speed
    this.v = 3 * (Math.random() > 0.5 ? 1 : -1); // y speed
  }

  draw() {
    context.fillStyle = '#fff';
    context.fillRect(this.x, this.y, this.w, this.h);
  }

  get right() {
    return this.x + this.w;
  }

  get bottom() {
    return this.y + this.h;
  }

  get prevLeft() {
    return this.x - this.u;
  }

  get prevRight() {
    return this.x + this.w - this.u;
  }

  updatePos() {
    // increment ball position by speed values
    this.x += this.u;
    this.y += this.v;
    // if ball reached top or bottom of canvas
    if (this.y <= 0 || this.y + this.h >= canvas.height) {
      // play wall sound
      soundWall.play();
      // reverse vertical velocity
      this.v *= -1;
    }
  }

  checkForGoal() {
    if (this.x <= -this.w || this.x >= canvas.width) {
      return true;
    }
  }

  checkForRebound() {
    return (
      // was ball previously before or against p1/p2, then after or against it after updating its position?
      // if so, is it in the vertical bounds or the corresponding player?
      (this.prevLeft >= this.game.p1.right &&
        this.x <= this.game.p1.right &&
        (this.y >= this.game.p1.y && this.bottom <= this.game.p1.bottom)) ||
      (this.prevRight <= this.game.p2.x &&
        this.right >= this.game.p2.x &&
        (this.y >= this.game.p2.y && this.bottom <= this.game.p2.bottom))
    );
  }
}

export default Ball;
