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
					type: 'module'
				},
				content: `
					import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
					import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";

					// TODO: Add SDKs for Firebase products that you want to use
					// https://firebase.google.com/docs/web/setup#available-libraries

					// Your web app's Firebase configuration
					// For Firebase JS SDK v7.20.0 and later, measurementId is optional
					const firebaseConfig = {
						apiKey: "AIzaSyCdygrvuIBhTJmhAXF6iqeq6-0xpQOHJ14",
						authDomain: "xeroq-app.firebaseapp.com",
						projectId: "xeroq-app",
						storageBucket: "xeroq-app.firebasestorage.app",
						messagingSenderId: "624845905718",
						appId: "1:624845905718:web:e3b2bebbe13a10a88c1d97",
						measurementId: "G-TJ01BSN9NX"
					};

					// Initialize Firebase
					const app = initializeApp(firebaseConfig);
					const analytics = getAnalytics(app);
				`
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
