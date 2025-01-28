import { serverHandler } from "@/app/lib/handlers/serverHandler";
import { saveToken } from "@/app/lib/handlers/sessionManager";
import SignUpSignInForm from "@/app/ui/forms/SignUpSignInForm";

export default async function SignIn() {
	const availableFields = [
		{ label: "Email", name: "email", mirrorTo: "username", required: true, disableSendingToServer: true },
		{ label: "username", name: "Username", mirror: true },
		{ label: "Password", name: "password", required: true, type: "password" },
	];

	return (
		<SignUpSignInForm
			formType="signIn"
			serverHandler={serverHandler}
			formData={availableFields}
			saveToken={saveToken} //pass to client to save token on sign in
		/>
	);
}
