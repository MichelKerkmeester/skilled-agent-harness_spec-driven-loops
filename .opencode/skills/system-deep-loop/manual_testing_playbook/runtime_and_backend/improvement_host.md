---
title: "RB-003: Improvement Host Backend"
description: "Verify agent-improvement resolves to backendKind improvement-host with runtimeLoopType null and loopHostMode agent-improvement."
version: "1.1.0.0"
---

# RB-003: Improvement Host Backend

## 1. OVERVIEW

This scenario verifies that improvement-host modes use `loop-host.cjs --mode` semantics and explicit null `runtimeLoopType`.

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator wants to confirm that agent-improvement is host-driven rather than handled by the runtime convergence loop.

**Exact prompt**:
```
For an agent-improvement run, resolve the mode through the registry and state the backend, runtime loop type, loop host mode, command, agent, and artifact root before starting.
```

**Expected route**:
- Mode: `agent-improvement`
- Command: `/deep:agent-improvement`
- Agent: `deep-improvement`
- Backend: `improvement-host`
- Runtime loop type: `null`
- Loop host mode: `agent-improvement`
- Packet: `deep-improvement`
- Artifact root: `improvement/`

**Why this route is expected**:
- Registry fields: `workflowMode: "agent-improvement"`, `runtimeLoopType: null`, `backendKind: "improvement-host"`, `loopHostMode: "agent-improvement"`.
- Hub source: improvement lanes use the improvement loop host and the runtime never gains an `improvement` loop type.
- Discriminator evidence: `runtimeLoopType` is explicit null for improvement-host modes and is never inferred from `workflowMode`.

**Desired user-visible outcome**: The AI reports `runtimeLoopType: null`, backend `improvement-host`, and loop host mode `agent-improvement` without naming `convergence.cjs --loop-type improvement`.

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/system-deep-loop/mode-registry.json` contains the `agent-improvement` mode entry.
2. `.opencode/skills/system-deep-loop/SKILL.md` contains the backend and NEVER-infer rules.

### Exact Command Sequence

1. **Invoke hub**: `Skill(system-deep-loop, "For an agent-improvement run, resolve the mode through the registry and state the backend, runtime loop type, loop host mode, command, agent, and artifact root before starting.")`.
2. **Capture route**: save output to `/tmp/dlw-RB-003/response.txt`.
3. **Compare backend fields**: confirm null runtime loop type and loop host mode.

### Expected Signals

| Step | Signal |
|---|---|
| 1 | Hub selects `workflowMode: agent-improvement`. |
| 2 | Response names `backendKind: improvement-host`, `runtimeLoopType: null`, and `loopHostMode: agent-improvement`. |
| 3 | Response does not infer `runtimeLoopType: improvement` or `runtimeLoopType: agent-improvement`. |

### Pass/Fail Criteria

- **PASS** iff agent-improvement resolves to `improvement-host` with null runtime loop type and expected loop host mode.
- **PARTIAL** iff backend and null loop type are correct but the loop host mode is omitted.
- **FAIL** iff any non-null runtime loop type is assigned or the runtime-loop backend is used.

### Failure Triage

1. If a runtime loop type is invented, inspect the registry discriminator's explicit-null rule.
2. If backend is wrong, compare against `backendKind: "improvement-host"`.
3. If command is wrong, compare against `command: "/deep:agent-improvement"`.

## 4. SOURCE FILES

- `.opencode/skills/system-deep-loop/SKILL.md` - backend and NEVER-infer rules.
- `.opencode/skills/system-deep-loop/mode-registry.json` - `agent-improvement` backend fields.

## 5. SOURCE METADATA

- **Critical path**: Yes
- **Destructive**: No for this routing test
- **Sandbox**: `/tmp/dlw-RB-003/`
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
