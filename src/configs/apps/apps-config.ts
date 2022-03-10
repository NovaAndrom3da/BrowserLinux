import { createAppConfig } from '🍎/helpers/create-app-config';

var extapps = {};

const vscode = createAppConfig({
  title: 'VSCode',
  resizable: true,

  height: 600,
  width: 800,

  icon: '../../vscode/1024.png',
});

const files = createAppConfig({
  title: 'Files',
  resizable: true,
  dockBreaksBefore: true,
  icon: 'dde-file-manager.svg',
  
});

const settings = createAppConfig({
  title: 'Settings',
  resizable: true,
  icon: 'preferences-desktop.svg',
});

const terminal = createAppConfig({
  title: 'Terminal',
  resiable: true,
  height: 600,
  width: 800,
  icon: 'utilities-x-terminal.svg',
});

export const appsConfig = {
  vscode,
  files,
  terminal,
  settings,
  ...extapps,
};

export function addApp(id, config) {
  extapps[id] = config;
}