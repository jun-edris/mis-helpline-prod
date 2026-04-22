import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [
		react({
			include: '**/*.{js,jsx}',
		}),
	],
	resolve: {
		alias: {
			'@mui/styled-engine': '@mui/styled-engine-sc',
		},
	},
	server: {
		port: 3000,
	},
	build: {
		outDir: 'dist',
		sourcemap: false,
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ['react', 'react-dom', 'react-router-dom'],
					mui: ['@mui/material', '@mui/icons-material'],
				},
			},
		},
	},
});