import { writable } from 'svelte/store';
import type { appsConfig } from '🍎/configs/apps/apps-config';

export type AppID = keyof typeof appsConfig;

/** Which apps are currently open */
export const openApps = writable<Record<AppID, boolean>>({
  files: false,
  calendar: false,
  browser: false,
  terminal: false,
  settings: false,
});

/** Which app is currently focused */
export const activeApp = writable<AppID>('files');

/**
 * Maximum zIndex for the active app
 * Initialize with -2, so that it becomes 0 when initialised
 */
export const activeAppZIndex = writable(-2);

export const appZIndices = writable<Record<AppID, number>>({
  files: 0,
  calendar: 0,
  settings: 0,
  browser: 0,
  terminal: 0,
});

export const isAppBeingDragged = writable(false);

export const appsInFullscreen = writable<Record<AppID, boolean>>({
  files: false,
  calendar: false,
  browser: false,
  terminal: false,
  settings: false,
});
