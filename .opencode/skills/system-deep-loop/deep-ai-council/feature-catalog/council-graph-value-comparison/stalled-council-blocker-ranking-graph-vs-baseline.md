---
title: "Stalled-council blocker ranking: graph vs baseline"
description: "Demonstrate the graph produces a prioritized blocker list; the baseline produces an unranked dump."
trigger_phrases:
  - "stalled-council blocker ranking graph vs baseline"
  - "getConvergenceBlockers"
  - "rank council blockers after max rounds"
  - "prioritized blocker list council"
  - "council did not converge top blockers"
version: 2.3.0.10
---

# Stalled-council blocker ranking: graph vs baseline

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Demonstrate the graph produces a prioritized blocker list; the baseline produces an unranked dump.

When max_rounds is reached without convergence, council-report.md carries convergence: false per convergence-signals.md, but it does not rank what to fix first.

Operators use this feature when the real request is: This council didn't converge after 4 rounds. What are the top blockers and what should I fix first?

---

## 2. HOW IT WORKS

The shipped surface is anchored by `runtime upsert CLI`, `runtime query CLI`, `deep-ai-council`. The playbook scenario `council-graph-value-comparison/stalled-council-blocker-ranking-graph-vs-baseline.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-030.

Current behavior is grounded in `.opencode/skills/system-deep-loop/runtime/scripts/query.cjs`, which the scenario identifies as runtime CLI script. Validation is anchored by `.opencode/skills/system-deep-loop/runtime/tests/integration/council-graph-value-scenarios.vitest.ts`, covering automated test name: dac-030 graph beats no-graph baseline.

The user-visible contract is concrete: Demonstrate the graph produces a prioritized blocker list; the baseline produces an unranked dump. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-deep-loop/runtime/scripts/query.cjs` | Handler | runtime CLI script |
| `.opencode/skills/system-deep-loop/runtime/lib/council/council-graph-query.ts` | Library | `getConvergenceBlockers` helper |
| `.opencode/skills/system-deep-loop/deep-ai-council/references/convergence/convergence-signals.md` | Reference | Documents `max_rounds` escape hatch |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/council-graph-value-comparison/stalled-council-blocker-ranking-graph-vs-baseline.md` | Automated test | Manual scenario contract |
| `.opencode/skills/system-deep-loop/runtime/tests/integration/council-graph-value-scenarios.vitest.ts` | Automated test | Automated test name: DAC-030 graph beats no-graph baseline |

---

## 4. SOURCE METADATA
- Group: Council Graph Value Comparison
- Feature ID: DAC-030
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `feature-catalog/council-graph-value-comparison/stalled-council-blocker-ranking-graph-vs-baseline.md`
- Playbook scenario: `manual-testing-playbook/council-graph-value-comparison/stalled-council-blocker-ranking-graph-vs-baseline.md`
Related references:
- [convergence-safety-under-critical-disagreement-graph-vs-baseline.md](../../feature-catalog/council-graph-value-comparison/convergence-safety-under-critical-disagreement-graph-vs-baseline.md) — Convergence safety under critical disagreement
- [hot-topic-discovery-graph-vs-baseline.md](../../feature-catalog/council-graph-value-comparison/hot-topic-discovery-graph-vs-baseline.md) — Hot-topic discovery: graph vs baseline
