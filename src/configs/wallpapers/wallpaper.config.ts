import type { Theme } from '🍎/stores/theme.store';

export type Wallpaper = {
  name: string;
  type: 'standalone' | 'automatic' | 'dynamic';

  thumbnail: string;

  /** Timestamps definition in terms of when a new wallpaper should take effect */
  timestamps?: {
    wallpaper?: Record<number, string>;
    theme?: Record<number, Theme['scheme']>;
  };
};

const createWallpapersConfig = <TConfig>(et: Record<keyof TConfig, Wallpaper>) => et;

export const wallpapersConfig = createWallpapersConfig({
  '0': {
    name: '',
    type: 'standalone',
    thumbnail: '0',
  },
  '1': {
    name: '',
    type: 'standalone',
    thumbnail: '1',
  }
});

export type WallpaperID = keyof typeof wallpapersConfig;
