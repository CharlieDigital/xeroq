import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://zeroq.chrslchn.dev',
	integrations: [
		starlight({
			title: 'Xeroq Docs',
			social: {
				github: 'https://github.com/CharlieDigital/xeroq',
			},
			head: [{
				tag: 'script',
				attrs: {
					src: '/analytics.js',
					defer: true
				}
			}],
			sidebar: [
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Example Guide', slug: 'guides/example' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
});
