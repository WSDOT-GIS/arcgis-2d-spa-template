import templateHtml from "./template.html?raw";

export class WsdotMilepostForm extends HTMLElement {
	constructor() {
		super();

		const domParser = new DOMParser();
		const dom = domParser.parseFromString(templateHtml, "text/html") as HTMLDocument;
        
        const form = dom.documentElement.querySelector("template")?.content.querySelector("form");

        if (!form) {
            throw new TypeError("form element not found");
        }

		const shadow = this.attachShadow({
			mode: "open",
		});

        shadow.append(form);
	}
}

customElements.define("wsdot-mp-form", WsdotMilepostForm);
