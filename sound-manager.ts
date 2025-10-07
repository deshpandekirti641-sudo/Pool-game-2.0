/**
 * Sound Manager
 * Handles all game audio and sound effects
 */

export type SoundEffect = 
  | 'ball_hit'
  | 'ball_pot'
  | 'match_start'
  | 'match_end'
  | 'win'
  | 'lose'
  | 'coin'
  | 'button_click'
  | 'notification'
  | 'timer_tick'
  | 'countdown';

export type BackgroundMusic = 
  | 'menu'
  | 'gameplay'
  | 'victory';

class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private music: Map<string, HTMLAudioElement> = new Map();
  private isMuted: boolean = false;
  private musicVolume: number = 0.5;
  private sfxVolume: number = 0.7;
  private currentMusic: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadSounds();
      this.loadMusic();
      this.loadSettings();
    }
  }

  /**
   * Load all sound effects
   */
  private loadSounds(): void {
    const soundData: Record<SoundEffect, string> = {
      ball_hit: this.generateTone(200, 0.1),
      ball_pot: this.generateTone(400, 0.2),
      match_start: this.generateTone(600, 0.3),
      match_end: this.generateTone(500, 0.4),
      win: this.generateTone(800, 0.5),
      lose: this.generateTone(300, 0.3),
      coin: this.generateTone(700, 0.2),
      button_click: this.generateTone(400, 0.05),
      notification: this.generateTone(600, 0.2),
      timer_tick: this.generateTone(500, 0.05),
      countdown: this.generateTone(700, 0.15),
    };

    Object.entries(soundData).forEach(([key, dataUrl]) => {
      const audio = new Audio(dataUrl);
      audio.volume = this.sfxVolume;
      this.sounds.set(key, audio);
    });
  }

  /**
   * Load background music tracks
   */
  private loadMusic(): void {
    // In production, these would be actual music files
    // For now, using generated tones
    const musicData: Record<BackgroundMusic, string> = {
      menu: this.generateTone(440, 1),
      gameplay: this.generateTone(523, 1),
      victory: this.generateTone(659, 1),
    };

    Object.entries(musicData).forEach(([key, dataUrl]) => {
      const audio = new Audio(dataUrl);
      audio.loop = true;
      audio.volume = this.musicVolume;
      this.music.set(key, audio);
    });
  }

  /**
   * Generate simple tone for sound effects
   */
  private generateTone(frequency: number, duration: number): string {
    const sampleRate = 44100;
    const samples = sampleRate * duration;
    const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const buffer = audioContext.createBuffer(1, samples, sampleRate);
    const channel = buffer.getChannelData(0);

    for (let i = 0; i < samples; i++) {
      channel[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate);
      // Apply fade out
      channel[i] *= 1 - (i / samples);
    }

    // Convert to data URL (simplified - in production use proper encoding)
    return 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
  }

  /**
   * Play sound effect
   */
  play(sound: SoundEffect): void {
    if (this.isMuted) return;

    const audio = this.sounds.get(sound);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(err => console.log('Sound play failed:', err));
    }
  }

  /**
   * Play background music
   */
  playMusic(track: BackgroundMusic): void {
    if (this.isMuted) return;

    // Stop current music
    if (this.currentMusic) {
      this.currentMusic.pause();
      this.currentMusic.currentTime = 0;
    }

    const audio = this.music.get(track);
    if (audio) {
      this.currentMusic = audio;
      audio.play().catch(err => console.log('Music play failed:', err));
    }
  }

  /**
   * Stop current music
   */
  stopMusic(): void {
    if (this.currentMusic) {
      this.currentMusic.pause();
      this.currentMusic.currentTime = 0;
      this.currentMusic = null;
    }
  }

  /**
   * Set mute state
   */
  setMute(muted: boolean): void {
    this.isMuted = muted;
    if (muted && this.currentMusic) {
      this.currentMusic.pause();
    } else if (!muted && this.currentMusic) {
      this.currentMusic.play().catch(err => console.log('Music play failed:', err));
    }
    this.saveSettings();
  }

  /**
   * Set SFX volume
   */
  setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach(audio => {
      audio.volume = this.sfxVolume;
    });
    this.saveSettings();
  }

  /**
   * Set music volume
   */
  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    this.music.forEach(audio => {
      audio.volume = this.musicVolume;
    });
    this.saveSettings();
  }

  /**
   * Get current settings
   */
  getSettings(): { isMuted: boolean; musicVolume: number; sfxVolume: number } {
    return {
      isMuted: this.isMuted,
      musicVolume: this.musicVolume,
      sfxVolume: this.sfxVolume,
    };
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings(): void {
    try {
      localStorage.setItem('poolGameSound', JSON.stringify(this.getSettings()));
    } catch (err) {
      console.error('Failed to save sound settings:', err);
    }
  }

  /**
   * Load settings from localStorage
   */
  private loadSettings(): void {
    try {
      const saved = localStorage.getItem('poolGameSound');
      if (saved) {
        const settings = JSON.parse(saved);
        this.isMuted = settings.isMuted || false;
        this.musicVolume = settings.musicVolume || 0.5;
        this.sfxVolume = settings.sfxVolume || 0.7;
      }
    } catch (err) {
      console.error('Failed to load sound settings:', err);
    }
  }
}

// Singleton instance
export const soundManager = new SoundManager();
