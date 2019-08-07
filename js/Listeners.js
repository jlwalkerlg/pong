class Listeners {
  constructor(game) {
    this.game = game;
  }

  // starts game (in 1 player mode) if game not already running
  mouseClick = e => {
    if (!this.game.animationRequest) {
      this.game.animationRequest = requestAnimationFrame(this.game.animate);
    }
  };

  // makes player 1 paddle follow mouse in 1 player mode
  mouseMove = e => {
    this.game.p1.y = e.clientY - canvas.offsetTop - this.game.p1.h / 2;
  };

  // moves player 1 in 1 player keyboard mode
  // also starts game if user pressed space bar and game not already running
  keydown1P = e => {
    if (e.key === 'ArrowUp') {
      this.game.p1.v = -6;
    } else if (e.key === 'ArrowDown') {
      this.game.p1.v = 6;
    } else if (e.key === ' ') {
      if (!this.game.animationRequest) {
        this.game.animationRequest = requestAnimationFrame(this.game.animate);
      }
    }
  };

  // stops movement of player 1 in 1 player keyboard mode
  keyup1P = e => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      this.game.p1.v = 0;
    }
  };

  // controls movement of both players with keyboard in 2 player mode
  // also starts game if user pressed space bar and game not already running
  keydown2P = e => {
    if (e.key === 'w') {
      this.game.p1.v = -6;
    } else if (e.key === 's') {
      this.game.p1.v = 6;
    } else if (e.key === 'ArrowUp') {
      this.game.p2.v = -6;
    } else if (e.key === 'ArrowDown') {
      this.game.p2.v = 6;
    } else if (e.key === ' ') {
      if (!this.game.animationRequest) {
        this.game.animationRequest = requestAnimationFrame(this.game.animate);
      }
    }
  };

  // stops movement of both players in 2 player mode
  keyup2P = e => {
    if (e.key === 'w' || e.key === 's') {
      this.game.p1.v = 0;
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      this.game.p2.v = 0;
    }
  };
}

export default Listeners;
