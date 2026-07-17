---
title: "284 -- Skill graph query"
description: "Manual scenario for validating skill_graph_query relationship reads."
version: 0.8.0.7
id: NC-008
category: native_mcp_tools
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources:
  - workflow_mode: system-skill-advisor
    leaf_resource_id: references/graph/skill_graph_query_cookbook.md
---

# 284 -- Skill graph query

Prompt: Manual scenario for validating skill_graph_query relationship reads.


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

Command run:

```json
{
  "queryType": "hub_skills",
  "skillId": "",
  "sourceSkillId": "",
  "targetSkillId": "",
  "family": "system",
  "minInbound": 1,
  "depth": 0,
  "limit": 10
}
```

Tool response transcript excerpt:

```json
{
  "status": "ok",
  "data": {
    "queryType": "hub_skills",
    "minInbound": 1,
    "skills": [
      { "node": { "id": "sk-code", "family": "sk-code", "category": "code-quality", "schemaVersion": 2 }, "inboundCount": 10 },
      { "node": { "id": "system-spec-kit", "family": "system", "category": "system", "schemaVersion": 2 }, "inboundCount": 9 },
      { "node": { "id": "system-deep-loop", "family": "deep-loop", "category": "workflow", "schemaVersion": 2 }, "inboundCount": 7 },
      { "node": { "id": "sk-design", "family": "sk-code", "category": "design", "schemaVersion": 2 }, "inboundCount": 6 },
      { "node": { "id": "cli-opencode", "family": "cli", "category": "cli-orchestrator", "schemaVersion": 2 }, "inboundCount": 5 },
      { "node": { "id": "mcp-figma", "family": "mcp", "category": "mcp-tool", "schemaVersion": 2 }, "inboundCount": 5 },
      { "node": { "id": "cli-claude-code", "family": "cli", "category": "cli-orchestrator", "schemaVersion": 2 }, "inboundCount": 4 },
      { "node": { "id": "cli-codex", "family": "cli", "category": "cli-orchestrator", "schemaVersion": 2 }, "inboundCount": 4 },
      { "node": { "id": "mcp-code-mode", "family": "mcp", "category": "mcp-tool", "schemaVersion": 2 }, "inboundCount": 4 },
      { "node": { "id": "sk-code-review", "family": "sk-code", "category": "code-quality", "schemaVersion": 2 }, "inboundCount": 4 }
    ]
  }
}
```

Observed result count: `10` rows for requested `limit: 10`.

### Pass / Fail

- **PASS**: Query metadata is present (`"queryType": "hub_skills"`) and the observed result count is `10`, which respects `limit: 10`.

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
- Feature file path: `context-preservation/284-skill-graph-query.md`
