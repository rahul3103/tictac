/**
 * This program is a boliler plate code for the famous tic tac toe game
 * Here box represents one placeholder for either X or a 0
 * We have a 2D array to represent the arrangement of X or O is a grid
 * 0 -> empty box
 * 1 -> box with X
 * 2 -> box with O
 *
 * Below are the tasks which needs to be completed
 * Imagine you are playing with Computer so every alternate move should be by Computer
 * X -> player
 * O -> Computer
 *
 * Winner has to be decided and has to be flashed
 *
 * Extra points will be given for the Creativity
 *
 * Use of Google is not encouraged
 *
 */
const grid = [];
const GRID_LENGTH = 3;
let turn = "X";
let gameFinished = false;

const winningCombo = [
  [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }],
  [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }],
  [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }],
  [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }],
  [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
  [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }],
  [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }],
  [{ x: 0, y: 2 }, { x: 1, y: 1 }, { x: 2, y: 0 }]
];

function initializeGrid() {
  for (let colIdx = 0; colIdx < GRID_LENGTH; colIdx++) {
    const tempArray = [];
    for (let rowidx = 0; rowidx < GRID_LENGTH; rowidx++) {
      tempArray.push(0);
    }
    grid.push(tempArray);
  }
}

function getRowBoxes(colIdx) {
  let rowDivs = "";

  for (let rowIdx = 0; rowIdx < GRID_LENGTH; rowIdx++) {
    let additionalClass = "darkBackground";
    let content = "";
    const sum = colIdx + rowIdx;
    if (sum % 2 === 0) {
      additionalClass = "lightBackground";
    }
    const gridValue = grid[colIdx][rowIdx];
    if (gridValue === 1) {
      content = '<span class="cross">X</span>';
    } else if (gridValue === 2) {
      content = '<span class="cross">O</span>';
    }
    rowDivs =
      rowDivs +
      '<div colIdx="' +
      colIdx +
      '" rowIdx="' +
      rowIdx +
      '" class="box ' +
      additionalClass +
      '">' +
      content +
      "</div>";
  }
  return rowDivs;
}

function getColumns() {
  let columnDivs = "";
  for (let colIdx = 0; colIdx < GRID_LENGTH; colIdx++) {
    let coldiv = getRowBoxes(colIdx);
    coldiv = '<div class="rowStyle">' + coldiv + "</div>";
    columnDivs = columnDivs + coldiv;
  }
  return columnDivs;
}

function renderMainGrid() {
  const parent = document.getElementById("grid");
  const columnDivs = getColumns();
  parent.innerHTML = '<div class="columnsStyle">' + columnDivs + "</div>";
}

function checkWinner(grid) {
  for (let i = 0; i < winningCombo.length; i++) {
    let [a, b, c] = winningCombo[i];
    if (
      grid[a.x][a.y] &&
      grid[a.x][a.y] === grid[b.x][b.y] &&
      grid[a.x][a.y] === grid[c.x][c.y]
    ) {
      gameFinished = true;
      return {
        combination: winningCombo[i],
        winner: grid[a.x][a.y] === 1 ? "You Won" : "Computer Won"
      };
    }
  }
  return null;
}

function checkFreeSpace() {
  const tempArray = [];
  for (let colIdx = 0; colIdx < GRID_LENGTH; colIdx++) {
    for (let rowidx = 0; rowidx < GRID_LENGTH; rowidx++) {
      if (!grid[colIdx][rowidx]) tempArray.push({ x: colIdx, y: rowidx });
    }
  }
  return tempArray;
}

function renderWinner(player) {
  document.querySelector(".gameover").style.display = "block";
  document.querySelector(".gameover .text").innerText = player;
}

function checkDraw() {
  if (gameFinished) return false;
  if (checkFreeSpace().length === 0) {
    var boxes = document.getElementsByClassName("box");
    for (var idx = 0; idx < boxes.length; idx++) {
      boxes[idx].style.backgroundColor = "green";
    }
    removeClickHandler();
    renderWinner("Game is Tied");
    return true;
  }
  return false;
}

function newSpot() {
  const tempVal = checkFreeSpace();
  let position = tempVal[Math.floor(Math.random() * tempVal.length)];
  return [position.y, position.x];
}

function gameOver(winner) {
  for (index of winner.combination) {
    let div = document.querySelector(
      `[colidx='${index.x}'][rowidx='${index.y}']`
    );
    div.style.backgroundColor = "yellow";
  }
  removeClickHandler();
  renderWinner(winner.winner);
}

function playerTurn(rowIdx, colIdx, player) {
  let newValue = player === "X" ? 1 : 2;
  grid[colIdx][rowIdx] = newValue;
  renderMainGrid();
  addClickHandlers();
  let winner = checkWinner(grid);
  if (winner) gameOver(winner);
}

function onBoxClick() {
  var rowIdx = this.getAttribute("rowIdx");
  var colIdx = this.getAttribute("colIdx");
  if (!grid[colIdx][rowIdx]) {
    playerTurn(rowIdx, colIdx, turn);
    if (!checkDraw()) {
      playerTurn(...newSpot(), "O");
    }
  }
}

function removeClickHandler() {
  var boxes = document.getElementsByClassName("box");
  for (var idx = 0; idx < boxes.length; idx++) {
    boxes[idx].removeEventListener("click", onBoxClick, false);
  }
}

function restart() {
  for (let colIdx = 0; colIdx < GRID_LENGTH; colIdx++) {
    for (let rowidx = 0; rowidx < GRID_LENGTH; rowidx++) {
      grid[colIdx][rowidx] = 0;
    }
  }
  renderMainGrid();
  addClickHandlers();
  gameFinished = false;
  document.querySelector(".gameover").style.display = "none";
}

function addClickHandlers() {
  var boxes = document.getElementsByClassName("box");
  for (var idx = 0; idx < boxes.length; idx++) {
    boxes[idx].addEventListener("click", onBoxClick, false);
  }
  var restartbtn = document.getElementById("restart");
  restartbtn.addEventListener("click", restart, false);
}

initializeGrid();
renderMainGrid();
addClickHandlers();
