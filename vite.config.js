import { sveltekit } from '@sveltejs/kit/vite';
import { websocketServer } from './websocketPluginVite.js';

import { defineConfig } from 'vite';

export default defineConfig({
	//plugins: [sveltekit(), websocketServer],
	plugins: [sveltekit()],
	server: {
		port: 5173,
		hmr: {
		  clientPort: 5111,
		},
	  },
});
