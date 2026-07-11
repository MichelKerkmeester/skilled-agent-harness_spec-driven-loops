---
title: "RB-004: External Adapter Backend"
description: "Verify ai-system-improvement resolves to backendKind external-adapter with runtimeLoopType null and external loop ownership."
version: "1.1.0.0"
---

# RB-004: External Adapter Backend

## 1. OVERVIEW

This scenario verifies that the non-developer AI-system lane is not hosted by the runtime loop or the improvement host. Its backend is the external adapter declared by the registry.

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator wants a route explanation for the non-developer AI-system improvement lane before running the external package loop.

**Exact prompt**:
```
/deep:ai-system-improvement Resolve the non-dev AI-system improvement route through the registry and state the backend, runtime loop type, loop owner, command, agent, and artifact root before starting.
```

**Expected route**:
- Mode: `ai-system-improvement`
- Command: `/deep:ai-system-improvement`
- Agent: `deep-improvement`
- Backend: `external-adapter`
- Runtime loop type: `null`
- Loop host mode: `non-dev-ai-system-refine`
- Packet: `deep-improvement`
- Artifact root: `improvement/`

**Why this route is expected**:
- Registry fields: `workflowMode: "ai-system-improvement"`, `runtimeLoopType: null`, `backendKind: "external-adapter"`, `loopHostMode: "non-dev-ai-system-refine"`.
- External owner evidence: `externalLoopOwner: "external packaging (e.g. Barter Copywriter) owns the Python loop, gates, scoring, and kill-switches"`.
- Advisor evidence: `advisorRouting.routingClass: "command-bridge"`.

**Desired user-visible outcome**: The AI reports `external-adapter`, keeps `runtimeLoopType: null`, and states that external packaging owns the loop.

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/system-deep-loop/mode-registry.json` contains the `ai-system-improvement` mode entry.
2. The orchestrator can accept `/deep:ai-system-improvement` command prompts.

### Exact Command Sequence

1. **Invoke command surface**: enter the exact prompt into the orchestrator runtime.
2. **Capture route**: save output to `/tmp/dlw-RB-004/response.txt`.
3. **Compare backend fields**: confirm external-adapter and null runtime loop type.

### Expected Signals

| Step | Signal |
|---|---|
| 1 | Command surface selects `workflowMode: ai-system-improvement`. |
| 2 | Response names `backendKind: external-adapter` and `runtimeLoopType: null`. |
| 3 | Response names external ownership and does not use the runtime-loop backend. |

### Pass/Fail Criteria

- **PASS** iff ai-system-improvement resolves to `external-adapter` with null runtime loop type and the expected external ownership statement.
- **PARTIAL** iff backend and null loop type are correct but external ownership is omitted.
- **FAIL** iff backend is `runtime-loop-type` or `improvement-host`, or any non-null runtime loop type is assigned.

### Failure Triage

1. If improvement-host appears, compare against `backendKind: "external-adapter"`.
2. If runtime loop type is invented, inspect the explicit-null discriminator rule.
3. If external ownership is unknown, quote the registry `externalLoopOwner` field or mark UNKNOWN rather than inventing an owner.

## 4. SOURCE FILES

- `.opencode/skills/system-deep-loop/SKILL.md` - backend discriminator.
- `.opencode/skills/system-deep-loop/mode-registry.json` - `ai-system-improvement` backend fields.

## 5. SOURCE METADATA

- **Critical path**: Yes
- **Destructive**: No for this routing test
- **Sandbox**: `/tmp/dlw-RB-004/`
- **Concurrent-safe**: Run serially with command checks
- **Last validated**: pending first manual run
