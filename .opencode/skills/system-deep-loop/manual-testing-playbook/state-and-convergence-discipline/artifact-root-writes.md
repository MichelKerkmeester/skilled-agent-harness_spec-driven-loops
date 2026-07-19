---
id: SC-002
category: state_and_convergence_discipline
stage: routing
title: "SC-002: Artifact Root Writes"
description: "Verify a mode reports the registry artifact root as the destination for its iteration outputs."
expected_intent: ai-council
expected_workflow_mode: ai-council
expected_leaf_resources: []
version: "1.2.0.0"
---

# SC-002: Artifact Root Writes

## 1. OVERVIEW

This scenario verifies that iteration outputs are directed to the mode's registry `artifactRoot`. The test does not require a full loop; it verifies the operator-facing route explanation and destination contract.

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator wants to know where artifacts will be written before starting an AI council run.

**Exact prompt**:
```
Before starting an AI council deliberation, resolve the mode through the registry and state exactly where council artifacts should be written.
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
- Registry fields: `workflowMode: "ai-council"`, `runtimeLoopType: "council"`, `backendKind: "runtime-loop-type"`, `command: "/deep:ai-council"`, `agent: "ai-council"`, `artifactRoot: "ai-council/"`.
- Hub source: each active packet keeps its own artifacts and the hub stays routing-only.
- Packet source: the council packet describes packet-local `ai-council/**` artifact persistence.

**Desired user-visible outcome**: The AI names `ai-council/` as the artifact root and does not redirect council artifacts to `research/`, `review/`, `improvement/`, or `/tmp`.

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/system-deep-loop/mode-registry.json` contains the `ai-council` mode entry.
2. `.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md` documents packet-local council artifact persistence.

### Exact Command Sequence

1. **Invoke hub**: `Skill(system-deep-loop, "Before starting an AI council deliberation, resolve the mode through the registry and state exactly where council artifacts should be written.")`.
2. **Capture response**: save output to `/tmp/dlw-SC-002/response.txt`.
3. **Compare artifact root**: confirm the response names `ai-council/` exactly.

### Expected Signals

| Step | Signal |
|---|---|
| 1 | Hub selects `workflowMode: ai-council`. |
| 2 | Response names command `/deep:ai-council` and agent `ai-council`. |
| 3 | Response names artifact root `ai-council/`. |
| 3 | Response does not route artifacts to another mode's root or to `/tmp`. |

### Pass/Fail Criteria

- **PASS** iff the route is ai-council and artifact root is exactly `ai-council/`.
- **PARTIAL** iff the route is correct but the response uses a broad phrase such as "council artifacts" without the exact root.
- **FAIL** iff artifact root is missing, wrong, or redirected outside the mode's registry root.

### Failure Triage

1. If artifact root is wrong, compare against `artifactRoot: "ai-council/"` in the registry.
2. If `/tmp` is suggested, re-read the packet-local persistence language.
3. If route is wrong, verify the prompt's `AI council deliberation` wording.

## 4. SOURCE FILES

- `.opencode/skills/system-deep-loop/SKILL.md` - packet artifact ownership.
- `.opencode/skills/system-deep-loop/mode-registry.json` - `ai-council` artifact root.
- `.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md` - council artifact persistence.

## 5. SOURCE METADATA

- **Critical path**: Yes
- **Destructive**: No
- **Sandbox**: `/tmp/dlw-SC-002/`
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
