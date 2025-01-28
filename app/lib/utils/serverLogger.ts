// working on alternative colorisation
const colors = {
	error: "red",
	warn: "yellow",
	info: "green",
	http: "magenta",
	debug: "orange",
};

export const logger = {
	info: (title: string, log: any) => {
		console.log(`%c${title}`, `color: ${colors.info}`, log);
	},
	error: (title: string, log: any) => {
		console.error(`%c${title}`, `color: ${colors.error}`, log);
	},
	warn: (title: string, log: any) => {
		console.warn(`%c${title}`, `color: ${colors.warn}`, log);
	},
};
