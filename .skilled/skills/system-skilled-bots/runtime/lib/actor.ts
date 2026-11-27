// ───────────────────────────────────────────────────────────────────
// MODULE: Actor
// ───────────────────────────────────────────────────────────────────
//
// An answer and a run both record who gave them, and a shared identity makes
// that name the only thing that tells two people apart. The actor is a name
// and nothing else: it is never a path and never a credential, so no
// filesystem call and no lookup ever takes it. This module is the one place
// the name is validated, so the command line, the answer writer and the run
// record all accept exactly the same set of names.
//
// Resolution takes the first source that gives a name. An explicit `--as`
// wins, and a bad one is a refusal rather than a quiet fall back, because a
// caller who typed a name must learn that it was rejected. The operator
// pinned into a job's environment counts only on a scheduled fire, since a
// shell that exports the same variable would otherwise claim the operator's
// name. The OS user is the last resort and may be absent.

import { userInfo } from 'node:os';

import type { Result } from './repo-config.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES & CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** The names an actor may take: one leading letter or digit, then up to 63 more of letters, digits, dot, underscore and hyphen. */
export const ACTOR_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;

/** The environment variable that carries the operator pinned into a job at install time. */
export const PINNED_OPERATOR_ENV = 'SKILLED_BOTS_OPERATOR';

/** Everything the resolution needs to name an actor. */
export interface ActorInput {
  /** The --as value, or the actor a library caller such as a channel holds. Absent or null when none was given. */
  as?: string | null;
  /** The environment the run or the answer executes under. Never the resolved job environment. */
  env: NodeJS.ProcessEnv;
  /** True only on a scheduled fire or a scheduled drain. */
  scheduled: boolean;
  /** The OS user lookup, a seam for tests. */
  osUser?: () => string;
}

// ───────────────────────────────────────────────────────────────────
// 2. NAMES
// ───────────────────────────────────────────────────────────────────

/**
 * Trim a candidate name and return it when it matches the pattern.
 *
 * Surrounding whitespace is forgiven because a shell hands over what was
 * typed, and a name that still fails the pattern yields null so the caller
 * decides whether that is a refusal or a source to skip.
 */
export function normalizeActor(value: string): string | null {
  const trimmed = value.trim();
  return ACTOR_PATTERN.test(trimmed) ? trimmed : null;
}

/** Compare two names after trimming. Case is significant, so `Ada` and `ada` are two different actors. */
export function sameActor(a: string, b: string): boolean {
  return a.trim() === b.trim();
}

/**
 * Name the OS user, or null when there is none to name.
 *
 * A lookup that throws is treated as no name at all, since a container or a
 * stripped environment can fail here and that must not stop a run.
 */
export function osActor(osUser: () => string = () => userInfo().username): string | null {
  let name: string;
  try {
    name = osUser();
  } catch {
    return null;
  }
  return normalizeActor(name);
}

// ───────────────────────────────────────────────────────────────────
// 3. RESOLUTION
// ───────────────────────────────────────────────────────────────────

/**
 * Resolve the actor for an answer or a run.
 *
 * The first source that gives a name wins, in this order: an explicit `--as`,
 * the operator pinned into a scheduled job's environment, then the OS user.
 * An explicit name that fails the pattern is a refusal and never falls
 * through, because a caller who typed a name must not be recorded as someone
 * else. The pinned operator is skipped on an unscheduled run, since a shell
 * that exports the variable would otherwise claim the operator's name.
 */
export function resolveActor(input: ActorInput): Result<string | null> {
  if (input.as !== undefined && input.as !== null) {
    const explicit = normalizeActor(input.as);
    if (explicit === null) return { ok: false, reason: 'actor-invalid', detail: '--as takes a name' };
    return { ok: true, value: explicit };
  }

  if (input.scheduled) {
    const pinned = input.env[PINNED_OPERATOR_ENV];
    if (pinned !== undefined) {
      const operator = normalizeActor(pinned);
      if (operator !== null) return { ok: true, value: operator };
    }
  }

  return { ok: true, value: osActor(input.osUser) };
}
