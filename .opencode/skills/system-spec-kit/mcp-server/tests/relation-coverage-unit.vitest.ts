// Unit coverage for the relation-coverage reporter's backfill contract. A bounded
// relation-inference backfill is now wired (handlers/causal-graph.ts surfaces it via
// memory_causal_stats({ backfill })), so the reporter advertises it HONESTLY:
// implemented:true with a real, callable command. The remediation hint must name that
// command (never the no-op memory_health({ autoRepair }) command) and still describe the
// complementary real paths (post-insert enrichment for 'supports' + explicit memory_causal_link).
import { describe, it, expect } from 'vitest';
import { buildRelationCoverageState, BACKFILL_COMMAND } from '../lib/causal/relation-coverage';

describe('buildRelationCoverageState — backfill contract', () => {
  it('marks the relation backfill implemented with a real, callable command', () => {
    const state = buildRelationCoverageState({ supports: 10 });
    expect(state.backfillJob.name).toBe('autonomous-causal-relation-backfill');
    expect(state.backfillJob.implemented).toBe(true);
    expect(state.backfillJob.command).toBe(BACKFILL_COMMAND);
    expect(state.backfillJob.command).not.toBeNull();
    expect(state.backfillJob.command).toContain('memory_causal_stats');
  });

  it('below-target hint names the real backfill command, never the no-op autoRepair command', () => {
    // Only 'supports' edges → 'caused' is 0% (< its 5% minimum) → status below_target.
    const state = buildRelationCoverageState({ supports: 10 });
    expect(state.status).toBe('below_target');
    expect(state.remediationHint).not.toBeNull();
    expect(state.remediationHint).not.toContain('autoRepair');
    expect(state.remediationHint).toContain('memory_causal_stats');
    expect(state.remediationHint).toContain('memory_causal_link');
  });

  it('returns a null hint when every relation target is met', () => {
    // caused + supports both above their 5% minimum, nothing above a maximum.
    const state = buildRelationCoverageState({ caused: 5, supports: 5 });
    expect(state.status).toBe('met');
    expect(state.remediationHint).toBeNull();
  });

  it('reports no_edges when the graph is empty', () => {
    const state = buildRelationCoverageState({});
    expect(state.status).toBe('no_edges');
  });
});
