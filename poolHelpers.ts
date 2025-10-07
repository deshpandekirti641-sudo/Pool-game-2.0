import type * as Phaser from 'phaser';

export function addPoolTable(scene: Phaser.Scene): void {
  // Table background
  const graphics = scene.add.graphics();
  graphics.fillStyle(0x0d4025, 1);
  graphics.fillRect(40, 40, 720, 420);
  
  // Table border
  graphics.lineStyle(20, 0x8b4513, 1);
  graphics.strokeRect(30, 30, 740, 440);
  
  // Add cushions (walls)
  const cushionThickness = 30;
  
  // Top wall
  scene.matter.add.rectangle(400, cushionThickness / 2, 740, cushionThickness, {
    isStatic: true,
    label: 'wall',
    friction: 0.1,
    restitution: 0.9
  });
  
  // Bottom wall
  scene.matter.add.rectangle(400, 500 - cushionThickness / 2, 740, cushionThickness, {
    isStatic: true,
    label: 'wall',
    friction: 0.1,
    restitution: 0.9
  });
  
  // Left wall
  scene.matter.add.rectangle(cushionThickness / 2, 250, cushionThickness, 420, {
    isStatic: true,
    label: 'wall',
    friction: 0.1,
    restitution: 0.9
  });
  
  // Right wall
  scene.matter.add.rectangle(800 - cushionThickness / 2, 250, cushionThickness, 420, {
    isStatic: true,
    label: 'wall',
    friction: 0.1,
    restitution: 0.9
  });
}

export function addBall(scene: Phaser.Scene, x: number, y: number, color: number): Phaser.Physics.Matter.Sprite {
  const graphics = scene.add.graphics();
  graphics.fillStyle(color, 1);
  graphics.fillCircle(0, 0, 12);
  graphics.lineStyle(2, 0x000000, 0.3);
  graphics.strokeCircle(0, 0, 12);
  
  graphics.generateTexture(`ball_${color}`, 24, 24);
  graphics.destroy();
  
  const ball = scene.matter.add.sprite(x, y, `ball_${color}`, undefined, {
    shape: { type: 'circle', radius: 12 },
    friction: 0.05,
    frictionAir: 0.02,
    restitution: 0.9,
    density: 0.1
  }) as Phaser.Physics.Matter.Sprite;
  
  ball.setCircle(12);
  ball.setBounce(0.9);
  
  return ball;
}

export function createCueStick(scene: Phaser.Scene): Phaser.GameObjects.Graphics {
  return scene.add.graphics();
}
