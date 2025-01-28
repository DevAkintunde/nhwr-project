/**
 * @description IS used to split up joined strings (joined with '.') into typeof object key depth. That is key values pais in inner/greater depth can easily be import in this function with the object and the equivalent value of the innermost depth would be returned
 * @param {string} keyAtDepth
 * @param {object} containerObj
 * @returns {string|object}
 */
export const objectifyStringedKeys = ({ keyAtDepth, containerObj }: { keyAtDepth: string; containerObj: object }): string | object => {
	const key = keyAtDepth.includes(".") ? keyAtDepth.split(".") : keyAtDepth;
	let output = "";
	const depthGetter = (value: string | object) => {
		if (typeof value === "string") output = value;
		else if (value && Object.keys(value).length === 1) {
			//when a single object key exist
			output = Object.values(value)[0];
		} else {
			//objects with more than a single object key must be a nested array concatenated as string, else return error
			new Error("Improperly configured keyAtDepth");
		}
	};
	if (typeof key === "string") {
		const value = containerObj[key as keyof typeof containerObj];
		depthGetter(value);
	} else {
		let depth: string | object = "";
		key.forEach((k, i) => {
			if (i === 0) depth = containerObj[k as keyof typeof containerObj];
			else if (typeof depth === "object") {
				depth = depth[key[i] as keyof typeof depth];
			}
		});
		depthGetter(depth);
	}
	//console.log("output", output);
	return output;
};
