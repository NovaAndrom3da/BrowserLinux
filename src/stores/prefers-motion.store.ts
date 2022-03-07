import { writable } from 'svelte-local-storage-store';

export const prefersReducedMotion = writable(
  'bl:is-reduced-motion',
  matchMedia('(prefers-reduced-motion)').matches,
);
