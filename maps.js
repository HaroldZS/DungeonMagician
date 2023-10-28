const images = {
  "-": "./assets/img/Road.png",
  M: "./assets/img/HiddenMagicMine.png",
  O: "./assets/img/Gate.png",
  X: "./assets/img/Three.png",
  I: "./assets/img/Reward.png",
  E: "./assets/img/CrystalBall.png",
  PLAYER: "./assets/img/DM-Magician.png",
  MINE: "./assets/img/MagicMine.png",
  BOMB_COLLISION: "./assets/img/Three.png",
  GAME_OVER: "./assets/img/Three.png",
  WIN: "./assets/img/Three.png",
};

const maps = [];
maps.push(`
    IXXXXXXXXX
    -EXXXXXXXX
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
    EM-M--XXXX
    X-MXX--XXX
    XX-----XXX
    X--EXM-XXX
    XM-MXX--XX
    XX--XEMMEX
    XEM----IXX
    XXXXXXXXXX
    `);
maps.push(`
    I-----XXXX
    XXX-XM-XXX
    XM--XEM-XX
    X--XXX-MXX
    XX-----XXX
    XEMXXX--XX
    XX-----XXX
    XX-XXXXXXX
    XX-----OXX
    XXXXXXXXXX
  `);
