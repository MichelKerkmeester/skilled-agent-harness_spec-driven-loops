// Config loading / saving with user- and project-scoped resolution.
//
// Resolution order for *reading*:
//   1. project file:  <cwd>/.pi/extensions/openai-fast.json   (if it exists)
//   2. user file:     <agentDir>/extensions/openai-fast/config.json
//
// Writes go to whichever scope was resolved at load time.

import { promises as fs, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { getAgentDir } from "@earendil-works/pi-coding-agent";
import {
  DEFAULT_MODELS,
  DEFAULT_TIER,
  isServiceTier,
  PACKAGE_NAME,
  type FastConfig,
  type IndicatorMode,
} from "./types.ts";

export const DEFAULT_CONFIG: FastConfig = {
  persist: false,
  desired: false,
  tier: DEFAULT_TIER,
  models: [...DEFAULT_MODELS],
  indicator: "status",
};

export type ConfigScope = "user" | "project";

export interface LoadedConfig {
  scope: ConfigScope;
  path: string;
  config: FastConfig;
}

export function cloneConfig(config: FastConfig = DEFAULT_CONFIG): FastConfig {
  return {
    persist: config.persist,
    desired: config.desired,
    tier: config.tier,
    models: [...config.models],
    indicator: config.indicator,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const INDICATOR_MODES: IndicatorMode[] = ["status", "widget", "off"];

/** Coerce arbitrary parsed JSON into a safe config, field by field. */
export function normalizeConfig(
  raw: unknown,
  fallback: FastConfig = DEFAULT_CONFIG,
): FastConfig {
  const safe = cloneConfig(fallback);
  if (!isRecord(raw)) return safe;

  if (typeof raw.persist === "boolean") safe.persist = raw.persist;
  if (typeof raw.desired === "boolean") safe.desired = raw.desired;

  if (isServiceTier(raw.tier)) {
    safe.tier = raw.tier;
  }

  if (Array.isArray(raw.models)) {
    const models = raw.models
      .filter((m): m is string => typeof m === "string" && m.includes("/"))
      .map((m) => m.trim());
    // An explicit (even empty) array is honored so users can opt out entirely.
    safe.models = [...new Set(models)];
  }

  if (
    typeof raw.indicator === "string" &&
    INDICATOR_MODES.includes(raw.indicator as IndicatorMode)
  ) {
    safe.indicator = raw.indicator as IndicatorMode;
  }

  return safe;
}

export function getUserConfigPath(agentDir: string = getAgentDir()): string {
  return join(agentDir, "extensions", PACKAGE_NAME, "config.json");
}

export function getProjectConfigPath(cwd: string): string {
  return join(resolve(cwd), ".pi", "extensions", `${PACKAGE_NAME}.json`);
}

export function resolveConfigPath(cwd: string): {
  scope: ConfigScope;
  path: string;
} {
  const projectPath = getProjectConfigPath(cwd);
  if (existsSync(projectPath)) {
    return { scope: "project", path: projectPath };
  }
  return { scope: "user", path: getUserConfigPath() };
}

export async function loadConfig(cwd: string): Promise<LoadedConfig> {
  const { scope, path } = resolveConfigPath(cwd);
  try {
    const json = await fs.readFile(path, "utf8");
    return { scope, path, config: normalizeConfig(JSON.parse(json)) };
  } catch {
    return { scope, path, config: cloneConfig() };
  }
}

export async function saveConfig(
  path: string,
  config: FastConfig,
): Promise<void> {
  const normalized = normalizeConfig(config);
  await fs.mkdir(dirname(path), { recursive: true });
  await fs.writeFile(path, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
}
