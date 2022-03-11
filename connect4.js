/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {

  constructor(height = 6, width = 7) {
    this.height = height,
    this.width = width,
    this.currPlayer = 0,
    this.players = [];
    this.makeStartButton()
    this.makeForm();
  }

  /**Manipulate DOM to add a start button with event listener */
  makeStartButton(){
    const header = document.getElementById('header');
    const button = document.createElement('button');

    button.setAttribute("id", "start-button");
    button.addEventListener("click", this.handleStartClick.bind(this));
    button.innerText = "Start Game";

    header.append(button);
  }

  /** Manipulate DOM to input form for players and favorite colors */
  makeForm(){
    const area = document.getElementById('header');

    const form = document.createElement('form');
    form.setAttribute("id", "player-form");
    area.append(form);

    const formArea = document.getElementById('player-form')
    //P1 Name - Color P2 Name- Color
    // i is number of players PLACEHOLDER potental change to support many players
    for (let i = 1; i <= 2; i++){
      const label = document.createElement('label');
      const input = document.createElement('input');
      const colorLabel = document.createElement('label');
      const colorInput = document.createElement('input');

      label.setAttribute("for", `Player-${i}`);
      input.setAttribute("type", "text");
      input.setAttribute("id", `Player-${i}`);
      input.setAttribute("placeholder", `Player ${i}`);

      colorLabel.setAttribute("for", `Player-${i}-color`);
      colorInput.setAttribute("type", "text");
      colorInput.setAttribute("id", `Player-${i}-color`);
      colorInput.setAttribute("placeholder", `Favorite Color`);

      formArea.append(label);
      formArea.append(input);
      formArea.append(colorInput)
      formArea.append(colorLabel)
    }
  }

  /** Process User input of start button and create game board
   * clear game area and reset board if game is in session
  */
  handleStartClick(evt){
      const board = document.getElementById('board');
      board.innerHTML = "";
      this.board = [];

      this.makeBoard();
      this.makeHtmlBoard();

  }
  /** makeBoard: create in-JS board structure:
  *   board = array of rows, each row is array of cells  (board[y][x])
  */
  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    const board = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }


  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`p${this.currPlayer}`);
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */

  endGame(msg) {
    alert(msg);
    let result = confirm("Play again?");

    if (result) return this.handleStartClick()
  }


  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {

      return this.endGame(`Player ${this.players[this.currPlayer]} won!`);
    }

    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }

    // switch players
    this.currPlayer = this.currPlayer === 0 ? 1 : 0;
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */
  checkForWin() {
    let _win = cells => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.height &&
          this.board[y][x] === this.currPlayer
      );
    }

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.height; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {

          return true;
        }
      }
    }
  }

}; //Game Class Ends Here

class Player {

  constructor(name, color){
    this.name = name
    this.color = color
  }

  getPlayerName(){


  }

  getPlayerColor(){

  }

}


new Game(6, 7);
