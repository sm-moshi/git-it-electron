import * as path from "node:path";

/**
 * available
 * All locale support in this app.
 * All available locale MUST have a folder with translated files in resources/contents.
 */
const available: Record<string, string> = {
	"en-US": "English",
	"ja-JP": "日本語",
	"zh-TW": "中文(臺灣)",
	"ko-KR": "한국어",
	"pt-BR": "Português Brasileiro",
	"uk-UA": "Українська",
	"es-CO": "Español (Colombia)",
	"es-ES": "Español (España)",
	"fr-FR": "Français",
};

/**
 * aliases
 * Locale in aliases MUST point to a locale existed in available.
 */
const aliases: Record<string, string> = {
	en: "en-US",
	ja: "ja-JP",
	zh: "zh-TW",
	kr: "ko-KR",
	br: "pt-BR",
	uk: "uk-UA",
	es: "es-ES",
	fr: "fr-FR",
};

/**
 * fallback
 * Default locale.
 */
const fallback = "en-US";

/**
 * Check the locale is supported or not.
 */
function isAvaliable(lang: string): boolean {
	return !!(lang in available);
}

/**
 * Check the locale is aliased to another locale or not.
 */
function isAlias(lang: string): boolean {
	return !!(lang in aliases);
}

/**
 * Get locale data from url
 */
function getCurrentLocale(passWindow?: {
	webContents: { getURL(): string };
}): string {
	const regex = /built\/([a-z]{2}-[A-Z]{2})\//;
	let location: string;
	let lang: string;

	if (passWindow) {
		location = passWindow.webContents.getURL();
		const match = regex.exec(location);
		lang = match ? match[1] : fallback;
	} else {
		location = window.location.href;
		const match = regex.exec(location);
		lang = match ? match[1] : fallback;
	}
	return getLocale(lang);
}

/**
 * Get the locale which aliased to.
 */
function getAliasLocale(lang: string): string {
	return aliases[lang];
}

/**
 * Get locate which supported.(If not supported, return fallback)
 */
function getLocale(lang: string): string {
	if (isAvaliable(lang)) {
		return lang;
	}
	if (isAlias(lang)) {
		return getAliasLocale(lang);
	}
	return fallback;
}

/**
 * Get the path where the locale contents built.
 */
function getLocaleBuiltPath(lang: string): string {
	const basepath = path.normalize(path.join(__dirname, ".."));
	return path.join(basepath, "built", getLocale(lang));
}

/**
 * Get the path where the locale resources.
 */
function getLocaleResourcesPath(lang: string): string {
	const basepath = path.normalize(path.join(__dirname, ".."));
	return path.join(basepath, "resources", "contents", getLocale(lang));
}

/**
 * Get the locale name.
 */
function getLocaleName(lang: string): string {
	if (isAvaliable(lang)) {
		return available[lang];
	}
	if (isAlias(lang)) {
		return available[getAliasLocale(lang)];
	}
	throw new Error(
		`locale ${lang} do not exist. Do you add it in lib/locale.js?`,
	);
}

/**
 * Get the available locale array.
 */
function getAvaiableLocales(): string[] {
	return Object.keys(available);
}

/**
 * Get fallback.
 */
function getFallbackLocale(): string {
	return fallback;
}

/**
 * Get locale menu
 */
function getLocaleMenu(current: string): string {
	let menu = "";
	for (const lang in available) {
		if (lang === current) {
			menu = menu.concat(
				`<option value="${lang}" selected="selected">${getLocaleName(lang)}</option>`,
			);
		} else {
			menu = menu.concat(
				`<option value="${lang}">${getLocaleName(lang)}</option>`,
			);
		}
	}
	return menu;
}

export {
	getLocale,
	getLocaleBuiltPath,
	getLocaleResourcesPath,
	getCurrentLocale,
	getLocaleName,
	getAvaiableLocales,
	getFallbackLocale,
	getLocaleMenu,
};
