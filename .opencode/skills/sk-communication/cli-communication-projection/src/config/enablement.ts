// ───────────────────────────────────────────────────────────────────
// MODULE: Projection Enablement Gate
// ───────────────────────────────────────────────────────────────────

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/** Environment variable that force-decides projection enablement when present. */
export const PROJECTION_ENABLE_ENV = 'COMMUNICATION_PROJECTION_ENABLED';

/** Git-ignored opt-in file at the package root, consulted only when the env var is unset. */
const LOCAL_OVERRIDE_URL = new URL('../../enablement.local.json', import.meta.url);

/** Shape of the local opt-in file. */
export interface LocalEnablementOverride {
  enabled?: unknown;
}

/**
 * Decide enablement from the two opt-in sources without touching the filesystem,
 * so the rule stays exhaustively testable. The environment variable wins when
 * set, which lets tests and CI force either state; otherwise the parsed local
 * override may switch it on. With neither opting in the answer is false.
 */
export function resolveProjectionEnablement(
  envValue: string | undefined,
  localOverride: LocalEnablementOverride | null,
): boolean {
  if (envValue !== undefined && envValue.trim() !== '') {
    const normalized = envValue.trim().toLowerCase();
    return normalized === '1' || normalized === 'true' || normalized === 'on';
  }
  return localOverride?.enabled === true;
}

function readLocalOverride(): LocalEnablementOverride | null {
  try {
    const text = readFileSync(fileURLToPath(LOCAL_OVERRIDE_URL), 'utf8');
    const parsed: unknown = JSON.parse(text);
    return typeof parsed === 'object' && parsed !== null
      ? (parsed as LocalEnablementOverride)
      : null;
  } catch {
    return null;
  }
}

/**
 * Communication projection stays OFF unless someone opts in on this machine.
 * Dormant-by-default means pulling the repo never changes anyone's CLI output,
 * and an operator who wants the rewrite enables it privately without committing
 * that choice for everyone else. Set COMMUNICATION_PROJECTION_ENABLED, or drop a
 * git-ignored enablement.local.json holding { "enabled": true } at the package
 * root. Every activation path must consult this before projecting.
 */
export function isProjectionEnabled(): boolean {
  return resolveProjectionEnablement(
    process.env[PROJECTION_ENABLE_ENV],
    readLocalOverride(),
  );
}
