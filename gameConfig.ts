import type * as Phaser from 'phaser';

const gameConfig: Phaser.Types.Core.GameConfig = {
  width: 800,
  height: 500,
  type: 1,
  backgroundColor: '#1a5c3a',
  physics: {
    default: 'matter',
    matter: {
      gravity: { y: 0 },
      debug: false,
      enableSleeping: true,
    }
  },
  scale: {
    mode: 2,
    autoCenter: 1,
    width: 800,
    height: 500
  },
  fps: { target: 60, forceSetTimeOut: true },
  input: {
    gamepad: true,
    mouse: true,
    touch: true,
    keyboard: true
  }
};

export default gameConfig;
