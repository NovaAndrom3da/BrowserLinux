const blMenu = {
  title: 'Menu',
  menu: {
    'about-browserlinux': {
      title: 'About BrowserLinux',
      breakAfter: true,
    },
    'settings': {
      title: 'Settings',
    },
    'terminal': {
      title: 'Terminal',
      breakAfter: true,
    },
    'force-quit': {
      title: 'Close',
      breakAfter: true,
    },
    restart: {
      title: 'Reload',
      
    },
  },
};

export const createMenuConfig = <T extends {}>(et: T) => ({ browserlinux: blMenu, ...et });

