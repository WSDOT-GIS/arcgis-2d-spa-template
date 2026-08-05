import type { ScreenPoint } from "@arcgis/core/core/types";

const EsriMap = await $arcgis.import("@arcgis/core/Map.js");
const SpatialReference = await $arcgis.import("@arcgis/core/geometry/SpatialReference.js");
const FeatureLayerView = await $arcgis.import("@arcgis/core/views/layers/FeatureLayerView.js");
const { imageryWithWsdotRoutesBasemap } = await import("./basemaps");

export const arcgisMap = document.body.querySelector<HTMLArcgisMapElement>("arcgis-map");

if (!arcgisMap) {
	throw new TypeError("Could not find arcgis-map element.");
}

arcgisMap.spatialReference = SpatialReference.WebMercator;

const milepostsLayer = await import("./layers/mileposts").then(
	({ milepostsLayer }) => milepostsLayer,
);

const esriMap = new EsriMap({
	basemap: imageryWithWsdotRoutesBasemap,
	layers: [milepostsLayer],
});

arcgisMap.map = esriMap;

// Setup milepost filtering event handler
arcgisMap.addEventListener(
	"arcgisViewClick",
	/**
	 * If the user clicked near mileposts, update the milepost layer view's filter to make these
	 * mileposts visible.
	 */
	async (event) => {
		const {
			target: { layerViews },
			detail: { mapPoint, x, y },
		} = event;

		// If the user clicked on a feature, exit.
		// Default action (show popup) will be performed.
		const hitTestResult = await arcgisMap.hitTest({
			x,
			y,
		});

		if (hitTestResult.results.length) {
			return;
		}

		const objectIds = (await milepostsLayer.queryObjectIds({
			geometry: mapPoint,
			distance: 50,
			units: "feet",
		})) as number[];

		/* __PURE__ */ console.debug("query result", objectIds);

		const mpLayerView = layerViews
			.filter((lv) => lv.layer === milepostsLayer && lv instanceof FeatureLayerView)
			.at(0) as InstanceType<typeof FeatureLayerView> | undefined;

		/* __PURE__ */ console.debug("layer view", mpLayerView);

		if (!mpLayerView) {
			return;
		}

		if (!objectIds.length) {
			return;
		}

		if (mpLayerView.filter?.objectIds?.length) {
			mpLayerView.filter = {
				objectIds: [...mpLayerView.filter.objectIds, ...objectIds],
			};
		} else {
			mpLayerView.filter = {
				objectIds,
			};
		}

		event.preventDefault();
	},
);
