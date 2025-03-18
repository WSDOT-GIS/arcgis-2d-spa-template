import type { ArcgisMapCustomEvent } from "@arcgis/map-components";
import "./index.css";
import type { ArcgisMap } from "@arcgis/map-components/components/arcgis-map";

async function addLayersToMap(
	this: ArcgisMap,
	event: ArcgisMapCustomEvent<void>,
) {
	// Dynamically import the FeatureLayer class.
	const { default: FeatureLayer } = await import(
		"@arcgis/core/layers/FeatureLayer"
	);
	const cityLimitsLayer = new FeatureLayer({
		portalItem: {
			id: "0d96ba84b802425aa1d2b9a99e422c5d",
		},
	});
	const map = this.map ?? event.target?.map;
	map.add(cityLimitsLayer);
}

/* 
Since some browsers targeted in the browserslist file don't yet support
top-level await, we need to wrap our code in a self-executing async function.
*/
(async () => {
	// Dynamically import the components we need.
	await Promise.all([
		import("@arcgis/map-components/components/arcgis-map"),
		import("@arcgis/map-components/components/arcgis-basemap-gallery"),
		import("@arcgis/map-components/components/arcgis-expand"),
		import("@arcgis/map-components/components/arcgis-layer-list"),
		import("@arcgis/map-components/components/arcgis-legend"),
		import("@arcgis/map-components/components/arcgis-locate"),
		import("@arcgis/map-components/components/arcgis-scale-bar"),
		import("@arcgis/map-components/components/arcgis-search"),
		import("@arcgis/map-components/components/arcgis-zoom"),
	]);

	// Get the map element.
	// If your app has multiple maps, you'll need to assign each one an "id" attribute.
	const mapElement = document.body.querySelector("arcgis-map");

	if (!mapElement) {
		throw new Error("No <arcgis-map> element found in the document.");
	}

	// Wait for the map to load before adding layers.
	mapElement.addEventListener("arcgisViewReadyChange", addLayersToMap);
})();
