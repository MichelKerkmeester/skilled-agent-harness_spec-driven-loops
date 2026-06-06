---
title: "runtime convergence CLI three-state decision matrix"
description: "Verify runtime convergence CLI returns the correct bucket for each of three documented signal configurations."
trigger_phrases:
  - "runtime convergence cli three-state decision matrix"
  - "convergence.cjs three-state"
  - "council stop continue escalate decision"
  - "three-state convergence signal"
  - "council orchestrator stop rule"
---

# runtime convergence CLI three-state decision matrix

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Verify runtime convergence CLI returns the correct bucket for each of three documented signal configurations.

The three-state output is the council orchestrator's primary stop/continue/escalate signal.

Operators use this feature when the real request is: Decide whether the council should stop, continue, or block on three different setups.

---

## 2. HOW IT WORKS

The shipped surface is anchored by `runtime upsert CLI`, `runtime convergence CLI`, `deep-ai-council`. The playbook scenario `08--council-graph-integration/council-graph-convergence-three-state-decision-matrix.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-023.

Current behavior is grounded in `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs`, which the scenario identifies as runtime CLI script: three-state decision logic. Validation is anchored by `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts`, covering tests: "allows convergence when ... thresholds are met", "continues convergence when non-blocking thresholds are not met", "blocks convergence for empty derived graphs...".

The user-visible contract is concrete: Verify runtime convergence CLI returns the correct bucket for each of three documented signal configurations. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | Handler | runtime CLI script: three-state decision logic |
| `.opencode/skills/deep-loop-runtime/lib/council/council-graph-query.ts` | Library | Per-signal helpers (`agreementRatio`, `dissentDensity`, etc.) |
| `.opencode/skills/deep-ai-council/references/integration/graph_support.md 4` | Reference | Documents the convergence signals |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/08--council-graph-integration/council-graph-convergence-three-state-decision-matrix.md` | Automated test | Manual scenario contract |
| `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts` | Automated test | Tests: "allows convergence when ... thresholds are met", "continues convergence when non-blocking thresholds are not met", "blocks convergence for empty derived graphs..." |

---

## 4. SOURCE METADATA
- Group: Council Graph Integration
- Feature ID: DAC-023
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `feature_catalog/08--council-graph-integration/council-graph-convergence-three-state-decision-matrix.md`
- Playbook scenario: `manual_testing_playbook/08--council-graph-integration/council-graph-convergence-three-state-decision-matrix.md`
Related references:
- [council-graph-query-five-modes-prompt-safe-context.md](council-graph-query-five-modes-prompt-safe-context.md) — runtime query CLI five modes return prompt-safe context
- [council-graph-status-recovery-payload-and-readiness.md](council-graph-status-recovery-payload-and-readiness.md) — runtime status CLI recovery payload and readiness
