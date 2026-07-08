---
title: "Hot-topic discovery: graph vs baseline"
description: "Demonstrate hot_nodes mode surfaces high-degree contested topics; baseline requires manual cross-reference tallying."
trigger_phrases:
  - "hot-topic discovery graph vs baseline"
  - "getHotNodes"
  - "council hot nodes query"
  - "most contested council topics"
  - "high-degree contested claim discovery"
version: 2.3.0.10
---

# Hot-topic discovery: graph vs baseline

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Demonstrate hot_nodes mode surfaces high-degree contested topics; baseline requires manual cross-reference tallying.

Operators reviewing complex multi-round councils need to know which claims/decisions are the center of gravity.

Operators use this feature when the real request is: This 4-round council touched a lot of claims -- show me the 3 most-contested or most-supported topics.

---

## 2. HOW IT WORKS

The shipped surface is anchored by `runtime upsert CLI`, `runtime query CLI`, `deep-ai-council`. The playbook scenario `09--council-graph-value-comparison/hot-topic-discovery-graph-vs-baseline.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-031.

Current behavior is grounded in `.opencode/skills/system-deep-loop/runtime/scripts/query.cjs`, which the scenario identifies as runtime CLI script. Validation is anchored by `.opencode/skills/system-deep-loop/runtime/tests/integration/council-graph-value-scenarios.vitest.ts`, covering automated test name: dac-031 graph beats no-graph baseline.

The user-visible contract is concrete: Demonstrate hot_nodes mode surfaces high-degree contested topics; baseline requires manual cross-reference tallying. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-deep-loop/runtime/scripts/query.cjs` | Handler | runtime CLI script |
| `.opencode/skills/system-deep-loop/runtime/lib/council/council-graph-query.ts` | Library | `getHotNodes` ranking helper |
| `.opencode/skills/system-deep-loop/deep-ai-council/references/integration/graph_support.md 3` | Reference | Documents edge kinds counted toward hotness |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/09--council-graph-value-comparison/hot-topic-discovery-graph-vs-baseline.md` | Automated test | Manual scenario contract |
| `.opencode/skills/system-deep-loop/runtime/tests/integration/council-graph-value-scenarios.vitest.ts` | Automated test | Automated test name: DAC-031 graph beats no-graph baseline |

---

## 4. SOURCE METADATA
- Group: Council Graph Value Comparison
- Feature ID: DAC-031
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `feature_catalog/09--council-graph-value-comparison/hot-topic-discovery-graph-vs-baseline.md`
- Playbook scenario: `manual_testing_playbook/09--council-graph-value-comparison/hot-topic-discovery-graph-vs-baseline.md`
Related references:
- [stalled-council-blocker-ranking-graph-vs-baseline.md](stalled-council-blocker-ranking-graph-vs-baseline.md) — Stalled-council blocker ranking: graph vs baseline
- [mid-run-interruption-recovery-graph-vs-baseline.md](mid-run-interruption-recovery-graph-vs-baseline.md) — Mid-run interruption recovery: graph vs baseline
