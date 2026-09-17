// ───────────────────────────────────────────────────────────────────
// MODULE: Default Reject-Only Meaning Judge
// ───────────────────────────────────────────────────────────────────

import type { RejectOnlyJudge, RejectOnlyJudgeRequest } from './types.js';

const MINIMUM_SOURCE_TOKENS = 6;
const MINIMUM_COVERAGE = 0.5;

/**
 * Default local meaning judge. It only ever accepts for continued processing or
 * adds a rejection, so it cannot authorize a candidate that deterministic checks
 * already rejected and cannot rank variants. Restored plaintext stays inside this
 * module, which never issues a request beyond the local process.
 */
export function createRejectOnlyMeaningJudge(): RejectOnlyJudge {
  return async (request: RejectOnlyJudgeRequest): Promise<'accept' | 'reject'> => {
    if (request.signal.aborted) {
      return 'reject';
    }
    const sourceTokens = contentTokens(request.sourceText);
    if (sourceTokens.size < MINIMUM_SOURCE_TOKENS) {
      return 'accept';
    }
    const candidateTokens = contentTokens(request.candidateText);
    const coverage = coveredFraction(sourceTokens, candidateTokens);
    return coverage >= MINIMUM_COVERAGE ? 'accept' : 'reject';
  };
}

function contentTokens(text: string): Set<string> {
  const tokens = new Set<string>();
  for (const match of text.toLowerCase().matchAll(/[a-z0-9_./-]{3,}/gu)) {
    tokens.add(match[0]);
  }
  return tokens;
}

function coveredFraction(source: ReadonlySet<string>, candidate: ReadonlySet<string>): number {
  let covered = 0;
  for (const token of source) {
    if (candidate.has(token)) {
      covered += 1;
    }
  }
  return covered / source.size;
}
