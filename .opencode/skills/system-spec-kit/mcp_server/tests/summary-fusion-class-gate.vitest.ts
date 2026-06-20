// Class-gates the summary fusion lane so known-item intents stop losing their
// exact target document to a summary/community candidate. The lane only ever
// measured benefit on thematic classes, so a known-item query skips the lane
// entirely while a thematic (`understand`) query keeps it active.
//
// The gate is on participation, not just fusion weight: the lane's candidates
// enter dedup, the cross-channel bonus, and top-K competition before any weight
// applies, so a down-weighted lane still displaces the known-item target.
//
// These are ON-path unit assertions over the gate predicate and weight resolver.
// The gate lives entirely inside the SPECKIT_SUMMARY_FUSION_LANE=on block, so
// with the flag off the lane is never added and these are never consulted —
// flag-off byte identity is preserved upstream and is not what this file tests.

import { describe, expect, it } from 'vitest';

import { __testables } from '../lib/search/hybrid-search';
import { classifyIntent } from '../lib/search/intent-classifier';

const {
  resolveSummaryFusionLaneWeight,
  shouldRunSummaryFusionLane,
  SUMMARY_LANE_THEMATIC_INTENTS,
} = __testables;

// A query whose runtime classifier resolves to the thematic `understand` intent.
// The gate must keep the lane active here.
const THEMATIC_QUERY = 'explain how memory search works';
// A query whose runtime classifier resolves to a known-item intent (find_spec).
// The gate must skip the lane here.
const KNOWN_ITEM_QUERY = 'find the spec for memory search remediation';

describe('summary fusion lane class gate', () => {
  it('classifies the thematic fixture as understand and the known-item fixture as a non-thematic intent', () => {
    // Anchor the fixtures to the real classifier so the gate assertions below
    // cannot silently pass on a query that drifted out of its intent.
    expect(classifyIntent(THEMATIC_QUERY).intent).toBe('understand');
    const knownItemIntent = classifyIntent(KNOWN_ITEM_QUERY).intent;
    expect(knownItemIntent).not.toBe('understand');
    expect(SUMMARY_LANE_THEMATIC_INTENTS.has(knownItemIntent)).toBe(false);
  });

  it('suppresses the summary lane for an explicit known-item intent', () => {
    expect(shouldRunSummaryFusionLane(KNOWN_ITEM_QUERY, 'find_decision')).toBe(false);
    expect(shouldRunSummaryFusionLane(KNOWN_ITEM_QUERY, 'find_spec')).toBe(false);
  });

  it('suppresses the summary lane via the classifier fallback when intent is undefined', () => {
    // The default eval and runtime path leaves options.intent undefined, so the
    // gate must fall back to classifyIntent — otherwise it would never fire on
    // the path the retrieval eval actually measures.
    expect(shouldRunSummaryFusionLane(KNOWN_ITEM_QUERY, undefined)).toBe(false);
  });

  it('keeps the summary lane active for a thematic understand intent', () => {
    expect(shouldRunSummaryFusionLane(THEMATIC_QUERY, 'understand')).toBe(true);
    // The classifier fallback path must reach the same verdict for a query that
    // classifies thematic on its own.
    expect(shouldRunSummaryFusionLane(THEMATIC_QUERY, undefined)).toBe(true);
  });

  it('resolves a real, active fusion weight for the thematic intent it admits', () => {
    // When the lane is admitted, its weight is the strategy-derived weight (not a
    // suppression sentinel) and large enough to actually participate in fusion.
    const weight = resolveSummaryFusionLaneWeight(THEMATIC_QUERY, 'understand', {});
    expect(weight).toBeGreaterThan(0.01);
  });

  it('never lists a known-item intent among the thematic intents that admit the lane', () => {
    // Structural guard: the gate keeps the lane only for thematic queries, so the
    // known-item intents must never leak into the admit-set.
    for (const knownItem of ['find_spec', 'find_decision', 'fix_bug', 'security_audit', 'add_feature', 'refactor']) {
      expect(SUMMARY_LANE_THEMATIC_INTENTS.has(knownItem)).toBe(false);
    }
  });
});
