// ───────────────────────────────────────────────────────────────────
// MODULE: CLI Guard Needs-Input Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

// cli-guards is CommonJS; pull the pending-question detector and classifier.
import {
  PENDING_QUESTION_PATTERN,
  classifyLineageFailure,
  detectPendingQuestion,
} from '../../scripts/lib/cli-guards.cjs';

const COMPLETE_MARKER = 'FANOUT_LINEAGE_COMPLETE:live-opencode';

describe('detectPendingQuestion', () => {
  it('detects a logic-sync tail', () => {
    const transcript = [
      'Iteration 3 produced a contradiction between the plan and the ledger.',
      'LOGIC-SYNC REQUIRED: plan.md contradicts tasks.md',
      'Which truth prevails?',
    ].join('\n');

    expect(detectPendingQuestion(transcript)).toEqual({ question: 'Which truth prevails?' });
  });

  it('detects a reply-menu prompt', () => {
    const transcript = [
      'Two options remain.',
      'Reply **A** to keep the current scope.',
      'Reply **B** to expand it.',
    ].join('\n');

    expect(detectPendingQuestion(transcript)).toEqual({ question: 'Reply **B** to expand it.' });
  });

  it('ignores a completed transcript', () => {
    const transcript = [
      'Should I proceed with the rewrite?',
      COMPLETE_MARKER,
    ].join('\n');

    expect(detectPendingQuestion(transcript)).toBeNull();
  });

  it('ignores a plain transcript', () => {
    expect(detectPendingQuestion('stub-done-without-artifact')).toBeNull();
  });

  it('exports the pending-question pattern', () => {
    expect(PENDING_QUESTION_PATTERN).toBeInstanceOf(RegExp);
  });
});

describe('classifyLineageFailure needs_input', () => {
  it('classifies needsInput as a non-retryable needs_input failure', () => {
    const result = classifyLineageFailure({ needsInput: true });

    expect(result.failure_class).toBe('needs_input');
    expect(result.retry_verdict).toBe('fatal');
    expect(result.retryable).toBe(false);
  });

  it('lets a timeout outrank needsInput', () => {
    const result = classifyLineageFailure({ needsInput: true, timedOut: true });

    expect(result.failure_class).toBe('timeout');
  });
});
