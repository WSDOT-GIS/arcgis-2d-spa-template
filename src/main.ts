import waExtent from "./WAExtent";

import("./index.css");

import("@arcgis/core/Map").then(({ default: EsriMap }) => {
  const map = new EsriMap({
    basemap: "topo-vector",
  });

  import("@arcgis/core/views/MapView").then(({ default: MapView }) => {
    const view = new MapView({
      container: "viewDiv",
      map,
      extent: waExtent,
    });

    import("./widgets/setupSearch").then(({ setupSearch }) => {
      setupSearch(view).then((search) => {
        search.view.ui.add(search, "top-right");
      });
    });
  });
});
