const Basemap = await $arcgis.import("@arcgis/core/Basemap.js");

export const imageryWithWsdotRoutesBasemap = new Basemap({
	portalItem: { id: "952d28d8d68c4e9ca2db7c7d68307af0" },
});
