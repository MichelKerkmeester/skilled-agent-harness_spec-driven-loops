---
title: "Semantic convergence signals"
description: "Two supplementary stop signals (semanticNovelty and findingStability) that measure conceptual novelty and finding-set stability beyond the severity-weighted 3-signal composite vote."
trigger_phrases:
  - "semantic convergence signals"
  - "semanticNovelty findingStability"
  - "supplementary stop signals"
  - "conceptual novelty plateau"
  - "finding-set stability"
version: 1.11.0.5
---

# Semantic convergence signals

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Measures whether a review iteration is still uncovering genuinely new defect patterns and whether the finding set has stabilized, independent of severity weighting.

These two signals catch a failure mode the severity-weighted composite vote can miss: a review that keeps producing moderate `newFindingsRatio` from reworded refinements while the genuinely new defect categories are already exhausted. They feed the legal-stop gate evaluation rather than the composite stop-score.

## 2. HOW IT WORKS

Two signals supplement the 3-signal composite vote and participate in legal-stop gate evaluation.

`semanticNovelty` (0.0 to 1.0) measures how much conceptually new review insight an iteration contributes beyond overlap with prior findings, independent of severity weighting. It is computed as new defect patterns over total patterns in the current iteration. When it drops below 0.15 for 2 or more consecutive evidence iterations, it provides strong supporting evidence for a legal STOP. When this `semanticNoveltyPlateau` sub-check fails while the existing churn signals pass, the gate records the mismatch as a diagnostic note but does not independently block STOP.

`findingStability` (0.0 to 1.0) measures how stable the cumulative finding set is across iterations, computed as unchanged findings (same id, severity, and status) over the larger of the current and prior registry sizes. A value at or above 0.85 supports STOP (the finding set has stabilized), a value below 0.50 prevents STOP (the set is still in flux). The metric is surfaced alongside the existing convergence signals and complements the ratio-based churn signals inside the `findingStability` gate (which maps to `convergenceGate` in the event-shape gate model).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/convergence/convergence.md` | Protocol | Semantic Convergence Signals section: definitions, computation, thresholds, and gate integration. |
| `scripts/reduce-state.cjs` | Reducer | `computeConvergenceScore` and the registry stability inputs the signals draw from. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/convergence-and-recovery/composite-review-convergence-stop-behavior.md` | Manual scenario | Verifies composite convergence stop behavior the semantic signals supplement. |
| `manual_testing_playbook/convergence-and-recovery/dimension-coverage-convergence-signal.md` | Manual scenario | Verifies dimension-coverage signal interaction with stop evaluation. |

---

## 4. SOURCE METADATA

- Group: Severity system
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `severity-system/convergence-signals.md`
- Primary sources: `references/convergence/convergence.md`, `scripts/reduce-state.cjs`
Related references:
- [quality-gates.md](quality-gates.md) — Quality gates
- [security-sensitive-fix-overrides.md](security-sensitive-fix-overrides.md) — Security-sensitive fix overrides
