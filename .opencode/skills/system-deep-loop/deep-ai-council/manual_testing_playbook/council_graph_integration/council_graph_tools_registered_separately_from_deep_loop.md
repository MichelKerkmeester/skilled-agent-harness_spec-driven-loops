---
title: "DAC-026 -- Council graph MCP surface retired"
description: "This scenario validates that the council graph MCP tools are absent from the live mk-spec-memory registry and that council graph operations route through runtime/ --loop-type council."
version: 2.3.0.7
---

# DAC-026 -- Council graph MCP surface retired

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-026`.

---

## 1. OVERVIEW

This scenario validates the post-migration boundary: mk-spec-memory no longer exposes a dedicated council graph MCP family, and council graph writes/queries/status/convergence run through `runtime/` CLI scripts with `--loop-type council`.

### Why This Matters

ADR-001 still rejects reusing the research/review graph semantics for council state. The migration keeps that semantic boundary but moves ownership out of mk-spec-memory: council state is now a runtime-owned derived SQLite projection, rebuilt from `ai-council/**` artifacts by the replay helper or direct runtime CLI calls.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DAC-026` and confirm the expected signals without contradictory evidence.

- Objective: Verify the council graph MCP surface is retired and runtime CLI council support is present.
- Real user request: Confirm council graph operations no longer consume MCP tool slots.
- Prompt: `As a council-graph integration validator, assert that mk-spec-memory exposes 36 tools with no council graph MCP entries, then run or inspect the runtime/ council CLI scripts for upsert, query, status, and convergence support.`
- Expected execution process: Import `TOOL_DEFINITIONS` or inspect the source registry, grep live MCP source files for the escaped council graph tool-name pattern, then run runtime council script coverage.
- Expected signals: `TOOL_DEFINITIONS.length === 36`; no live MCP registry/schema/dispatcher entries match `council[_]graph_(upsert|query|status|convergence)`; runtime council integration tests pass.
- Desired user-visible outcome: The user sees that council graph behavior remains available while the MCP surface is smaller.
- Pass/fail: PASS if the MCP tools are absent and runtime CLI coverage passes; FAIL if a live MCP entry remains or runtime council CLI support regresses.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Import `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` and assert count 35 with no council graph entries.
2. Grep live registry, schema, and dispatcher files for `council[_]graph_(upsert|query|status|convergence)`.
3. Run runtime council integration tests.

### Prompt

`As a council-graph integration validator, assert that mk-spec-memory exposes 36 tools with no council graph MCP entries, then run or inspect the runtime/ council CLI scripts for upsert, query, status, and convergence support.`

### Commands

1. `bash: node --import .opencode/skills/system-spec-kit/scripts/node_modules/tsx/dist/loader.mjs -e "import('./.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts').then(({TOOL_DEFINITIONS}) => console.log(JSON.stringify({count: TOOL_DEFINITIONS.length, council: TOOL_DEFINITIONS.filter((tool) => /council[_]graph/.test(tool.name)).map((tool) => tool.name)})))"`
2. `bash: rg -n 'council[_]graph_(upsert|query|status|convergence)' .opencode/skills/system-spec-kit/mcp_server/tools/index.ts .opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts .opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
3. `bash: cd .opencode/skills/system-spec-kit/mcp_server && ./node_modules/.bin/vitest run --no-coverage ../../runtime//tests/integration/council-graph-script.vitest.ts`

### Expected

Step 1 prints `{"count":35,"council":[]}`. Step 2 returns no hits. Step 3 exits 0.

### Evidence

Capture tool-definition import output, grep output, and runtime council integration test result.

### Pass / Fail

- **Pass**: 35 live tools, no council graph MCP entries, runtime council script tests pass.
- **Fail**: Any council graph MCP entry remains, tool count is not 35, or runtime council CLI coverage fails.

### Failure Triage

If a council graph MCP entry remains, inspect `tools/index.ts`, `tool-schemas.ts`, and `schemas/tool-input-schemas.ts` for stale registry/schema rows. If runtime CLI coverage fails, inspect `runtime//scripts/{upsert,query,status,convergence}.cjs` and `lib/council/**`.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-026 | Council graph MCP surface retired | Verify MCP removal plus runtime CLI replacement | `As a council-graph integration validator, assert that mk-spec-memory exposes 36 tools with no council graph MCP entries, then run or inspect the runtime/ council CLI scripts for upsert, query, status, and convergence support.` | import tool definitions -> grep live MCP files -> run runtime council integration test | 35 tools, no council graph MCP entries, runtime council tests pass | Import output + grep output + Vitest result | PASS if retired from MCP and covered in runtime CLI | Inspect MCP registry/schema files or runtime scripts |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `feature_catalog/` | Feature catalog mirror |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Live MCP tool inventory |
| `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts` | Live MCP dispatcher registry |
| `.opencode/skills/system-deep-loop/runtime/tests/integration/council-graph-script.vitest.ts` | Runtime council CLI coverage |

---

## 5. SOURCE METADATA

- Group: COUNCIL GRAPH INTEGRATION
- Playbook ID: DAC-026
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `council-graph-integration/council-graph-tools-registered-separately-from-deep-loop.md`
