---
title: "EX-021 -- Causal edge deletion (memory_causal_unlink)"
description: "This scenario validates Causal edge deletion (memory_causal_unlink) for `EX-021`. It focuses on Edge correction."
audited_post_018: true
---

# EX-021 -- Causal edge deletion (memory_causal_unlink)

## 1. OVERVIEW

This scenario validates Causal edge deletion (memory_causal_unlink) for `EX-021`. It focuses on Edge correction.

> **Surface status (verified 2026-06-03):** `memory_causal_unlink` has a request handler (`mcp_server/handlers/causal-graph.ts`) and an input schema (`memoryCausalUnlinkSchema`, required arg `edgeId`), but it is **not advertised in the MCP tool registry** (`mcp_server/tool-schemas.ts` lists `memory_causal_link` and `memory_causal_stats` only). It is therefore **not callable through the MCP surface**, so step 2 below cannot be executed via MCP. Treat this scenario as **UNAUTOMATABLE via MCP** until the tool is registered. Exposing a destructive edge-deletion tool is a deliberate decision — track it as a follow-up rather than asserting a defect here.

---

## 2. SCENARIO CONTRACT


- Objective: Edge correction. (Blocked: the unlink tool is not exposed via MCP — see Surface status above.)
- Real user request: `Please validate Causal edge deletion (memory_causal_unlink) against checkpoint_create({ name:"pre-ex021-causal-unlink", specFolder:"<sandbox-spec>" }) and tell me whether the expected signals are present: Removed edge absent in trace.`
- Prompt: `Validate memory_causal_unlink removes the target edge after checkpoint creation; return pass/fail with cited evidence.`
- Expected execution process: Confirm tool availability first. If `memory_causal_unlink` is not in the advertised MCP tool list, classify UNAUTOMATABLE (no exposed unlink surface) and stop. If/when registered, run the documented command sequence and compare against the expected signals.
- Expected signals: Removed edge absent in trace
- Desired user-visible outcome: A concise pass/fail (or UNAUTOMATABLE) verdict with the main reason and cited evidence.
- Pass/fail: PASS if edge removed and checkpoint exists; **UNAUTOMATABLE** while `memory_causal_unlink` is absent from the advertised MCP tool registry

---

## 3. TEST EXECUTION

### Prompt

```
Validate memory_causal_unlink removes the target edge after checkpoint creation; return pass/fail with cited evidence.
```

### Commands

0. Confirm `memory_causal_unlink` is in the advertised MCP tool list. If absent → classify **UNAUTOMATABLE** and stop (current state).
1. checkpoint_create({ name:"pre-ex021-causal-unlink", specFolder:"<sandbox-spec>" })
2. memory_causal_unlink({ edgeId:"<edge-id>" })  — *not exposed via MCP at time of writing*
3. memory_drift_why({ memoryId:"<memory-id>", direction:"both", maxDepth:4 })

### Expected

Removed edge absent in trace (only verifiable once the tool is exposed)

### Evidence

Tool-availability check; checkpoint_create output; (when runnable) unlink + trace outputs

### Pass / Fail

- **Pass**: edge removed and checkpoint exists
- **UNAUTOMATABLE**: `memory_causal_unlink` absent from the advertised MCP tool registry (current state) — handler + input schema exist but the tool is not registered in `tool-schemas.ts`
- **Fail**: tool exposed but contradicting evidence appears or the pass condition is not met

### Failure Triage

If UNAUTOMATABLE: register `memory_causal_unlink` in `mcp_server/tool-schemas.ts` (decision required — destructive edge deletion) before this scenario can run. If runnable: verify edgeId exists; restore `pre-ex021-causal-unlink` if wrong edge removed.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [06--analysis/048-causal-edge-deletion-memorycausalunlink.md](../../feature_catalog/06--analysis/048-causal-edge-deletion-memorycausalunlink.md)

---

## 5. SOURCE METADATA

- Group: Analysis
- Playbook ID: EX-021
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--analysis/049-causal-edge-deletion-memory-causal-unlink.md`
