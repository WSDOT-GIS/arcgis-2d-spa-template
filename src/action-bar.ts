/**
 * This module sets things up so that a calcite-action can toggle a
 * calcite-panel or other element by merely adding a "data-toggles" element with
 * the other element's "id".
 *
 * Call the {@link setupActionBar} function to set this all up.
 */

import type { ArcgisAreaMeasurement2d } from "@arcgis/map-components/components/arcgis-area-measurement-2d";
import type { ArcgisDistanceMeasurement2d } from "@arcgis/map-components/components/arcgis-distance-measurement-2d";

const toolsActionBar =
	document.querySelector<HTMLCalciteActionBarElement>("#tools-action-bar");

if (!toolsActionBar) {
	throw new Error("Tools action bar not found");
}

/**
 * Finds the related Panel element for a given HTMLCalciteActionElement element
 * based on the "data-toggles" attribute of the HTMLCalciteActionElement.
 *
 * @param action - A calcite-action element
 * @returns
 */
const findRelatedPanel = <T extends HTMLElement>(
	action: HTMLCalciteActionElement,
): T | null => {
	const panelId = action.dataset.toggles;
	if (!panelId) {
		console.warn(
			"HTMLCalciteActionElement does not have a data-toggles attribute:",
			action,
		);
		return null;
	}

	const panel = document.querySelector<T>(`#${panelId}`);

	if (!panel) {
		console.error(`Panel with id "${panelId}" not found for action:`, action);
		return null;
	}
	return panel;
};

/**
 * Iterate over the actions and their associated panel elements. Only actions
 * that have associated panels will be yielded.
 *
 * @param actionBar - Action bar
 * @yields - Action and its associated panel.
 */
function* iterateActionsAndPanels(actionBar: HTMLCalciteActionBarElement) {
	const activeActions = actionBar.querySelectorAll<HTMLCalciteActionElement>(
		"calcite-action[data-toggles]",
	);
	if (activeActions) {
		for (const action of activeActions) {
			const panel = findRelatedPanel(action);
			if (!panel) {
				/* __PURE__ */ console.warn("Could not find related panel", {
					action,
					panel,
				});
				continue;
			}
			yield { action, panel };
		}
	}
}

/**
 * Event handler that toggles "collapsed" state of the panel related to the
 * HTMLCalciteActionElement element that was clicked. The relationship is
 * determined by the "data-toggles" attribute on the HTMLCalciteActionElement
 * element, which should contain the id of the related Panel element. Also sets
 * the HTMLCalciteActionElement's "active" state to reflect the panel's
 * collapsed state.
 *
 * @param event - The PointerEvent that triggered the click.
 */
const togglePanel = (event: PointerEvent) => {
	const clickedAction = event.target as HTMLCalciteActionElement;
	/**
	 * The panel associated with the action that was clicked.
	 *
	 * The panel itself wasn't actually clicked. Just wanted to keep the variable
	 * name short.
	 */
	const clickedPanel = findRelatedPanel<
		HTMLCalcitePanelElement | HTMLCalciteBlockElement
	>(clickedAction);
	if (!clickedPanel) {
		throw new TypeError("Could not find panel");
	}
	clickedPanel.hidden = !clickedPanel.hidden;
	clickedAction.active = !clickedAction.active;

	for (const {
		action: currentAction,
		panel: currentPanel,
	} of iterateActionsAndPanels(toolsActionBar)) {
		// Skip if the current action is the one that was clicked.
		if (currentAction === clickedAction) {
			continue;
		}
		currentPanel.hidden = true;
		currentAction.active = false;
	}

	const shellPanel =
		clickedPanel.parentElement as HTMLCalciteShellPanelElement | null;
	if (shellPanel) {
		// Hide the shell panel if none of the children are visible.
		shellPanel.collapsed = clickedPanel.hidden;
	}
};

/**
 * Sets up the click event listeners for all HTMLCalciteActionElement elements
 * that have a "data-toggles" attribute, which indicates they are related to a
 * Panel element.
 *
 * @param actionBar
 */
export function setupActionBar(actionBar: HTMLCalciteActionBarElement) {
	let selector = "calcite-action[data-toggles]";
	const actions =
		actionBar.querySelectorAll<HTMLCalciteActionElement>(selector);
	for (const action of actions) {
		action.addEventListener("click", togglePanel);
	}

	selector = "calcite-action[data-measure-element]";
	const measureActions =
		document.querySelectorAll<HTMLCalciteActionElement>(selector);
	for (const currentMeasureAction of measureActions) {
		const selector = `[id=${currentMeasureAction.dataset.measureElement}]`;
		const measureElement = document.querySelector<
			ArcgisDistanceMeasurement2d | ArcgisAreaMeasurement2d
		>(selector);
		if (!measureElement) {
			console.error(`Element not found: "${selector}"`, {
				"current action": currentMeasureAction,
			});
			currentMeasureAction.disabled = true;
			continue;
		}

		currentMeasureAction.addEventListener("click", () => {
			measureElement.clear().catch((reason) =>
				console.error(`Failed to call clear function on ${measureElement.id}`, {
					measureElement,
					reason,
				}),
			);
		});
	}
}
