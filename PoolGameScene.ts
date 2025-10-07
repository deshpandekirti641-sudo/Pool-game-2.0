import * as Phaser from 'phaser';
import { addPoolTable, addBall, createCueStick } from './helpers/poolHelpers';
import { handleCueInput } from './helpers/inputHelpers';

export default class PoolGameScene extends Phaser.Scene {
  private cueBall!: Phaser.Physics.Matter.Sprite;
  private balls: Phaser.Physics.Matter.Sprite[] = [];
  private cueStick!: Phaser.GameObjects.Graphics;
  private pockets: Phaser.Physics.Matter.Sprite[] = [];
  private isDragging: boolean = false;
  private dragStartX: number = 0;
  private dragStartY: number = 0;
  private cueAngle: number = 0;
  private cuePower: number = 0;
  private maxPower: number = 20;
  private canShoot: boolean = true;
  private pottedBalls: number = 0;
  public matchId: string = '';
  public onScoreUpdate: ((points: number) => void) | null = null;
  public isActive: boolean = false;

  constructor() {
    super('PoolGameScene');
  }

  create(): void {
    // Add pool table
    addPoolTable(this);
    
    // Add pockets
    this.createPockets();
    
    // Add balls
    this.setupBalls();
    
    // Create cue stick
    this.cueStick = createCueStick(this);
    
    // Setup input
    handleCueInput(this, this.onPointerDown.bind(this), this.onPointerMove.bind(this), this.onPointerUp.bind(this));
    
    // Add instructions text
    this.add.text(400, 30, 'Drag to aim, release to shoot!', {
      fontSize: '20px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5);
  }

  private createPockets(): void {
    const pocketPositions = [
      { x: 50, y: 50 }, // Top left
      { x: 400, y: 40 }, // Top middle
      { x: 750, y: 50 }, // Top right
      { x: 50, y: 450 }, // Bottom left
      { x: 400, y: 460 }, // Bottom middle
      { x: 750, y: 450 } // Bottom right
    ];

    pocketPositions.forEach((pos: { x: number; y: number }) => {
      const pocket = this.matter.add.circle(pos.x, pos.y, 20, {
        isStatic: true,
        isSensor: true,
        label: 'pocket'
      }) as Phaser.Physics.Matter.Sprite;
      
      const graphics = this.add.graphics();
      graphics.fillStyle(0x000000, 1);
      graphics.fillCircle(pos.x, pos.y, 20);
      
      this.pockets.push(pocket);
    });

    // Collision detection for pockets
    this.matter.world.on('collisionstart', (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
      event.pairs.forEach((pair: MatterJS.Pair) => {
        const { bodyA, bodyB } = pair;
        
        if ((bodyA.label === 'pocket' || bodyB.label === 'pocket')) {
          const ball = bodyA.label === 'pocket' ? bodyB.gameObject : bodyA.gameObject;
          
          if (ball && ball !== this.cueBall && this.balls.includes(ball as Phaser.Physics.Matter.Sprite)) {
            this.pocketBall(ball as Phaser.Physics.Matter.Sprite);
          }
        }
      });
    });
  }

  private setupBalls(): void {
    // Cue ball (white)
    this.cueBall = addBall(this, 200, 250, 0xffffff);
    
    // Triangle formation starting position
    const startX = 600;
    const startY = 250;
    const ballRadius = 12;
    const spacing = ballRadius * 2 + 2;
    
    // Colors for pool balls
    const ballColors = [
      0xffff00, 0x0000ff, 0xff0000, 0x800080, 0xff8800, // Row 1: yellow, blue, red, purple, orange
      0x008000, 0x8b0000, 0x000000, 0xffff00, // Row 2: green, maroon, black, yellow
      0x0000ff, 0xff0000, 0xff8800, // Row 3: blue, red, orange
      0x800080, 0x008000, // Row 4: purple, green
      0x8b0000 // Row 5: maroon
    ];
    
    let colorIndex = 0;
    
    // Create triangle formation
    for (let row = 0; row < 5; row++) {
      const ballsInRow = row + 1;
      const rowStartY = startY - (row * spacing * 0.87);
      
      for (let col = 0; col < ballsInRow; col++) {
        const x = startX + (row * spacing);
        const y = rowStartY + (col * spacing);
        
        const ball = addBall(this, x, y, ballColors[colorIndex % ballColors.length]);
        this.balls.push(ball);
        colorIndex++;
      }
    }
  }

  private onPointerDown(pointer: Phaser.Input.Pointer): void {
    if (!this.canShoot || !this.isActive) return;
    
    if (!this.areBallsMoving()) {
      this.isDragging = true;
      this.dragStartX = pointer.x;
      this.dragStartY = pointer.y;
    }
  }

  private onPointerMove(pointer: Phaser.Input.Pointer): void {
    if (!this.isDragging || !this.isActive) return;
    
    const dx = pointer.x - this.cueBall.x;
    const dy = pointer.y - this.cueBall.y;
    
    this.cueAngle = Math.atan2(dy, dx);
    
    const dragDist = Phaser.Math.Distance.Between(this.dragStartX, this.dragStartY, pointer.x, pointer.y);
    this.cuePower = Math.min(dragDist / 10, this.maxPower);
    
    this.updateCueStick();
  }

  private onPointerUp(): void {
    if (!this.isDragging || !this.isActive) return;
    
    this.isDragging = false;
    this.shootCueBall();
  }

  private shootCueBall(): void {
    if (this.cuePower > 0.5) {
      const velocityX = Math.cos(this.cueAngle) * this.cuePower * 0.5;
      const velocityY = Math.sin(this.cueAngle) * this.cuePower * 0.5;
      
      this.cueBall.setVelocity(velocityX, velocityY);
      this.canShoot = false;
      
      this.cueStick.clear();
    }
    
    this.cuePower = 0;
  }

  private updateCueStick(): void {
    this.cueStick.clear();
    
    if (this.isDragging && this.cuePower > 0) {
      const stickLength = 100 + this.cuePower * 5;
      const startX = this.cueBall.x - Math.cos(this.cueAngle) * 30;
      const startY = this.cueBall.y - Math.sin(this.cueAngle) * 30;
      const endX = startX - Math.cos(this.cueAngle) * stickLength;
      const endY = startY - Math.sin(this.cueAngle) * stickLength;
      
      this.cueStick.lineStyle(6, 0xffaa00, 1);
      this.cueStick.beginPath();
      this.cueStick.moveTo(startX, startY);
      this.cueStick.lineTo(endX, endY);
      this.cueStick.strokePath();
      
      this.cueStick.lineStyle(2, 0x000000, 1);
      this.cueStick.beginPath();
      this.cueStick.arc(endX, endY, 8, 0, Math.PI * 2);
      this.cueStick.strokePath();
    }
  }

  private areBallsMoving(): boolean {
    if (Math.abs(this.cueBall.body?.velocity.x ?? 0) > 0.1 || Math.abs(this.cueBall.body?.velocity.y ?? 0) > 0.1) {
      return true;
    }
    
    for (const ball of this.balls) {
      if (Math.abs(ball.body?.velocity.x ?? 0) > 0.1 || Math.abs(ball.body?.velocity.y ?? 0) > 0.1) {
        return true;
      }
    }
    
    return false;
  }

  private pocketBall(ball: Phaser.Physics.Matter.Sprite): void {
    const index = this.balls.indexOf(ball);
    if (index > -1) {
      this.balls.splice(index, 1);
      ball.destroy();
      this.pottedBalls++;
      
      // Award points
      const points = 10;
      if (this.onScoreUpdate) {
        this.onScoreUpdate(points);
      }
    }
  }

  update(): void {
    if (!this.areBallsMoving() && !this.canShoot) {
      this.canShoot = true;
    }
    
    if (this.canShoot && !this.isDragging) {
      this.cueStick.clear();
    }
  }
}
