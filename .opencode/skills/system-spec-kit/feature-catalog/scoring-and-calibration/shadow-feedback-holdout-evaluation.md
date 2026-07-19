---
title: "Shadow scoring with holdout evaluation"
description: "Shadow scoring compares would-have-changed rankings against live rankings when an explicit replay pool is available; clean production schemas skip scheduled replay because raw query text is not durably stored."
trigger_phrases:
  - "shadow scoring with holdout evaluation"
  - "SPECKIT_SHADOW_FEEDBACK"
  - "holdout query shadow ranking comparison"
  - "Kendall tau NDCG shadow scoring"
  - "promotion gate weekly improvement cycle"
version: 3.6.0.9
---

# Shadow scoring with holdout evaluation

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Shadow scoring compares would-have-changed rankings against live rankings when replayable queries are supplied by an explicit test or replay pool. Clean production consumption logs store query fingerprints, not raw query text, so the scheduled replay runtime currently skips cycles instead of writing misleading shadow rows.

Before switching to new ranking logic in production, you want proof that it actually improves results. The library can compare live and shadow rankings for a deterministic holdout set and compute a scorecard, but the production scheduler has no privacy-preserving raw-query replay pool today. Until such a pool exists, an empty scheduled cycle on a clean schema is expected behavior, not a failure.

---

## 2. HOW IT WORKS

The shadow scoring module computes per-result rank deltas between live and shadow rankings, producing Kendall tau correlation, NDCG delta, and MRR delta metrics. When replayable query text is available to the evaluation helper, holdout queries are deterministically selected via a seed (default 20% holdout). Results are logged to the `shadow_scoring_log` table for auditability, with per-query comparison results and cycle-level aggregation stored in `shadow_cycle_results`.

Promotion requires 2+ consecutive weeks of stable improvement (`PROMOTION_THRESHOLD_WEEKS = 2`). The evaluation window is 7 days (`EVALUATION_WINDOW_MS`). The promotion gate returns one of three recommendations: `promote`, `wait`, or `rollback`.

Enabled by default (graduated). Set `SPECKIT_SHADOW_FEEDBACK=false` to disable. Key invariants: shadow-only (no live ranking columns are mutated), holdout queries are deterministic when a replay pool exists, and clean-schema scheduled runs may log a skipped cycle with no scoring rows.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp-server/lib/feedback/shadow-scoring.ts` | Lib | Rank comparison, Kendall tau, NDCG/MRR deltas, cycle aggregation, promotion gate |
| `mcp-server/lib/feedback/shadow-evaluation-runtime.ts` | Lib | Production runtime scheduler wired into `context-server.ts`; scheduled replay currently does not execute on clean schemas because `consumption_log` retains no raw query text, so no replay pool exists |
| `mcp-server/lib/search/search-flags.ts` | Lib | `isShadowFeedbackEnabled()` flag accessor |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp-server/tests/shadow-scoring-holdout.vitest.ts` | Automated test | Flag behavior, rank comparison, holdout selection, cycle evaluation, promotion gate logic |
| `mcp-server/tests/shadow-evaluation-runtime.vitest.ts` | Automated test | Runtime scheduler lifecycle, replay execution, weekly cycle detection |

---

## 4. SOURCE METADATA
- Group: Scoring And Calibration
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `scoring-and-calibration/shadow-feedback-holdout-evaluation.md`
Related references:
- [learned-stage2-weight-combiner.md](../../feature-catalog/scoring-and-calibration/learned-stage2-weight-combiner.md) — Learned Stage 2 weight combiner
- [calibrated-overlap-bonus.md](../../feature-catalog/scoring-and-calibration/calibrated-overlap-bonus.md) — Calibrated overlap bonus
