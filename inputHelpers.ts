import type * as Phaser from 'phaser';

export function handleCueInput(
  scene: Phaser.Scene,
  onPointerDown: (pointer: Phaser.Input.Pointer) => void,
  onPointerMove: (pointer: Phaser.Input.Pointer) => void,
  onPointerUp: (pointer: Phaser.Input.Pointer) => void
): void {
  scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
    onPointerDown(pointer);
  });

  scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
    onPointerMove(pointer);
  });

  scene.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
    onPointerUp(pointer);
  });
}
