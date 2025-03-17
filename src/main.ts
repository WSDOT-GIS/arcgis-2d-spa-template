import "./index.css";

(async () => {
	await Promise.all([
		import("@arcgis/map-components/components/arcgis-map"),
		import("@arcgis/map-components/components/arcgis-zoom"),
		import("@arcgis/map-components/components/arcgis-basemap-gallery"),
		import("@arcgis/map-components/components/arcgis-expand"),
		import("@arcgis/map-components/components/arcgis-search"),
		import("@arcgis/map-components/components/arcgis-legend"),
		import("@arcgis/map-components/components/arcgis-scale-bar"),
		import("@arcgis/map-components/components/arcgis-layer-list"),
	]);
	const { default: FeatureLayer } = await import(
		"@arcgis/core/layers/FeatureLayer"
	);

	const mapElement = document.body.querySelector("arcgis-map");

	mapElement?.addEventListener("arcgisViewReadyChange", (event) => {
		const cityLimitsLayer = new FeatureLayer({
			portalItem: {
				id: "0d96ba84b802425aa1d2b9a99e422c5d",
			},
		});
		const map = event.target?.map;
		map.add(cityLimitsLayer);
	});
})();
