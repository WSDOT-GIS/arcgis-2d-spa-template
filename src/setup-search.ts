/// <reference types="@wsdot/arcgis-core-helper" />

/**
 * @module setup-search
 * @description Adds search sources to the search map component.
 */

import type { ArcgisSearchCustomEvent } from "@arcgis/map-components";

const searchElement = document.body.querySelector("arcgis-search");

if (!searchElement) {
	throw new Error("Could not find arcgis-search element.");
}

/**
 * Creates a {@link LocatorSearchSource} that is restricted to the extent of WA,
 * as defined by [EPSG:1416](https://epsg.io/1416-area).
 * @returns a promise that resolves to a {@link LocatorSearchSource}.
 */
async function createLocatorSearchSource(
	itemId = "a86fa8aeabdd470792022a8ef959afb6",
): Promise<__esri.LocatorSearchSource> {
	const waExtentLocatorViewUrl = `https://utility.arcgis.com/usrsvcs/servers/${itemId}/rest/services/World/GeocodeServer`;

	const LocatorSearchSource = await $arcgis.import(
		"@arcgis/core/widgets/Search/LocatorSearchSource.js",
	);

	return new LocatorSearchSource({
		url: waExtentLocatorViewUrl,
	});
}

/**
 * Adds search sources to the search map component.
 * @param this an `<arcgis-search>` element
 * @param ev - event params
 */
async function setupSearchProviders(
	this: HTMLArcgisSearchElement,
	ev: ArcgisSearchCustomEvent<void>,
) {
	const locatorSearchSource = await createLocatorSearchSource();
	ev.target.sources.add(locatorSearchSource);
}

searchElement.addEventListener("arcgisReady", setupSearchProviders);
