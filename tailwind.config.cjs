const forms = require("@tailwindcss/forms");
const daisyui = require("daisyui");

const config = {
	content: ["./src/**/*.{html,js,svelte,ts}"],

	theme: {
		extend: {},
	},

	plugins: [forms, daisyui],
};

module.exports = config;
