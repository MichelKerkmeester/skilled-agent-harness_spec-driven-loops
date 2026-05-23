---
title: "DAC-019 -- council_graph_upsert idempotency and self-loop rejection"
description: "This scenario validates idempotent upsert behavior and strict-schema rejection of self-loop edges for `DAC-019`. It anchors to the council-graph.vitest.ts test 'upserts prompt-safe council graph data and queries unresolved disagreements and decision support'."
---

# DAC-019 -- council_graph_upsert idempotency and self-loop rejection

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-019`.

---

## 1. OVERVIEW

This scenario validates that `council_graph_upsert` is idempotent across repeated calls (same `(specFolder, sessionId, nodeId/edgeId)` → no duplicate rows) and that self-loop edges (where `from === to`) are rejected by the strict input schema before any storage write.

### Why This Matters

Derived graph rows are replayable from `ai-council/**` artifacts. A reducer or caller will frequently re-upsert the same nodes during convergence loops; without idempotency, row counts drift and convergence math becomes meaningless. Self-loops corrupt graph traversal (`evidence_chain` and `unresolved_disagreements` queries depend on acyclic edges), so they must fail closed at the input boundary.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DAC-019` and confirm the expected signals without contradictory evidence.

- Objective: Verify `council_graph_upsert` is idempotent and rejects self-loop edges.
- Real user request: Upsert the same council session twice and check that nothing is duplicated, and confirm the tool refuses self-loop edges.
- Prompt: `As a council-graph integration validator, call council_graph_upsert twice with the same node payload and assert single-row state, then attempt a self-loop edge and assert strict-schema rejection.`
- Expected execution process: Issue two MCP `council_graph_upsert` calls with identical `nodes` payloads; query node count via `council_graph_status`; issue a third `council_graph_upsert` with a `from === to` edge; assert validation error.
- Expected signals: Second upsert reports no new rows (or matching `inserted: 0`); status node count equals first-call count; self-loop edge call returns input-validation error before any row write.
- Desired user-visible outcome: The user sees that repeated upserts are safe and that self-loops are rejected at the schema layer.
- Pass/fail: PASS if both behaviors hold; FAIL if duplicate rows appear or self-loop edges are stored.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Pick a sandbox `(specFolder, sessionId)` pair (e.g. `specFolder='sandbox/dac-019', sessionId='dac-019-run-01'`).
2. Call `council_graph_upsert` with one SESSION node + one ROUND node + one SUPPORTS edge between two distinct nodes.
3. Call `council_graph_status` and record `nodes`/`edges` counts.
4. Call `council_graph_upsert` with the identical payload from step 2.
5. Re-run `council_graph_status`; assert counts unchanged.
6. Call `council_graph_upsert` with an edge where `from === to`; capture the validation error response.

### Prompt

`As a council-graph integration validator, call council_graph_upsert twice with the same node payload and assert single-row state, then attempt a self-loop edge and assert strict-schema rejection.`

### Commands

1. `tool: council_graph_upsert({ specFolder: 'sandbox/dac-019', sessionId: 'dac-019-run-01', nodes: [{id:'s1', kind:'SESSION'},{id:'r1', kind:'ROUND'}], edges: [{id:'e1', from:'s1', to:'r1', kind:'SUPPORTS'}] })`
2. `tool: council_graph_status({ specFolder: 'sandbox/dac-019', sessionId: 'dac-019-run-01' })`
3. `tool: council_graph_upsert({ specFolder: 'sandbox/dac-019', sessionId: 'dac-019-run-01', nodes: [{id:'s1', kind:'SESSION'},{id:'r1', kind:'ROUND'}], edges: [{id:'e1', from:'s1', to:'r1', kind:'SUPPORTS'}] })`
4. `tool: council_graph_status({ specFolder: 'sandbox/dac-019', sessionId: 'dac-019-run-01' })`
5. `tool: council_graph_upsert({ specFolder: 'sandbox/dac-019', sessionId: 'dac-019-run-01', edges: [{id:'e2', from:'s1', to:'s1', kind:'SUPPORTS'}] })`

### Expected

Step 4 status counts equal step 2 status counts (idempotent). Step 5 returns a strict-schema validation error naming the self-loop constraint; no row written.

### Evidence

Capture the four MCP responses and the schema validation error message verbatim.

### Pass / Fail

- **Pass**: Step 4 counts equal step 2 counts; step 5 returns validation error; node/edge totals after step 5 unchanged.
- **Fail**: Step 4 counts higher than step 2 (duplicate write); step 5 succeeds (self-loop accepted).

### Failure Triage

If duplicates appear, inspect `lib/council-graph/council-graph-db.ts` `upsertNodes`/`upsertEdges` for unique-constraint regression. If self-loop accepted, inspect `schemas/tool-input-schemas.ts` `councilGraphUpsertInputSchema` and `handlers/council-graph/upsert.ts` for validation drift.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-019 | council_graph_upsert idempotency + self-loop rejection | Verify duplicate-call no-op and self-loop input-validation rejection | `As a council-graph integration validator, call council_graph_upsert twice with the same node payload and assert single-row state, then attempt a self-loop edge and assert strict-schema rejection.` | upsert -> status -> upsert (same) -> status -> upsert (self-loop) | First and third status counts equal; self-loop returns validation error | MCP responses + error verbatim | PASS if idempotent + self-loop rejected | Inspect upsertNodes/upsertEdges + tool-input-schemas |

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
| `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/upsert.ts` | MCP handler: idempotent upsert + self-loop rejection |
| `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-db.ts` | Storage layer: unique constraints |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Strict input schema for council_graph_upsert |
| `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts` | Test: "upserts prompt-safe council graph data and queries unresolved disagreements and decision support" |

---

## 5. SOURCE METADATA

- Group: COUNCIL GRAPH INTEGRATION
- Playbook ID: DAC-019
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `08--council-graph-integration/001-council-graph-upsert-idempotency-and-self-loop-rejection.md`
