/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		screens: {
			sm: { max: 'calc(446rem/16)' },
			md: { max: 'calc(639rem/16)' },
			lg: { max: 'calc(864rem/16)' }
		},
		colors: {
			white: '#ffffff',
			'dark-grey': '#484648',
			'light-grey': '#9d9597',
			'dark-red': '#8c1930',
			'light-red': '#ff385c',
			'dark-pink': '#702054',
			'light-pink': '#c54097',
			'dark-purple': '#411d53',
			'light-purple': '#804aa6',
			'dark-blue': '#194653',
			'light-blue': '#2da1b8',
			'dark-green': '#27331d',
			'light-green': '#68925e',
			'dark-yellow': '#8a522b',
			'light-yellow': '#ff9b5e',
			'dark-orange': '#92361a',
			'light-orange': '#ff6c3e'
		},
		extend: {
			transitionDuration: {
				duration: '200ms'
			}
		}
	},
	plugins: []
}
