// Shared constants and types for the GPT Fast Mode extension.

/** Package / namespace identifier (status key, config dir name). */
export const PACKAGE_NAME = "pi-gpt-fast-mode";

/** Key used for the TUI status / widget entry. */
export const STATUS_KEY = PACKAGE_NAME;

/** CLI flag: `pi --fast`. */
export const FLAG_NAME = "fast";

/** Slash command: `/fast`. */
export const COMMAND_NAME = "fast";

/**
 * Environment variable used to hand off the desired preference to child pi
 * processes (subagents). `1` = desired on, `0` = desired off.
 */
export const HANDOFF_ENV = "PI_GPT_FAST_MODE";

/**
 * OpenAI service tiers accepted by the `service_tier` request field.
 * - priority: faster, premium (the classic "fast mode")
 * - flex:     cheaper, slower (economy)
 * - default:  standard tier
 * - auto:     let OpenAI choose based on account settings
 */
export const SERVICE_TIERS = ["priority", "flex", "default", "auto"] as const;
export type ServiceTier = (typeof SERVICE_TIERS)[number];

/** Tier selected when toggling Fast Mode on without naming one. */
export const DEFAULT_TIER: ServiceTier = "priority";

export function isServiceTier(value: unknown): value is ServiceTier {
  return (
    typeof value === "string" &&
    (SERVICE_TIERS as readonly string[]).includes(value)
  );
}

/** Default `provider/model` keys that may use Fast Mode. */
export const DEFAULT_MODELS = [
  "openai/gpt-5.4",
  "openai/gpt-5.5",
  "openai-codex/gpt-5.4",
  "openai-codex/gpt-5.5",
] as const;

/** How the indicator is surfaced in the TUI. */
export type IndicatorMode = "status" | "widget" | "off";

export interface FastConfig {
  /** Remember the desired on/off choice (and tier) between pi runs. */
  persist: boolean;
  /** Saved on/off preference (only honored when `persist` is true). */
  desired: boolean;
  /** Currently selected service tier. */
  tier: ServiceTier;
  /** Exact `provider/model` keys that may use Fast Mode. */
  models: string[];
  /** TUI indicator presentation. */
  indicator: IndicatorMode;
}

/** Minimal model identity used for matching. */
export interface ModelRef {
  provider: string;
  id: string;
}
