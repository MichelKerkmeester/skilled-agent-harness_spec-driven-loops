---
id: MO-005
category: mode_routing
stage: routing
title: "MO-005: Alignment Mode Routing"
description: "Verify a read-only conformance audit against a named standard authority resolves to the alignment mode through the system-deep-loop hub."
expected_intent: alignment
expected_resources:
  - deep-alignment/references/scoping_protocol.md
  - deep-alignment/references/discover_contract.md
  - deep-alignment/references/lane_config_schema.md
expected_workflow_mode: alignment
expected_leaf_resources:
  - workflow_mode: alignment
    leaf_resource_id: references/scoping_protocol.md
  - workflow_mode: alignment
    leaf_resource_id: references/discover_contract.md
  - workflow_mode: alignment
    leaf_resource_id: references/lane_config_schema.md
version: "1.0.0.0"
---

# MO-005: Alignment Mode Routing

## 1. OVERVIEW

This scenario verifies that a read-only conformance-audit request against a named standard authority resolves to `workflowMode: alignment` and does not route to review, research, or an improvement lane. It realizes the `DA-R01` alignment seed row from the routing research: the seventh public mode needs a loader-eligible direct-route scenario so the corpus covers every workflow mode.

## 2. SCENARIO CONTRACT

**Realistic user request**: A maintainer wants to check whether a skill conforms to its named standard authority, without changing any files.

**Exact prompt**:
```
Run a conformance audit against the named standard authority for the sk-git skill: read-only, report deviations by lane, and do not edit anything.
```

**Expected route**:
- Mode: `alignment`
- Command: `/deep:alignment`
- Agent: `deep-alignment`
- Backend: `runtime-loop-type`
- Runtime loop type: `review`
- Packet: `deep-alignment`
- Artifact root: `alignment/`
- Mutating: `false` (Write/Edit forbidden)

**Why this route is expected**:
- Registry fields: `workflowMode: "alignment"`, `runtimeLoopType: "review"`, `backendKind: "runtime-loop-type"`, `command: "/deep:alignment"`, `agent: "deep-alignment"`, `artifactRoot: "alignment/"`, `toolSurface.forbidden: ["Write", "Edit"]`.
- Alias evidence: `aliases` includes `"deep-alignment"`, `"alignment lane"`, `"conformance review"`, `"standard authority check"`, and `"alignment conformance audit"`.
- Advisor evidence: `advisorRouting.routingClass: "lexical"` and `advisorRouting.legacyAdvisorId: "deep-alignment"`.

**Expected references loaded** (surface router, packet-qualified):
- `deep-alignment/references/scoping_protocol.md`
- `deep-alignment/references/discover_contract.md`
- `deep-alignment/references/lane_config_schema.md`

**Desired user-visible outcome**: The AI invokes or describes the `alignment` lane, names `/deep:alignment`, `deep-alignment`, `runtime-loop-type`, and `alignment/`, and states that the audit is read-only by default.

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/system-deep-loop/SKILL.md` is readable.
2. `.opencode/skills/system-deep-loop/mode-registry.json` contains the `alignment` mode entry.
3. Skill advisor is callable if the operator chooses an advisor probe.

### Exact Command Sequence

1. **Invoke hub**: `Skill(system-deep-loop, "Run a conformance audit against the named standard authority for the sk-git skill: read-only, report deviations by lane, and do not edit anything.")`.
2. **Capture route**: save the AI response to `/tmp/dlw-MO-005/response.txt`.
3. **Compare to registry**: confirm the response matches the `alignment` registry entry, including the forbidden Write/Edit surface.

### Pass/Fail Criteria

- **PASS** iff the selected mode is `alignment`, the backend is `runtime-loop-type` with `runtimeLoopType: review`, and the audit is described as read-only.
- **PARTIAL** iff `alignment` is selected but the response omits one non-routing field such as `packet` or `artifactRoot`.
- **FAIL** iff any non-alignment mode is selected, or the response proposes edits (violating the read-only default).

### Failure Triage

1. If the hub picks review, check whether the prompt over-emphasizes findings severity rather than named-standard conformance.
2. If the backend is wrong, verify the `alignment` entry's `runtimeLoopType` is `review` and `backendKind` is `runtime-loop-type`.

## 4. SOURCE FILES

- `.opencode/skills/system-deep-loop/SKILL.md` - hub routing rule and mode table.
- `.opencode/skills/system-deep-loop/mode-registry.json` - `alignment` mode source of truth.

## 5. SOURCE METADATA

- **Critical path**: Yes
- **Destructive**: No
- **Sandbox**: `/tmp/dlw-MO-005/`
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
