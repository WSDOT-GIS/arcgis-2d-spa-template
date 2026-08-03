const EsriMap = await $arcgis.import("@arcgis/core/Map.js");
const SpatialReference = await $arcgis.import("@arcgis/core/geometry/SpatialReference.js");
const { imageryWithWsdotRoutesBasemap } = await import("./basemaps");

export const arcgisMap = document.body.querySelector<HTMLArcgisMapElement>("arcgis-map");

if (!arcgisMap) {
	throw new TypeError("Could not find arcgis-map element.");
}

arcgisMap.spatialReference = SpatialReference.WebMercator;

const esriMap = new EsriMap({
	basemap: imageryWithWsdotRoutesBasemap,
});

esriMap.add(import("./layers/mileposts").then(({ milepostsLayer }) => milepostsLayer));

arcgisMap.map = esriMap;
