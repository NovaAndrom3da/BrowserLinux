import { createAppConfig } from '🍎/helpers/create-app-config';

/*const wallpaper = createAppConfig({
  title: 'Wallpapers',
  resizable: true,
  height: 600,
  width: 800
});*/

const vscode = createAppConfig({
  title: 'VSCode',
  resizable: true,

  height: 600,
  width: 800,
});

const files = createAppConfig({
  title: 'Files',
  resizable: true,

  dockBreaksBefore: true,
});

const safari = createAppConfig({
  title: 'Safari',
  resizable: true,
});

const settings = createAppConfig({
  title: 'Settings',
  resizable: true,
});

const terminal = createAppConfig({
  title: 'Terminal',
  resiable: true,
  height: 600,
  width: 800,
});

export const appsConfig = {
  vscode,
  files,
  safari,
  terminal,
  settings,
};
