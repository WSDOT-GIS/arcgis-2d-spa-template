import type ListItem from "@arcgis/core/widgets/LayerList/ListItem";
import "./index.css";
import type { ArcgisMapCustomEvent } from "@arcgis/map-components";
import "@arcgis/map-components/dist/components/arcgis-expand";
import "@arcgis/map-components/dist/components/arcgis-layer-list";
import "@arcgis/map-components/dist/components/arcgis-legend";
import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/dist/components/arcgis-search";
import "@arcgis/map-components/dist/components/arcgis-zoom";
import type ListItemPanel from "@arcgis/core/widgets/LayerList/ListItemPanel";


const map = document.querySelector("arcgis-map");

if (!map) {
  throw new Error("arcgis-map not found");
}

async function createLayers() {
  const MapImageLayer = (await import("@arcgis/core/layers/MapImageLayer"))
    .default;
  const mpLayer = new MapImageLayer({
    portalItem: {
      id: "03ec5ff3609f45caa849d5afa4d92e9e",
    },
  });
  return [mpLayer];
}

interface LayerListItemCreateEvent {
  item: ListItem;
}

function hasListItem(event: unknown): event is LayerListItemCreateEvent {
  return !!event && Object.hasOwn(event, "item");
}

/**
 * Performs further setup tasks on a layer list item, such as adding a legend.
 * which contains an "item" ListItem property.
 */
const setupLayerListItems: __esri.LayerListListItemCreatedHandler = (event) => {
  if (!hasListItem(event)) {
    throw new TypeError(
      `Expected event object to have an item property with a ListItem value`,
    );
  }
  // Add a legend to the list item panel
  event.item.panel = {
    content: "legend",
  } as ListItemPanel;
};


function setupLayerList() {
  const layerListElement = document.querySelector("arcgis-layer-list");

  if (!layerListElement) {
    throw new Error("arcgis-layer-list not found");
  }

  layerListElement.listItemCreatedFunction = setupLayerListItems;
  layerListElement.showErrors = true;
  layerListElement.hideStatusIndicators = false;
}


function setupMap(this: HTMLArcgisMapElement, ev: ArcgisMapCustomEvent<void>) {
  /* __PURE__ */ console.log("arcgisViewReadyChange", {
    this: this,
    event: ev,
  });

  const { view } = ev.target;

  setupLayerList();

  import("./WAExtent")
    .then(({ waExtent }) => {
      ev.target.view.extent = waExtent;
    })
    .catch((err: unknown) => {
      console.error("Error setting map extent to WA.", err);
    });

  createLayers()
    .then((layers) => {
      view.map.layers.addMany(layers);
    })
    .catch((err: unknown) => {
      console.error("Error setting map layers.", err);
    });

  import("./widgets/setupSearch").then(({ setupSearch }) => {
    return setupSearch(view).then((search) => {
      search.view.ui.add(search, {
        index: 0,
        position: "top-trailing",
      });
    });
  }).catch((err: unknown) => {
    console.error("Error setting up search widget.", err);
  });

  import("./widgets/expandGroups").then(({ setupWidgets }) => {
    return setupWidgets(view, "top-trailing", {
      group: "top-trailing",
    });
  }).catch((err: unknown) => {
    console.error("Error setting up expandGroups widget.", err);
  });
}

map.addEventListener("arcgisViewReadyChange", setupMap);