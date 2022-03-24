type SingleThemeConfig = {
  hsl: string;
  contrastHsl: string;
};

const colorsConfig = <T extends string = string>(
  et: Record<T, { light: SingleThemeConfig; dark: SingleThemeConfig }>,
) => et;

export const colors = colorsConfig({
  red: {
    light: {
      hsl: '349deg, 100%, 59%',
      contrastHsl: '349deg, 100%, 95%',
    },
    dark: {
      hsl: '348deg, 100%, 61%',
      contrastHsl: '348deg, 100%, 5%',
    },
  },

  yellow: {
    light: {
      hsl: '65deg, 100%, 49%',
      contrastHsl: '65deg, 9%, 8%',
    },
    dark: {
      hsl: '65deg, 98%, 46%',
      contrastHsl: '65deg, 9%, 8%',
    },
  },
  
  orange: {
    light: {
      hsl: '35deg, 100%, 50%',
      contrastHsl: '240deg, 3%, 11%',
    },
    dark: {
      hsl: '36deg, 100%, 52%',
      contrastHsl: '240deg, 3%, 11%',
    },
  },

  green: {
    light: {
      hsl: '135deg, 59%, 49%',
      contrastHsl: '135deg, 60%, 4%',
    },
    dark: {
      hsl: '135deg, 64%, 50%',
      contrastHsl: '135deg, 60%, 4%',
    },
  },

  cyan: {
    light: {
      hsl: '199deg, 78%, 55%',
      contrastHsl: '199deg, 78%, 100%',
    },
    dark: {
      hsl: '197deg, 100%, 70%',
      contrastHsl: '197deg, 100%, 5%',
    },
  },

  blue: {
    light: {
      hsl: '211, 100%, 50%',
      contrastHsl: '240deg, 24%, 100%',
    },
    dark: {
      hsl: '210, 100%, 52%',
      contrastHsl: '210deg, 92%, 5%',
    },
  },

  purple: {
    light: {
      hsl: '282deg, 67%, 51%',
      contrastHsl: '282deg, 87%, 8%',
    },
    dark: {
      hsl: '282deg, 67%, 58%',
      contrastHsl: '282deg, 87%, 8%',
    },
  },

  pink: {
    light: {
      hsl: '280deg, 68%, 60%',
      contrastHsl: '280deg, 75%, 100%',
    },
    dark: {
      hsl: '280deg, 85%, 65%',
      contrastHsl: '280deg, 85%, 95%',
    },
  },
});
