---
id: SC-001
category: state_and_convergence_discipline
stage: routing
title: "SC-001: Externalized State Discipline"
description: "Verify loop state is packet-owned and externalized, not manually simulated through ad hoc /tmp iteration prompts."
expected_intent: review
expected_workflow_mode: review
expected_leaf_resources: []
version: "1.2.0.0"
---

# SC-001: Externalized State Discipline

## 1. OVERVIEW

This scenario verifies documented state discipline without running a full loop. The operator confirms that state belongs to the mode packet and command workflow, not to ad hoc `/tmp` prompts or a manually scripted dispatcher.

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator asks how to run an iterative review loop safely and wants to avoid manual state drift.

**Exact prompt**:
```
Before running deep review, explain where iteration state is owned and confirm whether I can manually write prompts to /tmp and dispatch them in a loop.
```

**Expected route**:
- Mode: `review`
- Command: `/deep:review`
- Agent: `deep-review`
- Backend: `runtime-loop-type`
- Runtime loop type: `review`
- Packet: `deep-review`
- Artifact root: `review/`

**Why this route is expected**:
- Registry fields: `workflowMode: "review"`, `runtimeLoopType: "review"`, `backendKind: "runtime-loop-type"`, `command: "/deep:review"`, `agent: "deep-review"`, `artifactRoot: "review/"`.
- Hub source: each active packet keeps its own convergence math, state shape, artifacts, and tool-permission guards.
- Packet source: deep-review forbids manually writing iteration prompts to `/tmp`, dispatching them in a loop, skipping the state machine, or managing iteration state outside the resolved review packet.
- Packet source: deep-review requires the command workflow to own dispatch and `scripts/reduce-state.cjs` to be the single state writer.

**Desired user-visible outcome**: The AI says no to manual `/tmp` iteration state and points the operator to `/deep:review` and packet-owned state discipline.

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/system-deep-loop/mode-registry.json` contains the `review` mode entry.
2. `.opencode/skills/system-deep-loop/deep-review/SKILL.md` contains the forbidden invocation patterns and state ownership rules.

### Exact Command Sequence

1. **Invoke hub**: `Skill(system-deep-loop, "Before running deep review, explain where iteration state is owned and confirm whether I can manually write prompts to /tmp and dispatch them in a loop.")`.
2. **Capture response**: save output to `/tmp/dlw-SC-001/response.txt`.
3. **Compare discipline**: confirm the response rejects manual `/tmp` iteration state and names command-owned state.

### Expected Signals

| Step | Signal |
|---|---|
| 1 | Hub selects `workflowMode: review`. |
| 2 | Response names `/deep:review`, packet-owned state, and command workflow ownership. |
| 3 | Response rejects manual `/tmp` prompt dispatch and ad hoc shell fan-out. |
| 3 | Response does not claim the hub owns review state shape. |

### Pass/Fail Criteria

- **PASS** iff the route is review and the response explicitly rejects manual `/tmp` state in favor of packet-owned command state.
- **PARTIAL** iff route is correct and packet ownership is named, but `/tmp` is not explicitly rejected.
- **FAIL** iff the AI recommends manual `/tmp` state, custom loop dispatch, or hub-owned state.

### Failure Triage

1. If manual `/tmp` is allowed, re-read the deep-review forbidden invocation patterns.
2. If hub ownership is claimed, re-read the hub rule that per-mode state contracts live in packets.
3. If route is not review, verify the prompt's `deep review` control is intact.

## 4. SOURCE FILES

- `.opencode/skills/system-deep-loop/SKILL.md` - packet-owned state and hub logic boundary.
- `.opencode/skills/system-deep-loop/mode-registry.json` - `review` route fields.
- `.opencode/skills/system-deep-loop/deep-review/SKILL.md` - forbidden manual state and command-owned workflow rules.

## 5. SOURCE METADATA

- **Critical path**: Yes
- **Destructive**: No
- **Sandbox**: `/tmp/dlw-SC-001/`
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
