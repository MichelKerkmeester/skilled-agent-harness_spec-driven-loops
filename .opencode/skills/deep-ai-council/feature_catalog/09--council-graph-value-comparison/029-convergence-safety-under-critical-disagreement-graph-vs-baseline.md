---
title: "Convergence safety under critical disagreement"
description: "Demonstrate the graph provides a safety guarantee (block on unresolved critical) that the two-of-three baseline does not."
trigger_phrases:
  - "convergence safety under critical disagreement"
  - "unresolvedCriticalDisagreements"
  - "block convergence critical disagreement"
  - "graph convergence safety guarantee"
  - "council stop blocked unresolved critical"
---

# Convergence safety under critical disagreement

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Demonstrate the graph provides a safety guarantee (block on unresolved critical) that the two-of-three baseline does not.

The two-of-three convergence rule is documented in references/convergence/convergence_signals.md and is the no-graph baseline for stop decisions.

Operators use this feature when the real request is: This council looks like it has 2 of 3 agreement on Plan X -- can we stop, or is something blocking?

---

## 2. HOW IT WORKS

The shipped surface is anchored by `runtime upsert CLI`, `runtime convergence CLI`, `deep-ai-council`. The playbook scenario `09--council-graph-value-comparison/003-convergence-safety-under-critical-disagreement-graph-vs-baseline.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-029.

Current behavior is grounded in `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs`, which the scenario identifies as three-state decision logic. Validation is anchored by `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts`, covering "blocks convergence for empty derived graphs instead of returning false-safe success" + stop_blocked branch test.

The user-visible contract is concrete: Demonstrate the graph provides a safety guarantee (block on unresolved critical) that the two-of-three baseline does not. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | Handler | Three-state decision logic |
| `.opencode/skills/deep-loop-runtime/lib/council/council-graph-query.ts` | Library | `unresolvedCriticalDisagreements` calculator |
| `.opencode/skills/deep-ai-council/references/convergence/convergence_signals.md` | Reference | Documents the baseline two-of-three rule |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/09--council-graph-value-comparison/003-convergence-safety-under-critical-disagreement-graph-vs-baseline.md` | Automated test | Manual scenario contract |
| `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts` | Automated test | "blocks convergence for empty derived graphs instead of returning false-safe success" + STOP_BLOCKED branch test |
| `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts` | Automated test | Automated test name: DAC-029 graph beats no-graph baseline |

---

## 4. SOURCE METADATA
- Group: Council Graph Value Comparison
- Feature ID: DAC-029
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `feature_catalog/09--council-graph-value-comparison/029-convergence-safety-under-critical-disagreement-graph-vs-baseline.md`
- Playbook scenario: `manual_testing_playbook/09--council-graph-value-comparison/003-convergence-safety-under-critical-disagreement-graph-vs-baseline.md`
Related references:
- [028-decision-provenance-audit-graph-vs-baseline.md](028-decision-provenance-audit-graph-vs-baseline.md) — Decision provenance audit: graph vs baseline
- [030-stalled-council-blocker-ranking-graph-vs-baseline.md](030-stalled-council-blocker-ranking-graph-vs-baseline.md) — Stalled-council blocker ranking: graph vs baseline
