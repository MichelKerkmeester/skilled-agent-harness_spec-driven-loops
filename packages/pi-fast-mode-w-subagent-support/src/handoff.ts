// ───────────────────────────────────────────────────────────────────
// MODULE: Handoff Contract
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { HANDOFF_ENV, type FastModePreference } from "./types";

// ───────────────────────────────────────────────────────────────────
// 2. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/** Read the inherited Fast Mode preference from the process environment.
 *
 * @param env - Environment object containing the handoff value.
 * @returns `true`, `false`, or `undefined` when no valid preference is set.
 */
export function readHandoff(
  env: NodeJS.ProcessEnv = process.env,
): FastModePreference {
  const value = env[HANDOFF_ENV];
  if (value === "1") return true;
  if (value === "0") return false;
  return undefined;
}

/** Write the current Fast Mode preference to the process environment.
 *
 * @param env - Environment object receiving the handoff value.
 * @param value - Whether Fast Mode should be enabled.
 * @returns Nothing.
 */
export function writeHandoff(
  env: NodeJS.ProcessEnv,
  value: boolean,
): void {
  env[HANDOFF_ENV] = value ? "1" : "0";
}
