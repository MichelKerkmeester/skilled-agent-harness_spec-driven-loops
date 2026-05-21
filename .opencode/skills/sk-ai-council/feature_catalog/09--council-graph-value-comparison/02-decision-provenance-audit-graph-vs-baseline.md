---
title: "Decision provenance audit: graph vs baseline"
description: "Demonstrate measurable audit-quality improvement between no-graph baseline and graph-driven provenance trace for a council decision."
---

# Decision provenance audit: graph vs baseline

## 1. OVERVIEW

Demonstrate measurable audit-quality improvement between no-graph baseline and graph-driven provenance trace for a council decision.

When a stakeholder, reviewer, or post-mortem asks "why did the council recommend Plan B?", the answer must be traceable to specific evidence and seat claims.

Operators use this feature when the real request is: Tell me exactly what evidence supported choosing Plan B in this council session.

---

## 2. CURRENT REALITY

The shipped surface is anchored by `council_graph_upsert`, `council_graph_query`, `sk-ai-council`. The playbook scenario `09--council-graph-value-comparison/002-decision-provenance-audit-graph-vs-baseline.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-028.

Current behavior is grounded in `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/query.ts`, which the scenario identifies as mcp handler. Validation is anchored by `mcp_server/tests/council-graph-value-scenarios.vitest.ts`, covering automated test name: dac-028 graph beats no-graph baseline.

The user-visible contract is concrete: Demonstrate measurable audit-quality improvement between no-graph baseline and graph-driven provenance trace for a council decision. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/query.ts` | Handler | MCP handler |
| `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-query.ts` | Library | `getDecisionSupport` helper |
| `.opencode/skills/sk-ai-council/references/graph_support.md 3` | Reference | Documents SUPPORTS / PROPOSES / RECOMMENDS edges |

### Validation And Tests

| File | Focus |
|------|-------|
| `manual_testing_playbook/09--council-graph-value-comparison/002-decision-provenance-audit-graph-vs-baseline.md` | Manual scenario contract |
| `mcp_server/tests/council-graph-value-scenarios.vitest.ts` | Automated test name: DAC-028 graph beats no-graph baseline |

---

## 4. SOURCE METADATA
- Group: Council Graph Value Comparison
- Feature ID: DAC-028
- Canonical catalog source: `manual_testing_playbook.md`
- Feature file path: `feature_catalog/09--council-graph-value-comparison/02-decision-provenance-audit-graph-vs-baseline.md`
- Playbook scenario: `manual_testing_playbook/09--council-graph-value-comparison/002-decision-provenance-audit-graph-vs-baseline.md`
