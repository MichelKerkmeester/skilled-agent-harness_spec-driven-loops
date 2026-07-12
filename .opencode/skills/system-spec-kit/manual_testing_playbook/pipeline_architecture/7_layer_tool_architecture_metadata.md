---
title: "205 -- 7-layer tool architecture metadata"
description: "This scenario validates 7-layer tool architecture metadata for `205`. It focuses on verifying that the seven layers act as governance metadata with budgets and recommendations, not as a separate runtime dispatch router."
audited_post_018: true
version: 3.6.0.12
---

# 205 -- 7-layer tool architecture metadata

## 1. OVERVIEW

This scenario validates 7-layer tool architecture metadata for `205`. It focuses on verifying that the seven layers act as governance metadata with budgets and recommendations, not as a separate runtime dispatch router.

---

## 2. SCENARIO CONTRACT


- Objective: Verify the 7-layer model supplies advisory budgets and layer recommendations while runtime dispatch still routes tools by name through the existing dispatcher modules.
- Real user request: `Please validate 7-layer tool architecture metadata against the documented validation surface and tell me whether the expected signals are present: L1-L7 metadata includes budgets/priorities/guidance/tool membership; task-type mappings remain available for recommendations; runtime dispatch is still name-based and fans into the existing dispatcher modules; recommended-layer metadata is advisory rather than a routing prerequisite.`
- Prompt: `Validate 7-layer tool architecture metadata against the documented validation surface and return pass/fail with cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: L1-L7 metadata includes budgets/priorities/guidance/tool membership; task-type mappings remain available for recommendations; runtime dispatch is still name-based and fans into the existing dispatcher modules; recommended-layer metadata is advisory rather than a routing prerequisite
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the layer model behaves as governance metadata and dispatch remains name-based; FAIL if runtime behavior depends on a missing seven-layer router or if metadata/recommendation claims do not match the actual dispatch implementation

---

## 3. TEST EXECUTION

### Prompt

```
Validate 7-layer tool architecture metadata against the documented validation surface and return pass/fail with cited evidence.
```

### Commands

1. Review the layer-definitions module and confirm all seven layers expose token budgets, priorities, guidance, and tool membership metadata
2. Verify layer IDs still map to task-type recommendation hints
3. Trace a representative tool invocation through the runtime entrypoint and confirm dispatch occurs by tool name into the existing dispatcher modules
4. Exercise or inspect one response path that surfaces recommended-layer metadata
5. Confirm that changing or reading layer metadata does not alter the fundamental name-based dispatch hop

### Expected

L1-L7 metadata includes budgets/priorities/guidance/tool membership; task-type mappings remain available for recommendations; runtime dispatch is still name-based and fans into the existing dispatcher modules; recommended-layer metadata is advisory rather than a routing prerequisite

### Evidence

Layer-definition snapshot from read-only inspection command:

```text
layerCount=7 ids=L1,L2,L3,L4,L5,L6,L7
L1 name=Orchestration tokenBudget=3500 priority=1 useCase=true tools=['memory_context', 'session_resume', 'session_bootstrap']
L2 name=Core tokenBudget=3500 priority=2 useCase=true tools=['memory_search', 'memory_quick_search', 'memory_save', 'memory_match_triggers']
L3 name=Discovery tokenBudget=1000 priority=3 useCase=true tools=['memory_list', 'memory_stats', 'memory_health', 'session_health']
L4 name=Mutation tokenBudget=1000 priority=4 useCase=true tools=['memory_update', 'memory_delete', 'memory_validate', 'memory_bulk_delete', 'memory_retention_sweep', 'memory_embedding_reconcile']
L5 name=Lifecycle tokenBudget=1000 priority=5 useCase=true tools=['checkpoint_create', 'checkpoint_list', 'checkpoint_restore', 'checkpoint_delete']
L6 name=Analysis tokenBudget=1500 priority=6 useCase=true tools=['memory_drift_why', 'memory_causal_link', 'memory_causal_stats', 'memory_causal_unlink', 'task_preflight', 'task_postflight', 'eval_run_ablation', 'eval_reporting_dashboard', 'code_graph_query', 'code_graph_context', 'detect_changes', 'skill_graph_query']
L7 name=Maintenance tokenBudget=1000 priority=7 useCase=true tools=['memory_index_scan', 'memory_index_scan_status', 'memory_index_scan_cancel', 'memory_get_learning_history', 'memory_ingest_start', 'memory_ingest_status', 'memory_ingest_cancel', 'embedder_list', 'embedder_set', 'embedder_status', 'code_graph_scan', 'code_graph_status', 'code_graph_verify', 'skill_graph_scan', 'skill_graph_status', 'skill_graph_validate']
recommendations=search: ['L1', 'L2'], browse: ['L3', 'L2'], modify: ['L4', 'L3'], checkpoint: ['L5'], analyze: ['L6', 'L2'], maintenance: ['L7', 'L3'], default: ['L1', 'L3', 'L2']
contextImportsLayerDefinitions=true
contextDispatchCall=true
toolsImportsLayerDefinitions=false
dispatchers=contextTools:context-tools,memoryTools:memory-tools,causalTools:causal-tools,checkpointTools:checkpoint-tools,lifecycleTools:lifecycle-tools
dispatchByToolName=true handleByName=true
```

Focused validation command:

```text
$ npx vitest run tests/layer-definitions.vitest.ts tests/mcp-tool-dispatch.vitest.ts

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

(node:96577) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)

 Test Files  2 passed (2)
      Tests  89 passed (89)
   Start at  14:04:32
   Duration  1.75s (transform 1.12s, setup 16ms, import 74ms, tests 1.54s, environment 0ms)
```

Runtime response path exercised through `memory_context` returned layer metadata in the MCP error envelope when the wrapper supplied an unbound session id:

```json
{
  "summary": "Error: sessionId \"memory-context:7c8464932aed2bb0\" is not bound to a corroborated server identity. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.",
  "data": {
    "error": "sessionId \"memory-context:7c8464932aed2bb0\" is not bound to a corroborated server identity. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.",
    "code": "E_SESSION_SCOPE",
    "details": {
      "requestId": "425fe857-70ef-4050-b125-34f127125ade",
      "layer": "L1:Orchestration",
      "mode": "focused",
      "upstream": {
        "requestedSessionId": "memory-context:7c8464932aed2bb0"
      }
    }
  },
  "hints": [
    "Omit sessionId to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context."
  ],
  "meta": {
    "tool": "memory_context",
    "tokenCount": 260,
    "cacheHit": false,
    "isError": true,
    "severity": "error",
    "tokenBudget": 3500
  }
}
```

Source inspection showed recommended-layer metadata is advisory: `memory-context.ts` uses `layerDefs.getRecommendedLayers('search')` only in the recovery envelope's `alternativeLayers`, while the fundamental dispatch hop remains `dispatchTool(name, validatedArgs, callerContext)` in `context-server.ts` and `dispatcher.TOOL_NAMES.has(name)` / `dispatcher.handleTool(name, args)` in `tools/index.ts`. The read-only inspection also confirmed `toolsImportsLayerDefinitions=false`, so the dispatch fan-out does not depend on layer metadata.

### Pass / Fail

- **PASS**: the layer model behaves as governance metadata and dispatch remains name-based
- **Fail**: runtime behavior depends on a missing seven-layer router or if metadata/recommendation claims do not match the actual dispatch implementation

### Failure Triage

Inspect `layer-definitions.ts` completeness; verify `context-server.ts` dispatch entrypoint and budget injection; review `tools/index.ts` fan-out modules; confirm handler metadata does not masquerade as an execution router

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [pipeline_architecture/7_layer_tool_architecture_metadata.md](../../feature_catalog/pipeline_architecture/7_layer_tool_architecture_metadata.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 205
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `pipeline_architecture/7_layer_tool_architecture_metadata.md`
