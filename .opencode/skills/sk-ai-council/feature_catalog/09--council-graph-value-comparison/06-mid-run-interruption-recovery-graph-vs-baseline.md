---
title: "Mid-run interruption recovery: graph vs baseline"
description: "Demonstrate council_graph_status returns structured recovery context where the baseline requires manual JSONL parsing."
---

# Mid-run interruption recovery: graph vs baseline

## 1. OVERVIEW

Demonstrate council_graph_status returns structured recovery context where the baseline requires manual JSONL parsing.

The append-only ai-council-state.jsonl captures every state transition, including council_complete.

Operators use this feature when the real request is: This council process got killed during round 3 -- where did state stop, and can I recover?

---

## 2. CURRENT REALITY

The shipped surface is anchored by `council_graph_upsert`, `council_graph_status`, `sk-ai-council`. The playbook scenario `09--council-graph-value-comparison/006-mid-run-interruption-recovery-graph-vs-baseline.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-032.

Current behavior is grounded in `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/status.ts`, which the scenario identifies as mcp handler with `recovery` field (p2-001 remediation). Validation is anchored by `mcp_server/tests/council-graph-value-scenarios.vitest.ts`, covering automated test name: dac-032 graph beats no-graph baseline.

The user-visible contract is concrete: Demonstrate council_graph_status returns structured recovery context where the baseline requires manual JSONL parsing. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/status.ts` | Handler | MCP handler with `recovery` field (P2-001 remediation) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-db.ts` | Library | Storage layer: namespace-scoped recovery query |
| `.opencode/skills/sk-ai-council/references/state_format.md` | Reference | Documents append-only `ai-council-state.jsonl` event contract |
| `.opencode/skills/sk-ai-council/references/graph_support.md 5` | Reference | Documents the recovery + replay contract |

### Validation And Tests

| File | Focus |
|------|-------|
| `manual_testing_playbook/09--council-graph-value-comparison/006-mid-run-interruption-recovery-graph-vs-baseline.md` | Manual scenario contract |
| `mcp_server/tests/council-graph-value-scenarios.vitest.ts` | Automated test name: DAC-032 graph beats no-graph baseline |

---

## 4. SOURCE METADATA
- Group: Council Graph Value Comparison
- Feature ID: DAC-032
- Canonical catalog source: `manual_testing_playbook.md`
- Feature file path: `feature_catalog/09--council-graph-value-comparison/06-mid-run-interruption-recovery-graph-vs-baseline.md`
- Playbook scenario: `manual_testing_playbook/09--council-graph-value-comparison/006-mid-run-interruption-recovery-graph-vs-baseline.md`
