import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // Prevents crash if API_KEY is undefined by defaulting to empty string
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    }
  };
});