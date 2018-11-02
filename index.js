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
let GRID_LENGTH = 3;
let turn = "X";
let gameFinished = false;

let winningCombo = [];

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

function checkWinByRow(colIdx, grid) {
  let winner = grid[colIdx][0];
  for (let i = 0; i < GRID_LENGTH; i++) {
    if (grid[colIdx][i] != winner) {
      winner = null;
      winningCombo = [];
      break;
    } else winningCombo.push({ x: colIdx, y: i });
  }
  return winner;
}

function checkWinByCol(rowIdx, grid) {
  let winner = grid[0][rowIdx];
  for (let i = 0; i < GRID_LENGTH; i++) {
    if (grid[i][rowIdx] != winner) {
      winner = null;
      winningCombo = [];
      break;
    } else winningCombo.push({ x: i, y: rowIdx });
  }
  return winner;
}

function checkWinByDiagonal(grid) {
  let winner = grid[0][0];
  for (let i = 0; i < GRID_LENGTH; i++) {
    if (grid[i][i] != winner) {
      winner = null;
      winningCombo = [];
      break;
    } else winningCombo.push({ x: i, y: i });
  }
  return winner;
}

function checkWinByAntiDiagonal(grid) {
  let winner = grid[0][GRID_LENGTH - 1];
  for (let i = 0; i < GRID_LENGTH; i++) {
    if (grid[i][GRID_LENGTH - 1 - i] != winner) {
      winner = null;
      winningCombo = [];
      break;
    } else winningCombo.push({ x: i, y: GRID_LENGTH - 1 - i });
  }
  return winner;
}

function checkWinner(colIdx, rowIdx, grid) {
  let winner = checkWinByRow(colIdx, grid);
  if (!winner) winner = checkWinByCol(rowIdx, grid);
  if (!winner && rowIdx === colIdx) winner = checkWinByDiagonal(grid);
  if (!winner && parseInt(rowIdx) + parseInt(colIdx) === GRID_LENGTH - 1)
    winner = checkWinByAntiDiagonal(grid);
  return winner;
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
  if (gameFinished) return;
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
  gameFinished = true;
  for (index of winningCombo) {
    let div = document.querySelector(
      `[colidx='${index.x}'][rowidx='${index.y}']`
    );
    div.style.backgroundColor = "yellow";
  }
  removeClickHandler();
  renderWinner(winner === 1 ? "You Won" : "Computer Won");
}

function playerTurn(rowIdx, colIdx, player) {
  let newValue = player === "X" ? 1 : 2;
  grid[colIdx][rowIdx] = newValue;
  renderMainGrid();
  addClickHandlers();
  let winner = checkWinner(colIdx, rowIdx, grid);
  if (winner) gameOver(winner);
}

function onBoxClick() {
  var rowIdx = this.getAttribute("rowIdx");
  var colIdx = this.getAttribute("colIdx");
  if (!grid[colIdx][rowIdx]) {
    playerTurn(rowIdx, colIdx, turn);
    if (!checkDraw() && !gameFinished) {
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
  addNumbers();
  renderMainGrid();
  addClickHandlers();
  gameFinished = false;
  winningCombo = [];
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

function onOptionChange() {
  GRID_LENGTH = Number(this.value);
  initializeGrid();
  renderMainGrid();
  addClickHandlers();
  restart();
}

function addNumbers() {
  let dropdown = document.getElementById("selectNumber");
  for (let i = 4; i < 10; ++i) {
    var el = document.createElement("option");
    el.textContent = String(i);
    el.value = String(i);
    dropdown.appendChild(el);
  }
  dropdown.addEventListener("change", onOptionChange, false);
}

addNumbers();
initializeGrid();
renderMainGrid();
addClickHandlers();
