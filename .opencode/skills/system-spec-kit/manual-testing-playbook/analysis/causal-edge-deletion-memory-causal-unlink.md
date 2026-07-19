---
title: "EX-021 -- Causal edge deletion (memory_causal_unlink)"
description: "This scenario validates Causal edge deletion (memory_causal_unlink) for `EX-021`. It focuses on Edge correction."
audited_post_018: true
version: 3.6.0.17
id: analysis-causal-edge-deletion-memory-causal-unlink
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# EX-021 -- Causal edge deletion (memory_causal_unlink)

## 1. OVERVIEW

This scenario validates Causal edge deletion (memory_causal_unlink) for `EX-021`. It focuses on Edge correction.

> **Surface status (2026-06-03):** `memory_causal_unlink` is now exposed via MCP — registered in `mcp-server/tool-schemas.ts` (advertised), the `MEMORY_RUNTIME_TOOL_NAMES` allow-list, and the `tools/causal-tools.ts` dispatch, on top of the pre-existing handler (`handlers/causal-graph.ts`) and input schema (`memoryCausalUnlinkSchema`, required arg `edgeId`). The scenario is runnable end-to-end. It is destructive (deletes a causal edge by ID), so checkpoint first; the handler returns `{ deleted: boolean }` and reports `deleted:false` for an unknown edge id rather than erroring.

---

## 2. SCENARIO CONTRACT


- Objective: Edge correction — remove an erroneous causal edge and confirm it no longer appears in the trace.
- Real user request: `Please validate Causal edge deletion (memory_causal_unlink) against checkpoint_create({ name:"pre-ex021-causal-unlink", specFolder:"<sandbox-spec>" }) and tell me whether the expected signals are present: Removed edge absent in trace.`
- Prompt: `Validate memory_causal_unlink removes the target edge after checkpoint creation; return pass/fail with cited evidence.`
- Expected execution process: Create a checkpoint, create a throwaway edge with memory_causal_link, delete it with memory_causal_unlink, then confirm via memory_drift_why that the edge is gone. Compare against the expected signals and return the verdict.
- Expected signals: Removed edge absent in trace; memory_causal_unlink returns `{ deleted: true }` for a valid edge id
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the edge is removed (`deleted:true`, absent from the trace) and the checkpoint exists

---

## 3. TEST EXECUTION

### Prompt

```
Validate memory_causal_unlink removes the target edge after checkpoint creation; return pass/fail with cited evidence.
```

### Commands

1. checkpoint_create({ name:"pre-ex021-causal-unlink", specFolder:"<sandbox-spec>" })
2. memory_causal_link({ sourceId:"<a>", targetId:"<b>", relation:"supports" }) → note the returned `edge` id
3. memory_causal_unlink({ edgeId:<edge-id> }) → expect `{ deleted: true }`
4. memory_drift_why({ memoryId:"<b>", direction:"both", maxDepth:4 }) → the removed edge must be absent

### Expected

memory_causal_unlink returns `{ deleted: true }`; the removed edge is absent from the memory_drift_why trace. A non-existent edge id returns `{ deleted: false }` (no error).

### Evidence

checkpoint_create output; memory_causal_link edge id; memory_causal_unlink `{ deleted }` result; memory_drift_why trace before/after

### Pass / Fail

- **Pass**: `deleted:true` for the valid edge id, edge absent from the trace, and the checkpoint exists
- **Fail**: `deleted:false` for a valid edge id, the edge still appears in the trace, or the tool is not callable

### Failure Triage

Verify the edge id exists (via the memory_causal_link result or memory_drift_why `allEdges[].id`). Restore `pre-ex021-causal-unlink` if the wrong edge was removed. If the tool is not callable, confirm the daemon is running the current dist (registration lives in `tool-schemas.ts` + `tools/causal-tools.ts`).

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [analysis/causal-edge-deletion-memorycausalunlink.md](../../feature-catalog/analysis/causal-edge-deletion-memorycausalunlink.md)

---

## 5. SOURCE METADATA

- Group: Analysis
- Playbook ID: EX-021
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `analysis/causal-edge-deletion-memory-causal-unlink.md`
