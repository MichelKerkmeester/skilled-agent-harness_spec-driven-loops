// ───────────────────────────────────────────────────────────────
// MODULE: Directive Lifecycle Boundary Tests
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';
import { handleDirectiveLifecycleBoundary } from '../../../hooks/claude/directive-lifecycle-boundary.js';
import {
  decideDirectiveLifecycleDelivery,
  InMemoryDirectiveLifecycleStore,
} from '../../../hooks/lib/directive-lifecycle.js';

const FULL = 'Advisor: live; use sk-code 0.91/0.23 pass.\nDirectives:\n- Comment hygiene';

function decide(state: InMemoryDirectiveLifecycleStore, sessionId: string) {
  return decideDirectiveLifecycleDelivery(FULL, {
    state,
    sessionId,
    sessionConfirmed: true,
    transcriptPath: `/sessions/${sessionId}.jsonl`,
    transcriptBytes: 100,
  });
}

describe('trusted lifecycle boundary handler', () => {
  it('advances only the identified session epoch', () => {
    const state = new InMemoryDirectiveLifecycleStore();
    decide(state, 's1');
    decide(state, 's2');
    expect(decide(state, 's1').suppressed).toBe(true);
    expect(decide(state, 's2').suppressed).toBe(true);

    expect(handleDirectiveLifecycleBoundary({ session_id: 's1', boundary: 'resume' }, state)).toBe(true);
    expect(decide(state, 's1').suppressed).toBe(false);
    expect(decide(state, 's2').suppressed).toBe(true);
  });

  it('reports a failed durable boundary mutation', () => {
    class FailingStore extends InMemoryDirectiveLifecycleStore {
      override advanceGeneration(): boolean { return false; }
      override advanceSessionEpoch(): boolean { return false; }
    }
    const state = new FailingStore();
    expect(handleDirectiveLifecycleBoundary({ session_id: 's1', boundary: 'resume' }, state)).toBe(false);
    expect(handleDirectiveLifecycleBoundary({ boundary: 'compact' }, state)).toBe(false);
  });

  it('invalidates all older records when identity is unavailable', () => {
    const state = new InMemoryDirectiveLifecycleStore();
    decide(state, 's1');
    decide(state, 's2');
    expect(handleDirectiveLifecycleBoundary({ boundary: 'compact' }, state)).toBe(true);
    expect(decide(state, 's1').suppressed).toBe(false);
    expect(decide(state, 's2').suppressed).toBe(false);
  });
});
