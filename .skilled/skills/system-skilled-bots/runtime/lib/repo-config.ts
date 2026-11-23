// ───────────────────────────────────────────────────────────────────
// MODULE: Repository Config (bots/config.json)
// ───────────────────────────────────────────────────────────────────
//
// One reader for the per-repository bot policy, so the checker, runner,
// queue, installer and status index never parse the file themselves or
// disagree on a default. A missing file is a valid state that yields the
// defaults. An unreadable or malformed file is a refusal with a named
// reason, never a silent fall back to defaults, because a typo in a policy
// file must not quietly widen what an unattended run may do.

import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { isAbsolute, join } from 'node:path';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES & CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** A value or a refusal that names why. Every contract library returns this shape. */
export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; reason: string; detail?: string };

/** How a run is isolated from the checkout it belongs to. */
export type Isolation = 'worktree' | 'shared';

export const ISOLATION_VALUES: readonly Isolation[] = ['worktree', 'shared'];

/** Bounds that keep user-level state from growing without limit. */
export interface RetentionConfig {
  indexRowsPerIdentity: number;
  runFoldersPerBot: number;
  skippedSlotsPerSummary: number;
  closedNeedsYouPerIdentity: number;
}

export interface NeedsYouConfig {
  expiryDays: number;
}

export interface RepoConfig {
  /** Executor kinds a bot in this repository may use; null means no restriction declared. */
  allowedExecutorKinds: string[] | null;
  /** Absolute user-level state root that replaces the XDG default; never moves the run root. */
  stateRoot: string | null;
  defaultIsolation: Isolation | null;
  /** Declared `owner/name` identity; wins over the environment and the origin remote. */
  identity: string | null;
  /** Opt-in for git-hook triggers; off unless the repository says so. */
  gitHookTrigger: boolean;
  needsYou: NeedsYouConfig;
  retention: RetentionConfig;
  /**
   * Checkout-relative paths a bot worktree links from the main checkout,
   * replacing the launcher's default list. Absent when the file does not set it.
   */
  worktreeSharedPaths?: string[];
}

/** The shape of sk-code's repository-identity.cjs, imported and never copied. */
export interface RepositoryIdentityModule {
  REPOSITORY_PATTERN: RegExp;
  currentRepository(options?: { root?: string; env?: NodeJS.ProcessEnv }): {
    identity: string | null;
    source: 'env' | 'origin' | null;
  };
}

const requireCjs = createRequire(import.meta.url);

export const repositoryIdentity = requireCjs(
  '../../../sk-code/shared/scripts/lib/repository-identity.cjs',
) as RepositoryIdentityModule;

/** The `owner/name` pattern the identity resolver itself applies, so the two never drift. */
export const IDENTITY_PATTERN: RegExp = repositoryIdentity.REPOSITORY_PATTERN;

export const CONFIG_RELATIVE_PATH = join('bots', 'config.json');

export const DEFAULT_RETENTION: Readonly<RetentionConfig> = Object.freeze({
  indexRowsPerIdentity: 1000,
  runFoldersPerBot: 200,
  skippedSlotsPerSummary: 100,
  closedNeedsYouPerIdentity: 200,
});

export const DEFAULT_NEEDS_YOU: Readonly<NeedsYouConfig> = Object.freeze({ expiryDays: 7 });

const TOP_LEVEL_KEYS = new Set([
  'allowedExecutorKinds',
  'stateRoot',
  'defaultIsolation',
  'identity',
  'gitHookTrigger',
  'needsYou',
  'retention',
  'worktreeSharedPaths',
]);

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

/** The config used when a repository has no bots/config.json. */
export function defaultRepoConfig(): RepoConfig {
  return {
    allowedExecutorKinds: null,
    stateRoot: null,
    defaultIsolation: null,
    identity: null,
    gitHookTrigger: false,
    needsYou: { ...DEFAULT_NEEDS_YOU },
    retention: { ...DEFAULT_RETENTION },
  };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

function invalid(key: string, detail?: string): { ok: false; reason: string; detail?: string } {
  return detail === undefined ? { ok: false, reason: `${key}-invalid` } : { ok: false, reason: `${key}-invalid`, detail };
}

function readPositiveIntegerBlock<T extends object>(
  blockName: string,
  raw: unknown,
  defaults: Readonly<T>,
): Result<T> {
  if (!isPlainObject(raw)) return invalid(blockName, 'expected an object');
  const out = { ...defaults } as Record<string, number>;
  for (const [key, value] of Object.entries(raw)) {
    if (!(key in defaults)) return { ok: false, reason: 'unknown-key', detail: `${blockName}.${key}` };
    if (!isPositiveInteger(value)) return invalid(`${blockName}.${key}`, 'expected a positive integer');
    out[key] = value;
  }
  return { ok: true, value: out as T };
}

// ───────────────────────────────────────────────────────────────────
// 3. PARSE & READ
// ───────────────────────────────────────────────────────────────────

/**
 * Validate a parsed config object and fill its defaults.
 *
 * @param raw - The parsed JSON value of bots/config.json.
 * @returns The typed config, or a refusal naming the first bad key.
 */
export function parseRepoConfig(raw: unknown): Result<RepoConfig> {
  if (!isPlainObject(raw)) return { ok: false, reason: 'config-invalid', detail: 'expected a JSON object' };
  const config = defaultRepoConfig();

  for (const key of Object.keys(raw)) {
    if (!TOP_LEVEL_KEYS.has(key)) return { ok: false, reason: 'unknown-key', detail: key };
  }

  if ('allowedExecutorKinds' in raw) {
    const kinds = raw.allowedExecutorKinds;
    if (!Array.isArray(kinds) || kinds.some((kind) => typeof kind !== 'string' || kind.trim() === '')) {
      return invalid('allowedExecutorKinds', 'expected a list of non-empty strings');
    }
    config.allowedExecutorKinds = [...kinds] as string[];
  }

  if ('stateRoot' in raw) {
    const root = raw.stateRoot;
    if (typeof root !== 'string' || !isAbsolute(root)) return invalid('stateRoot', 'expected an absolute path');
    config.stateRoot = root;
  }

  if ('defaultIsolation' in raw) {
    const isolation = raw.defaultIsolation;
    if (!ISOLATION_VALUES.includes(isolation as Isolation)) {
      return invalid('defaultIsolation', `expected one of ${ISOLATION_VALUES.join(', ')}`);
    }
    config.defaultIsolation = isolation as Isolation;
  }

  if ('identity' in raw) {
    const identity = raw.identity;
    if (typeof identity !== 'string' || !IDENTITY_PATTERN.test(identity)) {
      return invalid('identity', 'expected owner/name');
    }
    config.identity = identity;
  }

  if ('gitHookTrigger' in raw) {
    if (typeof raw.gitHookTrigger !== 'boolean') return invalid('gitHookTrigger', 'expected true or false');
    config.gitHookTrigger = raw.gitHookTrigger;
  }

  if ('needsYou' in raw) {
    const block = readPositiveIntegerBlock('needsYou', raw.needsYou, DEFAULT_NEEDS_YOU);
    if (!block.ok) return block;
    config.needsYou = block.value;
  }

  if ('retention' in raw) {
    const block = readPositiveIntegerBlock('retention', raw.retention, DEFAULT_RETENTION);
    if (!block.ok) return block;
    config.retention = block.value;
  }

  // Shape only here: whether each entry resolves is the isolation module's
  // rule, so the checker can name that rule's own invariant.
  if ('worktreeSharedPaths' in raw) {
    const paths = raw.worktreeSharedPaths;
    if (!Array.isArray(paths) || paths.some((path) => typeof path !== 'string' || path.trim() === '')) {
      return invalid('worktreeSharedPaths', 'expected a list of non-empty strings');
    }
    config.worktreeSharedPaths = [...paths] as string[];
  }

  return { ok: true, value: config };
}

/**
 * Read bots/config.json from a checkout.
 *
 * A missing file yields the defaults. Any other read failure is reported as
 * `config-unreadable`, so an unreadable path is never mistaken for a missing one.
 *
 * @param checkoutRoot - The repository checkout that holds the bots/ folder.
 * @returns The typed config, or a refusal with a named reason.
 */
export function readRepoConfig(checkoutRoot: string): Result<RepoConfig> {
  const path = join(checkoutRoot, CONFIG_RELATIVE_PATH);
  let text: string;
  try {
    text = readFileSync(path, 'utf8');
  } catch (error: unknown) {
    const code = (error as NodeJS.ErrnoException | null)?.code;
    if (code === 'ENOENT') return { ok: true, value: defaultRepoConfig() };
    return { ok: false, reason: 'config-unreadable', detail: code ?? 'unknown error' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'config-invalid', detail: 'not valid JSON' };
  }
  return parseRepoConfig(parsed);
}
