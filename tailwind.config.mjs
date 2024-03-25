/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	safelist: [
		'bg-light-grey',
		'bg-light-red',
		'bg-light-pink',
		'bg-light-purple',
		'bg-light-blue',
		'bg-light-green',
		'bg-light-yellow',
		'bg-light-orange',
		'bg-dark-grey',
		'bg-dark-red',
		'bg-dark-pink',
		'bg-dark-purple',
		'bg-dark-blue',
		'bg-dark-green',
		'bg-dark-yellow',
		'bg-dark-orange',
		'text-light-grey',
		'text-light-red',
		'text-light-pink',
		'text-light-purple',
		'text-light-blue',
		'text-light-green',
		'text-light-yellow',
		'text-light-orange',
		'fill-light-grey',
		'fill-light-red',
		'fill-light-pink',
		'fill-light-purple',
		'fill-light-blue',
		'fill-light-green',
		'fill-light-yellow',
		'fill-light-orange',
		'border-dark-grey',
		'border-dark-red',
		'border-dark-pink',
		'border-dark-purple',
		'border-dark-blue',
		'border-dark-green',
		'border-dark-yellow',
		'border-dark-orange',
		'hover:after:text-light-grey',
		'hover:after:text-light-red',
		'hover:after:text-light-pink',
		'hover:after:text-light-purple',
		'hover:after:text-light-blue',
		'hover:after:text-light-green',
		'hover:after:text-light-yellow',
		'hover:after:text-light-orange'
	],
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
;('bg-dark-')
