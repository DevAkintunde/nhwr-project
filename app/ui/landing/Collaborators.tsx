"use client";
import Image from "next/image";
import { appConfig } from "../../../../app.config";

export const Collaborators = () => {
	/* // Earlier implimentation to fetch assets from backend server
	const collabs = await ServerHandler({
		endpoint: "core_course_get_contents",
		//serviceEndpoint: "/webservice/rest/server.php",
		//requireShortName: false,
		body: { courseid: "1", ["options[0][name]"]: "modname", ["options[0][value]"]: "folder" },
	}).then((res) => {
		//console.log(res);
		return //res[0]["modules"][0]["contents"];
	}); */

	const collabs = appConfig.homepageDataDrive.collaboratorLogos;

	//console.log("collabs", collabs);
	return (
		<section className="flex flex-grow flex-wrap tab:flex-nowrap tab:gap-8 overflow-x-auto tab:bg-[#F2FAFF] items-center rounded-3xl tab:p-4 pb-0">
			<div className="flex flex-col gap-0 text-2xl py-1 px-4 tab:p-0">
				<span className="text-color-pri font-bold">{"250+"}</span>
				<span className="text-color-link">Collaboration</span>
			</div>
			<div className="flex gap-6 bg-[#F2FAFF] p-3 tab:p-0 rounded-3xl tab:rounded-none overflow-x-scroll w-full">
				{collabs.map((collab, i) => {
					return (
						<Image
							key={collab + i}
							src={collab}
							alt={collab}
							width={100}
							height={100}
						/>
					);
				})}
			</div>
		</section>
	);
};
