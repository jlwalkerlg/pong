import { context } from './assets.js';

class UI {
  constructor(game) {
    this.game = game;
  }

  // utility function to display text on canvas
  displayText = (text, x1, y, font, color) => {
    // set text color
    context.fillStyle = color;
    // set text font
    context.font = font;
    // get font size for centering vertically or multi-line text
    let fontSize = Number(font.slice(0, font.indexOf('px')));
    // initalise variable to store horizontal position of text
    let x;
    // set vertical position to center if requested or just use given value
    y = y === 'center' ? canvas.height / 2 + fontSize / 2 : y;
    // handle multi-line text
    if (String(text).indexOf('\n') !== -1) {
      // split text on new line characters
      text = text.split('\n');
      // initialise i for loop
      let i;
      // for each line
      for (i = 0; i < text.length; i++) {
        // calculate horizontal position if center requested or just use given value
        x =
          x1 === 'center'
            ? canvas.width / 2 - context.measureText(text[i]).width / 2
            : x1;
        // display text
        context.fillText(text[i], x, y);
        // increase vertical position for next line
        y += fontSize;
      }
    } else {
      // if text is not multi-line, display in center or given position
      x =
        x1 === 'center'
          ? canvas.width / 2 - context.measureText(text).width / 2
          : x1;
      context.fillText(text, x, y);
    }
  };

  displayScores = () => {
    this.displayText(
      this.game.p1.score + ' - ' + this.game.p2.score,
      'center',
      100,
      '60px Arial',
      '#fff'
    );
  };

  displayRallyCount = () => {
    this.displayText(this.game.rallyCount, 'center', 60, '40px Arial', '#fff');
  };

  // display instructional text before game begins to explain controls
  displayInstructions = () => {
    let text;
    // set appropriate text depending on game mode
    if (this.game.options.players === 2) {
      text =
        'Player 1 controls: UP: w, DOWN: s\nPlayer 2 controls: UP: ArrowUp, DOWN: ArrowDown\nPress spacebar to begin.';
    } else {
      if (this.game.options.controls === 'keyboard') {
        text =
          'Controls: UP: ArrowUp, DOWN: ArrowDown\nPress spacebar to begin.';
      } else {
        text = 'Click to begin.';
      }
    }
    this.displayText(text, 'center', 300, '20px Arial', '#fff');
  };

  // display rally count from local storage
  displayMaxScore = () => {
    let maxScore = localStorage.getItem('rallyCount');
    this.displayText(
      'Max score: ' + maxScore,
      'center',
      100,
      '30px Arial',
      '#fff'
    );
  };

  // utility function to display 2 options on screen
  showOptions = (opt1, opt2, font, color, pongOpt, pongOptVal, handler) => {
    context.font = font;
    // set vertical position of text
    const y = 350;
    // get font size to set vertical position of underline
    let fontSize = Number(font.slice(0, font.indexOf('px')));
    // get width of text for horizontal placement
    let opt1Width = context.measureText(opt1).width;
    let opt2Width = context.measureText(opt2).width;
    // set option text in pong object to allow retrieval from changeOption function
    this.game.opt1 = opt1;
    this.game.opt2 = opt2;
    // set default option in pong object so first option underlined matches default;
    // if user presses enter without changing value, correct option will be selected
    this.game.options[pongOpt] = pongOptVal;
    // show pong title unless in replay menu
    if (opt1 !== 'replay') {
      this.displayText('PONG', 'center', 'center', '80px Arial', '#f00');
    }
    // display options at 1/4 and 3/4 positions
    this.displayText(opt1, canvas.width / 4 - opt1Width / 2, y, font, color);
    this.displayText(
      opt2,
      (canvas.width * 3) / 4 - opt2Width / 2,
      y,
      font,
      color
    );
    context.fillRect(
      canvas.width / 4 - opt1Width / 2,
      y + fontSize,
      opt1Width,
      5
    );
    // handle changing options with arrow keys
    document.addEventListener('keydown', handler);
  };

  // utility function for changing option with arrow keys
  changeOption = (e, pongOpt, pongOptOnLeft, pongOptOnRight, onEnter) => {
    // set vertical position of text
    const y = 350;
    // get font size to set vertical position of underline
    let fontSize = Number(context.font.slice(0, context.font.indexOf('px')));
    // get width of text for horizontal placement
    let opt1Width = context.measureText(this.game.opt1).width;
    let opt2Width = context.measureText(this.game.opt2).width;

    // change appropriate option in pong object when navigating between on-screen options with arrow keys
    // also redraw the underline to highlight currently-selected option
    if (e.key === 'ArrowLeft') {
      this.game.options[pongOpt] = pongOptOnLeft;
      context.fillRect(
        canvas.width / 4 - opt1Width / 2,
        y + fontSize,
        opt1Width,
        5
      );
      context.clearRect(
        (canvas.width * 3) / 4 - opt2Width / 2 - 1,
        y + fontSize,
        opt2Width + 2,
        5
      );
    } else if (e.key === 'ArrowRight') {
      this.game.options[pongOpt] = pongOptOnRight;
      context.fillRect(
        (canvas.width * 3) / 4 - opt2Width / 2,
        y + fontSize,
        opt2Width,
        5
      );
      context.clearRect(
        canvas.width / 4 - opt1Width / 2 - 1,
        y + fontSize,
        opt1Width + 2,
        5
      );
    } else if (e.key === 'Enter') {
      // run callback function if user pressed the enter key
      onEnter();
    }
  };

  // display choice: 1 player or 2 player
  showPlayerOptions = () => {
    this.showOptions(
      '1 player',
      '2 player',
      '30px Arial',
      '#fff',
      'players',
      1,
      this.changePlayerOption
    );
  };

  // change choice selection: 1 player or 2 player
  changePlayerOption = e => {
    this.changeOption(e, 'players', 1, 2, this.handleSelectPlayerOption);
  };

  handleSelectPlayerOption = () => {
    // when user presses enter
    // remove event listener for changing player option
    document.removeEventListener('keydown', this.changePlayerOption);
    // wipe canvas
    this.game.blank();
    // either show options for preferred controls in 1 player mode
    // or start the game in 2 player mode
    if (this.game.options.players === 1) {
      this.showControlsOptions();
    } else {
      this.game.replay();
    }
  };

  // display choice: keyboard or mouse
  showControlsOptions = () => {
    this.showOptions(
      'keyboard',
      'mouse',
      '30px Arial',
      '#fff',
      'controls',
      'keyboard',
      this.changeControlsOption
    );
  };

  // display choice selection: keyboard or mouse
  changeControlsOption = e => {
    this.changeOption(
      e,
      'controls',
      'keyboard',
      'mouse',
      this.handleSelectControlsOption
    );
  };

  handleSelectControlsOption = () => {
    // when user presses enter
    // remove event listener for changing controls option
    document.removeEventListener('keydown', this.changeControlsOption);
    // wipe canvas
    this.game.blank();
    // start game
    this.game.replay();
  };

  // display choice: replay or main menu
  showResetOptions = () => {
    this.showOptions(
      'replay',
      'menu',
      '30px Arial',
      '#fff',
      'onFinish',
      'replay',
      this.changeResetOption
    );
  };

  // change choice selection: replay or main menu
  changeResetOption = e => {
    this.changeOption(
      e,
      'onFinish',
      'replay',
      'menu',
      this.handleSelectResetOption
    );
  };

  handleSelectResetOption = () => {
    // when user presses enter
    // remove event listener for changing player choice
    document.removeEventListener('keydown', this.changeResetOption);
    // wipe canvas
    this.game.blank();
    // either restart game or go back to main menu, depending on user's choice
    if (this.game.options.onFinish === 'replay') {
      this.game.replay();
    } else {
      this.showPlayerOptions();
    }
  };
}

export default UI;
