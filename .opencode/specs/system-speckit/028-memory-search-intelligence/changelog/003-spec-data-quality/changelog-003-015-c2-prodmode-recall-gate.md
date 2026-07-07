---
title: "Changelog: C2 Prod-Mode Recall Gate [003-spec-data-quality/003-retrieval-gated-tuning/015-prodmode-recall-gate]"
description: "Chronological changelog for the C2 Prod-Mode Recall Gate phase."
trigger_phrases:
 - "phase changelog"
 - "nested changelog"
 - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-21

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-spec-data-quality/003-retrieval-gated-tuning/015-prodmode-recall-gate` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-spec-data-quality`

### Summary

Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built.

### Added

- No new additions recorded.

### Changed

- Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built.

### Fixed

- No fixes recorded.

### Verification

- A degraded scratch prod profile fails REGRESSION mode with the recall-verdict code when any prod-column read falls, completeRecall@3/@5/@8, NDCG@K or top1 - PLANNED, not yet run
- A measured prod completeRecall@3/@5/@8 rise that holds NDCG@K and top1 passes PROMOTION mode, while an unchanged profile and a window-membership rise that degrades top1 do not - PLANNED, not yet run
- The gold set has no single-target query and every query carries a class tag - PLANNED, not yet run
- The gate refuses an eval-lens input - PLANNED, not yet run
- A missing baseline seeds a first baseline rather than scoring as complete - PLANNED, not yet run
- A multi-target class sitting at its K/N ceiling does not trip REGRESSION, proving the gate is ceiling-aware - PLANNED, not yet run

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/spec-corpus-golden.json` | Planned create | Multi-target gold set, one relevance set per query across the three measurability classes |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-spec-recall-gate.mjs` | Planned create | PROMOTION and REGRESSION gate reading only the prod-lens completeRecall@3/@5/@8 columns plus the order-sensitive NDCG@K and top1, ceiling-aware |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/spec-recall-baseline.json` | Planned create | Stored prod-column completeRecall@3/@5/@8, NDCG@K and top1 baseline with a per-class headline-K and provenance |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs` | Verify (no change) | Export already present at line 361 (`buildSearchLenses`, `meanCompleteRecallProfile`, `diffProfiles`, `MEASURABILITY_CLASSES`, `COMPLETE_RECALL_KS`). Confirm it covers the gate, add no second export, lenses unchanged |
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/eval/eval-metrics.js` | Verify (no change) | Order-sensitive `computeNDCG` and `computeMRR` already exported here. The gate computes its NDCG@K and top1 companion from them, no edit |

### Follow-Ups

- Build this gate per plan.md. It is GO-on-cost and buildable-now, two narrow files reusing the export already present at line 361 plus the shared eval-metrics functions, with the gate-owned copy-DB and orchestration it must replicate.
- A retrieval-class candidate earns a promotion only after the prod-mode completeRecall@3/@5/@8 benchmark rises AND the order-sensitive NDCG@K and top1 hold, because eval-mode gains do not transfer. The eval lens runs forceAllChannels with no truncation while the prod path applies the cliff-conditional confidence cut over the never-cut-below-3 minimum and the token budget. `DEFAULT_MIN_RESULTS = 3` is a floor not a cap, so the @5/@8 columns are the prod window the gate must read, not a hidden band.
