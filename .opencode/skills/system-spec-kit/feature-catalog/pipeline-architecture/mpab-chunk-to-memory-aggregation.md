---
title: "MPAB chunk-to-memory aggregation"
description: "MPAB chunk-to-memory aggregation combines multiple chunk scores into a single memory-level score using a damped bonus formula."
trigger_phrases:
  - "mpab chunk-to-memory aggregation"
  - "chunk score aggregation"
  - "memory-level score"
  - "damped bonus formula"
  - "combine chunk scores"
version: 3.6.0.14
---

# MPAB chunk-to-memory aggregation

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

MPAB chunk-to-memory aggregation combines multiple chunk scores into a single memory-level score using a damped bonus formula.

A long document gets split into smaller pieces for searching, but you want to see the whole document in your results, not a list of fragments. This feature combines the scores from all the pieces back into a single score for the whole document. The best piece counts the most, and the other pieces add a small bonus. That way a document with several good matches ranks higher than one with just a single lucky hit.

---

## 2. HOW IT WORKS

When a spec-doc record file splits into chunks, each chunk gets its own score. Multi-Parent Aggregated Bonus combines those chunk scores into a single memory-level score using the formula `sMax + 0.3 * sum(remaining) / sqrt(N)`. The top chunk score becomes the base, and the remaining chunks contribute a damped bonus.

Guards handle the edge cases: N=0 returns 0, N=1 returns the raw score and N>1 applies MPAB. The bonus coefficient (0.3) is exported as `MPAB_BONUS_COEFFICIENT` for tuning. The aggregation runs in Stage 3 of the 4-stage pipeline after RRF fusion and before state filtering. Runs behind the `SPECKIT_DOCSCORE_AGGREGATION` flag (default ON).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp-server/lib/scoring/mpab-aggregation.ts` | Lib | MPAB chunk aggregation |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp-server/tests/mpab-aggregation.vitest.ts` | Automated test | MPAB aggregation tests |

---

## 4. SOURCE METADATA
- Group: Pipeline Architecture
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `pipeline-architecture/mpab-chunk-to-memory-aggregation.md`
Related references:
- [4-stage-pipeline-refactor.md](../../feature-catalog/pipeline-architecture/4-stage-pipeline-refactor.md) — 4-stage pipeline refactor
- [chunk-ordering-preservation.md](../../feature-catalog/pipeline-architecture/chunk-ordering-preservation.md) — Chunk ordering preservation
