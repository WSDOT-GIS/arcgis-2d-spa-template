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

// Since we don't have a basemap specified in the HTML element,
// we need to set the spatial reference system manually.
arcgisMap.spatialReference = SpatialReference.WebMercator;

// Create a map object and specify its basemap.
const esriMap = new EsriMap({
	basemap: imageryWithWsdotRoutesBasemap,
});

// Add the mileposts layer.
esriMap.add(createMPFeatureLayer())

// Set the esriMap as the map of the arcgis-map element.
arcgisMap.map = esriMap;
