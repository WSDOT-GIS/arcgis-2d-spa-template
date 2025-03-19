import type { ArcgisMapCustomEvent } from "@arcgis/map-components";
import type { ArcgisMap } from "@arcgis/map-components/components/arcgis-map";

export async function addLayersToMap(
	this: ArcgisMap,
	event: ArcgisMapCustomEvent<void>,
) {
	// Dynamically import the FeatureLayer class.
	const { default: FeatureLayer } = await import(
		"@arcgis/core/layers/FeatureLayer"
	);
	const cityLimitsLayer = new FeatureLayer({
		title: "City Limits",
		portalItem: {
			id: "0d96ba84b802425aa1d2b9a99e422c5d",
		},
	});
	const map = event.target.map;
	map.add(cityLimitsLayer);
}