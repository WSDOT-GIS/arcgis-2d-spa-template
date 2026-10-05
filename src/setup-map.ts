const EsriMap = await $arcgis.import("@arcgis/core/Map.js");
const SpatialReference = await $arcgis.import(
	"@arcgis/core/geometry/SpatialReference.js",
);
const { imageryWithWsdotRoutesBasemap } = await import("./basemaps");
const {createMPFeatureLayer} = await import("./milepost-layer")

const config = await $arcgis.import("@arcgis/core/config.js");
config.portalUrl = "https://wsdot.maps.arcgis.com"

export const arcgisMap =
	document.body.querySelector<HTMLArcgisMapElement>("arcgis-map");

if (!arcgisMap) {
	throw new TypeError("Could not find arcgis-map element.");
}

arcgisMap.spatialReference = SpatialReference.WebMercator;

const esriMap = new EsriMap({
	basemap: imageryWithWsdotRoutesBasemap,
});

esriMap.add(createMPFeatureLayer())

arcgisMap.map = esriMap;
