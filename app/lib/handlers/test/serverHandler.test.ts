import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { endpointRewriter, serverHandler } from "../serverHandler";

test("Server call endpoint test, with disableEndpointRewrite", async () => {
	//render(<Page />)
	expect(
		await serverHandler({
			disableEndpointRewrite: true,
			endpoint: "core_course_get_courses",
			serviceEndpoint: "/webservice/rest/server.php",
			requireShortName: false, //body: ""
		}).then((res) => {
			console.log(res);
		})
	).toMatchObject({});
});
/* test("Server call endpoint test", async () => {
	//render(<Page />)
	expect(
		await ServerHandler({
			endpoint: "page",
			serviceEndpoint: "/webservice/rest/server.php",
			requireShortName: false, //body: ""
		}).then((res) => {
			console.log(res);
		})
	).toMatchObject({});
}); */

// http://4.180.140.62/moodle/webservice/rest/server.php?wsfunction=core_course_get_contents&moodlewsrestformat=json&wstoken=9aceecb4e2dc1ec5c18911c7fa2ad939&courseid=1&options[0][name]=modname&options[0][value]=folder
/* test("Get collaboration images", async () => {
	//render(<Page />)
	expect(
		await ServerHandler({
			endpoint: "core_course_get_contents",
			//serviceEndpoint: "/webservice/rest/server.php",
			//requireShortName: false,
			body: { courseid: "1", ["options[0][name]"]: "modname", ["options[0][value]"]: "folder" },
		}).then((res) => {
			console.log(res);
			//console.log(res[0]["modules"][0]["contents"]);
		})
	).toMatchObject({});
}); */

test("Check if endpointRewriter works as expected inside Serverhandler", () => {
	expect(endpointRewriter("signup.get")).toEqual("auth_email_get_signup_settings");
});
