// ───────────────────────────────────────────────────────────────────
// MODULE: Hook Flags ESM Facade
// ───────────────────────────────────────────────────────────────────

// Typed ESM facade over the canonical CommonJS resolver, for the .ts adapters
// (Pi and Claude runtime hooks). It re-exports the single implementation in
// hook-flags.cjs via createRequire so kill-switch semantics never drift between
// module systems. See hook-flags.cjs for the contract.
import { createRequire } from "node:module";

export interface HookFlagDecision {
  enabled: boolean;
  key: string | null;
  reason: "master" | "kill" | "runtime" | "global" | "default";
}

interface HookFlagsModule {
  isHookEnabled(
    concern: string,
    env?: Record<string, string | undefined>,
    config?: Record<string, string | undefined>,
    options?: { runtime?: string },
  ): boolean;
  hookFlagDecision(
    concern: string,
    env?: Record<string, string | undefined>,
    config?: Record<string, string | undefined>,
    options?: { runtime?: string },
  ): HookFlagDecision;
  concernFlag(concern: string): string | null;
  runtimeEnableFlag(concern: string, runtime?: string): string | null;
  isTruthy(value: unknown): boolean;
  loadConfigFile(filePath: string): Record<string, string>;
  configPath(): string;
  MASTER_FLAG: string;
  LEGACY_ALIASES: Record<string, readonly string[]>;
  DEFAULT_OFF: Record<string, string>;
  RUNTIMES: readonly string[];
}

const require = createRequire(import.meta.url);
const flags = require("./hook-flags.cjs") as HookFlagsModule;

export const isHookEnabled = flags.isHookEnabled;
export const hookFlagDecision = flags.hookFlagDecision;
export const concernFlag = flags.concernFlag;
export const runtimeEnableFlag = flags.runtimeEnableFlag;
export const isTruthy = flags.isTruthy;
export const MASTER_FLAG = flags.MASTER_FLAG;
export const LEGACY_ALIASES = flags.LEGACY_ALIASES;
export const DEFAULT_OFF = flags.DEFAULT_OFF;
export const RUNTIMES = flags.RUNTIMES;
export const loadConfigFile = flags.loadConfigFile;
export const configPath = flags.configPath;
export default flags;
