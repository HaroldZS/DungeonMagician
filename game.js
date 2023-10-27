const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");
const btnUp = document.querySelector("#up");
const btnLeft = document.querySelector("#left");
const btnRight = document.querySelector("#right");
const btnDown = document.querySelector("#down");
const liveSpan = document.querySelector("#lives");
const timeSpan = document.querySelector("#time");
const recordSpan = document.querySelector("#record");
const result = document.querySelector("#result");

let canvasSize;
let elementSize;
let mapMatrix;
let characterImage;
let loadedImages = {};
let playerPosition = { x: undefined, y: undefined };
let giftPosition = { x: undefined, y: undefined };
let environmentPositions = [];
let minePositions = [];
let level = 0;
let lives = 3;
let radar = {};
let minesField = {};
let startTime;
let intervalTime;
let collided = false;

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
  showLives();

  if (!startTime) {
    startTime = Date.now();
    intervalTime = setInterval(showTime, 100);
    showRecord();
  }

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
      if (col === "-") {
        environmentPositions.push({
          x: Math.round(posX),
          y: Math.round(posY),
          sign: "-",
        });
      }
      if (col === "M") {
        minePositions.push({
          x: Math.round(posX),
          y: Math.round(posY),
          sign: "M",
        });
      }

      game.drawImage(image, posX, posY, elementSize, elementSize);
    });
  });
}

function startGame() {
  environmentPositions = [];
  minePositions = [];
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
  game.font = "24px 'Press Start 2P', sans-serif";
  game.textAlign = "center";
  game.textBaseline = "middle";

  minesField = minesReveal();
  minePrediction();

  const giftCollisionX = valueRange(
    Math.round(giftPosition.x),
    Math.round(playerPosition.x)
  );
  const giftCollisionY = valueRange(
    Math.round(giftPosition.y),
    Math.round(playerPosition.y)
  );
  const giftCollision = giftCollisionX && giftCollisionY;

  if (giftCollision) {
    levelCompleted();
  }

  const mineCollision = minePositions.find((mine) => {
    const mineCollisionX = valueRange(mine.x, Math.round(playerPosition.x));
    const mineCollisionY = valueRange(mine.y, Math.round(playerPosition.y));
    return mineCollisionX && mineCollisionY;
  });

  const characterImage = loadedImages[images["PLAYER"]];
  game.drawImage(
    characterImage,
    playerPosition.x,
    playerPosition.y,
    elementSize,
    elementSize
  );

  if (mineCollision) {
    collided = true;
    const mineImage = loadedImages[images["MINE"]];
    game.drawImage(
      mineImage,
      playerPosition.x,
      playerPosition.y,
      elementSize,
      elementSize
    );
    setTimeout(() => {
      levelFailed();
      collided = false;
    }, 1000);
  }
}

function levelCompleted() {
  level++;
  if (level < maps.length) {
    reload();
  } else {
    clearInterval(intervalTime);
    const recordTime = localStorage.getItem("record_time");
    const playerTime = Date.now() - startTime;

    if (recordTime) {
      if (recordTime >= playerTime) {
        localStorage.setItem("record_time", playerTime);
        result.innerHTML = "New Record!";
      } else {
        result.innerHTML = "Undefeated record";
      }
    } else {
      localStorage.setItem("record_time", playerTime);
      result.innerHTML = "Let's go for a new record!";
    }
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
    radar.up != "X" &&
    !collided
  ) {
    playerPosition.y -= elementSize;
    startGame();
  }
}

function moveRight() {
  if (
    Math.round(playerPosition.x) < Math.round(canvasSize - elementSize) &&
    radar.right != "X" &&
    !collided
  ) {
    playerPosition.x += elementSize;
    startGame();
  }
}

function moveDown() {
  if (
    Math.round(playerPosition.y) < Math.round(canvasSize - elementSize) &&
    radar.down != "X" &&
    !collided
  ) {
    playerPosition.y += elementSize;
    startGame();
  }
}

function moveLeft() {
  if (
    Math.round(playerPosition.x) >= Math.round(elementSize) &&
    radar.left != "X" &&
    !collided
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
    upRight: undefined,
    downRight: undefined,
    downLeft: undefined,
    upLeft: undefined,
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

    const UpRightWay = {
      x: Math.round(upWay.x + elementSize),
      y: Math.round(upWay.y),
    };
    const DownRightWay = {
      x: Math.round(downWay.x + elementSize),
      y: Math.round(downWay.y),
    };
    const DownLeftWay = {
      x: Math.round(downWay.x - elementSize),
      y: Math.round(downWay.y),
    };
    const UpLefttWay = {
      x: Math.round(upWay.x - elementSize),
      y: Math.round(upWay.y),
    };

    if (pos.sign == "X") {
      if (valueRange(upWay.x, pos.x) && valueRange(upWay.y, pos.y)) {
        nearCollisions.up = pos.sign;
      }

      if (valueRange(rightWay.x, pos.x) && valueRange(rightWay.y, pos.y)) {
        nearCollisions.right = pos.sign;
      }

      if (valueRange(downWay.x, pos.x) && valueRange(downWay.y, pos.y)) {
        nearCollisions.down = pos.sign;
      }

      if (valueRange(leftWay.x, pos.x) && valueRange(leftWay.y, pos.y)) {
        nearCollisions.left = pos.sign;
      }
    }

    if (pos.sign == "-") {
      if (valueRange(UpRightWay.x, pos.x) && valueRange(UpRightWay.y, pos.y)) {
        nearCollisions.upRight = true;
      }

      if (
        valueRange(DownRightWay.x, pos.x) &&
        valueRange(DownRightWay.y, pos.y)
      ) {
        nearCollisions.downRight = true;
      }

      if (
        valueRange(DownLeftWay.x, pos.x) &&
        valueRange(DownLeftWay.y, pos.y)
      ) {
        nearCollisions.downLeft = true;
      }

      if (valueRange(UpLefttWay.x, pos.x) && valueRange(UpLefttWay.y, pos.y)) {
        nearCollisions.upLeft = true;
      }
    }
  });

  return nearCollisions;
}

function levelFailed() {
  lives--;
  playerPosition.x = undefined;
  playerPosition.y = undefined;

  if (lives === 0) {
    level = 0;
    lives = 3;
    startTime = undefined;
    location.reload();
  }

  startGame();
}

function reload() {
  const customLoadEvent = new Event("load");
  window.dispatchEvent(customLoadEvent);
}

function showLives() {
  liveSpan.innerHTML = "❤".repeat(lives);
}

function showTime() {
  timeSpan.innerHTML = Date.now() - startTime;
}

function showRecord() {
  recordSpan.innerHTML = localStorage.getItem("record_time");
}

function mineRadar(path, value) {
  switch (path) {
    case "Up-Right":
      game.fillText(
        value,
        playerPosition.x + (3 * elementSize) / 2,
        playerPosition.y - elementSize / 2
      );
      break;
    case "Down-Right":
      game.fillText(
        value,
        playerPosition.x + (3 * elementSize) / 2,
        playerPosition.y + (3 * elementSize) / 2
      );
      break;
    case "Down-Left":
      game.fillText(
        value,
        playerPosition.x - elementSize / 2,
        playerPosition.y + (3 * elementSize) / 2
      );
      break;
    case "Up-Left":
      game.fillText(
        value,
        playerPosition.x - elementSize / 2,
        playerPosition.y - elementSize / 2
      );
      break;
  }
}

function minesReveal() {
  const nearMines = {
    upRight: 0,
    downRight: 0,
    downLeft: 0,
    upLeft: 0,
  };

  minePositions.forEach((pos) => {
    const uWay = {
      x: Math.round(playerPosition.x),
      y: Math.round(playerPosition.y - elementSize),
    };
    const rWay = {
      x: Math.round(playerPosition.x + elementSize),
      y: Math.round(playerPosition.y),
    };
    const dWay = {
      x: Math.round(playerPosition.x),
      y: Math.round(playerPosition.y + elementSize),
    };
    const lWay = {
      x: Math.round(playerPosition.x - elementSize),
      y: Math.round(playerPosition.y),
    };

    if (valueRange(uWay.x, pos.x) && valueRange(uWay.y, pos.y)) {
      nearMines.upRight += 1;
      nearMines.upLeft += 1;
    }

    if (valueRange(rWay.x, pos.x) && valueRange(rWay.y, pos.y)) {
      nearMines.upRight += 1;
      nearMines.downRight += 1;
    }

    if (valueRange(dWay.x, pos.x) && valueRange(dWay.y, pos.y)) {
      nearMines.downRight += 1;
      nearMines.downLeft += 1;
    }

    if (valueRange(lWay.x, pos.x) && valueRange(lWay.y, pos.y)) {
      nearMines.upLeft += 1;
      nearMines.downLeft += 1;
    }
  });

  return nearMines;
}

function minePrediction() {
  if (radar.upRight && minesField.upRight != 0) {
    mineRadar("Up-Right", minesField.upRight);
  }
  if (radar.downRight && minesField.downRight != 0) {
    mineRadar("Down-Right", minesField.downRight);
  }
  if (radar.downLeft && minesField.downLeft != 0) {
    mineRadar("Down-Left", minesField.downLeft);
  }
  if (radar.upLeft && minesField.upLeft != 0) {
    mineRadar("Up-Left", minesField.upLeft);
  }
}

function valueRange(value1, value2, tolerance = 1) {
  return Math.abs(value1 - value2) <= tolerance;
}
