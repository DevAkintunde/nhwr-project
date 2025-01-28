import Joi from "joi";

// under construction
const validatorHandler = async (fields: object | string, schema: Joi.ObjectSchema<unknown>) => {
	const { error } = schema.validate(fields, {
		errors: { label: "key" },
	});

	if (error) {
		//ctx.status = 406;
		//ctx.message = error.details[0].message.replace("/[^a-zA-Z0-9 ]/g", "");
		return;
	}
	return true;
};

export const formValidator = (field: string | object) => {
	const schema = Joi.object().keys({
		title: Joi.string().trim().min(3).max(250).required(),
		featuredImage: Joi.any().allow(null, Joi.string().trim().allow("")),
		summary: Joi.string().trim(),
		body: Joi.any(),
		status: Joi.string().trim(),
		revisionNote: Joi.string().trim(),
		uuid: Joi.string().guid({ version: ["uuidv4"] }),
		//UUID is mere placeholder during creation but needed during entity update.
	});
	return validatorHandler(field, schema);
};
