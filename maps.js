const images = {
  "-": "./assets/img/Road.png",
  M: "./assets/img/MagicMine.png",
  O: "./assets/img/Gate.png",
  X: "./assets/img/Three.png",
  I: "./assets/img/Reward.png",
  PLAYER: "./assets/img/DM-Magician.png ",
  BOMB_COLLISION: "./assets/img/Three.png",
  GAME_OVER: "./assets/img/Three.png",
  WIN: "./assets/img/Three.png",
};

const maps = [];
maps.push(`
    IXXXXXXXXX
    -XXXXXXXXX
    -XXXXXXXXX
    -XXXXXXXXX
    -XXXXXXXXX
    -XXXXXXXXX
    -XXXXXXXXX
    -XXXXXXXXX
    -XXXXXXXXX
    OXXXXXXXXX
  `);
maps.push(`
    O--XXXXXXX
    X--XXXXXXX
    XX----XXXX
    X-MXX-XXXX
    X-XXX--XXX
    X-XXXX-XXX
    XX-MXX--XX
    XX--XXX-XX
    XXXX---IXX
    XXXXXXXXXX
    `);
maps.push(`
    I-----XXXX
    XXXXX-XXXX
    XX----XXXX
    XX-XXXXXXX
    XX-----XXX
    XXXXXX-XXX
    XX-----XXX
    XX-XXXXXXX
    XX-----OXX
    XXXXXXXXXX
  `);
