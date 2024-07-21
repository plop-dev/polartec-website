import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
	server: {
		port: 3000,
	},
	output: 'hybrid',
	adapter: vercel({
		webAnalytics: { enabled: true },
	}),
});
