/**
 * This script publishes the page built with Vite to GitHub Pages
 * via the [gh-pages package](https://www.npmjs.com/package/gh-pages).
 */

import {publish} from "gh-pages";

/**
 * @see https://www.npmjs.com/package/gh-pages
 */
publish("dist", {
    // This needs to be specified so that the .nojekyll file is included.
    dotfiles: true
}, (error) => {
    if (error) {
        const message = error instanceof Error ? error.message : null ?? "An error occurred while attempting to publish to Github Pages";
        console.error(message, error);
    }
});


