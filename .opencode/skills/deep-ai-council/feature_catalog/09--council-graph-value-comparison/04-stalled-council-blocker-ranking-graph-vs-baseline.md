---
title: "Stalled-council blocker ranking: graph vs baseline"
description: "Demonstrate the graph produces a prioritized blocker list; the baseline produces an unranked dump."
---

# Stalled-council blocker ranking: graph vs baseline

## 1. OVERVIEW

Demonstrate the graph produces a prioritized blocker list; the baseline produces an unranked dump.

When max_rounds is reached without convergence, council-report.md carries convergence: false per convergence_signals.md, but it does not rank what to fix first.

Operators use this feature when the real request is: This council didn't converge after 4 rounds. What are the top blockers and what should I fix first?

---

## 2. CURRENT REALITY

The shipped surface is anchored by `runtime upsert CLI`, `runtime query CLI`, `deep-ai-council`. The playbook scenario `09--council-graph-value-comparison/004-stalled-council-blocker-ranking-graph-vs-baseline.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-030.

Current behavior is grounded in `.opencode/skills/deep-loop-runtime/scripts/query.cjs`, which the scenario identifies as runtime CLI script. Validation is anchored by `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts`, covering automated test name: dac-030 graph beats no-graph baseline.

The user-visible contract is concrete: Demonstrate the graph produces a prioritized blocker list; the baseline produces an unranked dump. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/deep-loop-runtime/scripts/query.cjs` | Handler | runtime CLI script |
| `.opencode/skills/deep-loop-runtime/lib/council/council-graph-query.ts` | Library | `getConvergenceBlockers` helper |
| `.opencode/skills/deep-ai-council/references/convergence/convergence_signals.md` | Reference | Documents `max_rounds` escape hatch |

### Validation And Tests

| File | Focus |
|------|-------|
| `manual_testing_playbook/09--council-graph-value-comparison/004-stalled-council-blocker-ranking-graph-vs-baseline.md` | Manual scenario contract |
| `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts` | Automated test name: DAC-030 graph beats no-graph baseline |

---

## 4. SOURCE METADATA
- Group: Council Graph Value Comparison
- Feature ID: DAC-030
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `feature_catalog/09--council-graph-value-comparison/04-stalled-council-blocker-ranking-graph-vs-baseline.md`
- Playbook scenario: `manual_testing_playbook/09--council-graph-value-comparison/004-stalled-council-blocker-ranking-graph-vs-baseline.md`
