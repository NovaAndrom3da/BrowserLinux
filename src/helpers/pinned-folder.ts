export type PinnedFolder = {
  title: string;
  directory: string;
  icon: string;
};

export const createPinnedFolder = (et: AppConfig) => ({
  title: "Folder",
  directory: "/",
  icon: "folder-adwaita.svg",
  
  ...et,
});
