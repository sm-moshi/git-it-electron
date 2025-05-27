//
// This file builds out the challenge web pages. A simple static site
// generator. It uses `partials` and `layouts`.
//

import * as fs from "node:fs";
import * as path from "node:path";
import * as glob from "glob";
import * as Handlebars from "handlebars";
import {
	getAvaiableLocales,
	getLocaleBuiltPath,
	getLocaleResourcesPath,
	getLocaleMenu,
	getFallbackLocale,
} from "../packages/i18n/src/getLocale";
// TODO: Update this import when translate-locale is migrated to TS
// import translateLocale from "../packages/i18n/src/translate-locale";

const layout = fs
	.readFileSync(
		path.normalize(path.join(__dirname, "../resources/layouts/challenge.hbs")),
	)
	.toString();
let files: string[] = [];

// Take in a language type if any
const langs = getAvaiableLocales();
let input = "";
let output = "";

// If built not exist, create one
try {
	fs.accessSync(path.join(getLocaleBuiltPath(langs[0]), ".."));
} catch (e) {
	fs.mkdirSync(path.join(getLocaleBuiltPath(langs[0]), ".."));
}

for (const lang of langs) {
	// If locale folder not exist, create one.
	try {
		fs.accessSync(getLocaleBuiltPath(lang));
	} catch (e) {
		fs.mkdirSync(getLocaleBuiltPath(lang));
	}
	input = path.join(getLocaleResourcesPath(lang), "challenges");
	output = path.join(getLocaleBuiltPath(lang), "challenges");
	try {
		fs.accessSync(output);
	} catch (e) {
		fs.mkdirSync(output);
	}
	files = glob.sync("*.html", { cwd: input });
	buildChallenges(files, lang);
}

interface ChallengeContent {
	header: string;
	sidebar: string;
	footer: string;
	body: string;
	shortname: string;
}

function buildChallenges(files: string[], lang: string): void {
	for (const file of files) {
		if (!file || !lang) return;

		const shortname = makeShortname(file).replace(".", "");
		const content: ChallengeContent = {
			header: buildHeader(file, lang),
			sidebar: buildSidebar(file, lang),
			footer: buildFooter(file, lang),
			body: buildBody(file, lang),
			shortname,
		};

		// TODO: Uncomment and fix when translateLocale is migrated
		// if (lang && lang !== "en-US") {
		// 	content.body = translateLocale(content.body, lang);
		// }

		const template = Handlebars.compile(layout);
		const final = template(content);
		fs.writeFileSync(path.join(output, `${shortname}.html`), final);
	}
	console.log(`Built ${lang} challenges!`);
}

function makeShortname(filename: string): string {
	// TODO: BEFORE guide/challenge-content/10_merge_tada.html
	// TODO: AFTER  merge_tada
	const parts = filename.split("/");
	const last = parts.length > 0 ? parts[parts.length - 1] : "";
	return last
		.split("_")
		.slice(1)
		.join("_")
		.replace("html", "");
}

function makeTitleName(filename: string, lang: string): string {
	const short = makeShortname(filename).split("_").join(" ").replace(".", "");
	return grammarize(short, lang);
}

function makeTitle(title: string, lang: string): string {
	const short = title.split("_").join(" ").replace(".", "");
	return grammarize(short, lang);
}

function buildHeader(filename: string, lang: string): string {
	const parts = filename.split("/");
	const last = parts.length > 0 ? parts[parts.length - 1] : "";
	const num = last.split("_")[0];
	const data = getPrevious(num, lang);
	const title = makeTitleName(filename, lang);
	const source = fs
		.readFileSync(getPartial("chal-header", lang))
		.toString()
		.trim();
	const template = Handlebars.compile(source);
	const content = {
		challengetitle: title,
		challengenumber: num,
		localemenu: new Handlebars.SafeString(getLocaleMenu(lang)),
		lang: lang,
		preurl: data.preurl,
		nexturl: data.nexturl,
	};
	return template(content);
}

function buildSidebar(filename: string, lang: string): string {
	const currentTitle = makeTitleName(filename, lang);
	const emptyData = require("../empty-data.json");
	const challenges = Object.keys(emptyData).map((title) => {
		const currentChallenge = currentTitle === makeTitle(title, lang);
		return [title, makeTitle(title, lang), currentChallenge];
	});
	const parts = filename.split("/");
	const last = parts.length > 0 ? parts[parts.length - 1] : "";
	const num = last.split("_")[0];
	const data = getPrevious(num, lang);
	const source = fs
		.readFileSync(getPartial("chal-sidebar", lang))
		.toString()
		.trim();
	const template = Handlebars.compile(source);
	const content = {
		challenges: challenges,
		challengetitle: currentTitle,
		challengenumber: num,
		lang: lang,
		preurl: data.preurl,
		nexturl: data.nexturl,
	};
	return template(content);
}

function grammarize(name: string, _lang: string): string {
	let correct = name;
	const wrongWords = ["arent", "githubbin", "its"];
	const rightWords = ["aren't", "GitHubbin", "it's"];

	wrongWords.forEach((word, i) => {
		if (name.match(word)) {
			correct = name.replace(word, rightWords[i]);
		}
	});
	return correct;
}

interface PreviousData {
	prename: string;
	preurl: string;
	nextname: string;
	nexturl: string;
	lang?: string;
}

function buildFooter(file: string, lang: string): string {
	const parts = file.split("/");
	const last = parts.length > 0 ? parts[parts.length - 1] : "";
	const num = last.split("_")[0];
	const data: PreviousData = getPrevious(num, lang);
	data.lang = lang;
	const source = fs
		.readFileSync(getPartial("chal-footer", lang))
		.toString()
		.trim();
	const template = Handlebars.compile(source);
	return template(data);
}

function buildBody(file: string, lang: string): string {
	const source = fs.readFileSync(path.join(input, file)).toString();
	const template = Handlebars.compile(source);

	const content = {
		verify_button: fs
			.readFileSync(getPartial("verify-button", lang))
			.toString()
			.trim(),
		verify_directory_button: fs
			.readFileSync(getPartial("verify-directory-button", lang))
			.toString()
			.trim(),
	};

	return template(content);
}

function getPrevious(num: string, lang: string): PreviousData {
	const pre = Number.parseInt(num, 10) - 1;
	const next = Number.parseInt(num, 10) + 1;
	let preurl = "";
	let prename = "";
	let nexturl = "";
	let nextname = "";
	for (const file of files) {
		const regexPre = `(^|[^0-9])${pre}([^0-9]|$)`;
		const regexNext = `(^|[^0-9])${next}([^0-9]|$)`;
		if (pre === 0) {
			prename = "All Challenges";
			preurl = path.join("../", "pages", "index.html");
		} else if (file.match(regexPre)) {
			prename = makeTitleName(file, lang);
			const getridof = `${pre}_`;
			preurl = file.replace(getridof, "");
		}
		if (next === 12) {
			nextname = "Done!";
			nexturl = path.join("../", "pages", "index.html");
		} else if (file.match(regexNext)) {
			nextname = makeTitleName(file, lang);
			const getridof = `${next}_`;
			nexturl = file.replace(getridof, "");
		}
	}
	return {
		prename: prename,
		preurl: preurl,
		nextname: nextname,
		nexturl: nexturl,
	};
}

function getPartial(filename: string, lang: string): string {
	try {
		const pos = path.join(
			getLocaleResourcesPath(lang),
			`partials/${filename}.html`,
		);
		fs.statSync(pos);
		return pos;
	} catch (e) {
		return path.join(
			getLocaleResourcesPath(getFallbackLocale()),
			`partials/${filename}.html`,
		);
	}
}
