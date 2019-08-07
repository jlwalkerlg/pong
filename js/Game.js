import UI from './UI.js';
import Listeners from './Listeners.js';
import Ball from './Ball.js';
import Player from './Player.js';
import { context, soundPaddle, soundGoal } from './assets.js';

class Game {
  constructor() {
    // set variable to track if game in progress;
    // if so, handlers for game menus will not work so game can not be interrupted
    this.animationRequest = null;
    // winning score for 2 player mode
    this.winningScore = 5;
    // rally count for 1 player mode
    this.rallyCount = 0;
    // game menu option text
    // storing in game object allows retrieval from event handlers
    this.opt1 = null;
    this.opt2 = null;
    this.options = {
      players: 1,
      // can control with keyboard or mouse in 1 player mode
      controls: 'keyboard',
      // when game finishes, player can replay same game or go back to main menu
      onFinish: 'replay',
    };

    this.UI = new UI(this);
    this.Listeners = new Listeners(this);
  }

  // initialise game upon page load
  init = () => {
    this.ball = new Ball(this);
    this.p1 = new Player(this, 1);
    this.p2 = new Player(this, 2);
    this.UI.showPlayerOptions();
  };

  // reset game objects positions and player scores
  reset = () => {
    this.ball.reset();
    this.p1.reset();
    this.p2.reset();
    this.p1.score = 0;
    this.p2.score = 0;
  };

  // start game again with same settings
  replay = () => {
    // reset game objects positions and player scores
    this.reset();
    // wipe canvas
    this.blank();
    // draw game objects
    this.draw();
    // show instructions to start game
    this.UI.displayInstructions();
    // if in 1 player mode, show rally count and max score before game starts
    if (this.options.players === 1) {
      this.UI.displayRallyCount();
      this.UI.displayMaxScore();
    }
    // start game
    this.start();
  };

  // start game by setting appropriate event listners to allow control of players
  start = () => {
    if (this.options.players === 2) {
      document.addEventListener('keydown', this.Listeners.keydown2P);
      document.addEventListener('keyup', this.Listeners.keyup2P);
    } else {
      if (this.options.controls === 'mouse') {
        canvas.addEventListener('click', this.Listeners.mouseClick);
        canvas.addEventListener('mousemove', this.Listeners.mouseMove);
      } else {
        document.addEventListener('keydown', this.Listeners.keydown1P);
        document.addEventListener('keyup', this.Listeners.keyup1P);
      }
    }
  };

  // end game by removing event listners to disable control of players
  finish = () => {
    if (this.options.players === 2) {
      document.removeEventListener('keydown', this.Listeners.keydown2P);
      document.removeEventListener('keyup', this.Listeners.keyup2P);
    } else {
      if (this.options.controls === 'mouse') {
        canvas.removeEventListener('click', this.Listeners.mouseClick);
        canvas.removeEventListener('mousemove', this.Listeners.mouseMove);
      } else {
        document.removeEventListener('keydown', this.Listeners.keydown1P);
        document.removeEventListener('keyup', this.Listeners.keyup1P);
      }
    }
  };

  // wipe canvas
  blank = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  // draw game objects
  draw = () => {
    this.ball.draw();
    this.p1.draw();
    this.p2.draw();
  };

  // check if a player's score reached the winning score in 2 player mode
  checkWin = () => {
    return (
      this.p1.score === this.winningScore || this.p2.score === this.winningScore
    );
  };

  // update rally count in local storage if player beat current max score
  updateMaxScore = () => {
    let maxScore = Number(localStorage.getItem('rallyCount'));
    if (this.rallyCount > maxScore) {
      localStorage.setItem('rallyCount', this.rallyCount);
    }
    return maxScore;
  };

  // game loop
  animate = () => {
    // update ball
    this.ball.updatePos();
    // update p1 position
    this.p1.updatePos();
    // update p2 position -- will simply follow ball in 1 player mode
    this.options.players === 1 ? this.p2.followBall() : this.p2.updatePos();
    // wipe canvas
    this.blank();
    // draw game objects
    this.draw();
    // if ball rebounded off of a player paddle
    if (this.ball.checkForRebound()) {
      // play rebound sound
      soundPaddle.play();
      // increase speed and reverse x direction
      this.ball.u += this.ball.u > 0 ? 0.6 : -0.6;
      this.ball.u *= -1;
      // also increment rally count if in 1 player mode and the player rebounded the ball
      if (this.options.players === 1 && this.ball.u > 0) {
        this.rallyCount++;
      }
    }
    // display rally count only in 1 player mode
    if (this.options.players === 1) {
      this.UI.displayRallyCount();
    }
    // if goal was scored
    if (this.ball.checkForGoal()) {
      // play goal sound
      soundGoal.play();
      // allow event listeners to restart the next round by setting animationRequest to null
      this.animationRequest = null;
      // update appropriate player's score according to direction ball is travelling
      this.ball.u > 0 ? this.p1.score++ : this.p2.score++;
      // reset positions of ball, p1, and p2
      this.ball.reset();
      this.p1.reset();
      this.p2.reset();
      // if in 2 player mode
      if (this.options.players === 2) {
        // if a player won
        if (this.checkWin()) {
          // display scores
          this.UI.displayScores();
          // display winning message
          let text =
            this.p1.score === this.winningScore
              ? 'Player 1 wins the game!'
              : 'Player 2 wins the game!';
          this.UI.displayText(text, 'center', 'center', '30px Arial', '#fff');
          // remove listeners for controlling player paddles
          this.finish();
          // prompt reset options
          this.UI.showResetOptions();
        } else {
          // if a player did not win
          // wipe canvas
          this.blank();
          // draw ball and players in reset positions, ready for next round
          this.draw();
          // display scores
          this.UI.displayScores();
        }
      } else {
        // if goal scored (against player) in 1 player mode
        // save rally count if beat high score
        this.updateMaxScore();
        // display max score
        this.UI.displayMaxScore();
        // reset rally count
        this.rallyCount = 0;
        // remove listeners for controlling player paddles
        this.finish();
        // prompt reset options
        this.UI.showResetOptions();
      }
    } else {
      // if no goal scored
      // simply reanimate the next frame
      requestAnimationFrame(this.animate);
    }
  };
}

export default Game;
