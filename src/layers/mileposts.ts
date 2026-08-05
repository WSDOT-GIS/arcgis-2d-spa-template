const itemId = "22324eb30f6949eabc180bfbe0de6fcb";

const FeatureLayer = await $arcgis.import("@arcgis/core/layers/FeatureLayer.js");
const FeatureLayerView = await $arcgis.import("@arcgis/core/views/layers/FeatureLayerView.js")

export const milepostsLayer = new FeatureLayer({
	title: "Mileposts",
	portalItem: {
		id: itemId,
	},
});

milepostsLayer.on("layerview-create", (event) => {
	const { layerView } = event;

	if (!(layerView instanceof FeatureLayerView)) {
		/* __PURE__ */ console.debug("Not a feature layer view.", event);
		return;
	}

	// Hide all features initially.
	layerView.filter = {
		where: "1=0"
	}
});
