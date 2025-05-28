//
// This file builds out the general web pages (like the about page). A simple
// static site generator. It uses `partials` and `layouts`.
//

import * as fs from "node:fs";
import * as path from "node:path";
import * as Handlebars from "handlebars";
import {
	getAvaiableLocales,
	getFallbackLocale,
	getLocaleBuiltPath,
	getLocaleMenu,
	getLocaleResourcesPath,
} from "../packages/i18n/src/getLocale.js";

const langs = getAvaiableLocales();

const layout = fs
	.readFileSync(
		path.normalize(
			path.join(__dirname, "..", "resources", "layouts", "page.hbs"),
		),
	)
	.toString();
let input = "";
let output = "";

for (const lang of langs) {
	input = path.join(getLocaleResourcesPath(lang), "pages");
	output = path.join(getLocaleBuiltPath(lang), "pages");

	// If folder not exist, create it
	try {
		fs.accessSync(output);
	} catch {
		// Exception intentionally ignored: directory doesn't exist, create it
		fs.mkdirSync(output);
	}
	const pageFiles = fs.readdirSync(input);
	buildPages(pageFiles, lang);
}

function buildPages(files: string[], lang: string): void {
	for (const file of files) {
		if (!/html/.exec(file)) return;
		let final = "";
		if (file === "index.html") {
			final = buildIndex(file, lang);
		} else {
			const content = {
				header: buildHeader(file, lang),
				footer: buildFooter(file, lang),
				body: fs.readFileSync(path.join(input, file)).toString(),
			};
			const template = Handlebars.compile(layout);
			final = template(content);
		}
		fs.writeFileSync(path.join(output, file), final);
	}
	console.log(`Built ${lang} pages!`);
}

function buildFooter(_filename: string, lang: string): string {
	const source = fs.readFileSync(getPartial("footer", lang)).toString();
	const template = Handlebars.compile(source);
	return template({});
}

function buildHeader(filename: string, lang: string): string {
	const source = fs.readFileSync(getPartial("header", lang)).toString();
	const template = Handlebars.compile(source);
	const contents = {
		pageTitle: filename.replace(/.html/, ""),
		localemenu: new Handlebars.SafeString(getLocaleMenu(lang)),
		lang: lang,
	};
	return template(contents);
}

function buildIndex(file: string, lang: string): string {
	const source = fs.readFileSync(path.join(input, file)).toString();
	const template = Handlebars.compile(source);
	const content = {
		localemenu: new Handlebars.SafeString(getLocaleMenu(lang)),
	};
	return template(content);
}

function getPartial(filename: string, lang: string): string {
	try {
		const pos = path.join(
			getLocaleResourcesPath(lang),
			`partials/${filename}.html`,
		);
		fs.statSync(pos);
		return pos;
	} catch {
		// Exception intentionally ignored: file doesn't exist for this locale,
		// fall back to default locale
		return path.join(
			getLocaleResourcesPath(getFallbackLocale()),
			`partials/${filename}.html`,
		);
	}
}
