---
title: "284 -- Skill graph query"
description: "Manual scenario for validating skill_graph_query relationship reads."
---

# 284 -- Skill graph query

**Owned by**: `mk_skill_advisor` MCP server (since `013/009/008`).

## 1. OVERVIEW

This scenario validates skill graph relationship reads for `284`. It focuses on confirming that `skill_graph_query` returns bounded structured results with query type metadata.

### Why This Matters

Relationship queries are only useful if callers can trust the shape and size of the response. This scenario catches read-path regressions where query metadata disappears, limits are ignored or the handler returns an unbounded result set.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm a bounded skill graph query returns structured results.
- Real user request: `Please validate Skill graph query against the documented validation surface and tell me whether the expected signals are present: Tool response includes query type metadata and no more than 10 result rows.`
- Prompt: `Validate skill graph query metadata and result limits against the documented validation surface.`
- Expected execution process: Execute the documented validation request against the documented validation surface, capture the response and evidence, compare it against the expected signals and return the pass/fail verdict.
- Expected signals: Tool response includes query type metadata and no more than 10 result rows
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS when the query succeeds and result count respects `limit`.

---

## 3. TEST EXECUTION

### Prompt

```
Validate skill graph query metadata and result limits against the documented validation surface.
```

### Commands

1. Call `skill_graph_query` with a bounded limit of `10`.
2. Capture the response payload.
3. Confirm query type metadata is present and the result count is no more than `10`.

### Expected

The query succeeds, returns structured metadata and respects the requested result limit.

### Evidence

Tool response transcript showing query metadata and result count.

### Pass / Fail

- **Pass**: Query metadata is present and result count respects `limit`.
- **Fail**: The handler errors, metadata is missing or more than 10 rows are returned.

---

## 4. SOURCE FILES

- `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/query.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/handlers/skill-graph-dispatch.vitest.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph-handlers.vitest.ts`

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 284
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation/284-skill-graph-query.md`
