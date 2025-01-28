import { redirect } from "next/navigation";
import { serverHandler } from "@/app/lib/handlers/serverHandler";
import UserProfile from "@/app/ui/forms/UserProfile";
import { jsonHandler } from "@/app/lib/handlers/jsonHandler";

const Page = async () => {
	const titleOptions = (await jsonHandler("form.personalisedTitle")) as { status: number; data: string[] };
	const sexOption = (await jsonHandler("form.sex")) as { status: number; data: string[] };
	const occupationOption = (await jsonHandler("form.occupation")) as { status: number; data: string[] };
	const countriesOption = await jsonHandler("form.countries");
	let countries: { key: string; value: string }[] = [];
	if (countriesOption && countriesOption.status && countriesOption.data) {
		Object.keys(countriesOption.data).forEach((nation) => {
			const data = countriesOption["data" as keyof typeof countriesOption] as object;
			countries.push({ key: nation, value: data[nation as keyof typeof data]["name"] });
		});
	}

	const availableFields = [
		[
			{
				name: "title",
				label: "Title",
				required: true,
				type: "select",
				className: "w-fit tab:mr-2",
				options: titleOptions && titleOptions.status && titleOptions.data ? titleOptions.data : undefined,
			},
			{ name: "firstname", label: "First Name", required: true, className: "mt-7 tab:mt-0", placeholder: "Enter your first name" },
			{
				name: "lastname",
				label: "Last Name", //mirror: true
				className: "mt-7 tab:mt-0",
				required: true,
				placeholder: "Enter your last name",
			},
		],
		[
			[
				{
					name: "phone_number_pre",
					label: "Phone number",
					required: true,
					className: "w-[70%] tab:w-fit",
					type: "diallingCode",
					defaultValue: "+234",
				},
				{
					name: "phone_number",
					label: "",
					className: "mt-3 tab:mt-0 tab:w-fit",
					placeholder: "Enter your phone number",
					type: "tel",
					//defaultValue: "+234",
				},
				{
					name: "sex",
					label: "Sex",
					//defaultValue:'Female',
					required: true,
					type: "select",
					className: "w-fit mt-7 tab:mt-0 tab:ml-10",
					options: sexOption && sexOption.status && sexOption.data ? sexOption.data : undefined,
				},
			],
		],
		[
			{
				name: "occupation",
				label: "Occupation",
				className: "tab:mr-3 tab:w-full",
				required: true,
				type: "select",
				options: occupationOption && occupationOption.status && occupationOption.data ? occupationOption.data : undefined,
			},
			{ name: "dob", label: "Date of Birth", type: "date", required: true, className: "mt-7 tab:mt-0 tab:ml-3 tab:w-full" },
		],
		{ name: "address1", label: "Address line 1", className: "w-full", required: true },
		{ name: "address2", label: "Address line 2", className: "w-full" },
		[
			{ name: "state", label: "State/Province", className: "tab:mr-3", required: true },
			{ name: "city", label: "City/District", className: "mt-7 tab:mt-0 tab:ml-3", required: true },
		],
		[
			{ name: "postal_code", label: "Postal code", className: "tab:mr-3", required: true },
			{
				name: "country",
				label: "Country",
				className: "mt-7 tab:mt-0 tab:ml-3 tab:w-full",
				required: true,
				type: "select",
				options: countries,
			},
		],
		[{ name: "avatar", label: "Profile picture (Optional)", placeholder: "Upload your profile picture(<40MB)", className: "", disabled: true }],
	];
	/* 
	Lets get the data structure as provided by Moodle and send to client. Currently not in use
	const importFormData = await ServerHandler({ endpoint: "signup.get" }).then((res) => {
		console.log("Server data: ", res);
		return res;
	});
	*/

	return (
		<UserProfile
			serverHandler={serverHandler}
			formData={availableFields}
		/>
	);
};

export default Page;
