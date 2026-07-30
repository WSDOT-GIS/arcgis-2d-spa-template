import "./index.css";
// import { setupLayerList } from "./layer-list";

// Dynamically import the components we need.

const { addLayersToMap } = await import("./setup-layers");

// Wait for the map to load before adding layers.
document.body
  .querySelector<HTMLArcgisMapElement>("arcgis-map")
  ?.addEventListener("arcgisViewReadyChange", addLayersToMap);

// // Disabling this. See the TODO in setup-search.ts for the reason.
// (async () => {
//   const { setupLayerList } = await import("./layer-list");
//   setupLayerList().catch((reason) => {
//     console.error("failed to setup Layer List", reason);
//   });
// })().catch((reason) => {
//   /* __PURE__ */ console.error("Error setting up layer list.", reason)
// });

import("./setup-search").catch((error) => {
  console.error("Error setting up search:", error);
});

import("./action-bar")
  .then(({ setupActionBar }) => {
    const actionBar = document.body.querySelector("calcite-action-bar");
    if (!actionBar) {
      throw new TypeError("Could not find action bar.");
    }
    setupActionBar(actionBar);
  })
  .catch((error) => {
    console.error("Error setting up action bar:", error);
  });
