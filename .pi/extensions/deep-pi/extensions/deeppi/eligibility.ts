export const DEEPPI_MODEL_IDS = [
	"deepseek-v4-flash",
	"deepseek-v4-pro",
] as const;

export type DeepPiModelId = (typeof DEEPPI_MODEL_IDS)[number];
export interface DeepPiModel {
	provider: string;
	id: string;
}

const modelIds = new Set<string>(DEEPPI_MODEL_IDS);

export function isDeepPiModel(
	model: DeepPiModel | null | undefined,
): model is DeepPiModel & { id: DeepPiModelId } {
	return model?.provider === "deepseek" && modelIds.has(model.id);
}

export function withEditLinesActive(
	activeTools: readonly string[],
	eligible: boolean,
): string[] {
	const withoutDeepPi = activeTools.filter((name) => name !== "edit_lines");
	return eligible ? [...withoutDeepPi, "edit_lines"] : withoutDeepPi;
}
