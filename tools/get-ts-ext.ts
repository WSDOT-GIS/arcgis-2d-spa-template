#!/usr/bin/env bun
import { Temporal } from "temporal-polyfill";
import { fetch, CryptoHasher } from "bun";

// const c=new CryptoHasher("sha256")
// c.digest()

interface Asset extends Record<string, unknown> {
	/** "https://api.github.com/repos/microsoft/TypeScript/releases/assets/601618067" */
	url: string;
	// id: 601618067;
	// node_id: "RA_kwDOAT9aAc4j2_aT";
	// name: "native-preview-alpine-arm64.vsix";
	// label: "";
	// uploader: {
	// 	login: "typescript-automation[bot]";
	// 	id: 290192711;
	// 	node_id: "BOT_kgDOEUv9Rw";
	// 	avatar_url: "https://avatars.githubusercontent.com/in/3946201?v=4";
	// 	gravatar_id: "";
	// 	url: "https://api.github.com/users/typescript-automation%5Bbot%5D";
	// 	html_url: "https://github.com/apps/typescript-automation";
	// 	followers_url: "https://api.github.com/users/typescript-automation%5Bbot%5D/followers";
	// 	following_url: "https://api.github.com/users/typescript-automation%5Bbot%5D/following{/other_user}";
	// 	gists_url: "https://api.github.com/users/typescript-automation%5Bbot%5D/gists{/gist_id}";
	// 	starred_url: "https://api.github.com/users/typescript-automation%5Bbot%5D/starred{/owner}{/repo}";
	// 	subscriptions_url: "https://api.github.com/users/typescript-automation%5Bbot%5D/subscriptions";
	// 	organizations_url: "https://api.github.com/users/typescript-automation%5Bbot%5D/orgs";
	// 	repos_url: "https://api.github.com/users/typescript-automation%5Bbot%5D/repos";
	// 	events_url: "https://api.github.com/users/typescript-automation%5Bbot%5D/events{/privacy}";
	// 	received_events_url: "https://api.github.com/users/typescript-automation%5Bbot%5D/received_events";
	// 	type: "Bot";
	// 	user_view_type: "public";
	// 	site_admin: false;
	// };
	// content_type: "application/octet-stream";
	// state: "uploaded";
	// size: 9264037;
	/** "sha256:ec1ebcb1c5b3ee81b81ff326fb3cce3f22a90a2d108977380a7fe11faa962f54" */
	digest: `${string}:${string}`;
	// download_count: 65;
	/** "2026-09-30T19:10:05Z"; */
	created_at: string;
	/** "2026-09-30T19:10:05Z"; */
	updated_at: string;
	/** "https://github.com/microsoft/TypeScript/releases/download/vscode-typescript/v1.0.1/native-preview-alpine-arm64.vsix"; */
	browser_download_url: `https://github.com/microsoft/TypeScript/releases/download/vscode-typescript/${string}/${string}.vsix`;
}

const assetReviver: Parameters<typeof JSON.parse>[1] = function (
	this,
	key,
	value: unknown,
) {
	if (typeof value === "string" && /((created)|(updated))_at/.test(key)) {
		const instant = Temporal.Instant.from(value);
		return instant;
	}
	return value;
};

interface ReleaseItem extends Record<string, unknown> {
	name: string;
	assets: Asset[];
}

const url = new URL(
	"https://api.github.com/repos/microsoft/TypeScript/releases",
);

const request = new Request(url);
request.headers.append("accept", "application/vnd.github+json");

const response = await fetch(request);
const txt = await response.text();
const output: ReleaseItem[] = JSON.parse(txt, assetReviver)
const list = Object.fromEntries(
	output
		.filter((item) => item.name.startsWith("vscode-typescript/"))
		.map((item) => [item.name, item.assets] as const),
);

console.log(list);

export {};
