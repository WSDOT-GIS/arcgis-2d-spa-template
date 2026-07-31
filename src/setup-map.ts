const EsriMap = await $arcgis.import("@arcgis/core/Map.js");
const SpatialReference = await $arcgis.import("@arcgis/core/geometry/SpatialReference.js");

const { addLayersToMap } = await import("./setup-layers");

export const arcgisMap = document.body.querySelector<HTMLArcgisMapElement>("arcgis-map");

if (!arcgisMap) {
  throw new TypeError("Could not find arcgis-map element.");
}

arcgisMap.spatialReference = SpatialReference.WebMercator;

const esriMap = new EsriMap({
    basemap: "dark-gray-vector"
})

arcgisMap.map = esriMap;

// Wait for the map to load before adding layers.
arcgisMap.addEventListener("arcgisViewReadyChange", (event) => {
    void addLayersToMap.call(arcgisMap, event);
});
