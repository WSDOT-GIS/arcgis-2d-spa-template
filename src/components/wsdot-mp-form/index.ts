import { ArcgisMap } from "@arcgis/map-components/components/arcgis-map";
import templateHtml from "./template.html?raw";

export class WsdotMilepostForm extends HTMLElement {
	private static readonly referenceElementAttributeName = "reference-element";
	private static readonly layerIdAttributeName = "mp-layer-id";

	static observedAttributes = [
		WsdotMilepostForm.referenceElementAttributeName,
		WsdotMilepostForm.layerIdAttributeName,
	] as const;

	public get map(): ArcgisMap | null {
		const mapId = this.getAttribute("reference-element");
		if (!mapId) {
			return null;
		}
		const map = document.body.querySelector<ArcgisMap>(`#${mapId}`);
		return map;
	}

	public get layerId(): string | null {
		return this.getAttribute("mp-layer-id");
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
		/* __PURE__ */ console.group("element added to page");

		let parentMap: ArcgisMap | null = null;
		const refElementId = this.getAttribute("reference-element");
		if (refElementId) {
			/* __PURE__ */ console.debug(
				`Reference element explicitly defined: ${refElementId}`,
			);
		} else {
			const arcgisMaps = document.body.querySelectorAll("arcgis-map");

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
		/* __PURE__ */ console.groupEnd();
	}

	populateRouteList() {}

	attributeChangedCallback(
		name: (typeof WsdotMilepostForm.observedAttributes)[number],
		oldValue: string | null,
		newValue: string | null,
	) {
		/* __PURE__ */ console.group(
			`Attribute ${name} changed from ${JSON.stringify(oldValue)} to ${JSON.stringify(newValue)}`,
		);
		if (
			name === WsdotMilepostForm.referenceElementAttributeName ||
			WsdotMilepostForm.layerIdAttributeName
		) {
			const arcgisMap = this.map;

			if (!arcgisMap) {
				/* __PURE__ */ console.debug("No reference-element has been defined.");
			} else if (!this.layerId) {
				/* __PURE__ */ console.debug("No layer ID has been defined.");
			} else {
				const layer = arcgisMap.map?.findLayerById(this.layerId);
				/* __PURE__ */ console.debug("layer", layer);
			}
		}

		/* __PURE__ */ console.groupEnd();
	}
}

customElements.define("wsdot-mp-form", WsdotMilepostForm);
