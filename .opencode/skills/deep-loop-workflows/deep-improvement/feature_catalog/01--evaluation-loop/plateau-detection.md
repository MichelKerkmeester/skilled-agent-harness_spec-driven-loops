---
title: "Plateau detection"
description: "Stops further iterations when the loop has run out of meaningful movement or stable evidence."
trigger_phrases:
  - "plateau detection"
  - "reduce-state.cjs"
  - "detect improvement plateau"
  - "loop stop condition"
  - "convergence eligibility"
---

# Plateau detection

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Stops further iterations when the loop has run out of meaningful movement or stable evidence.

This feature covers the stop logic spread across the reducer, mutation-coverage graph, replay-stability helper, and trade-off detector.

---

## 2. HOW IT WORKS

`reduce-state.cjs` computes the live stop status from the JSONL ledger and the runtime config. It can stop for trailing ties, repeated infra failures, repeated benchmark failures, mirror-drift ambiguity, and all-dimension plateau detection, where every tracked dimension has the same score across the configured plateau window.

That reducer stop check is not the only stability signal. `mutation-coverage.cjs` uses a looser convergence-eligibility rule based on three data points with all dimension deltas within `+/-2`, while `trade-off-detector.cjs` and `benchmark-stability.cjs` both return explicit `insufficientData` or `insufficientSample` states until they have at least three observations. The current loop therefore has both exact-score plateau detection and separate evidence-quality gates for convergence and repeatability.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/reduce-state.cjs` | Reducer | Computes stop status from ties, infra failures, benchmark failures, drift ambiguity, and exact-score plateaus. |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/mutation-coverage.cjs` | Coverage tracker | Records per-dimension score history and checks convergence eligibility from stable trajectories. |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/agent-improvement/trade-off-detector.cjs` | Analysis helper | Refuses to analyze trade-offs until enough trajectory points exist and flags meaningful regressions when they do. |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs` | Stability helper | Measures replay variance and refuses verdicts until the minimum replay count is met. |
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/agent_improvement/improvement_config.json` | Runtime config | Supplies the plateau window and stop-rule thresholds consumed by the reducer. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/tests/mutation-coverage.vitest.ts` | Automated test | Verifies the three-point convergence rule and unstable-dimension reporting. |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/agent-improvement/tests/trade-off-detector.vitest.ts` | Automated test | Verifies insufficient-data handling and hard versus soft regression thresholds. |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/agent-improvement/tests/benchmark-stability.vitest.ts` | Automated test | Verifies insufficient-sample handling, stability coefficients, and warning thresholds. |

---

## 4. SOURCE METADATA

- Group: Evaluation loop
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--evaluation-loop/plateau-detection.md`
Related references:
- [rollback.md](rollback.md) — Rollback
