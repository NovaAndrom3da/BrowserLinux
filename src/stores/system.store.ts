import { writable } from 'svelte/store';

export const systemNeedsUpdate = writable(false);
export const autohideDock = writable(false);