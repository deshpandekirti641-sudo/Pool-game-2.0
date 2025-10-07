/**
 * VFX Manager
 * Handles visual effects and animations
 */

export type VFXEffect = 
  | 'ball_pot'
  | 'match_win'
  | 'match_lose'
  | 'coin_earned'
  | 'level_up'
  | 'combo'
  | 'particle_burst';

interface VFXOptions {
  x?: number;
  y?: number;
  duration?: number;
  color?: string;
  size?: number;
}

class VFXManager {
  private container: HTMLDivElement | null = null;
  private activeEffects: Set<string> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.initContainer();
    }
  }

  /**
   * Initialize VFX container
   */
  private initContainer(): void {
    this.container = document.createElement('div');
    this.container.id = 'vfx-container';
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;
    
    if (document.body) {
      document.body.appendChild(this.container);
    } else {
      window.addEventListener('load', () => {
        if (document.body && this.container) {
          document.body.appendChild(this.container);
        }
      });
    }
  }

  /**
   * Play visual effect
   */
  play(effect: VFXEffect, options: VFXOptions = {}): void {
    const effectId = `${effect}_${Date.now()}`;
    this.activeEffects.add(effectId);

    switch (effect) {
      case 'ball_pot':
        this.createBallPotEffect(effectId, options);
        break;
      case 'match_win':
        this.createMatchWinEffect(effectId, options);
        break;
      case 'match_lose':
        this.createMatchLoseEffect(effectId, options);
        break;
      case 'coin_earned':
        this.createCoinEffect(effectId, options);
        break;
      case 'particle_burst':
        this.createParticleBurst(effectId, options);
        break;
      default:
        this.createGenericEffect(effectId, options);
    }
  }

  /**
   * Create ball pot effect
   */
  private createBallPotEffect(id: string, options: VFXOptions): void {
    const element = this.createElement('div', {
      position: 'absolute',
      left: `${options.x || 50}%`,
      top: `${options.y || 50}%`,
      transform: 'translate(-50%, -50%)',
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      background: options.color || 'radial-gradient(circle, #4ade80 0%, #22c55e 100%)',
      animation: 'vfx-ballPot 0.5s ease-out',
      opacity: '0',
    });

    this.addEffect(id, element, 500);
  }

  /**
   * Create match win effect
   */
  private createMatchWinEffect(id: string, options: VFXOptions): void {
    const element = this.createElement('div', {
      position: 'fixed',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '72px',
      fontWeight: 'bold',
      color: '#fbbf24',
      textShadow: '0 0 20px rgba(251, 191, 36, 0.8)',
      animation: 'vfx-victory 1.5s ease-out',
      zIndex: '10000',
    });
    element.textContent = '🎉 VICTORY! 🎉';

    this.addEffect(id, element, 1500);
  }

  /**
   * Create match lose effect
   */
  private createMatchLoseEffect(id: string, options: VFXOptions): void {
    const element = this.createElement('div', {
      position: 'fixed',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '48px',
      fontWeight: 'bold',
      color: '#ef4444',
      textShadow: '0 0 20px rgba(239, 68, 68, 0.8)',
      animation: 'vfx-defeat 1s ease-out',
      zIndex: '10000',
    });
    element.textContent = 'Better luck next time!';

    this.addEffect(id, element, 1000);
  }

  /**
   * Create coin earned effect
   */
  private createCoinEffect(id: string, options: VFXOptions): void {
    const element = this.createElement('div', {
      position: 'absolute',
      left: `${options.x || 50}%`,
      top: `${options.y || 50}%`,
      transform: 'translate(-50%, -50%)',
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#fbbf24',
      animation: 'vfx-coinFloat 1s ease-out',
      zIndex: '10000',
    });
    element.textContent = '💰 +₹';

    this.addEffect(id, element, 1000);
  }

  /**
   * Create particle burst effect
   */
  private createParticleBurst(id: string, options: VFXOptions): void {
    const particleCount = 12;
    const x = options.x || 50;
    const y = options.y || 50;
    const color = options.color || '#4ade80';

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const distance = 100;
      const targetX = x + Math.cos(angle) * distance;
      const targetY = y + Math.sin(angle) * distance;

      const particle = this.createElement('div', {
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: color,
        animation: `vfx-particle-${i} 0.8s ease-out`,
      });

      // Create keyframes for this particle
      this.createParticleKeyframes(i, x, y, targetX, targetY);

      if (this.container) {
        this.container.appendChild(particle);
        setTimeout(() => particle.remove(), 800);
      }
    }

    setTimeout(() => this.activeEffects.delete(id), 800);
  }

  /**
   * Create generic effect
   */
  private createGenericEffect(id: string, options: VFXOptions): void {
    const element = this.createElement('div', {
      position: 'absolute',
      left: `${options.x || 50}%`,
      top: `${options.y || 50}%`,
      transform: 'translate(-50%, -50%)',
      width: `${options.size || 100}px`,
      height: `${options.size || 100}px`,
      borderRadius: '50%',
      background: options.color || 'rgba(74, 222, 128, 0.6)',
      animation: 'vfx-pulse 0.5s ease-out',
    });

    this.addEffect(id, element, options.duration || 500);
  }

  /**
   * Create DOM element with styles
   */
  private createElement(tag: string, styles: Record<string, string>): HTMLDivElement {
    const element = document.createElement(tag) as HTMLDivElement;
    Object.assign(element.style, styles);
    return element;
  }

  /**
   * Add effect to container
   */
  private addEffect(id: string, element: HTMLElement, duration: number): void {
    if (this.container) {
      this.container.appendChild(element);
      setTimeout(() => {
        element.remove();
        this.activeEffects.delete(id);
      }, duration);
    }
  }

  /**
   * Create particle animation keyframes
   */
  private createParticleKeyframes(
    index: number,
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ): void {
    const keyframeName = `vfx-particle-${index}`;
    const styleSheet = document.styleSheets[0];
    
    const keyframes = `
      @keyframes ${keyframeName} {
        0% {
          left: ${startX}%;
          top: ${startY}%;
          opacity: 1;
          transform: scale(1);
        }
        100% {
          left: ${endX}%;
          top: ${endY}%;
          opacity: 0;
          transform: scale(0.5);
        }
      }
    `;

    try {
      styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    } catch (err) {
      // Ignore if rule already exists
    }
  }

  /**
   * Clear all active effects
   */
  clearAll(): void {
    if (this.container) {
      this.container.innerHTML = '';
    }
    this.activeEffects.clear();
  }
}

// Add CSS animations
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes vfx-ballPot {
      0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.8; }
      100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
    }

    @keyframes vfx-victory {
      0% { transform: translate(-50%, -50%) scale(0) rotate(-180deg); opacity: 0; }
      50% { transform: translate(-50%, -50%) scale(1.2) rotate(10deg); opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
    }

    @keyframes vfx-defeat {
      0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
    }

    @keyframes vfx-coinFloat {
      0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
      50% { transform: translate(-50%, -100px) scale(1.2); opacity: 1; }
      100% { transform: translate(-50%, -150px) scale(0.8); opacity: 0; }
    }

    @keyframes vfx-pulse {
      0% { transform: translate(-50%, -50%) scale(0); opacity: 0.8; }
      100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
    }
  `;
  
  if (document.head) {
    document.head.appendChild(style);
  } else {
    window.addEventListener('DOMContentLoaded', () => {
      document.head.appendChild(style);
    });
  }
}

// Singleton instance
export const vfxManager = new VFXManager();
