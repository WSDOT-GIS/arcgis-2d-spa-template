import type { QueryProperties } from "@arcgis/core/rest/support/Query";

const FeatureLayer = await $arcgis.import("@arcgis/core/layers/FeatureLayer");

export type Direction = "i" | "d";

export enum FieldName {
	routeId = "RouteID",
	direction = "Direction",
	arm = "ARM",
	srmp = "SRMP",
	ab = "AheadBackInd",
	sr = "StateRouteNumber",
	rrt = "RelRouteType",
	rrq = "RelRouteQual",
}

export enum StatDefFieldName {
	minSrmp = "Min_SRMP",
	maxSrmp = "Max_SRMP",
}

export const mpLayerId = "mileposts";

interface MPAttributes extends Record<string, string | number> {
	[FieldName.routeId]: string;
	[StatDefFieldName.minSrmp]: number;
	[StatDefFieldName.maxSrmp]: number;
}

export function isMPAttributes(o: unknown): o is MPAttributes {
	if (!o || typeof o !== "object") {
		return false;
	}
	return [
		FieldName.routeId,
		StatDefFieldName.minSrmp,
		StatDefFieldName.maxSrmp,
	].every((fn) => fn in o);
}

const fromFormFilterId = "from-form";
/**
 * Creates the mileposts feature layer
 *
 * @returns The mileposts feature layer
 */
export function createMPFeatureLayer() {
	const mpLayerAgolId = "22324eb30f6949eabc180bfbe0de6fcb";
	return new FeatureLayer({
		portalItem: {
			portal: {
				url: "https://wsdot.maps.arcgis.com",
			},
			id: mpLayerAgolId,
		},
		displayFilterInfo: {
			filters: [
				{
					id: fromFormFilterId,
					where: "1 = 0",
					title: "Show only features selected by the form",
				},
			],
			activeFilterId: fromFormFilterId,
		},
	});
}

export async function getRouteList(
	layer: Awaited<ReturnType<typeof createMPFeatureLayer>>,
) {
	const query: QueryProperties = {
		where: `${FieldName.routeId} IS NOT NULL`,
		outFields: [FieldName.routeId],
		returnDistinctValues: true,
		outStatistics: [
			{
				onStatisticField: FieldName.srmp,
				outStatisticFieldName: StatDefFieldName.minSrmp,
				statisticType: "min",
			},
			{
				onStatisticField: FieldName.srmp,
				outStatisticFieldName: StatDefFieldName.maxSrmp,
				statisticType: "max",
			},
		],
		orderByFields: [
			FieldName.sr,
			`${FieldName.direction} DESC`,
			FieldName.rrq,
			FieldName.rrt,
		],
	};

	const featureSet = await layer.queryFeatures(query);
	const mpAttributes = featureSet.features
		.map(({ attributes }) => attributes)
		.filter(isMPAttributes);
	return mpAttributes;
}
