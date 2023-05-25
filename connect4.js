/** Connect Four
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])
const newGameForm = document.querySelector('#newGame')
const htmlBoard = document.querySelector('#board')
const currTurn = document.querySelector('#currTurn')
let gameOver = false
function makeBoard() {
  for (let i = 0; i < HEIGHT; i++){
    const row = []
    for (let i = 0; i < WIDTH; i++){
      row.push(null)
    }
    board.push(row)
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {
  // Create top tr element and set id as columntop
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);
// Creates tds for column top tr 
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);


  for (let y = 0; y < HEIGHT; y++) {
    // create new row for every height 
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      // add Width # of tds for every row created
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  let y = 5
  while (y >= 0) {
    if (board[y][x] !== 1 && board[y][x] !== 2) {
      return y
    }
    y--
  }
  return null
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  const div = document.createElement('div')
  div.classList.add(`player${currPlayer}`)
  document.getElementById(`${y}-${x}`).append(div)
}

/** endGame: announce game end */

function endGame(msg) {
  setTimeout(() => alert(msg),750)
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  if (gameOver) {
    return;
  }
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);
  board[y][x] = currPlayer

  // check for win
  if (checkForWin()) {
    let playerColor = ""
    gameOver = true
    if (currPlayer === 1) {
      playerColor = 'Red'
    } else {playerColor = 'Blue'}
    return endGame(`${playerColor} player won!`);
  }

  // check for tie
  const allCells = board.every((val,i) => {
   return board[i].every((value) => value !== null)
  })
  if (allCells) {
    endGame('Tie Game! Hit new game to try again!')
  }
  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1
  currPlayer === 1 ? currTurn.firstChild.textContent = "Red's Turn" : currTurn.firstChild.textContent = "Blue's Turn"
}
/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // for loops check every cell for the following conditions
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // get horizontal set of 4 cells starting at the first y,x and going right 3 cells
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      // get vertical set of 4 cells starting at the first y,x and going up 3 cells
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      // get right diag set of 4 cells starting at the first y,x and going up and right 1 cell each time to get a total of 4 cells
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
            // get right diag set of 4 cells starting at the first y,x and going up and left 1 cell each time to get a total of 4 cells
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
      //for each cell check if there is a win by going right 3 cells up 3 cells right diag 3 cells or left diag 3 cells 
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}
const resetGame = () => {
  currTurn.innerHTML = ''
  const h4 = document.createElement('h4');
  h4.textContent = "Red's Turn"
  currTurn.append(h4)
  board.length = 0
  htmlBoard.innerHTML = ''
  makeBoard();
  makeHtmlBoard();
  gameOver = false
}

newGameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  newGameForm.firstElementChild.textContent = "New Game";
  const allPieces = document.querySelectorAll('.player1, .player2');
  allPieces.forEach((piece) => {
    piece.style.animation = "fall-out 0.5s ease-in";
    piece.addEventListener("animationend", () => {
      piece.remove();
    });
  });
  if (board.length === 0) {
    resetGame()
  }
  else {
    setTimeout(resetGame, 500);
  }

});