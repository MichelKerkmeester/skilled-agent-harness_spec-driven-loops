// Unit coverage for the relation-coverage reporter's HONEST backfill contract: the
// "autonomous-causal-relation-backfill" is advertised in metadata but NOT wired, so the reporter
// must mark it implemented:false / command:null and the remediation hint must describe the real
// mechanism (post-insert enrichment for 'supports' + explicit memory_causal_link for typed
// relations) instead of pointing at the no-op memory_health({ autoRepair }) command.
import { describe, it, expect } from 'vitest';
import { buildRelationCoverageState } from '../lib/causal/relation-coverage';

describe('buildRelationCoverageState — honest backfill contract', () => {
  it('marks the autonomous backfill not-implemented with a null command', () => {
    const state = buildRelationCoverageState({ supports: 10 });
    expect(state.backfillJob.name).toBe('autonomous-causal-relation-backfill');
    expect(state.backfillJob.implemented).toBe(false);
    expect(state.backfillJob.command).toBeNull();
  });

  it('below-target hint describes the real mechanism, never the no-op autoRepair command', () => {
    // Only 'supports' edges → 'caused' is 0% (< its 5% minimum) → status below_target.
    const state = buildRelationCoverageState({ supports: 10 });
    expect(state.status).toBe('below_target');
    expect(state.remediationHint).not.toBeNull();
    expect(state.remediationHint).not.toContain('autoRepair');
    expect(state.remediationHint).toContain('not auto-backfilled');
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
