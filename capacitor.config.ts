import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dinesh.yourlovestory',
  appName: 'Your Love Story',
  webDir: 'dist',
  plugins: {
    AdMob: {
      androidAppId: 'ca-app-pub-5173875521561209~8510041529',
    },
  },
};

export default config;
