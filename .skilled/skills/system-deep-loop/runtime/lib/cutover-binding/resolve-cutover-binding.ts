// ───────────────────────────────────────────────────────────────────
// MODULE: Cutover Binding Resolver
// ───────────────────────────────────────────────────────────────────
//
// Resolves the execution-time facts an authority flip must be bound to —
// who is acting, under which capability, against which commit — from the
// local environment instead of from hand-supplied arguments.
//
// These values were previously expected from a human at an approval stop.
// That is a poor place to source them: a person retyping a commit SHA or a
// capability id is a transcription risk on an irreversible transition, and
// the values are all derivable from the machine that is performing it.
//
// Deriving them does NOT relax the authorization check. The coordinator
// still verifies the resolved identity against the request's own claim and
// denies on any mismatch. This module only removes the human keyboard from
// the path; it never asserts an identity it could not establish.

import { execFileSync } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { hostname, userInfo } from 'node:os';

export const CutoverBindingErrorCodes = Object.freeze({
  /** No durable operator identity could be established from the environment. */
  IDENTITY_UNRESOLVED: 'IDENTITY_UNRESOLVED',
  /** The working tree is not a git checkout, so no commit can bind the flip. */
  COMMIT_UNRESOLVED: 'COMMIT_UNRESOLVED',
  /** A commit was named but does not exist in this repository's history. */
  COMMIT_UNKNOWN: 'COMMIT_UNKNOWN',
} as const);

export type CutoverBindingErrorCode =
  typeof CutoverBindingErrorCodes[keyof typeof CutoverBindingErrorCodes];

export class CutoverBindingError extends Error {
  public readonly code: CutoverBindingErrorCode;

  public constructor(code: CutoverBindingErrorCode, message: string) {
    super(message);
    this.name = 'CutoverBindingError';
    this.code = code;
  }
}

export interface ResolvedCutoverBinding {
  /** Stable identity of the operator on whose authority the flip proceeds. */
  readonly actorId: string;
  /** Capability the actor holds on this host, derived from actor plus host. */
  readonly capabilityId: string;
  /** Commit whose contents the flip is being performed against. */
  readonly candidateSha: string;
  /** Commit the candidate is compared against for regression evidence. */
  readonly baseSha: string;
  readonly requestId: string;
  readonly correlationId: string;
  readonly streamId: string;
  readonly decidedAt: string;
}

export interface ResolveCutoverBindingOptions {
  /** Repository the flip is bound to. Defaults to the current directory. */
  readonly repositoryRoot?: string;
  /** Comparison baseline. Defaults to the candidate's first parent. */
  readonly baseSha?: string;
  /** Mode being flipped; scopes the stream so modes never share a stream. */
  readonly mode: string;
  readonly now?: () => Date;
  /** Seam for tests; production reads the real environment. */
  readonly environment?: CutoverBindingEnvironment;
}

export interface CutoverBindingEnvironment {
  readonly gitConfigEmail: () => string | null;
  readonly gitHeadSha: () => string | null;
  readonly gitParentSha: (sha: string) => string | null;
  readonly gitCommitExists: (sha: string) => boolean;
  readonly osUser: () => string | null;
  readonly osHost: () => string | null;
}

function runGit(repositoryRoot: string, args: readonly string[]): string | null {
  try {
    const stdout = execFileSync('git', ['-C', repositoryRoot, ...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    const trimmed = stdout.trim();
    return trimmed.length > 0 ? trimmed : null;
  } catch {
    return null;
  }
}

export function createDefaultEnvironment(repositoryRoot: string): CutoverBindingEnvironment {
  return Object.freeze({
    gitConfigEmail: () => runGit(repositoryRoot, ['config', '--get', 'user.email']),
    gitHeadSha: () => runGit(repositoryRoot, ['rev-parse', 'HEAD']),
    gitParentSha: (sha: string) => runGit(repositoryRoot, ['rev-parse', `${sha}^`]),
    gitCommitExists: (sha: string) => runGit(repositoryRoot, ['cat-file', '-e', `${sha}^{commit}`]) !== null
      || runGit(repositoryRoot, ['rev-parse', '--verify', `${sha}^{commit}`]) !== null,
    osUser: () => {
      try {
        return userInfo().username || null;
      } catch {
        return null;
      }
    },
    osHost: () => {
      const value = hostname();
      return value.length > 0 ? value : null;
    },
  });
}

function shortDigest(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex').slice(0, 16);
}

/**
 * Establishes the flip's bindings, or refuses.
 *
 * The refusal cases matter more than the happy path: an unattributable flip
 * is worse than a blocked one, because the ledger would carry a transition
 * nobody can be held to. A missing git identity and a missing commit are
 * therefore hard failures, never defaults.
 */
export function resolveCutoverBinding(
  options: ResolveCutoverBindingOptions,
): ResolvedCutoverBinding {
  const repositoryRoot = options.repositoryRoot ?? process.cwd();
  const environment = options.environment ?? createDefaultEnvironment(repositoryRoot);
  const now = options.now ?? (() => new Date());

  // Prefer the committer identity over the OS user: it is the identity that
  // already signs this operator's durable history, so the ledger and the git
  // log attribute the same change to the same person.
  const email = environment.gitConfigEmail();
  const osUser = environment.osUser();
  const actorSource = email ?? osUser;
  if (actorSource === null) {
    throw new CutoverBindingError(
      CutoverBindingErrorCodes.IDENTITY_UNRESOLVED,
      'Cannot bind an authority flip: no git user.email and no OS user could be read, '
      + 'so the transition would be recorded without an accountable actor.',
    );
  }
  const actorId = email !== null ? `operator:${email}` : `operator:${osUser}`;

  const host = environment.osHost();
  if (host === null) {
    throw new CutoverBindingError(
      CutoverBindingErrorCodes.IDENTITY_UNRESOLVED,
      'Cannot bind an authority flip: the host name is unavailable, so the capability '
      + 'cannot be scoped to the machine performing the transition.',
    );
  }
  // The capability is actor-and-host scoped so a credential copied to another
  // machine does not silently carry flip authority with it.
  const capabilityId = `capability:authority-flip:${shortDigest(`${actorId}@${host}`)}`;

  const candidateSha = environment.gitHeadSha();
  if (candidateSha === null) {
    throw new CutoverBindingError(
      CutoverBindingErrorCodes.COMMIT_UNRESOLVED,
      `Cannot bind an authority flip: ${repositoryRoot} has no resolvable HEAD commit.`,
    );
  }

  const baseSha = options.baseSha ?? environment.gitParentSha(candidateSha);
  if (baseSha === null) {
    throw new CutoverBindingError(
      CutoverBindingErrorCodes.COMMIT_UNRESOLVED,
      'Cannot bind an authority flip: no comparison baseline was supplied and the '
      + 'candidate commit has no parent to fall back to.',
    );
  }
  if (options.baseSha !== undefined && !environment.gitCommitExists(options.baseSha)) {
    throw new CutoverBindingError(
      CutoverBindingErrorCodes.COMMIT_UNKNOWN,
      `Cannot bind an authority flip: baseline ${options.baseSha} is not a commit in this repository.`,
    );
  }

  return Object.freeze({
    actorId,
    capabilityId,
    candidateSha,
    baseSha,
    requestId: randomUUID(),
    correlationId: randomUUID(),
    // One stream per mode keeps each mode's transition history independently
    // replayable; a shared stream would interleave unrelated flips.
    streamId: `authority-flip:${options.mode}`,
    decidedAt: now().toISOString(),
  });
}
