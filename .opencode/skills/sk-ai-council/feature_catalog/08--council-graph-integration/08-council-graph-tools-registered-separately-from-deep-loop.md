---
title: "council_graph family tools registered separately from..."
description: "Verify council_graph_* tools are registered as a distinct family with no loop_type:'council' overload of deep_loop_graph_*."
---

# council_graph family tools registered separately from...

## 1. OVERVIEW

Verify council_graph_* tools are registered as a distinct family with no loop_type:'council' overload of deep_loop_graph_*.

ADR-001 explicitly rejected reusing the deep-loop research/review graph for council semantics.

Operators use this feature when the real request is: Confirm the council graph tools do not share dispatch with the research/review graph tools.

---

## 2. CURRENT REALITY

The shipped surface is anchored by `council_graph_upsert`, `council_graph_query`, `council_graph_convergence`, `council_graph_status`, `sk-ai-council`. The playbook scenario `08--council-graph-integration/008-council-graph-tools-registered-separately-from-deep-loop.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-026.

Current behavior is grounded in `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts`, which the scenario identifies as tool dispatcher registration. Validation is anchored by `manual_testing_playbook/08--council-graph-integration/008-council-graph-tools-registered-separately-from-deep-loop.md`, covering manual scenario contract.

The user-visible contract is concrete: Verify council_graph_* tools are registered as a distinct family with no loop_type:'council' overload of deep_loop_graph_*. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts` | Tool Registry | Tool dispatcher registration |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Tool Registry | Tool descriptor registry |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Schema | Strict input schemas |
| Internal design notes | Spec | ADR-001: dedicated graph decision |

### Validation And Tests

| File | Focus |
|------|-------|
| `manual_testing_playbook/08--council-graph-integration/008-council-graph-tools-registered-separately-from-deep-loop.md` | Manual scenario contract |
| Internal design notes | CHK-011 (deep-loop boundary) + CHK-023 (tool registration) |

---

## 4. SOURCE METADATA
- Group: Council Graph Integration
- Feature ID: DAC-026
- Canonical catalog source: `manual_testing_playbook.md`
- Feature file path: `feature_catalog/08--council-graph-integration/08-council-graph-tools-registered-separately-from-deep-loop.md`
- Playbook scenario: `manual_testing_playbook/08--council-graph-integration/008-council-graph-tools-registered-separately-from-deep-loop.md`
