---
id: RB-002
category: runtime_and_backend
stage: routing
title: "RB-002: Runtime Loop Council Backend"
description: "Verify the ai-council mode resolves to backendKind runtime-loop-type with runtimeLoopType council."
expected_intent: ai-council
expected_workflow_mode: ai-council
expected_leaf_resources: []
version: "1.2.0.0"
---

# RB-002: Runtime Loop Council Backend

## 1. OVERVIEW

This scenario verifies that the public mode key `ai-council` maps to runtime loop key `council`. The runtime loop type must not be inferred by copying the workflow mode.

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator wants a registry-grounded route explanation for the council backend.

**Exact prompt**:
```
For an AI council deliberation, resolve the mode through the registry and state the backend, runtime loop type, command, agent, and artifact root before starting.
```

**Expected route**:
- Mode: `ai-council`
- Command: `/deep:ai-council`
- Agent: `ai-council`
- Backend: `runtime-loop-type`
- Runtime loop type: `council`
- Packet: `deep-ai-council`
- Artifact root: `ai-council/`

**Why this route is expected**:
- Registry fields: `workflowMode: "ai-council"`, `runtimeLoopType: "council"`, and `backendKind: "runtime-loop-type"`.
- Runtime extension evidence: `runtimeLoopTypes` are `"research"`, `"review"`, and `"council"`.
- Hub source: `ai-council` maps to `runtimeLoopType: council`.

**Desired user-visible outcome**: The AI reports `runtimeLoopType: council` and does not invent `runtimeLoopType: ai-council`.

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/system-deep-loop/mode-registry.json` contains the `ai-council` mode entry.
2. `.opencode/skills/system-deep-loop/SKILL.md` contains the three-tier discriminator section.

### Exact Command Sequence

1. **Invoke hub**: `Skill(system-deep-loop, "For an AI council deliberation, resolve the mode through the registry and state the backend, runtime loop type, command, agent, and artifact root before starting.")`.
2. **Capture route**: save output to `/tmp/dlw-RB-002/response.txt`.
3. **Compare backend fields**: confirm `runtimeLoopType: council` exactly.

### Expected Signals

| Step | Signal |
|---|---|
| 1 | Hub selects `workflowMode: ai-council`. |
| 2 | Response names `backendKind: runtime-loop-type` and `runtimeLoopType: council`. |
| 3 | Response does not infer runtime loop type from the workflow mode string. |

### Pass/Fail Criteria

- **PASS** iff council resolves to `runtime-loop-type` with `runtimeLoopType: council` and the expected command, agent, and artifact root.
- **PARTIAL** iff backend is correct but the non-inference rule is not mentioned.
- **FAIL** iff runtime loop type is `ai-council`, null, or any value other than `council`.

### Failure Triage

1. If runtime loop type is copied from the workflow mode, re-read the discriminator rule: never infer `runtimeLoopType` from `workflowMode`.
2. If packet is wrong, compare `packet: "deep-ai-council"` with `agent: "ai-council"`.
3. If backend is wrong, verify `backendKind: "runtime-loop-type"`.

## 4. SOURCE FILES

- `.opencode/skills/system-deep-loop/SKILL.md` - three-tier discriminator and council mapping.
- `.opencode/skills/system-deep-loop/mode-registry.json` - `ai-council` backend fields.

## 5. SOURCE METADATA

- **Critical path**: No
- **Destructive**: No
- **Sandbox**: `/tmp/dlw-RB-002/`
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
