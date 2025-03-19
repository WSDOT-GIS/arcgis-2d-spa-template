import "./index.css";

/* 
Since some browsers targeted in the browserslist file don't yet support
top-level await, we need to wrap our code in a self-executing async function.
*/
(async () => {
	// Dynamically import the components we need.
	const [, , , , , , , , , , , { addLayersToMap }] = await Promise.all([
		import("@arcgis/map-components/components/arcgis-map"),
		import("@arcgis/map-components/components/arcgis-basemap-gallery"),
		import("@arcgis/map-components/components/arcgis-distance-measurement-2d"),
		import("@arcgis/map-components/components/arcgis-expand"),
		import("@arcgis/map-components/components/arcgis-home"),
		import("@arcgis/map-components/components/arcgis-layer-list"),
		import("@arcgis/map-components/components/arcgis-legend"),
		import("@arcgis/map-components/components/arcgis-locate"),
		import("@arcgis/map-components/components/arcgis-scale-bar"),
		import("@arcgis/map-components/components/arcgis-search"),
		import("@arcgis/map-components/components/arcgis-zoom"),
		import("./setup-layers"),
	]);

	// Get the map element.
	// If your app has multiple maps, you'll need to assign each one an "id" attribute.
	const mapElement = document.body.querySelector("arcgis-map");

	if (mapElement) {
		// Wait for the map to load before adding layers.
		mapElement.addEventListener("arcgisViewReadyChange", addLayersToMap);
	}

	document.body
		.querySelector("arcgis-layer-list")
		?.addEventListener("arcgisReady", function (this) {
			const customizeItem: __esri.ListItemCreatedHandler = ({
				item,
			}: { item: __esri.ListItem }) => {
				/* __PURE__ */ console.log("layer list item created", item);

				item.panel = {
					content: "legend",
				};
			};
			this.listItemCreatedFunction = customizeItem;
		});
})();
