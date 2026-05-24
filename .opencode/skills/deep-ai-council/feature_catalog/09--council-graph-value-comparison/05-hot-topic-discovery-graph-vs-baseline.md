---
title: "Hot-topic discovery: graph vs baseline"
description: "Demonstrate hot_nodes mode surfaces high-degree contested topics; baseline requires manual cross-reference tallying."
---

# Hot-topic discovery: graph vs baseline

## 1. OVERVIEW

Demonstrate hot_nodes mode surfaces high-degree contested topics; baseline requires manual cross-reference tallying.

Operators reviewing complex multi-round councils need to know which claims/decisions are the center of gravity.

Operators use this feature when the real request is: This 4-round council touched a lot of claims -- show me the 3 most-contested or most-supported topics.

---

## 2. CURRENT REALITY

The shipped surface is anchored by `runtime upsert CLI`, `runtime query CLI`, `deep-ai-council`. The playbook scenario `09--council-graph-value-comparison/005-hot-topic-discovery-graph-vs-baseline.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-031.

Current behavior is grounded in `.opencode/skills/deep-loop-runtime/scripts/query.cjs`, which the scenario identifies as runtime CLI script. Validation is anchored by `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts`, covering automated test name: dac-031 graph beats no-graph baseline.

The user-visible contract is concrete: Demonstrate hot_nodes mode surfaces high-degree contested topics; baseline requires manual cross-reference tallying. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/deep-loop-runtime/scripts/query.cjs` | Handler | runtime CLI script |
| `.opencode/skills/deep-loop-runtime/lib/council/council-graph-query.ts` | Library | `getHotNodes` ranking helper |
| `.opencode/skills/deep-ai-council/references/graph_support.md 3` | Reference | Documents edge kinds counted toward hotness |

### Validation And Tests

| File | Focus |
|------|-------|
| `manual_testing_playbook/09--council-graph-value-comparison/005-hot-topic-discovery-graph-vs-baseline.md` | Manual scenario contract |
| `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts` | Automated test name: DAC-031 graph beats no-graph baseline |

---

## 4. SOURCE METADATA
- Group: Council Graph Value Comparison
- Feature ID: DAC-031
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `feature_catalog/09--council-graph-value-comparison/05-hot-topic-discovery-graph-vs-baseline.md`
- Playbook scenario: `manual_testing_playbook/09--council-graph-value-comparison/005-hot-topic-discovery-graph-vs-baseline.md`
