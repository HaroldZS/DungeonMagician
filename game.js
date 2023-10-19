const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");
const btnUp = document.querySelector("#up");
const btnLeft = document.querySelector("#left");
const btnRight = document.querySelector("#right");
const btnDown = document.querySelector("#down");

let canvasSize;
let elementSize;

window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

function startGame() {
  game.font = elementSize + "px Verdana";
  game.textAlign = "";

  const map = maps[0];
  const mapMatrix = map.match(/[IXO\-]+/g).map((a) => a.split(""));

  mapMatrix.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      const image = new Image();
      image.src = images[col];
      const posX = elementSize * colI;
      const posY = elementSize * rowI;
      image.onload = function () {
        game.drawImage(image, posX, posY, elementSize, elementSize);
      };
    });
  });
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
  console.log("Up");
}
function moveLeft() {
  console.log("Left");
}
function moveRight() {
  console.log("Right");
}
function moveDown() {
  console.log("Down");
}
