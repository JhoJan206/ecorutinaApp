import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ecorutina.app',
  appName: 'EcoRutina',
  webDir: 'dist',
  server: {
    cleartext: false
  }
};

export default config;
