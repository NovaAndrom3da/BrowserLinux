import { Writable } from 'svelte/store';

declare function writable<T>(key: string, initialValue: T): Writable<T>;

export { writable };
