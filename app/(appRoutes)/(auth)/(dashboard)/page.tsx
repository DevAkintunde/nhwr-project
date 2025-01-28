import { redirect } from "next/navigation";

const Page = async () => {
	// Logic to determine if a redirect is needed
	const accessDenied = true;
	if (accessDenied) {
		redirect("/login");
	}
	return <div>page</div>;
};

export default Page;
