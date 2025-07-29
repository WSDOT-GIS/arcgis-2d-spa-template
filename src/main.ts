import "./index.css";

import type { ArcgisLayerListCustomEvent } from "@arcgis/map-components";

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
		ev: ArcgisLayerListCustomEvent<void>,
	) {
		ev.target.listItemCreatedFunction = customizeItem;
	}

	document.body
		.querySelector("arcgis-layer-list")
		?.addEventListener("arcgisReady", customizeLayerListItem);
}

/* 
Since some browsers targeted in the browserslist file don't yet support
top-level await, we need to wrap our code in a self-executing async function.
*/
(async () => {
	// Dynamically import the components we need.

	const { addLayersToMap } = await import("./setup-layers");

	// Wait for the map to load before adding layers.
	document.body
		.querySelector<HTMLArcgisMapElement>("arcgis-map")
		?.addEventListener("arcgisViewReadyChange", addLayersToMap);

	await setupLayerList();
})();

import("./setup-search");
