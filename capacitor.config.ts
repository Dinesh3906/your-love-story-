import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dinesh.yourlovestory',
  appName: 'Your Love Story',
  webDir: 'dist',
  plugins: {
    AdMob: {
      androidAppId: 'ca-app-pub-5173875521561209~9130663095',
    },
  },
};

export default config;
