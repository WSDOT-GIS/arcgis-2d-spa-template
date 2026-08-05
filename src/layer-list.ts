import type { ListItemModifier } from "@arcgis/core/widgets/LayerList/types";
import type { ArcgisLayerListCustomEvent } from "@arcgis/map-components";

export async function setupLayerList() {
	/**
	 * Customize the layer list item.
	 *
	 * @param params - Layer list item created event params
	 * @param params.item - Newly created layer list item
	 */
	const customizeItem: ListItemModifier = (ev) => {
		ev.item.panel = {
			/* TODO: Create legend rather than using the string "legend" for
            the "content" property.
            
            Specifying "legend" for "content" results in an old-style
            Legend Widget being created rather than a modern one.
            You will get this warning:

            ```
            [@arcgis/core/widgets/Legend] 🛑 DEPRECATED - This widget is deprecated. Use the Legend component instead.
                🛠️ Replacement: <arcgis-legend></arcgis-legend>
                ⚙️ Version: 4.34
                🔗 See for more details:
                    Legend component reference: https://www.esriurl.com/arcgis-legend/
                    Esri's move to web components: https://www.esriurl.com/components-transition-plan/
            ```
            */
			content: "legend",
			flowEnabled: true,
		};
	};

	/**
	 * Called when the layer list item is created.
	 *
	 * @param ev - Event params
	 * @param ev.item - Newly created layer list item
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
