---
title: "SC-004: Hub Logic Boundary"
description: "Verify the parent hub remains routing-only and does not flatten per-mode convergence, state, synthesis, or artifact contracts."
version: "1.1.0.0"
---

# SC-004: Hub Logic Boundary

## 1. OVERVIEW

This scenario verifies the architectural boundary of the parent skill. The hub resolves a `workflowMode` through the registry, then loads the selected mode packet. It must not own per-mode convergence, state, synthesis, or artifact behavior.

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator asks the hub to explain where mode-specific behavior lives before selecting a route.

**Exact prompt**:
```
Explain whether the deep-loop-workflows hub owns convergence, state, synthesis, or artifact logic, then resolve a review request through the registry.
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
- Registry fields: `workflowMode: "review"`, `runtimeLoopType: "review"`, `backendKind: "runtime-loop-type"`, `packet: "deep-review"`, `command: "/deep:review"`, `agent: "deep-review"`, `artifactRoot: "review/"`.
- Hub source: the hub holds NO per-mode convergence, state, or synthesis logic.
- Hub source: each active packet keeps its own convergence math, state shape, artifacts, and tool-permission guards.
- Hub source: ALWAYS keep each mode's convergence/state/artifact contract in its packet; the hub stays logic-free.

**Desired user-visible outcome**: The AI says the hub is routing-only, resolves the review route through `mode-registry.json`, and assigns detailed behavior to `deep-review`.

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/deep-loop-workflows/SKILL.md` contains the routing-only and packet-owned behavior rules.
2. `.opencode/skills/deep-loop-workflows/mode-registry.json` contains the `review` mode entry.

### Exact Command Sequence

1. **Invoke hub**: `Skill(deep-loop-workflows, "Explain whether the deep-loop-workflows hub owns convergence, state, synthesis, or artifact logic, then resolve a review request through the registry.")`.
2. **Capture response**: save output to `/tmp/dlw-SC-004/response.txt`.
3. **Compare boundary**: confirm the response states hub routing-only behavior and packet ownership.

### Expected Signals

| Step | Signal |
|---|---|
| 1 | Hub selects `workflowMode: review` after explaining the boundary. |
| 2 | Response names registry fields for review route. |
| 3 | Response says the hub does not own per-mode convergence, state, synthesis, or artifact logic. |
| 3 | Response assigns review-specific behavior to the `deep-review` packet. |

### Pass/Fail Criteria

- **PASS** iff the response preserves the hub routing-only boundary and resolves review using registry fields.
- **PARTIAL** iff the route is correct but the response omits one behavior category, such as synthesis.
- **FAIL** iff the response says the hub owns per-mode logic, invents mode behavior in the hub, or bypasses the registry.

### Failure Triage

1. If hub ownership is claimed, re-read the first paragraph and ALWAYS rules in the hub skill.
2. If registry is bypassed, compare the response against `mode-registry.json`.
3. If route fields drift, verify `packet: "deep-review"`, `command: "/deep:review"`, and `artifactRoot: "review/"`.

## 4. SOURCE FILES

- `.opencode/skills/deep-loop-workflows/SKILL.md` - routing-only boundary and packet ownership rules.
- `.opencode/skills/deep-loop-workflows/mode-registry.json` - `review` route fields.
- `.opencode/skills/deep-loop-workflows/deep-review/SKILL.md` - review packet behavior ownership.

## 5. SOURCE METADATA

- **Critical path**: Yes
- **Destructive**: No
- **Sandbox**: `/tmp/dlw-SC-004/`
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
