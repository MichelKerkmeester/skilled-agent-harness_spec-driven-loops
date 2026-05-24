---
title: "DAC-026 -- council_graph_* tools registered separately from deep_loop_graph_*"
description: "This scenario validates that `council_graph_*` tools are registered as a distinct family in `tools/index.ts`, `tool-schemas.ts`, and `schemas/tool-input-schemas.ts` with no `loop_type:'council'` overload added to `deep_loop_graph_*` for `DAC-026`. Anchors to ADR-001 dedicated-graph decision and checklist CHK-011 and CHK-023."
---

# DAC-026 -- council_graph_* tools registered separately from deep_loop_graph_*

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-026`.

---

## 1. OVERVIEW

This scenario validates that the four `council_graph_*` tools (`council_graph_upsert`, `council_graph_query`, `council_graph_status`, `council_graph_convergence`) are registered as a distinct family in the MCP server, with their own dispatchers and input schemas, and that no `loop_type:'council'` overload was hidden inside `deep_loop_graph_*`.

### Why This Matters

ADR-001 explicitly rejected reusing the deep-loop research/review graph for council semantics. A regression that smuggles council behavior into `deep_loop_graph_*` (e.g., adding `loop_type:'council'` to the deep-loop schema) would silently couple council to research/review semantics and destroy the boundary the ADR protects. This scenario is a structural invariant check — fast, mechanical, and run on every change to MCP server tool wiring.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DAC-026` and confirm the expected signals without contradictory evidence.

- Objective: Verify `council_graph_*` tools are registered as a distinct family with no `loop_type:'council'` overload of `deep_loop_graph_*`.
- Real user request: Confirm the council graph tools do not share dispatch with the research/review graph tools.
- Prompt: `As a council-graph integration validator, grep tools/index.ts, tool-schemas.ts, and schemas/tool-input-schemas.ts for council_graph_* registrations and assert each has its own dispatcher + schema; then assert no loop_type:'council' overload was added to deep_loop_graph_*.`
- Expected execution process: Grep the three MCP server files for the four council_graph tool names; grep deep_loop_graph_* schemas for any `'council'` value in `loop_type` enum.
- Expected signals: Each of the 4 council_graph tools has its own registration row in `tools/index.ts`, its own descriptor in `tool-schemas.ts`, and its own input schema in `schemas/tool-input-schemas.ts`; the `deep_loop_graph_*` schemas contain only `'research'` and `'review'` in `loop_type` (no `'council'`).
- Desired user-visible outcome: The user sees that council and deep-loop graph families are structurally independent.
- Pass/fail: PASS if the four council_graph tools are registered separately and `deep_loop_graph_*` carries no `'council'` loop_type; FAIL if any tool shares dispatch with deep-loop or `loop_type:'council'` appears anywhere in deep-loop schemas.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Grep `tools/index.ts` for the four council_graph tool registrations.
2. Grep `tool-schemas.ts` for the four council_graph tool descriptors.
3. Grep `schemas/tool-input-schemas.ts` for the four council_graph input schemas.
4. Grep all deep-loop graph schemas for `'council'` as a `loop_type` value.

### Prompt

`As a council-graph integration validator, grep tools/index.ts, tool-schemas.ts, and schemas/tool-input-schemas.ts for council_graph_* registrations and assert each has its own dispatcher + schema; then assert no loop_type:'council' overload was added to deep_loop_graph_*.`

### Commands

1. `bash: rg -n 'council_graph_(upsert|query|status|convergence)' .opencode/skills/system-spec-kit/mcp_server/tools/index.ts`
2. `bash: rg -n 'council_graph_(upsert|query|status|convergence)' .opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`
3. `bash: rg -n 'council_graph_(upsert|query|status|convergence)' .opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
4. `bash: rg -n "loop_type.*'council'|'council'.*loop_type" .opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts .opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`

### Expected

Steps 1-3 each return ≥4 hits (one per council_graph tool). Step 4 returns no hits.

### Evidence

Capture all four grep outputs verbatim with line numbers.

### Pass / Fail

- **Pass**: 4 council_graph tools registered separately in all three files; no `'council'` `loop_type` overload in deep-loop schemas.
- **Fail**: Any council_graph tool missing its registration; any `'council'` value found in deep-loop `loop_type` enum.

### Failure Triage

If a council_graph tool is missing, inspect ADR-001 vs current `tools/index.ts` for missed dispatcher wiring. If `loop_type:'council'` appears in deep-loop schemas, that is an explicit ADR-001 violation — the council semantics must be moved out of the deep-loop family before the next `validate.sh --strict` run.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-026 | council_graph_* registered separately from deep_loop_graph_* | Verify dedicated tool family + no loop_type:'council' overload | `As a council-graph integration validator, grep tools/index.ts, tool-schemas.ts, and schemas/tool-input-schemas.ts for council_graph_* registrations and assert each has its own dispatcher + schema; then assert no loop_type:'council' overload was added to deep_loop_graph_*.` | grep council_graph_* x3 -> grep loop_type 'council' x1 | 4 council_graph hits per file; 0 council loop_type hits | 4 grep outputs | PASS if 4 dedicated registrations + no overload | Inspect ADR-001 vs tool-wiring drift |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `feature_catalog/` | No feature catalog exists yet |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts` | Tool dispatcher registration |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Tool descriptor registry |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Strict input schemas |
| Internal design notes | ADR-001: dedicated graph decision |
| Internal design notes | CHK-011 (deep-loop boundary) + CHK-023 (tool registration) |

---

## 5. SOURCE METADATA

- Group: COUNCIL GRAPH INTEGRATION
- Playbook ID: DAC-026
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `08--council-graph-integration/008-council-graph-tools-registered-separately-from-deep-loop.md`
