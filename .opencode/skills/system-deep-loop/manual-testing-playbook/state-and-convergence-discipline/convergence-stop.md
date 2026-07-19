---
id: SC-003
category: state_and_convergence_discipline
stage: routing
title: "SC-003: Convergence Stop Discipline"
description: "Verify convergence detection is documented as a legal stop path owned by the selected mode packet."
expected_intent: research
expected_workflow_mode: research
expected_leaf_resources: []
version: "1.2.0.0"
---

# SC-003: Convergence Stop Discipline

## 1. OVERVIEW

This scenario verifies the documented convergence stop contract without running a full loop. The operator asks for the legal stop behavior and confirms the hub routes to the packet that owns convergence math.

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator wants to know whether a research loop stops on convergence or runs until manually interrupted.

**Exact prompt**:
```
For deep research, explain how convergence detection ends the loop and which packet owns the convergence math before starting any iterations.
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
- Registry fields: `workflowMode: "research"`, `runtimeLoopType: "research"`, `backendKind: "runtime-loop-type"`, `command: "/deep:research"`, `agent: "deep-research"`, `artifactRoot: "research/"`.
- Hub source: if `runtimeLoopType` is not null, the backend is the convergence runtime keyed by that loop type.
- Hub source: each active packet keeps its own convergence math.
- Packet source: deep-research describes iterative research with externalized state and convergence detection, with convergence threshold semantics local to deep-research.

**Desired user-visible outcome**: The AI states that convergence is a stop condition for deep research and that deep-research owns the mode-specific convergence math.

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/system-deep-loop/mode-registry.json` contains the `research` mode entry.
2. `.opencode/skills/system-deep-loop/deep-research/SKILL.md` documents convergence threshold semantics.

### Exact Command Sequence

1. **Invoke hub**: `Skill(system-deep-loop, "For deep research, explain how convergence detection ends the loop and which packet owns the convergence math before starting any iterations.")`.
2. **Capture response**: save output to `/tmp/dlw-SC-003/response.txt`.
3. **Compare discipline**: confirm convergence ownership is assigned to the packet, not the hub.

### Expected Signals

| Step | Signal |
|---|---|
| 1 | Hub selects `workflowMode: research`. |
| 2 | Response names runtime loop type `research` and backend `runtime-loop-type`. |
| 3 | Response says convergence can legally stop the loop. |
| 3 | Response says deep-research owns the convergence math, not the hub. |

### Pass/Fail Criteria

- **PASS** iff the route is research and convergence is described as a legal stop path owned by deep-research.
- **PARTIAL** iff route is correct and convergence is named, but ownership is not explicit.
- **FAIL** iff the AI says the loop must run indefinitely, the hub owns convergence math, or another mode's convergence semantics apply.

### Failure Triage

1. If convergence ownership is wrong, re-read the hub's packet-owned convergence rule.
2. If threshold details are borrowed from a sibling mode, compare against deep-research's local threshold semantics.
3. If route is wrong, verify the prompt's `deep research` control is intact.

## 4. SOURCE FILES

- `.opencode/skills/system-deep-loop/SKILL.md` - convergence backend and packet-owned convergence rule.
- `.opencode/skills/system-deep-loop/mode-registry.json` - `research` runtime loop fields.
- `.opencode/skills/system-deep-loop/deep-research/SKILL.md` - deep-research convergence semantics.

## 5. SOURCE METADATA

- **Critical path**: No
- **Destructive**: No
- **Sandbox**: `/tmp/dlw-SC-003/`
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
