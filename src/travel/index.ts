const agolItemIds = [
	["Cameras", "6692b4f163bd4ec99b5a897b2d207aa6"],
	["Road Alert Points", "82723db6325e46e0bc9e5a794a914aec"],
	["Mountain Pass Reports", "11d3f0874d504423adc889fe1448471c"],
	["Truck Restrictions - Line", "48b9c841e29f445293ac497bbd132a98"],
	["Weather Stations", "0da55e5e736d4da88b1a411bdf96b766"],
	["Road Alerts - Line", "82497d96d45e4acbb2e64bf925711189"],
	["Border Crossing Wait Times", "0c8628eabe2f468dbf71ba678e17f0dc"],
	["Road Closures", "c354e33eef064c2c93fd10cc170889f4"],
	["Truck Restrictions - Point", "eed07145b2dc4a938194902ae88c418f"],
] as const;

type LayerName = typeof agolItemIds[number][0];

export async function createLayers() {
	const { default: FeatureLayer } = await import(
		"@arcgis/core/layers/FeatureLayer"
	);
	const layers = agolItemIds.map(([name, id]) => {
		/* __PURE__ */ console.group(`Creating layer ${name} (${id})`)
		const layer = new FeatureLayer({
			title: name,
			portalItem: {
				id,
			},
			popupEnabled: true,
		});

		/* __PURE__ */  console.debug("layer", layer);

		// const template = layer.createPopupTemplate();

		// /* __PURE__ */ console.debug("template", template)
		// layer.popupTemplate = template;
		/* __PURE__ */  console.groupEnd()
		return layer;
	});
	return layers;
}
