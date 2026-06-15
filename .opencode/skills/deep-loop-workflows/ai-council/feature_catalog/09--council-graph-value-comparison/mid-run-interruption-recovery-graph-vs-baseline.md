---
title: "Mid-run interruption recovery: graph vs baseline"
description: "Demonstrate runtime status CLI returns structured recovery context where the baseline requires manual JSONL parsing."
trigger_phrases:
  - "mid-run interruption recovery graph vs baseline"
  - "status.cjs recovery field"
  - "recover interrupted council run"
  - "structured council recovery context"
  - "council process killed mid-round"
---

# Mid-run interruption recovery: graph vs baseline

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Demonstrate runtime status CLI returns structured recovery context where the baseline requires manual JSONL parsing.

The append-only ai-council-state.jsonl captures every state transition, including council_complete.

Operators use this feature when the real request is: This council process got killed during round 3 -- where did state stop, and can I recover?

---

## 2. HOW IT WORKS

The shipped surface is anchored by `runtime upsert CLI`, `runtime status CLI`, `deep-ai-council`. The playbook scenario `09--council-graph-value-comparison/mid-run-interruption-recovery-graph-vs-baseline.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-032.

Current behavior is grounded in `.opencode/skills/deep-loop-runtime/scripts/status.cjs`, which the scenario identifies as runtime CLI script with `recovery` field (p2-001 remediation). Validation is anchored by `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts`, covering automated test name: dac-032 graph beats no-graph baseline.

The user-visible contract is concrete: Demonstrate runtime status CLI returns structured recovery context where the baseline requires manual JSONL parsing. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/deep-loop-runtime/scripts/status.cjs` | Handler | runtime CLI script with `recovery` field (P2-001 remediation) |
| `.opencode/skills/deep-loop-runtime/lib/council/council-graph-db.ts` | Library | Storage layer: namespace-scoped recovery query |
| `.opencode/skills/deep-loop-workflows/ai-council/references/structure/state_format.md` | Reference | Documents append-only `ai-council-state.jsonl` event contract |
| `.opencode/skills/deep-loop-workflows/ai-council/references/integration/graph_support.md 5` | Reference | Documents the recovery + replay contract |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/09--council-graph-value-comparison/mid-run-interruption-recovery-graph-vs-baseline.md` | Automated test | Manual scenario contract |
| `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts` | Automated test | Automated test name: DAC-032 graph beats no-graph baseline |

---

## 4. SOURCE METADATA
- Group: Council Graph Value Comparison
- Feature ID: DAC-032
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `feature_catalog/09--council-graph-value-comparison/mid-run-interruption-recovery-graph-vs-baseline.md`
- Playbook scenario: `manual_testing_playbook/09--council-graph-value-comparison/mid-run-interruption-recovery-graph-vs-baseline.md`
Related references:
- [hot-topic-discovery-graph-vs-baseline.md](hot-topic-discovery-graph-vs-baseline.md) — Hot-topic discovery: graph vs baseline
