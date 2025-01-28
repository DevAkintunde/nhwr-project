import { serverHandler } from "@/app/lib/handlers/serverHandler";
import { redirect } from "next/navigation";
import Verifier from "./Verifier";

const Page = async () => {
	/* // Logic to determine if a redirect is needed
	const accessDenied = true;
	if (accessDenied) {
		redirect("/login");
	} */
	//sample: http://4.180.140.62/moodle/login/confirm.php?data=DTMPXZqcbcCuAEN/ebakintunde%40gmail%2Ecom
	/* const procoessVerifier = serverHandler({
		endpoint: 'verifyuser',
		body: formValues,
		requireShortName: false,
		serviceEndpoint: "/login/confirm.php",
	}).then((res) => {
		//console.log("signup get data client: ", res);
		// process token tosave in cookie for session management
		if (saveToken)
			if (res && res["status" as keyof typeof res] === 200 && res["data" as keyof typeof res] && res["data" as keyof typeof res]["token"]) {
				saveToken(res["data" as keyof typeof res]["token"]);
			}
		
	}); */
	return (
		<div className="mx-4">
			<Verifier serverHandler={serverHandler} />
		</div>
	);
};

export default Page;
