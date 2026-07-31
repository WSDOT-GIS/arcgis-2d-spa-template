await import("./setup-map");

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

export {}