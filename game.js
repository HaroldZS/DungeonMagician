const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");

let canvasSize;
let elementSize;

window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

function startGame() {
  game.font = elementSize + "px Verdana";
  game.textAlign = "";

  const map = maps[1];
  const mapMatrix = map
    .trim()
    .split("\n")
    .map((row) => row.trim().split(""));
  console.log(mapMatrix);

  for (let i = 0; i < mapMatrix.length; i++) {
    for (let j = 0; j < mapMatrix[i].length; j++) {
      const image = new Image();
      image.src = images[mapMatrix[i][j]];
      image.onload = function () {
        game.drawImage(
          image,
          elementSize * j,
          elementSize * i,
          elementSize,
          elementSize
        );
      };
    }
  }
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
