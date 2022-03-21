import { createPinnedFolder } from '🍎/helpers/pinned-folder';

var extfolders = {};

const applications = createPinnedFolder({
  title: "Applications",
  directory: "/usr/bin",
  icon: "folder-adwaita-applications.svg",
});

const desktop = createPinnedFolder({
  title: "Desktop",
  directory: "/home/user/Desktop",
  icon: "user-adwaita-desktop.svg",
});

const documents = createPinnedFolder({
  title: "Documents",
  directory: "/home/user/Documents",
  icon: "folder-adwaita-documents.svg",
});

const downloads = createPinnedFolder({
  title: "Downloads",
  directory: "/home/user/Downloads",
  icon: "folder-adwaita-download.svg",
});

export const pinnedFolders = {
  applications,
  desktop,
  documents,
  downloads,
  ...extfolders,
};

export function addFolder(id, config) {
  extfolders[id] = config;
}

export function removeFolder(id) {
  delete(extfolders[id]);
}