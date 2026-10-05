import { ArcgisMap } from "@arcgis/map-components/components/arcgis-map";
import templateHtml from "./template.html?raw";
import type FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import type FeatureLayerView from "@arcgis/core/views/layers/FeatureLayerView";

export class WsdotMilepostForm extends HTMLElement {
	static observedAttributes = ["reference-element", "mp-layer-id"] as const;

	public get referenceElement(): ArcgisMap | null {
		const mapId = this.getAttribute("reference-element");
		if (!mapId) {
			return null;
		}
		const map = document.body.querySelector<ArcgisMap>(`#${mapId}`);
		return map;
	}

	public get layer(): FeatureLayer | null {
		const layerId = this.getAttribute("mp-layer-id");
		if (!layerId) {
			return null;
		}
		const map = this.referenceElement;
		if (!map) {
			return null;
		}
		const layer =
			(
				map.layerViews.find(
					(l) => l.layer.id === layerId && l.layer.type === "feature",
				) as FeatureLayerView
			)?.layer ?? null;

		return layer;
	}

	constructor() {
		super();

		const domParser = new DOMParser();
		const dom = domParser.parseFromString(
			templateHtml,
			"text/html",
		) as HTMLDocument;

		const form = dom.documentElement
			.querySelector("template")
			?.content.querySelector("form");

		if (!form) {
			throw new TypeError("form element not found");
		}

		const shadow = this.attachShadow({
			mode: "open",
		});

		shadow.append(form);
	}

	connectedCallback() {
		/* __PURE__ */ console.debug("element added to page");
		const arcgisMaps = document.body.querySelectorAll("arcgis-map");
		let parentMap: ArcgisMap | null = null;

		for (const map of arcgisMaps) {
			if (map.contains(this)) {
				parentMap = map;
				break;
			}
		}

		if (parentMap) {
			/* __PURE__ */ console.debug(`${parentMap.id} contains this element`);
			this.setAttribute("reference-element", parentMap.id);
		} else {
			/* __PURE__ */ console.debug(
				'This element is not contained by an "arcgis-map"',
			);
		}
	}

	populateRouteList() {}

	attributeChangedCallback(
		name: (typeof WsdotMilepostForm.observedAttributes)[number],
		oldValue: string | null,
		newValue: string | null,
	) {
		/* __PURE__ */ console.debug(
			`Attribute ${name} changed from ${oldValue} to ${newValue}`,
		);
		if (!WsdotMilepostForm.observedAttributes.includes(name)) {
			/* __PURE__ */ console.debug(
				`"${name} is not one of the observed attributes, so we will exit now.`,
			);
			return;
		}

		const layer = this.layer;
		/* __PURE__ */ console.debug(layer ? `layer found: ${layer.id}` : "no layer found.")
	}
}

customElements.define("wsdot-mp-form", WsdotMilepostForm);
