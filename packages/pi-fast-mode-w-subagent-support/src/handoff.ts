import { HANDOFF_ENV, type FastModePreference } from "./types";

export function readHandoff(
  env: NodeJS.ProcessEnv = process.env,
): FastModePreference {
  const value = env[HANDOFF_ENV];
  if (value === "1") return true;
  if (value === "0") return false;
  return undefined;
}

export function writeHandoff(
  env: NodeJS.ProcessEnv,
  value: boolean,
): void {
  env[HANDOFF_ENV] = value ? "1" : "0";
}
