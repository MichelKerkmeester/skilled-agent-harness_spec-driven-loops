---
title: "Convergence score-delta"
description: "Adds a convergence score-delta signal comparing the current graph score with the prior snapshot."
trigger_phrases:
  - "convergence score-delta"
  - "convergence-score-delta"
  - "convergence score-delta runtime"
  - "scoring convergence score-delta"
---

# Convergence score-delta

---

## 1. OVERVIEW

Adds a convergence score-delta signal comparing the current graph score with the prior snapshot.

This feature belongs to the scoring group and is catalogued as F038 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

`convergence.cjs` reads the prior snapshot before creating the new one, emits `scoreDelta` and `scoreDeltaNote`, and can add an opt-in `improvementEffect` trace when requested.

The implementation is source-backed and covered by runtime-owned tests under `.skilled/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/convergence.cjs` | Runtime | convergence score-delta signal. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/integration/convergence-script.vitest.ts` | Automated test | Primary regression coverage for Convergence score-delta. |
| `tests/unit/convergence-score-delta.vitest.ts` | Automated test | Primary regression coverage for Convergence score-delta. |

---

## 4. SOURCE METADATA

- Group: Scoring
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `scoring/convergence-score-delta.md`
- Primary sources: `scripts/convergence.cjs`, `tests/integration/convergence-script.vitest.ts`, `tests/unit/convergence-score-delta.vitest.ts`
Related references:
- [scoring](../scoring/) — Scoring category
