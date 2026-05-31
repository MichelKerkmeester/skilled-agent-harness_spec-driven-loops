---
title: "Causal Graph Relation-Window Balance Metrics and Auto-Edge Caps"
description: "Adds deltaByRelation, dominantRelation, dominantRelationShare, balanceStatus, plus remediationHint to the causal-stats response. Zero-fills all six relation types. Reconciles health with meetsTarget. Gates all auto-edge insert paths behind a configurable per-relation per-window cap."
trigger_phrases:
  - "causal graph relation window metrics"
  - "causal graph balance status"
  - "supersedes burst cap"
  - "deltaByRelation dominantRelation"
  - "enforceRelationWindowCap"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-27

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/006-causal-graph-relation-window-metrics` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings`

### Summary

The `memory_causal_stats` handler had three separate problems that together hid relation-skew from operators. First, the `by_relation` map silently dropped relation types with a zero count, so a supersedes-only burst looked like a healthy distribution. Second, `health:"healthy"` could co-exist with `meetsTarget:false`, making the top-level health signal unreliable. Third, no per-relation per-window cap existed, so a prediction-error reconsolidation path could produce hundreds of supersedes edges in 15 minutes with no throttle.

Five new behaviors shipped. The `by_relation` map now zero-fills all six valid relation types. The handler emits `deltaByRelation`, `dominantRelation`, `dominantRelationShare`, `balanceStatus`, `remediationHint`, plus `windowStartedAt` on every response. `meetsTarget:false` now forces `health:"degraded"`. All three insert paths (`insertEdge`, `insertEdgesBatch`, `bulkInsertEdges`) route through a configurable `enforceRelationWindowCap` guard, with cap defaults env-configurable at 15 minutes and 100 edges per relation. A live `memory_causal_stats()` probe confirmed the new fields appear in a running daemon. The `npm run build` command exits non-zero on an out-of-scope type error in `memory-context.ts`, but targeted Vitest and dist-marker checks pass.

### Added

- `deltaByRelation`, `dominantRelation`, `dominantRelationShare`, `balanceStatus`, `remediationHint`, plus `windowStartedAt` fields in the `memory_causal_stats` response
- `enforceRelationWindowCap` helper in `causal-edges.ts` with a rolling 15-minute window and a 100-edge-per-relation default
- `SPECKIT_CAUSAL_RELATION_WINDOW_MS` and `SPECKIT_CAUSAL_RELATION_CAP_PER_WINDOW` environment variables for cap tuning
- Test fixture T014-CS4 verifying zero-fill on an empty database
- Test fixture T014-CS5 verifying `health:"degraded"` when `meetsTarget:false`
- Test fixture T014-CS6 verifying `balanceStatus:"relation_skewed"` and remediation hint on a 60-supersedes burst

### Changed

- `by_relation` map in the causal-stats response now always includes all six keys (`caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports`), zero-filled where no edges exist
- `health` field now reports `degraded` whenever `meetsTarget` is `false`
- `insertEdge`, `insertEdgesBatch`, plus `bulkInsertEdges` now route new inserts through `enforceRelationWindowCap` before writing

### Fixed

- `memory_causal_stats` omitted relation types with zero counts, hiding supersedes-only bursts from operators
- `health:"healthy"` was returned alongside `meetsTarget:false`, making the top-level signal misleading
- Prediction-error supersedes path had no volume guard, allowing unbounded edge growth within a single time window

### Verification

| Check | Result | Evidence |
|-------|--------|----------|
| Targeted Vitest (causal-graph and causal-edges suites) | PASS | 5 files passed, 226 tests passed |
| Empty DB zero-fill (T014-CS4) | PASS | `by_relation` and `deltaByRelation` contain all six keys at zero |
| Health/meetsTarget reconciliation (T014-CS5) | PASS | `meetsTarget:false` produces `health:"degraded"` |
| Supersedes burst skew (T014-CS6) | PASS | 60 supersedes edges yield `balanceStatus:"relation_skewed"` with remediation hint |
| Per-window cap fixture | PASS | 105 insert attempts produce 100 inserted and 5 throttled WARN calls |
| `npm run build` | FAIL | `tsc --build` exits non-zero on `handlers/memory-context.ts` TS2741 missing `intentEvidence`. Out-of-scope type error unrelated to this packet. |
| `grep -l deltaByRelation` dist check | PASS | Matched `dist/handlers/causal-graph.js` |
| `grep -l balanceStatus` dist check | PASS | Matched `dist/handlers/causal-graph.js` |
| `grep -l enforceRelationWindowCap` dist check | PASS | Matched `dist/lib/storage/causal-edges.js` |
| Dist timestamp check | PASS | `dist/handlers/causal-graph.js` and `dist/lib/storage/causal-edges.js` mtimes newer than source |
| Live `memory_causal_stats()` probe | PASS | 2026-04-27T10:12:36Z. `total_edges:2527`, all 6 `by_relation` keys present, `deltaByRelation` zero-filled, `balanceStatus:"insufficient_data"` consistent with idle window |
| `validate.sh --strict` | PASS | Errors 0, Warnings 0 |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts` | Added relation-window stats helper. Zero-filled all six relation keys. New response fields: `deltaByRelation`, `dominantRelation`, `dominantRelationShare`, `balanceStatus`, `remediationHint`, `windowStartedAt`. `meetsTarget:false` now sets `health:"degraded"`. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts` | Added `enforceRelationWindowCap` with rolling-window logic. Insert gating added to `insertEdge`, `insertEdgesBatch`, plus `bulkInsertEdges`. Env-configurable cap defaults. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts` | Added T014-CS4 zero-fill fixture, T014-CS5 health reconciliation fixture, plus T014-CS6 supersedes-burst skew fixture. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts` | Added 105-insert cap fixture asserting 100 inserted and 5 throttled WARNs. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/create-record.ts` | Read-only verified. Prediction-error supersedes route already routes through `causalEdges.insertEdge`. No changes needed. |

### Follow-Ups

- Fix the out-of-scope `handlers/memory-context.ts` TS2741 type error so `npm run build` exits cleanly. This is tracked in a separate packet.
- Run a live burst probe against the cap fixture in a running MCP daemon session to confirm the 100-edge throttle fires in practice.
- Evaluate whether the 80% dominance and 50-edge minimum thresholds need tuning based on production telemetry after the first rollout.
