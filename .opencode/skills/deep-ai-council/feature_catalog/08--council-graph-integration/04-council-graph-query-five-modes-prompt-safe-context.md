---
title: "council_graph_query five modes return prompt-safe context"
description: "Verify all 5 documented council_graph_query modes return prompt-safe bounded context."
---

# council_graph_query five modes return prompt-safe context

## 1. OVERVIEW

Verify all 5 documented council_graph_query modes return prompt-safe bounded context.

The query surface is the council synthesis caller's primary handle into derived graph state.

Operators use this feature when the real request is: Show me each query view the council graph supports against a fully-populated session.

---

## 2. CURRENT REALITY

The shipped surface is anchored by `council_graph_upsert`, `council_graph_query`, `deep-ai-council`. The playbook scenario `08--council-graph-integration/004-council-graph-query-five-modes-prompt-safe-context.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-022.

Current behavior is grounded in `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/query.ts`, which the scenario identifies as mcp handler: per-mode dispatch. Validation is anchored by `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts`, covering test: "upserts prompt-safe council graph data and queries unresolved disagreements and decision support".

The user-visible contract is concrete: Verify all 5 documented council_graph_query modes return prompt-safe bounded context. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/query.ts` | Handler | MCP handler: per-mode dispatch |
| `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-query.ts` | Library | Per-mode query helpers |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Schema | Mode enum: `['unresolved_disagreements','evidence_chain','decision_support','convergence_blockers','hot_nodes']` |
| `.opencode/skills/deep-ai-council/references/graph_support.md` | Reference | Documents the five query modes |

### Validation And Tests

| File | Focus |
|------|-------|
| `manual_testing_playbook/08--council-graph-integration/004-council-graph-query-five-modes-prompt-safe-context.md` | Manual scenario contract |
| `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts` | Test: "upserts prompt-safe council graph data and queries unresolved disagreements and decision support" |

---

## 4. SOURCE METADATA
- Group: Council Graph Integration
- Feature ID: DAC-022
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `feature_catalog/08--council-graph-integration/04-council-graph-query-five-modes-prompt-safe-context.md`
- Playbook scenario: `manual_testing_playbook/08--council-graph-integration/004-council-graph-query-five-modes-prompt-safe-context.md`
