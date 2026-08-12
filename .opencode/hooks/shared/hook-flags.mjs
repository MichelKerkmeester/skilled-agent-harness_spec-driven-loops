// ESM facade over the canonical CommonJS resolver so .mjs adapters and OpenCode
// ESM plugins share one implementation with the .cjs adapters. Keeping a single
// source of truth in hook-flags.cjs means the kill-switch semantics can never
// drift between module systems. See hook-flags.cjs for the contract.
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const flags = require("./hook-flags.cjs");

export const isHookEnabled = flags.isHookEnabled;
export const concernFlag = flags.concernFlag;
export const isTruthy = flags.isTruthy;
export const MASTER_FLAG = flags.MASTER_FLAG;
export const LEGACY_ALIASES = flags.LEGACY_ALIASES;
export default flags;
