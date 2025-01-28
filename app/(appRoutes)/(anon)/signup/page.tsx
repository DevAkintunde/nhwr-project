
import { serverHandler } from "@/app/lib/handlers/serverHandler";
import SignUpSignInForm from "@/app/ui/forms/SignUpSignInForm";

export default async function SignUp() {
	const availableFields = [
		{ name: "firstname", label: "Your Name", required: true },
		{ name: "lastname", label: "Name", mirror: true, defaultValue: "-" },
		{ label: "Email", name: "email", mirrorTo: "username", required: true },
		{ label: "username", name: "Username", mirror: true },
		{ label: "Password", name: "password", required: true, type: "password" },
	];
	/* Lets get the data structure as provided by Moodle and send to client. Currently not in use
	const importFormData = await ServerHandler({ endpoint: "signup.get" }).then((res) => {
		console.log("Server data: ", res);
		return res;
	});
	*/

	return (
		<SignUpSignInForm
			formType="signUp"
			serverHandler={serverHandler}
			formData={availableFields}
		/>
	);
}
