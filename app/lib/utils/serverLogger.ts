// work on colorisation of log outputs
const colors = {
	error: "red",
	warn: "yellow",
	info: "green",
	http: "magenta",
	debug: "orange",
};

export const logger = {
	info: (title: string, log: unknown) => {
		console.log(`%c${title}`, `color: ${colors.info}`, log);
	},
	error: (title: string, log: unknown) => {
		console.error(`%c${title}`, `color: ${colors.error}`, log);
	},
	warn: (title: string, log: unknown) => {
		console.warn(`%c${title}`, `color: ${colors.warn}`, log);
	},
};
