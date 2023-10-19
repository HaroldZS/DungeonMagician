const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");
const btnUp = document.querySelector("#up");
const btnLeft = document.querySelector("#left");
const btnRight = document.querySelector("#right");
const btnDown = document.querySelector("#down");

let canvasSize;
let elementSize;

const playerPosition = {
  x: undefined,
  y: undefined,
};

window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

function startGame() {
  game.font = elementSize + "px Verdana";
  game.textAlign = "";

  const map = maps[0];
  const mapMatrix = map.match(/[IXO\-]+/g).map((a) => a.split(""));

  game.clearRect(0, 0, canvasSize, canvasSize);
  mapMatrix.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      const image = new Image();
      image.src = images[col];
      const posX = elementSize * colI;
      const posY = elementSize * rowI;

      if (col == "O") {
        if (!playerPosition.x && !playerPosition.y) {
          playerPosition.x = posX;
          playerPosition.y = posY;
        }
      }

      image.onload = function () {
        game.drawImage(image, posX, posY, elementSize, elementSize);
      };
    });
  });

  movePlayer();
}

function setCanvasSize() {
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.8;
  } else {
    canvasSize = window.innerHeight * 0.8;
  }

  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);

  elementSize = canvasSize / 10;

  startGame();
}

function movePlayer() {
  const character = new Image();
  character.src = images["PLAYER"];
  character.onload = function () {
    game.drawImage(
      character,
      playerPosition.x,
      playerPosition.y,
      elementSize,
      elementSize
    );
  };
}

window.addEventListener("keydown", moveByKeys);
btnUp.addEventListener("click", moveUp);
btnLeft.addEventListener("click", moveLeft);
btnRight.addEventListener("click", moveRight);
btnDown.addEventListener("click", moveDown);

function moveByKeys(event) {
  switch (event.key) {
    case "ArrowUp":
      moveUp();
      break;
    case "ArrowRight":
      moveRight();
      break;
    case "ArrowDown":
      moveDown();
      break;
    case "ArrowLeft":
      moveLeft();
      break;
  }
}

function moveUp() {
  playerPosition.y -= elementSize;
  startGame();
}
function moveRight() {
  playerPosition.x += elementSize;
  startGame();
}
function moveDown() {
  playerPosition.y += elementSize;
  startGame();
}
function moveLeft() {
  playerPosition.x -= elementSize;
  startGame();
}
