---
title: "285 -- Skill graph validate"
description: "Manual scenario for validating skill_graph_validate diagnostics."
version: 0.8.0.7
id: NC-009
category: native_mcp_tools
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources:
  - workflow_mode: system-skill-advisor
    leaf_resource_id: references/graph/skill-graph-query-cookbook.md
---

# 285 -- Skill graph validate

Prompt: Manual scenario for validating skill_graph_validate diagnostics.


**Owned by**: `mk_skill_advisor` MCP server (since `013/009/008`).

## 1. OVERVIEW

This scenario validates skill graph diagnostics for `285`. It focuses on confirming that `skill_graph_validate` reports schema, edge, relation-weight, symmetry and cycle checks with a readable pass/warn/error state.

### Why This Matters

Validation output is the operator's first signal when graph quality drifts. This scenario catches diagnostic regressions where categories are missing, severity state is unclear or an internal validation error escapes as an unhandled exception.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm validation diagnostics are operator-readable.
- Real user request: `Please validate Skill graph validate against the documented validation surface and tell me whether the expected signals are present: Tool response reports validation categories and pass/warn/error state.`
- Prompt: `Validate skill graph validation categories and pass/warn/error state against the documented validation surface.`
- Expected execution process: Execute the documented validation request against the documented validation surface, capture the response and evidence, compare it against the expected signals and return the pass/fail verdict.
- Expected signals: Tool response reports validation categories and pass/warn/error state
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS when diagnostics are present without an unhandled exception.

---

## 3. TEST EXECUTION

### Prompt

```
Validate skill graph validation categories and pass/warn/error state against the documented validation surface.
```

### Commands

1. Call `skill_graph_validate`.
2. Capture the diagnostic payload.
3. Confirm validation categories and pass/warn/error state are present.

### Expected

The validation call returns operator-readable diagnostics without an unhandled exception.

### Evidence

Tool response transcript showing validation categories and severity state.

### Pass / Fail

- **Pass**: Diagnostics and pass/warn/error state are present without an unhandled exception.
- **Fail**: The handler errors or omits the required diagnostic categories or state.

---

## 4. SOURCE FILES

- `.opencode/skills/system-skill-advisor/mcp-server/handlers/skill-graph/validate.ts`
- `.opencode/skills/system-skill-advisor/mcp-server/tools/skill-graph-tools.ts`
- `.opencode/skills/system-skill-advisor/mcp-server/tests/skill-graph-handlers.vitest.ts`
- `.opencode/skills/system-skill-advisor/mcp-server/tests/skill-graph-db.vitest.ts`

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 285
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `context-preservation/285-skill-graph-validate.md`
