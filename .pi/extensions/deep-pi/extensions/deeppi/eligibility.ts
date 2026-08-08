// ───────────────────────────────────────────────────────────────────
// MODULE: DeepPi Model Eligibility
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** Model identifiers supported by the DeepPi extension. */
export const DEEPPI_MODEL_IDS = [
  'deepseek-v4-flash',
  'deepseek-v4-pro',
] as const;

/** Union of model identifiers supported by the DeepPi extension. */
export type DeepPiModelId = (typeof DEEPPI_MODEL_IDS)[number];

/** Minimal model descriptor used by DeepPi eligibility checks. */
export interface DeepPiModel {
  provider: string;
  id: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const modelIds = new Set<string>(DEEPPI_MODEL_IDS);

// ───────────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/**
 * Check whether a model is a supported direct DeepSeek model.
 *
 * @param model - Model descriptor to classify.
 * @returns Whether the model is supported, with its identifier narrowed when true.
 */
export function isDeepPiModel(
  model: DeepPiModel | null | undefined,
): model is DeepPiModel & { id: DeepPiModelId } {
  return model?.provider === 'deepseek' && modelIds.has(model.id);
}

/**
 * Add or remove the DeepPi line-editing tool from the active tool list.
 *
 * @param activeTools - Tools currently active for the model.
 * @param eligible - Whether DeepPi tools should be enabled.
 * @returns A new tool list with at most one `edit_lines` entry.
 */
export function withEditLinesActive(
  activeTools: readonly string[],
  eligible: boolean,
): string[] {
  const withoutDeepPi = activeTools.filter((name) => name !== 'edit_lines');
  return eligible ? [...withoutDeepPi, 'edit_lines'] : withoutDeepPi;
}
