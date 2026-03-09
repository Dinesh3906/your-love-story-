import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dinesh.yourlovestory',
  appName: 'Your Love Story',
  webDir: 'dist',
  plugins: {
    AdMob: {
      androidAppId: 'ca-app-pub-9130663095400561~4336021674',
    },
  },
};

export default config;
