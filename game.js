const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");
const btnUp = document.querySelector("#up");
const btnLeft = document.querySelector("#left");
const btnRight = document.querySelector("#right");
const btnDown = document.querySelector("#down");

let canvasSize;
let elementSize;
let mapMatrix;
let characterImage;
let loadedImages = {};
let playerPosition = { x: undefined, y: undefined };
let giftPosition = { x: undefined, y: undefined };
let environmentPositions = [];

function loadImage(src) {
  const image = new Image();
  image.src = src;
  return image;
}

function loadAllImages() {
  const imagePaths = Object.values(images);
  const promises = imagePaths.map((src) => {
    const img = loadImage(src);
    loadedImages[src] = img;
    return new Promise((resolve) => {
      img.onload = resolve;
    });
  });
  return Promise.all(promises);
}

function renderMap() {
  game.clearRect(0, 0, canvasSize, canvasSize);

  mapMatrix.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      const image = loadedImages[images[col]];
      const posX = colI * elementSize;
      const posY = rowI * elementSize;
      if (col === "O" && !playerPosition.x && !playerPosition.y) {
        playerPosition.x = posX;
        playerPosition.y = posY;
      }
      if (col === "I") {
        giftPosition.x = posX;
        giftPosition.y = posY;
      }
      if (col === "X") {
        environmentPositions.push({
          x: Math.floor(posX),
          y: Math.floor(posY),
        });
      }

      game.drawImage(image, posX, posY, elementSize, elementSize);
    });
  });
}

function startGame() {
  environmentPositions = [];
  renderMap();
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
  const giftCollisionX =
    Math.floor(giftPosition.x) == Math.floor(playerPosition.x);
  const giftCollisionY =
    Math.floor(giftPosition.y) == Math.floor(playerPosition.y);
  const giftCollision = giftCollisionX && giftCollisionY;
  if (giftCollision) {
    console.log("New Level unlocked");
  }
  const envCollision = environmentPositions.find((env) => {
    const envCollisionX = env.x == Math.floor(playerPosition.x);
    const envCollisionY = env.y == Math.floor(playerPosition.y);
    return envCollisionX && envCollisionY;
  });

  if (envCollision) {
    console.log("Collision");
  }

  const characterImage = loadedImages[images["PLAYER"]];
  game.drawImage(
    characterImage,
    playerPosition.x,
    playerPosition.y,
    elementSize,
    elementSize
  );
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
  if (Math.floor(playerPosition.y) >= Math.floor(elementSize)) {
    playerPosition.y -= elementSize;
    startGame();
  }
}

function moveRight() {
  if (Math.floor(playerPosition.x) < Math.floor(canvasSize - elementSize)) {
    playerPosition.x += elementSize;
    startGame();
  }
}

function moveDown() {
  if (Math.floor(playerPosition.y) < Math.floor(canvasSize - elementSize)) {
    playerPosition.y += elementSize;
    startGame();
  }
}

function moveLeft() {
  if (Math.floor(playerPosition.x) >= Math.floor(elementSize)) {
    playerPosition.x -= elementSize;
    startGame();
  }
}

window.addEventListener("load", () => {
  loadAllImages().then(() => {
    const map = maps[1];
    mapMatrix = map.match(/[IXO\-]+/g).map((a) => a.split(""));
    setCanvasSize();
    startGame();
  });
});
