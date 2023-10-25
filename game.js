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
let level = 0;
let radar = {};

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
          x: Math.round(posX),
          y: Math.round(posY),
          sign: "X",
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
  radar = magicRadar();

  const giftCollisionX =
    Math.round(giftPosition.x) == Math.round(playerPosition.x);
  const giftCollisionY =
    Math.round(giftPosition.y) == Math.round(playerPosition.y);
  const giftCollision = giftCollisionX && giftCollisionY;

  if (giftCollision) {
    levelCompleted();
  }

  const envCollision = environmentPositions.find((env) => {
    const envCollisionX = env.x == Math.round(playerPosition.x);
    const envCollisionY = env.y == Math.round(playerPosition.y);
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

function levelCompleted() {
  console.log("You got it!");
  level++;
  if (level < maps.length) {
    const customLoadEvent = new Event("load");
    window.dispatchEvent(customLoadEvent);
  } else {
    console.log("Game completed!");
  }
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
  if (
    Math.round(playerPosition.y) >= Math.round(elementSize) &&
    radar.up != "X"
  ) {
    playerPosition.y -= elementSize;
    startGame();
  }
}

function moveRight() {
  if (
    Math.round(playerPosition.x) < Math.round(canvasSize - elementSize) &&
    radar.right != "X"
  ) {
    playerPosition.x += elementSize;
    startGame();
  }
}

function moveDown() {
  if (
    Math.round(playerPosition.y) < Math.round(canvasSize - elementSize) &&
    radar.down != "X"
  ) {
    playerPosition.y += elementSize;
    startGame();
  }
}

function moveLeft() {
  if (
    Math.round(playerPosition.x) >= Math.round(elementSize) &&
    radar.left != "X"
  ) {
    playerPosition.x -= elementSize;
    startGame();
  }
}

window.addEventListener("load", () => {
  loadAllImages().then(() => {
    const map = maps[level];
    mapMatrix = map.match(/[IXOM\-]+/g).map((a) => a.split(""));
    setCanvasSize();
    startGame();
  });
});

function magicRadar() {
  const nearCollisions = {
    up: undefined,
    right: undefined,
    down: undefined,
    left: undefined,
  };

  environmentPositions.forEach((pos) => {
    const upWay = {
      x: Math.round(playerPosition.x),
      y: Math.round(playerPosition.y - elementSize),
    };
    const rightWay = {
      x: Math.round(playerPosition.x + elementSize),
      y: Math.round(playerPosition.y),
    };
    const downWay = {
      x: Math.round(playerPosition.x),
      y: Math.round(playerPosition.y + elementSize),
    };
    const leftWay = {
      x: Math.round(playerPosition.x - elementSize),
      y: Math.round(playerPosition.y),
    };

    if (upWay.x == pos.x && upWay.y == pos.y) {
      nearCollisions.up = pos.sign;
    }

    if (rightWay.x == pos.x && rightWay.y == pos.y) {
      nearCollisions.right = pos.sign;
    }

    if (downWay.x == pos.x && downWay.y == pos.y) {
      nearCollisions.down = pos.sign;
    }

    if (leftWay.x == pos.x && leftWay.y == pos.y) {
      nearCollisions.left = pos.sign;
    }
  });

  return nearCollisions;
}
