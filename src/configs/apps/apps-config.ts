import { createAppConfig } from '🍎/helpers/create-app-config';

const vscode = createAppConfig({
  title: 'VSCode',
  resizable: true,

  height: 600,
  width: 800,
});

const files = createAppConfig({
  title: 'Files',
  resizable: true,
});

const browser = createAppConfig({
  title: 'Browser',
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
//  wallpapers,
  vscode,
  files,
  browser,
  terminal,
  settings,
};
