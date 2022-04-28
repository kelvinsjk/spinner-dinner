const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const postcssFor = require('postcss-for');

const config = {
	plugins: [
		//Some plugins, like tailwindcss/nesting, need to run before Tailwind,
		tailwindcss(),
		//But others, like autoprefixer, need to run after,
		autoprefixer,
		postcssFor,
	],
};

module.exports = config;
