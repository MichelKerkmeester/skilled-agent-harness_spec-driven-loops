// ───────────────────────────────────────────────────────────────────
// MODULE: Default Reject-Only Meaning Judge Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { createRejectOnlyMeaningJudge } from '../../src/fidelity/reject-only-judge.js';

const SOURCE = 'deploy the service to production and notify the team immediately';

function request(sourceText: string, candidateText: string, aborted = false) {
  const controller = new AbortController();
  if (aborted) {
    controller.abort();
  }
  return { sourceText, candidateText, signal: controller.signal };
}

describe('default reject-only meaning judge', () => {
  it('accepts a candidate that keeps most of the source content tokens', async () => {
    const judge = createRejectOnlyMeaningJudge();
    await expect(judge(request(
      SOURCE,
      'ship the service to production and notify the team immediately',
    ))).resolves.toBe('accept');
  });

  it('accepts an unchanged candidate', async () => {
    const judge = createRejectOnlyMeaningJudge();
    await expect(judge(request(SOURCE, SOURCE))).resolves.toBe('accept');
  });

  it('rejects a candidate that drops most of the source meaning', async () => {
    const judge = createRejectOnlyMeaningJudge();
    await expect(judge(request(SOURCE, 'deploy production notify'))).resolves.toBe('reject');
  });

  it('defers to the deterministic checks for very short sources', async () => {
    const judge = createRejectOnlyMeaningJudge();
    await expect(judge(request('keep it', 'ok'))).resolves.toBe('accept');
  });

  it('rejects when the request is already aborted', async () => {
    const judge = createRejectOnlyMeaningJudge();
    await expect(judge(request(SOURCE, SOURCE, true))).resolves.toBe('reject');
  });
});
