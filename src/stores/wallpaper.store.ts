import { writable } from 'svelte-local-storage-store';
import type { WallpaperID } from '🍎/configs/wallpapers/wallpaper.config';

type WallpaperSettings = {
  id: WallpaperID;
  image: string;
};

export const wallpaper = writable<WallpaperSettings>('macos:wallpaper-settings', {
  image: '0',
  id: '0',
});
