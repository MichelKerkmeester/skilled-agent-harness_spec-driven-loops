// ───────────────────────────────────────────────────────────────────
// MODULE: Types and Constants
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** Whether Fast Mode is explicitly enabled, disabled, or unspecified. */
export type FastModePreference = boolean | undefined;

/** Provider identifiers supported by Fast Mode. */
export type SupportedProvider = (typeof SUPPORTED_PROVIDERS)[number];

/** A provider/model target that can receive Fast Mode payload settings. */
export type FastTarget = {
  provider: string;
  model: string;
  serviceTier?: string;
};

/** Persisted Fast Mode settings and the targets they apply to. */
export type FastModeConfig = {
  enabled: boolean;
  targets: FastTarget[];
};

/** Provider and model identifiers for the active model. */
export type ModelRef = {
  provider: string;
  id: string;
};

/** Configuration scope used for resolving persisted settings. */
export type ConfigScope = "user" | "project";

/** A resolved configuration file path and its scope. */
export type ResolvedConfigPath = {
  scope: ConfigScope;
  path: string;
};

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** Canonical package name used for configuration and status keys. */
export const PACKAGE_NAME = "pi-fast-mode-w-subagent-support";

/** Previous package name retained for legacy configuration migration. */
export const LEGACY_PACKAGE_NAME = "pi-openai-fast-mode";

/** Status key used to publish the Fast Mode indicator. */
export const STATUS_KEY = PACKAGE_NAME;

/** Default service tier applied when none is configured. */
export const DEFAULT_SERVICE_TIER = "priority";

/** Environment variable used to pass the enabled preference between sessions. */
export const HANDOFF_ENV = "PI_FAST_MODE_W_SUBAGENT_SUPPORT";

/** Provider identifiers accepted by configuration and payload matching. */
export const SUPPORTED_PROVIDERS = ["openai", "openai-codex"] as const;
