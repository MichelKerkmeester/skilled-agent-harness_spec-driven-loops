---
title: "Bayesian scorer"
description: "Two primitives: computeScore returns a Bayesian success probability via Laplace smoothing (success+1)/(total+2); shouldDemote returns true when score<0.5 and totalCalls>=3."
trigger_phrases:
  - "bayesian scorer"
  - "bayesian-scorer.ts"
  - "score executor reliability"
  - "laplace smoothing success probability"
  - "demotion threshold check"
version: 1.4.0.5
---

# Bayesian scorer

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Scores executor reliability and decides when enough evidence supports demotion.

This feature belongs to the scoring group and is catalogued as F010 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

Smoothed success scoring and demotion threshold checks.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/deep-loop/bayesian-scorer.ts` | Runtime | Smoothed success scoring and demotion threshold checks. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/bayesian-scorer.vitest.ts` | Test | Primary regression coverage for Bayesian scorer. |

---

## 4. SOURCE METADATA

- Group: Scoring
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F010
- Feature file path: `scoring/bayesian-scorer.md`
- Primary sources: `lib/deep-loop/bayesian-scorer.ts`, `tests/unit/bayesian-scorer.vitest.ts`
