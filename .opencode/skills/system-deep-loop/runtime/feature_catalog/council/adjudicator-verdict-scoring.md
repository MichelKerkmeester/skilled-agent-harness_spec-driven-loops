---
title: "Adjudicator verdict scoring"
description: "Scores Round-N to Round-N+1 adjudicator verdict deltas using ADR-003 weights for option change, confidence delta, material-risk Jaccard delta, axis flip rate, and blocking-disagreement delta."
trigger_phrases:
  - "adjudicator verdict scoring"
  - "adjudicator-verdict-scoring.cjs"
  - "score verdict delta"
  - "jaccard delta axis flip rate"
  - "council convergence saturation score"
version: 1.4.0.4
---

# Adjudicator verdict scoring

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Scores Round-N to Round-N+1 adjudicator verdict deltas using ADR-003 weights for option change, confidence delta, material-risk Jaccard delta, axis flip rate, and blocking-disagreement delta.

This feature belongs to the council group and is catalogued as F020 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

Five-component weighted delta score per ADR-003: option_change (binary, weight 0.30), confidence_delta (numeric, 0.20), material_risk_jaccard_delta (set distance, 0.20), axis_flip_rate (per-axis change rate, 0.15), blocking_disagreement_delta (signed count, 0.15). Output is a single saturation score in [0,1] consumed by the council convergence check.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/system-deep-loop/runtime/tests/council/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/council/adjudicator-verdict-scoring.cjs` | Runtime | 5-component weighted delta scorer for adjudicator verdict round-over-round stability. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/council/adjudicator-verdict-scoring.vitest.ts` | Test | Primary regression coverage for Adjudicator verdict scoring. |

---

## 4. SOURCE METADATA

- Group: Council
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F020
- Feature file path: `council/adjudicator-verdict-scoring.md`
- Primary sources: `lib/council/adjudicator-verdict-scoring.cjs`, `tests/council/adjudicator-verdict-scoring.vitest.ts`
Related references:
- [round-state-jsonl.md](round-state-jsonl.md) — Round-state JSONL
- [cost-guards.md](cost-guards.md) — Cost guards
