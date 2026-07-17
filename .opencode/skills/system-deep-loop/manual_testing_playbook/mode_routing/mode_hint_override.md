---
id: MO-004
category: mode_routing
stage: routing
title: "MO-004: Mode-Hint Override"
description: "Verify an explicit mode hint such as research: overrides ambiguous wording and resolves through the matching registry entry."
expected_intent: research
expected_resources:
  - deep-research/references/protocol/loop_protocol.md
  - deep-research/references/state/state_jsonl.md
  - deep-research/references/convergence/convergence.md
expected_workflow_mode: research
expected_leaf_resources:
  - workflow_mode: research
    leaf_resource_id: references/protocol/loop_protocol.md
  - workflow_mode: research
    leaf_resource_id: references/state/state_jsonl.md
  - workflow_mode: research
    leaf_resource_id: references/convergence/convergence.md
version: "1.2.0.0"
---

# MO-004: Mode-Hint Override

## 1. OVERVIEW

This scenario verifies the hub rule that a mode hint overrides dominant-intent classification. The test uses `research:` on an otherwise audit-flavored prompt and expects `workflowMode: research`.

## 2. SCENARIO CONTRACT

**Realistic user request**: A maintainer wants investigation first, even though the prompt mentions review terms.

**Exact prompt**:
```
research: Investigate whether our deep review findings are repeating because the source context is stale, and write a research summary before any audit verdict.
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
- Hub rule: `mode hint like "research: ..." overrides` the classifier.
- Registry fields: `workflowMode: "research"`, `runtimeLoopType: "research"`, `backendKind: "runtime-loop-type"`, `command: "/deep:research"`, `agent: "deep-research"`, `artifactRoot: "research/"`.
- Alias evidence: `aliases` includes `"research loop"` and `"iterative investigation workflow"`.
- Advisor evidence: `advisorRouting.routingClass: "lexical"` and `advisorRouting.legacyAdvisorId: "deep-research"`.

**Desired user-visible outcome**: The AI honors `research:` and routes to `research` even though the prompt contains `deep review`, `audit`, and `verdict` language.

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/system-deep-loop/SKILL.md` contains the mode-hint override rule.
2. `.opencode/skills/system-deep-loop/mode-registry.json` contains the `research` mode entry.

### Exact Command Sequence

1. **Invoke hub with hint**: `Skill(system-deep-loop, "research: Investigate whether our deep review findings are repeating because the source context is stale, and write a research summary before any audit verdict.")`.
2. **Capture route**: save the AI response to `/tmp/dlw-MO-004/response.txt`.
3. **Compare to registry**: confirm the response matches the `research` registry entry.

### Expected Signals

| Step | Signal |
|---|---|
| 1 | Hub reports that the explicit `research:` hint controls the selected mode. |
| 2 | Hub selects `workflowMode: research`. |
| 3 | Response names `/deep:research`, agent `deep-research`, backend `runtime-loop-type`, and artifact root `research/`. |
| 3 | Response does not route to `review` despite audit-flavored words. |

### Pass/Fail Criteria

- **PASS** iff `research:` wins and the selected route matches the `research` registry entry.
- **PARTIAL** iff `research` is selected but the AI does not explicitly mention that the hint overrode ambiguous wording.
- **FAIL** iff the AI selects `review`, asks for clarification instead of honoring the hint, or invents a non-registry mode.

### Failure Triage

1. If review wins, re-read the hub routing rule that mode hints override dominant intent.
2. If the hub asks for clarification, verify the hint uses the exact registered mode key `research`.
3. If route fields are missing, compare the response against the `research` registry entry.

## 4. SOURCE FILES

- `.opencode/skills/system-deep-loop/SKILL.md` - mode-hint override rule.
- `.opencode/skills/system-deep-loop/mode-registry.json` - `research` mode source of truth.

## 5. SOURCE METADATA

- **Critical path**: No
- **Destructive**: No
- **Sandbox**: `/tmp/dlw-MO-004/`
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
