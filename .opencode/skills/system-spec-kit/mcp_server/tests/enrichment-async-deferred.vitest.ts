// Behavior coverage for the default async enrichment lane: the save path returns the deferred
// result immediately (background enrichment runs via setImmediate + the bounded scheduler), so
// the response must report every lane deferred — never a 'ran'/'complete' status — with the
// async reason and a backfill follow-up so callers know the work is queued, not skipped.
import { describe, it, expect } from 'vitest';
import { buildDeferredEnrichmentResult } from '../handlers/save/post-insert';

const LANES = ['causalLinks', 'entityExtraction', 'summaries', 'entityLinking', 'graphLifecycle'] as const;

describe('Async enrichment deferred result', () => {
  it('async-background deferral marks every lane deferred with the async reason + backfill follow-up', () => {
    const r = buildDeferredEnrichmentResult('async-background');
    expect(r.causalLinksResult).toBeNull();
    expect(r.executionStatus.status).toBe('deferred');
    expect(r.executionStatus.reason).toBe('async-background');
    expect(r.executionStatus.followUpAction).toBe('runEnrichmentBackfill');
    for (const lane of LANES) {
      expect(r.enrichmentStatus[lane].status).toBe('deferred');
      // Lanes must not be mislabeled as planner-first skip when work is queued in the background.
      expect(r.enrichmentStatus[lane].reason).toBe('async_background');
    }
  });

  it('defaults to async-background and never reports a ran/complete status', () => {
    const r = buildDeferredEnrichmentResult();
    expect(r.executionStatus.status).toBe('deferred');
    expect(r.executionStatus.reason).toBe('async-background');
    for (const lane of LANES) {
      expect(r.enrichmentStatus[lane].status).not.toBe('ran');
    }
  });

  it('planner-first deferral keeps the planner-first lane reason', () => {
    const r = buildDeferredEnrichmentResult('planner-first-mode');
    expect(r.executionStatus.reason).toBe('planner-first-mode');
    for (const lane of LANES) {
      expect(r.enrichmentStatus[lane].reason).toBe('planner_first_mode');
    }
  });
});
