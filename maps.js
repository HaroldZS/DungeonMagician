const images = {
  "-": "./assets/img/Road.png",
  M: "./assets/img/HiddenMagicMine.png",
  O: "./assets/img/Gate.png",
  X: "./assets/img/Three.png",
  I: "./assets/img/Reward.png",
  PLAYER: "./assets/img/DM-Magician.png",
  MINE: "./assets/img/MagicMine.png",
  BOMB_COLLISION: "./assets/img/Three.png",
  GAME_OVER: "./assets/img/Three.png",
  WIN: "./assets/img/Three.png",
};

const maps = [];
maps.push(`
    IXXXXXXXXX
    --XXXXXXXX
    -MXXXXXXXX
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
    X----XXXXX
    -M-M--XXXX
    X-MXX--XXX
    XX-----XXX
    X---XM-XXX
    XM-MXX--XX
    XX--X-MM-X
    X-M----IXX
    XXXXXXXXXX
    `);
maps.push(`
    I-----XXXX
    XXX-XM-XXX
    XM----M-XX
    X--XXX-MXX
    XX-----XXX
    X-MXXX--XX
    XX-----XXX
    XX-XXXXXXX
    XX-----OXX
    XXXXXXXXXX
  `);
