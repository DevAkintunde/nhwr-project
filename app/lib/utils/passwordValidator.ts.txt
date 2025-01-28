import Joi from "joi";
import { joiPasswordExtendCore } from "joi-password";
const joiPassword = Joi.extend(joiPasswordExtendCore);

export const passwordValidator = (field: string) => {
	const schema = Joi.object().keys({
		/* password: joiPassword.string().minOfSpecialCharacters(1).minOfLowercase(1).minOfUppercase(1).minOfNumeric(1).noWhiteSpaces().required().messages({
			"password.minOfUppercase": "Password should contain at least 1 uppercase character",
			"password.minOfSpecialCharacters": "Password should contain at least 1 special character",
			"password.minOfLowercase": "Password should contain at least 1 lowercase character",
			"password.minOfNumeric": "Password should contain at least 1 numeric character",
			"password.noWhiteSpaces": "Password should not contain spaces",
		}), */
		password: joiPassword.string().minOfSpecialCharacters(1).minOfLowercase(1).minOfUppercase(1).minOfNumeric(1).length(7).required().messages({
			"password.minOfUppercase": "At least one uppercase character",
			"password.minOfSpecialCharacters": "At least one special character",
			"password.minOfLowercase": "At least one lowercase character",
			"password.minOfNumeric": "At least one number",
			"password.required": "You must choose a password",
			"string.length": "7+ characters",
		}),
	});
	const { error } = schema.validate(
		{ password: field },
		{
			errors: { label: "key" },
		}
	);

	if (error) return error.details[0].message.replace("/[^a-zA-Z0-9 ]/g", "");
	return true;
};
