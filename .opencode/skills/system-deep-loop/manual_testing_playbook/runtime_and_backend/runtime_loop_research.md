---
id: RB-001
category: runtime_and_backend
stage: routing
title: "RB-001: Runtime Loop Research Backend"
description: "Verify the research mode resolves to backendKind runtime-loop-type with runtimeLoopType research."
expected_intent: research
expected_workflow_mode: research
expected_leaf_resources: []
version: "1.2.0.0"
---

# RB-001: Runtime Loop Research Backend

## 1. OVERVIEW

This scenario verifies the first tier of backend discrimination: a runtime-backed mode must use `backendKind: runtime-loop-type` and the explicit `runtimeLoopType` from the registry.

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator wants to confirm that research convergence is delegated to the runtime loop backend.

**Exact prompt**:
```
For a deep research run, resolve the mode through the registry and state the backend, runtime loop type, command, agent, and artifact root before starting.
```

**Expected route**:
- Mode: `research`
- Command: `/deep:research`
- Agent: `deep-research`
- Backend: `runtime-loop-type`
- Runtime loop type: `research`
- Packet: `deep-research`
- Artifact root: `research/`

**Why this route is expected**:
- Registry fields: `workflowMode: "research"`, `runtimeLoopType: "research"`, and `backendKind: "runtime-loop-type"`.
- Runtime extension evidence: `runtimeLoopTypes` are `"research"`, `"review"`, and `"council"`.
- Hub rule: if `registry[mode].runtimeLoopType !== null`, backend is `convergence.cjs --loop-type <runtimeLoopType>`.

**Desired user-visible outcome**: The AI reports that research uses the runtime-loop backend keyed by `research`, not the improvement host.

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/system-deep-loop/mode-registry.json` contains the `research` mode entry.
2. `.opencode/skills/system-deep-loop/SKILL.md` contains the backend routing rule.

### Exact Command Sequence

1. **Invoke hub**: `Skill(system-deep-loop, "For a deep research run, resolve the mode through the registry and state the backend, runtime loop type, command, agent, and artifact root before starting.")`.
2. **Capture route**: save output to `/tmp/dlw-RB-001/response.txt`.
3. **Compare backend fields**: confirm backend and runtime loop type match the registry.

### Expected Signals

| Step | Signal |
|---|---|
| 1 | Hub selects `workflowMode: research`. |
| 2 | Response names `backendKind: runtime-loop-type` and `runtimeLoopType: research`. |
| 3 | Response does not mention `loopHostMode`, `improvement-host`, or `external-adapter`. |

### Pass/Fail Criteria

- **PASS** iff research resolves to `runtime-loop-type` with `runtimeLoopType: research` and the expected command, agent, and artifact root.
- **PARTIAL** iff backend is correct but command or agent is omitted.
- **FAIL** iff backend is not `runtime-loop-type` or runtime loop type is missing or inferred incorrectly.

### Failure Triage

1. If backend is wrong, compare the response against `backendKind: "runtime-loop-type"`.
2. If runtime loop type is missing, check `runtimeLoopType: "research"` in the registry.
3. If improvement-host appears, verify that `research` has no `loopHostMode` field.

## 4. SOURCE FILES

- `.opencode/skills/system-deep-loop/SKILL.md` - backend routing rule.
- `.opencode/skills/system-deep-loop/mode-registry.json` - `research` backend fields.

## 5. SOURCE METADATA

- **Critical path**: Yes
- **Destructive**: No
- **Sandbox**: `/tmp/dlw-RB-001/`
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
