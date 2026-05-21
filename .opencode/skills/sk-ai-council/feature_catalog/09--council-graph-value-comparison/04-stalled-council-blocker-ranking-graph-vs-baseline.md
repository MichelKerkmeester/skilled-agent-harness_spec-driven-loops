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

The shipped surface is anchored by `council_graph_upsert`, `council_graph_query`, `sk-ai-council`. The playbook scenario `09--council-graph-value-comparison/004-stalled-council-blocker-ranking-graph-vs-baseline.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-030.

Current behavior is grounded in `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/query.ts`, which the scenario identifies as mcp handler. Validation is anchored by `mcp_server/tests/council-graph-value-scenarios.vitest.ts`, covering automated test name: dac-030 graph beats no-graph baseline.

The user-visible contract is concrete: Demonstrate the graph produces a prioritized blocker list; the baseline produces an unranked dump. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/query.ts` | Handler | MCP handler |
| `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-query.ts` | Library | `getConvergenceBlockers` helper |
| `.opencode/skills/sk-ai-council/references/convergence_signals.md` | Reference | Documents `max_rounds` escape hatch |

### Validation And Tests

| File | Focus |
|------|-------|
| `manual_testing_playbook/09--council-graph-value-comparison/004-stalled-council-blocker-ranking-graph-vs-baseline.md` | Manual scenario contract |
| `mcp_server/tests/council-graph-value-scenarios.vitest.ts` | Automated test name: DAC-030 graph beats no-graph baseline |

---

## 4. SOURCE METADATA
- Group: Council Graph Value Comparison
- Feature ID: DAC-030
- Canonical catalog source: `manual_testing_playbook.md`
- Feature file path: `feature_catalog/09--council-graph-value-comparison/04-stalled-council-blocker-ranking-graph-vs-baseline.md`
- Playbook scenario: `manual_testing_playbook/09--council-graph-value-comparison/004-stalled-council-blocker-ranking-graph-vs-baseline.md`
