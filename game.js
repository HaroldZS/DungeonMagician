const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");

let canvasSize;
let elementSize;

window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

function startGame() {
  game.font = elementSize + "px Verdana";
  game.textAlign = "";

  const image = new Image();
  image.src = "./assets/img/Three.png";

  const map = maps[0];
  const mapMatrix = map
    .trim()
    .split("\n")
    .map((row) => row.trim().split(""));
  console.log(mapMatrix);

  image.onload = function () {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        game.drawImage(
          image,
          elementSize * i,
          elementSize * j,
          elementSize,
          elementSize
        );
      }
    }
  };
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
