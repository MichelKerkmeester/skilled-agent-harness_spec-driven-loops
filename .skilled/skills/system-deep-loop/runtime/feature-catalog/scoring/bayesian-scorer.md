---
title: "Bayesian scorer"
description: "Scores executor reliability and decides when enough evidence supports demotion."
trigger_phrases:
  - "bayesian scorer"
  - "bayesian-scorer.ts"
  - "score executor reliability"
  - "laplace smoothing success probability"
  - "demotion threshold check"
version: 1.4.0.5
---

# Bayesian scorer

---

## 1. OVERVIEW

Scores executor reliability and decides when enough evidence supports demotion.

This feature belongs to the scoring group and is catalogued as F010 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

Smoothed success scoring and demotion threshold checks.

The implementation is source-backed and covered by runtime-owned tests under `.skilled/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/deep-loop/bayesian-scorer.ts` | Runtime | Smoothed success scoring and demotion threshold checks. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/bayesian-scorer.vitest.ts` | Automated test | Primary regression coverage for Bayesian scorer. |

---

## 4. SOURCE METADATA

- Group: Scoring
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `scoring/bayesian-scorer.md`
- Primary sources: `lib/deep-loop/bayesian-scorer.ts`, `tests/unit/bayesian-scorer.vitest.ts`
