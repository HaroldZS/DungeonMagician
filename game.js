const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");

window.addEventListener("load", startGame);

function startGame() {
  let canvasSize;

  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.8;
  } else {
    canvasSize = window.innerHeight * 0.8;
  }

  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);

  const elementSize = canvasSize / 10;
  game.font = elementSize + "px Verdana";
  game.textAlign = "";

  const image = new Image();
  image.src = "./assets/img/Three.png";

  image.onload = function () {
    for (let i = 0; i < 10; i++) {
      game.drawImage(
        image,
        elementSize * i,
        0,
        elementSize,
        elementSize
      );
    }
  };
}
