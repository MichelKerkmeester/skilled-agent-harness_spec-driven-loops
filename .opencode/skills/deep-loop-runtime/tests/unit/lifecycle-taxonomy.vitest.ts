import { describe, expect, it } from 'vitest';

import { createRequire } from 'node:module';

const nodeRequire = createRequire(import.meta.url);

const TAXONOMY = '../../lib/deep-loop/lifecycle-taxonomy.cjs';
const JOURNAL = '../../../deep-loop-workflows/deep-improvement/scripts/shared/improvement-journal.cjs';

const taxonomy = nodeRequire(TAXONOMY) as {
  STOP_REASONS: Record<string, string>;
  SESSION_OUTCOMES: Record<string, string>;
};
const journal = nodeRequire(JOURNAL) as {
  STOP_REASONS: Record<string, string>;
  SESSION_OUTCOMES: Record<string, string>;
  validateEvent: (event: unknown) => { valid: boolean; errors: string[] };
};

describe('lifecycle taxonomy (promoted contract)', () => {
  it('declares exactly the seven stopReasons in contractual order', () => {
    expect(Object.values(taxonomy.STOP_REASONS)).toEqual([
      'converged',
      'maxIterationsReached',
      'blockedStop',
      'manualStop',
      'error',
      'stuckRecovery',
      'userPaused',
    ]);
  });

  it('declares exactly the four sessionOutcomes in contractual order', () => {
    expect(Object.values(taxonomy.SESSION_OUTCOMES)).toEqual([
      'keptBaseline',
      'promoted',
      'rolledBack',
      'advisoryOnly',
    ]);
  });

  it('freezes both enums', () => {
    expect(Object.isFrozen(taxonomy.STOP_REASONS)).toBe(true);
    expect(Object.isFrozen(taxonomy.SESSION_OUTCOMES)).toBe(true);
  });
});

describe('improvement-journal consumes the promoted taxonomy', () => {
  it('re-exports the exact same frozen objects', () => {
    expect(journal.STOP_REASONS).toBe(taxonomy.STOP_REASONS);
    expect(journal.SESSION_OUTCOMES).toBe(taxonomy.SESSION_OUTCOMES);
  });

  it('accepts a valid session_end event', () => {
    const result = journal.validateEvent({
      eventType: 'session_end',
      details: { stopReason: 'converged', sessionOutcome: 'promoted' },
    });
    expect(result).toEqual({ valid: true, errors: [] });
  });

  it('preserves the exact invalid-stopReason error string', () => {
    const result = journal.validateEvent({
      eventType: 'session_end',
      details: { stopReason: 'nope', sessionOutcome: 'promoted' },
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'Invalid stopReason: "nope". Valid reasons: converged, maxIterationsReached, blockedStop, manualStop, error, stuckRecovery, userPaused',
    );
  });

  it('preserves the exact invalid-sessionOutcome error string', () => {
    const result = journal.validateEvent({
      eventType: 'session_ended',
      details: { stopReason: 'converged', sessionOutcome: 'nope' },
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'Invalid sessionOutcome: "nope". Valid outcomes: keptBaseline, promoted, rolledBack, advisoryOnly',
    );
  });

  it('still requires stopReason and sessionOutcome on terminal events', () => {
    const result = journal.validateEvent({ eventType: 'session_end', details: {} });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('session_ended/session_end events MUST include details.stopReason');
    expect(result.errors).toContain('session_ended/session_end events MUST include details.sessionOutcome');
  });
});
