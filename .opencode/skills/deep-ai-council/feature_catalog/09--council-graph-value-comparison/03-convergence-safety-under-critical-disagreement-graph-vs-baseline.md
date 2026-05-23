---
title: "Convergence safety under critical disagreement"
description: "Demonstrate the graph provides a safety guarantee (block on unresolved critical) that the two-of-three baseline does not."
---

# Convergence safety under critical disagreement

## 1. OVERVIEW

Demonstrate the graph provides a safety guarantee (block on unresolved critical) that the two-of-three baseline does not.

The two-of-three convergence rule is documented in references/convergence_signals.md and is the no-graph baseline for stop decisions.

Operators use this feature when the real request is: This council looks like it has 2 of 3 agreement on Plan X -- can we stop, or is something blocking?

---

## 2. CURRENT REALITY

The shipped surface is anchored by `council_graph_upsert`, `council_graph_convergence`, `deep-ai-council`. The playbook scenario `09--council-graph-value-comparison/003-convergence-safety-under-critical-disagreement-graph-vs-baseline.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-029.

Current behavior is grounded in `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/convergence.ts`, which the scenario identifies as three-state decision logic. Validation is anchored by `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts`, covering "blocks convergence for empty derived graphs instead of returning false-safe success" + stop_blocked branch test.

The user-visible contract is concrete: Demonstrate the graph provides a safety guarantee (block on unresolved critical) that the two-of-three baseline does not. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/convergence.ts` | Handler | Three-state decision logic |
| `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-query.ts` | Library | `unresolvedCriticalDisagreements` calculator |
| `.opencode/skills/deep-ai-council/references/convergence_signals.md` | Reference | Documents the baseline two-of-three rule |

### Validation And Tests

| File | Focus |
|------|-------|
| `manual_testing_playbook/09--council-graph-value-comparison/003-convergence-safety-under-critical-disagreement-graph-vs-baseline.md` | Manual scenario contract |
| `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts` | "blocks convergence for empty derived graphs instead of returning false-safe success" + STOP_BLOCKED branch test |
| `mcp_server/tests/council-graph-value-scenarios.vitest.ts` | Automated test name: DAC-029 graph beats no-graph baseline |

---

## 4. SOURCE METADATA
- Group: Council Graph Value Comparison
- Feature ID: DAC-029
- Canonical catalog source: `manual_testing_playbook.md`
- Feature file path: `feature_catalog/09--council-graph-value-comparison/03-convergence-safety-under-critical-disagreement-graph-vs-baseline.md`
- Playbook scenario: `manual_testing_playbook/09--council-graph-value-comparison/003-convergence-safety-under-critical-disagreement-graph-vs-baseline.md`
