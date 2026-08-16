// Subagent hand-off via environment variable.
//
// When Fast Mode is desired, we export PI_OPENAI_FAST_DESIRED=1 into the current
// process environment. Child pi processes (subagents) inherit process.env, so
// they start with the same preference automatically. They confirm it on
// session_start and only inject priority when on a supported model.

import { HANDOFF_ENV } from "./types.ts";

export function readHandoff(
  env: NodeJS.ProcessEnv = process.env,
): boolean | undefined {
  const value = env[HANDOFF_ENV];
  if (value === "1") return true;
  if (value === "0") return false;
  return undefined; // unset or invalid -> no opinion
}

export function writeHandoff(
  desired: boolean,
  env: NodeJS.ProcessEnv = process.env,
): void {
  env[HANDOFF_ENV] = desired ? "1" : "0";
}
