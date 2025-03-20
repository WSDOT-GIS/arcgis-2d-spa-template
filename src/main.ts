import type { ArcgisMap } from "@arcgis/map-components/components/arcgis-map";
import "./index.css";

import type {
	ArcgisLayerListCustomEvent,
	ArcgisMapCustomEvent,
} from "@arcgis/map-components";
import Popup from "@arcgis/core/widgets/Popup";

async function setupLayerList() {
	interface LayerListItemCreatedEvent {
		item: __esri.ListItem;
	}

	/**
	 * Checks if the provided event is a {@link LayerListItemCreatedEvent}.
	 * @param event - an event object
	 * @returns - true if the event is a {@link LayerListItemCreatedEvent}, false otherwise
	 */
	function hasListItem(event: unknown): event is LayerListItemCreatedEvent {
		return !!event && Object.hasOwn(event, "item");
	}

	/**
	 * Customize the layer list item.
	 * @param params - layer list item created event params
	 * @param params.item - newly created layer list item
	 */
	const customizeItem: __esri.ListItemCreatedHandler = (ev) => {
		if (!hasListItem(ev)) {
			throw new Error('Event expected to have an "item" property.');
		}
		ev.item.panel = {
			content: "legend",
			flowEnabled: true,
		};
	};

	/**
	 * Called when the layer list item is created.
	 * @param ev - event params
	 * @param ev.item - newly created layer list item
	 */
	function customizeLayerListItem(
		this: HTMLArcgisLayerListElement,
		ev: ArcgisLayerListCustomEvent<undefined>,
	) {
		ev.target.listItemCreatedFunction = customizeItem;
	}

	document.body
		.querySelector("arcgis-layer-list")
		?.addEventListener("arcgisReady", customizeLayerListItem);

	return await import("@arcgis/map-components/components/arcgis-layer-list");
}

/* 
Since some browsers targeted in the browserslist file don't yet support
top-level await, we need to wrap our code in a self-executing async function.
*/
(async () => {
	// Dynamically import the components we need.

	async function addLayersToMap(
		this: ArcgisMap,
		event: ArcgisMapCustomEvent<void>,
	) {
		const { map, view } = event.target;

		const { createLayers } = await import("./travel");

		const layers = await createLayers();

		map.addMany(layers);
	}

	const mapElement = document.body.querySelector("arcgis-map");
	// Wait for the map to load before adding layers.
	mapElement?.addEventListener("arcgisViewReadyChange", addLayersToMap);

	mapElement?.addEventListener("arcgisViewClick", async (ev) => {
		const {
			target: { view },
			detail,
		} = ev;

		const hitTestResult = await view.hitTest(detail);

		const isGraphicHit = (
			hit: __esri.MapViewViewHit,
		): hit is __esri.GraphicHit => hit.type === "graphic";

		const graphicHits = hitTestResult.results.filter(isGraphicHit);

		const graphics = graphicHits.map(({ graphic }) => graphic);

		view.popup = new Popup({
			defaultPopupTemplateEnabled: true,
		});

		view.openPopup({
			features: graphics,
		});

		// for (const {} of hitTestResult.results) {
		// }
	});

	await setupLayerList();

	await Promise.all([
		import("@esri/calcite-components/components/calcite-shell"),
		import("@esri/calcite-components/components/calcite-shell-panel"),
		import("@arcgis/map-components/components/arcgis-map"),
		import("@arcgis/map-components/components/arcgis-basemap-gallery"),
		import("@arcgis/map-components/components/arcgis-distance-measurement-2d"),
		import("@arcgis/map-components/components/arcgis-expand"),
		import("@arcgis/map-components/components/arcgis-home"),
		import("@arcgis/map-components/components/arcgis-legend"),
		import("@arcgis/map-components/components/arcgis-locate"),
		import("@arcgis/map-components/components/arcgis-scale-bar"),
		import("@arcgis/map-components/components/arcgis-search"),
		import("@arcgis/map-components/components/arcgis-zoom"),
	]);
})();
