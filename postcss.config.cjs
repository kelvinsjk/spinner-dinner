const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const postcssFor = require("postcss-for");
const postcssTrig = require("postcss-simple-trig");

const config = {
	plugins: [
		//Some plugins, like tailwindcss/nesting, need to run before Tailwind,
		postcssFor,
		tailwindcss(),
		//But others, like autoprefixer, need to run after,
		autoprefixer,
		postcssTrig,
	],
};

module.exports = config;
