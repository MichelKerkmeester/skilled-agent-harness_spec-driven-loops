/**
 * MODULE: Model Modality
 *
 * Classifies whether the active host model is text-only — i.e. cannot natively see an
 * attached image. sk-vision GUARANTEES an image analysis for these models: a blind model
 * has no other way to learn what an image contains, so the cheap best-effort auto-inspect
 * (which may only hand over a file path under load) is not enough. A model the operator has
 * not listed as text-only keeps the existing best-effort behaviour.
 */
export interface ActiveModel {
  providerID?: string;
  modelID?: string;
  /**
   * The model's accepted input modalities when the host declares them (Pi exposes
   * this as `model.input`). When present and it omits "image", the model literally
   * cannot see an image — an authoritative signal that beats the name allowlist.
   */
  input?: readonly string[];
}

/**
 * Model families with no native image input, matched case-insensitively as substrings of
 * `providerID/modelID`. This is an explicit allowlist by operator choice: only a listed
 * model triggers the guaranteed run, so a brand-new text-only model must be added here (or
 * via the env override) before it is guaranteed vision.
 */
export const DEFAULT_TEXT_ONLY_PATTERNS: readonly string[] = [
  "deepseek",
  "minimax",
  "mimo",
  "qwen",
  "kimi",
];

/** Extra text-only substrings from `SK_VISION_TEXT_ONLY_MODELS` (comma-separated), lowercased. */
function envPatterns(env: NodeJS.ProcessEnv): string[] {
  const raw = env.SK_VISION_TEXT_ONLY_MODELS;
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length > 0);
}

/**
 * True when the active model is text-only and therefore must get a guaranteed vision run.
 *
 * `SK_VISION_FORCE=1` forces it for every model (an operator escape hatch); otherwise the
 * `providerID/modelID` pair is matched against the built-in allowlist plus any env additions.
 */
export function isTextOnlyModel(
  model: ActiveModel | undefined,
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  if (env.SK_VISION_FORCE === "1") return true;
  if (!model) return false;
  // A host that declares the model's accepted input modalities is authoritative: a
  // model whose declared inputs omit "image" is blind to images and must be guaranteed
  // vision, regardless of the name allowlist. Hosts that don't expose modality (OpenCode
  // today) leave `input` unset and fall through to the allowlist below.
  if (Array.isArray(model.input) && model.input.length > 0 && !model.input.includes("image")) {
    return true;
  }
  const id = `${model.providerID ?? ""}/${model.modelID ?? ""}`.toLowerCase();
  const patterns = [...DEFAULT_TEXT_ONLY_PATTERNS, ...envPatterns(env)];
  return patterns.some((pattern) => id.includes(pattern));
}
