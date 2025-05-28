import * as fs from "node:fs";
import * as path from "node:path";
import type { Translations } from "../../types/src/i18n-types.js";

// Using require for cheerio to work around module resolution issues
const cheerio = require("cheerio");

export function translateLocale(fileContent: string, lang: string): string {
	if (!lang) return fileContent;

	// get translation data
	const localePath = path.join(__dirname, `locale-${lang}.json`);
	const translations: Translations = JSON.parse(
		fs.readFileSync(localePath, "utf-8"),
	);

	// load file into Cheerio
	const $ = cheerio.load(fileContent);

	const types: Array<keyof Translations> = ["n", "v", "adj"];

	types.forEach((type) => {
		$(type).each((index: number, tag: Element) => {
			const word = $(tag).text().toLowerCase();
			const translation = translations[type][word];
			if (!translation) {
				console.log("Didn't find translation for", type, word);
				return;
			}
			const span = `<span class='superscript'>${translation}</span>`;
			$(tag).prepend(span);
		});
	});
	return $.html();
}
