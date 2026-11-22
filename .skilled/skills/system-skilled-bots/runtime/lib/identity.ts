// ───────────────────────────────────────────────────────────────────
// MODULE: Hub Repository Identity
// ───────────────────────────────────────────────────────────────────
//
// Every label, queue, lease and state folder is keyed by repository
// identity. The shared resolver returns null for a repository with no
// remote, and two such repositories would then collide on one key. This
// module adds the declared identity from bots/config.json on top of the
// shared resolver and turns "no answer" into a refusal, never a fallback
// path, so two unknown repositories can never share state.

import { readRepoConfig, repositoryIdentity } from './repo-config.js';

import type { RepoConfig, Result } from './repo-config.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────────

export type IdentitySource = 'config' | 'env' | 'origin';

export interface ResolvedIdentity {
  identity: string;
  source: IdentitySource;
}

export interface IdentityInput {
  /** The repository checkout to resolve. */
  checkoutRoot: string;
  /** The config already read for that checkout. */
  config: RepoConfig;
  /** The environment the shared resolver and git see; defaults to process.env. */
  env?: NodeJS.ProcessEnv;
}

// ───────────────────────────────────────────────────────────────────
// 2. RESOLUTION
// ───────────────────────────────────────────────────────────────────

/**
 * Resolve a checkout's identity: the declared config field first, then the
 * environment and the origin remote through the shared resolver.
 *
 * @param input - Checkout root, its config and the environment.
 * @returns The identity and where it came from, or the refusal `identity-unknown`.
 */
export function resolveIdentity(input: IdentityInput): Result<ResolvedIdentity> {
  if (input.config.identity !== null) {
    return { ok: true, value: { identity: input.config.identity, source: 'config' } };
  }
  const found = repositoryIdentity.currentRepository({
    root: input.checkoutRoot,
    env: input.env ?? process.env,
  });
  if (found.identity === null || found.source === null) {
    return { ok: false, reason: 'identity-unknown' };
  }
  return { ok: true, value: { identity: found.identity, source: found.source } };
}

/**
 * The one guard install and enqueue call before they touch any state.
 *
 * It reads bots/config.json itself so no caller can skip the declared
 * identity, and it refuses while identity is unknown.
 *
 * @param checkoutRoot - The repository checkout the caller acts for.
 * @param env - The environment; defaults to process.env.
 * @returns The identity, or a refusal (`identity-unknown`, or a config refusal).
 */
export function identityGuard(checkoutRoot: string, env: NodeJS.ProcessEnv = process.env): Result<ResolvedIdentity> {
  const config = readRepoConfig(checkoutRoot);
  if (!config.ok) return config;
  return resolveIdentity({ checkoutRoot, config: config.value, env });
}

/**
 * Encode an identity as one folder name.
 *
 * Hosting services treat `owner/name` case-insensitively, so case variants
 * of one repository share a key. The rest is percent-encoded, which is
 * one-to-one and leaves no path separator in the name.
 *
 * @param identity - An `owner/name` identity.
 * @returns A filesystem-safe folder name.
 */
export function identityKey(identity: string): string {
  return encodeURIComponent(identity.toLowerCase());
}
