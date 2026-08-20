// ───────────────────────────────────────────────────────────────────
// MODULE: Authority Root Resolver
// ───────────────────────────────────────────────────────────────────
//
// Resolves the durable, mode-global authority root directory.
//
// Authority is a single durable fact per deployment. The authority root is
// mode-global and must never be scoped per-run: a per-run root would fork
// authority across concurrent or sequential runs, allowing two runs to
// disagree on which writer is canonical.
//
// That is why the default DISCOVERS the repository root rather than trusting
// a directory it was handed. A caller near the write boundary usually holds a
// per-run path — a spec folder, an artifact directory — and passing one of
// those in as "the root" reads as correct while quietly giving every run its
// own authority. Discovery removes that whole class of mistake: the fallback
// is the checkout, not whatever the caller happened to be holding.

import { execFileSync } from 'node:child_process';
import { isAbsolute, join, resolve } from 'node:path';

export interface ResolveAuthorityRootOptions {
  /**
   * Repository root. Supply this only when the caller genuinely knows the
   * checkout root — never a per-run or per-spec directory.
   */
  readonly repositoryRoot?: string;
  /** Environment variables. Defaults to process.env. */
  readonly environment?: NodeJS.ProcessEnv;
  /** Seam for tests; production shells out to git. */
  readonly discoverRepositoryRoot?: () => string | null;
}

function gitTopLevel(): string | null {
  try {
    const stdout = execFileSync('git', ['rev-parse', '--show-toplevel'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    const trimmed = stdout.trim();
    return trimmed.length > 0 ? trimmed : null;
  } catch {
    return null;
  }
}

/**
 * Resolve the durable mode-global authority root directory.
 *
 * `DEEP_LOOP_AUTHORITY_ROOT` wins when set; a relative value resolves against
 * the repository root. Otherwise an explicitly supplied repository root is
 * used, and failing that the checkout is discovered from the working
 * directory. `process.cwd()` is the last resort so the function always
 * returns an absolute path rather than throwing at a write boundary.
 */
export function resolveAuthorityRoot(options?: ResolveAuthorityRootOptions): string {
  const environment = options?.environment ?? process.env;
  const discover = options?.discoverRepositoryRoot ?? gitTopLevel;

  const explicitRoot = options?.repositoryRoot;
  const base = explicitRoot !== undefined && explicitRoot.length > 0
    ? (isAbsolute(explicitRoot) ? explicitRoot : resolve(process.cwd(), explicitRoot))
    : (discover() ?? process.cwd());

  const configuredRoot = environment.DEEP_LOOP_AUTHORITY_ROOT?.trim();
  if (configuredRoot !== undefined && configuredRoot.length > 0) {
    return isAbsolute(configuredRoot) ? configuredRoot : resolve(base, configuredRoot);
  }

  return join(base, '.opencode/skills/.authority-state');
}
