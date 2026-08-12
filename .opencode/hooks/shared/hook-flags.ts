// Typed ESM facade over the canonical CommonJS resolver, for the .ts adapters
// (Pi and Claude runtime hooks). It re-exports the single implementation in
// hook-flags.cjs via createRequire so kill-switch semantics never drift between
// module systems. See hook-flags.cjs for the contract.
import { createRequire } from "node:module";

interface HookFlagsModule {
  isHookEnabled(concern: string, env?: Record<string, string | undefined>): boolean;
  concernFlag(concern: string): string;
  isTruthy(value: unknown): boolean;
  MASTER_FLAG: string;
  LEGACY_ALIASES: Record<string, readonly string[]>;
}

const require = createRequire(import.meta.url);
const flags = require("./hook-flags.cjs") as HookFlagsModule;

export const isHookEnabled = flags.isHookEnabled;
export const concernFlag = flags.concernFlag;
export const isTruthy = flags.isTruthy;
export const MASTER_FLAG = flags.MASTER_FLAG;
export const LEGACY_ALIASES = flags.LEGACY_ALIASES;
export default flags;
