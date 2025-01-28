"use server";
import { appJsonData } from "../../../../app.config";
import { logger } from "../utils/serverLogger";
import { promises as fs } from "fs";

/**
 * @description Read local json files by defined file location in app.config
 * @param endpoint
 * @returns { status: number, data?: object, statusText?: string }
 */
export const jsonHandler = async (endpoint: string): Promise<{ status: number; data?: object; statusText?: string }> => {
	try {
		const file = await fs.readFile(appJsonData(endpoint), "utf8");
		//logger.info("jsonHandler file: ", file);
		const data = JSON.parse(file);
		return { status: 200, data: data };
	} catch (error) {
		logger.error("jsonHandler error: ", error);
		return {
			status: 400,
			statusText: "Bad request. Unable to fetch file.",
		};
	}
};
