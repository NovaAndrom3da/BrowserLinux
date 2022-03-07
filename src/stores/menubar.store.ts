import { writable } from 'svelte/store';
import { writable as localWritable } from 'svelte-local-storage-store';
import { filesMenuConfig } from '🍎/configs/menu/files.menu.config';

const menuConfigs = { files: filesMenuConfig };

export const menuBarMenus = writable(
  // Uncomment when all apps get their own menus
  //(get) => menuConfigs[get(activeAppStore) as keyof typeof menuConfigs],
  menuConfigs.files,
);

export const activeMenu = writable('');

