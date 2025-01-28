/* Moodle response interpretations */
type actionObj = { onClick: () => void; text?: string; link?: string }; // usable for ResponseNotice component
export interface MoodleSignInSignUpResponse {
	response:
		| string
		| { data: { statusText: string; statusCode?: string; raw: string } }
		| { success: boolean; warnings?: { item: string; itemid: number; message: string; warningcode: string }[] };
	action?: () => void | actionObj;
}

export type ACCOUNT =
	| {
			userid: string;
			username: string;
			firstname: string;
			lastname?: string;
			fullname: Date;
			email: string;
			userpictureurl?: string;
			status: boolean;
			uuid: string;
	  }
	| { status: boolean };
