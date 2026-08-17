// ───────────────────────────────────────────────────────────────────
// MODULE: Config
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import { existsSync } from "node:fs";
import { basename, dirname, join, resolve, sep } from "node:path";
import { getAgentDir } from "@earendil-works/pi-coding-agent";
import {
  DEFAULT_SERVICE_TIER,
  LEGACY_PACKAGE_NAME,
  PACKAGE_NAME,
  SUPPORTED_PROVIDERS,
  type FastModeConfig,
  type FastTarget,
  type ResolvedConfigPath,
} from "./types";

// ───────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

type RecordLike = Record<string, unknown>;

/** Options used to select the applicable configuration path. */
export type SelectConfigPathOptions = {
  cwd: string;
  extensionDir?: string;
  agentDir?: string;
  exists?: (path: string) => boolean;
};

/** Options used when loading configuration for a scope. */
export type LoadConfigOptions = Omit<SelectConfigPathOptions, "exists"> & {
  fallback?: FastModeConfig;
};

/** Configuration loaded together with its resolved path. */
export type LoadedConfig = ResolvedConfigPath & {
  config: FastModeConfig;
};

// ───────────────────────────────────────────────────────────────────
// 3. CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** Default Fast Mode settings used when no persisted configuration exists. */
export const DEFAULT_CONFIG: FastModeConfig = {
  enabled: false,
  targets: [
    { provider: "openai", model: "gpt-5.4", serviceTier: DEFAULT_SERVICE_TIER },
    { provider: "openai", model: "gpt-5.5", serviceTier: DEFAULT_SERVICE_TIER },
    { provider: "openai", model: "gpt-5.6", serviceTier: DEFAULT_SERVICE_TIER },
    {
      provider: "openai",
      model: "gpt-5.6-sol",
      serviceTier: DEFAULT_SERVICE_TIER,
    },
    {
      provider: "openai",
      model: "gpt-5.6-terra",
      serviceTier: DEFAULT_SERVICE_TIER,
    },
    {
      provider: "openai",
      model: "gpt-5.6-luna",
      serviceTier: DEFAULT_SERVICE_TIER,
    },
    {
      provider: "openai-codex",
      model: "gpt-5.4",
      serviceTier: DEFAULT_SERVICE_TIER,
    },
    {
      provider: "openai-codex",
      model: "gpt-5.5",
      serviceTier: DEFAULT_SERVICE_TIER,
    },
    {
      provider: "openai-codex",
      model: "gpt-5.6",
      serviceTier: DEFAULT_SERVICE_TIER,
    },
    {
      provider: "openai-codex",
      model: "gpt-5.6-sol",
      serviceTier: DEFAULT_SERVICE_TIER,
    },
    {
      provider: "openai-codex",
      model: "gpt-5.6-terra",
      serviceTier: DEFAULT_SERVICE_TIER,
    },
    {
      provider: "openai-codex",
      model: "gpt-5.6-luna",
      serviceTier: DEFAULT_SERVICE_TIER,
    },
  ],
};

const SUPPORTED_PROVIDER_SET = new Set<string>(SUPPORTED_PROVIDERS);

// ───────────────────────────────────────────────────────────────────
// 4. HELPERS
// ───────────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is RecordLike {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cloneTarget(target: FastTarget): FastTarget {
  return {
    provider: target.provider,
    model: target.model,
    serviceTier: target.serviceTier ?? DEFAULT_SERVICE_TIER,
  };
}

function normalizeTarget(rawTarget: unknown): FastTarget | undefined {
  if (!isRecord(rawTarget)) return undefined;

  const rawProvider = rawTarget.provider;
  const rawModel = rawTarget.model;

  if (typeof rawProvider !== "string" || typeof rawModel !== "string") {
    return undefined;
  }

  const provider = rawProvider.trim().toLowerCase();
  const model = rawModel.trim();

  if (!provider || !model || !SUPPORTED_PROVIDER_SET.has(provider)) {
    return undefined;
  }

  const rawServiceTier = rawTarget.serviceTier;
  const serviceTier =
    typeof rawServiceTier === "string" && rawServiceTier.trim() !== ""
      ? rawServiceTier.trim()
      : DEFAULT_SERVICE_TIER;

  return { provider, model, serviceTier };
}

// ───────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/** Clone a Fast Mode configuration without sharing target objects. */
export function cloneConfig(
  config: FastModeConfig = DEFAULT_CONFIG,
): FastModeConfig {
  return {
    enabled: config.enabled,
    targets: config.targets.map(cloneTarget),
  };
}

/** Keep the persisted toggle while replacing targets with this package's current list. */
export function syncSupportedTargets(config: FastModeConfig): FastModeConfig {
  return {
    enabled: config.enabled,
    targets: DEFAULT_CONFIG.targets.map(cloneTarget),
  };
}

/** Normalize an unknown target list while removing invalid and duplicate targets. */
export function normalizeTargets(
  rawTargets: unknown,
): FastTarget[] | undefined {
  if (!Array.isArray(rawTargets)) return undefined;

  const normalized: FastTarget[] = [];
  const seen = new Set<string>();

  for (const rawTarget of rawTargets) {
    const target = normalizeTarget(rawTarget);
    if (!target) continue;

    const key = `${target.provider}\u0000${target.model}`;
    if (seen.has(key)) continue;

    seen.add(key);
    normalized.push(target);
  }

  return normalized;
}

/**
 * Convert arbitrary config input into a safe Fast Mode config.
 *
 * Invalid top-level values fall back entirely. Invalid or missing fields fall
 * back field-by-field, while an explicit empty targets array is preserved so a
 * user can opt out of every target in a scoped config.
 */
export function normalizeConfig(
  raw: unknown,
  fallback: FastModeConfig = DEFAULT_CONFIG,
): FastModeConfig {
  const safeFallback = cloneConfig(fallback);

  if (!isRecord(raw)) return safeFallback;

  const enabled =
    typeof raw.enabled === "boolean" ? raw.enabled : safeFallback.enabled;
  const targets = normalizeTargets(raw.targets) ?? safeFallback.targets;

  return { enabled, targets };
}

/** Parse JSON into a normalized Fast Mode configuration. */
export function parseConfigJson(
  json: string,
  fallback: FastModeConfig = DEFAULT_CONFIG,
): FastModeConfig {
  try {
    return normalizeConfig(JSON.parse(json), fallback);
  } catch {
    return cloneConfig(fallback);
  }
}

/** Resolve the user-level configuration path. */
export function getUserConfigPath(agentDir: string = getAgentDir()): string {
  return join(agentDir, "extensions", `${PACKAGE_NAME}-config.json`);
}

/** Resolve the project-level configuration path. */
export function getProjectConfigPath(cwd: string): string {
  return join(resolve(cwd), ".pi", `${PACKAGE_NAME}-config.json`);
}

/** Resolve the legacy user-level configuration path. */
export function getLegacyUserConfigPath(
  agentDir: string = getAgentDir(),
): string {
  return join(agentDir, "extensions", LEGACY_PACKAGE_NAME, "config.json");
}

/** Resolve the legacy project-level configuration path. */
export function getLegacyProjectConfigPath(cwd: string): string {
  return join(resolve(cwd), ".pi", LEGACY_PACKAGE_NAME, "config.json");
}

/** Determine whether an extension directory belongs to the current project. */
export function isProjectLocalExtension(
  extensionDir: string | undefined,
  cwd: string,
): boolean {
  if (!extensionDir) return false;

  const projectPiDir = resolve(cwd, ".pi");
  const resolvedExtensionDir = resolve(extensionDir);

  return (
    resolvedExtensionDir === projectPiDir ||
    resolvedExtensionDir.startsWith(
      projectPiDir.endsWith(sep) ? projectPiDir : `${projectPiDir}${sep}`,
    )
  );
}

/** Select the project or user configuration path for the current context. */
export function selectConfigPath({
  cwd,
  extensionDir,
  agentDir,
  exists = existsSync,
}: SelectConfigPathOptions): ResolvedConfigPath {
  const projectPath = getProjectConfigPath(cwd);
  if (exists(projectPath)) {
    return { scope: "project", path: projectPath };
  }

  if (isProjectLocalExtension(extensionDir, cwd)) {
    return { scope: "project", path: projectPath };
  }

  return { scope: "user", path: getUserConfigPath(agentDir) };
}

/** Load and normalize configuration from a specific path.
 *
 * @param configPath - Path to the persisted configuration file.
 * @param fallback - Configuration used when the file cannot be read.
 * @returns The normalized persisted configuration or the fallback clone.
 */
export async function loadConfigFromPath(
  configPath: string,
  fallback: FastModeConfig = DEFAULT_CONFIG,
): Promise<FastModeConfig> {
  try {
    const json = await fs.readFile(configPath, "utf8");
    return parseConfigJson(json, fallback);
  } catch {
    return cloneConfig(fallback);
  }
}

/** Load configuration using scope selection and migrate legacy files when needed.
 *
 * @param options - Scope, directory, and fallback settings for resolution.
 * @returns The selected path and normalized configuration.
 */
export async function loadConfigForScope(
  options: LoadConfigOptions,
): Promise<LoadedConfig> {
  const selected = selectConfigPath(options);
  const fallback = options.fallback ?? DEFAULT_CONFIG;
  const legacyPath =
    selected.scope === "project"
      ? getLegacyProjectConfigPath(options.cwd)
      : getLegacyUserConfigPath(options.agentDir);

  if (!existsSync(selected.path) && existsSync(legacyPath)) {
    const config = await loadConfigFromPath(legacyPath, fallback);
    await saveConfigToPath(selected.path, config);
    return { ...selected, config };
  }

  const config = await loadConfigFromPath(selected.path, fallback);
  return { ...selected, config };
}

/** Persist normalized configuration with an atomic temporary-file rename.
 *
 * @param configPath - Destination path for the configuration file.
 * @param config - Configuration to normalize and persist.
 * @returns A promise that resolves after the file is written.
 */
export async function saveConfigToPath(
  configPath: string,
  config: FastModeConfig,
): Promise<void> {
  const normalized = normalizeConfig(config);
  const configDir = dirname(configPath);
  const tempPath = join(
    configDir,
    `.${basename(configPath)}.${randomUUID()}.tmp`,
  );

  await fs.mkdir(configDir, { recursive: true });
  try {
    await fs.writeFile(
      tempPath,
      `${JSON.stringify(normalized, null, 2)}\n`,
      "utf8",
    );
    await fs.rename(tempPath, configPath);
  } catch (error: unknown) {
    await fs.rm(tempPath, { force: true });
    throw error;
  }
}

/** Persist configuration to the path selected for the current scope. */
export async function saveConfigForScope(
  options: SelectConfigPathOptions,
  config: FastModeConfig,
): Promise<ResolvedConfigPath> {
  const selected = selectConfigPath(options);
  await saveConfigToPath(selected.path, config);
  return selected;
}
