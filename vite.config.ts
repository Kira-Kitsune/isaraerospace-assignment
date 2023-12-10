import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api/status': {
                target: 'https://webfrontendassignment-isaraerospace.azurewebsites.net/api/SpectrumStatus',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/status/, ''),
            },
            '/api/act': {
                target: 'https://webfrontendassignment-isaraerospace.azurewebsites.net/api/ActOnSpectrum',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/act/, ''),
            },
        },
    },
});
