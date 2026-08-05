#!/usr/bin/env bun

/**
 * Updates the CDN references in the HTML to match what is in packages.json.
 *
 * @example
 * 	node --experimental-transform-types  .\tools\upgrade-cdn-refs.ts
 *
 * @example
 * 	bun .\tools\upgrade-cdn-refs.ts
 */

import { CryptoHasher, file, stderr } from "bun";
import { JSDOM } from "jsdom";
import { join } from "node:path";
import { parseRange, SemVer } from "semver-utils";
import packageConfig from "../package.json" with { type: "json" };

const ArcgisCorePackageName = "@arcgis/core";

const defaultHtmlPath = join(import.meta.dirname, "..", "index.html");

const htmlFile = file(defaultHtmlPath);

const jsdom = new JSDOM(await htmlFile.arrayBuffer(), {
	contentType: "text/html",
});

const {
	window: { document },
} = jsdom;

async function createScriptTag(version: string | SemVer) {
	/*
	<script type="module" src="https://js.arcgis.com/5.1.14/index.js"
			integrity="sha512-cv9brVi45T4lA8EDI/xqpYg+40ubgWSwEroseij6XJ4Ndm5B61WZgEr1FeMDxXpzm5LGlY1KSDCoKgPUZEXsFw=="
			crossorigin="anonymous"></script>
	*/
	const versionString =
		typeof version === "string"
			? version
			: `${version.major}.${version.minor}.${version.patch}`;
	const scriptElement = document.createElement("script");
	scriptElement.type = "module";
	const url = `https://js.arcgis.com/${versionString}/index.js`;
	scriptElement.src = url;
	const hashAlgorithm: Bun.SupportedCryptoAlgorithms = "sha512";
	const hash = `${hashAlgorithm}-${CryptoHasher.hash(hashAlgorithm, await fetch(url).then((response) => response.text()), "base64")}`;
	void stderr.write(`Hash for ${url}: ${hash}\n`);
	// scriptElement.integrity = hash;
	scriptElement.setAttribute("integrity", hash);
	scriptElement.crossOrigin = "anonymous";
	void stderr.write(scriptElement.outerHTML + "\n");
	return scriptElement;
}

const semVer = parseRange(packageConfig.dependencies["@arcgis/core"])
	.slice(-1)
	.at(0);

if (!semVer) {
	throw new Error(
		`Could not find a valid semver for ${ArcgisCorePackageName} in package.json`,
	);
}

void stderr.write(
	`Found ${ArcgisCorePackageName} versions: ${semVer.major}.${semVer.minor}.${semVer.patch}\n`,
);

const scriptElement = document.head.querySelector(
	'script[src^="https://js.arcgis.com/"]',
);
const newScriptElement = await createScriptTag(semVer);

if (!scriptElement) {
	document.head.append(newScriptElement);
} else {
	scriptElement.replaceWith(newScriptElement);
}

const serializedHtml = jsdom.serialize();

void stderr.write(serializedHtml);

await htmlFile.write(serializedHtml);

void stderr.write(`Writing updated HTML to ${defaultHtmlPath}...\n`);
