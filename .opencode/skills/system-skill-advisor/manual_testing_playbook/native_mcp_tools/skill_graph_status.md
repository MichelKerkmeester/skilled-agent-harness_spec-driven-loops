---
title: "283 -- Skill graph status"
description: "Manual scenario for validating skill_graph_status health output."
version: 0.8.0.7
---

# 283 -- Skill graph status

**Owned by**: `mk_skill_advisor` MCP server (since `013/009/008`).

## 1. OVERVIEW

This scenario validates skill graph status health output for `283`. It focuses on confirming that `skill_graph_status` reports live graph totals, staleness, families, categories, schema versions, validation and DB status.

### Why This Matters

Operators need a quick health check before trusting skill graph reads. This scenario catches handler regressions that return partial status payloads, omit core totals such as `totalSkills` and `totalEdges` or hide database readiness behind a non-actionable response.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm the status tool returns a non-error health payload.
- Real user request: `` Please validate Skill graph status against the documented validation surface and tell me whether the expected signals are present: Tool response includes `totalSkills`, `totalEdges` and `dbStatus`. ``
- Prompt: `Validate skill graph status fields against the documented validation surface.`
- Expected execution process: Execute the documented validation request against the documented validation surface, capture the response and evidence, compare it against the expected signals and return the pass/fail verdict.
- Expected signals: Tool response includes `totalSkills`, `totalEdges` and `dbStatus`
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS when status fields are present and no handler error occurs.

---

## 3. TEST EXECUTION

### Prompt

```
Validate skill graph status fields against the documented validation surface.
```

### Commands

1. Call `skill_graph_status`.
2. Capture the returned payload.
3. Confirm the payload includes `totalSkills`, `totalEdges` and `dbStatus`.

### Expected

The status call returns a non-error payload with live graph totals and database status fields.

### Evidence

`skill_graph_status` returned:

```json
{"status":"ok","data":{"totalSkills":20,"totalEdges":81,"lastIndexedAt":"2026-06-28T16:25:56.252Z","families":[{"name":"cli","count":3},{"name":"deep-loop","count":2},{"name":"mcp","count":5},{"name":"sk-code","count":3},{"name":"sk-util","count":4},{"name":"system","count":3}],"categories":[{"name":"cli-orchestrator","count":3},{"name":"code-quality","count":2},{"name":"design","count":1},{"name":"mcp-tool","count":5},{"name":"system","count":4},{"name":"utility","count":4},{"name":"workflow","count":1}],"schemaVersions":[{"name":"2","count":20}],"staleness":{"trackedSkills":20,"freshSourceFiles":0,"changedSourceFiles":19,"missingSourceFiles":1,"staleSkillIds":["cli-claude-code","cli-codex","cli-opencode","deep-loop-runtime","system-deep-loop","mcp-chrome-devtools","mcp-click-up","mcp-code-mode","mcp-figma","mcp-open-design","sk-code","sk-code-review","sk-design","sk-doc","sk-git","sk-prompt","sk-prompt/prompt-models","system-code-graph","system-skill-advisor","system-spec-kit"]},"validation":{"brokenEdgeCount":0,"weightBandViolations":4,"unsupportedSchemaVersionCount":0,"isHealthy":true},"dbStatus":"ready"}}
```

### Pass / Fail

- **PASS**: Status fields are present (`totalSkills`: 20, `totalEdges`: 81, `dbStatus`: `ready`) and no handler error occurred.
- **Fail**: The handler errors or any required status field is missing.

---

## 4. SOURCE FILES

- `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/status.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph-handlers.vitest.ts`

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 283
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `context-preservation/283-skill-graph-status.md`
