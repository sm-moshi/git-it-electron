import * as fs from "node:fs";
import * as path from "node:path";
import * as cheerio from "cheerio";

interface Translations {
	n: Record<string, string>;
	v: Record<string, string>;
	adj: Record<string, string>;
}

export function translateLocale(fileContent: string, lang: string): string {
	if (!lang) return fileContent;

	// get translation data
	const localePath = path.join(__dirname, `locale-${lang}.json`);
	const translations: Translations = JSON.parse(fs.readFileSync(localePath, "utf-8"));

	// load file into Cheerio
	const $ = cheerio.load(fileContent);

	const types: Array<keyof Translations> = ["n", "v", "adj"];

	types.forEach((type) => {
		$(type).each((_i, tag) => {
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
