---
id: MO-001
category: mode_routing
stage: routing
title: "MO-001: Research Mode Routing"
description: "Verify an outward iterative investigation request resolves to the research mode through the system-deep-loop hub."
expected_intent: research
expected_resources:
  - deep-research/references/protocol/loop-protocol.md
  - deep-research/references/state/state-jsonl.md
  - deep-research/references/convergence/convergence.md
expected_workflow_mode: research
expected_leaf_resources:
  - workflow_mode: research
    leaf_resource_id: references/protocol/loop-protocol.md
  - workflow_mode: research
    leaf_resource_id: references/state/state-jsonl.md
  - workflow_mode: research
    leaf_resource_id: references/convergence/convergence.md
version: "1.2.0.0"
---

# MO-001: Research Mode Routing

## 1. OVERVIEW

This scenario verifies that an outward web-plus-code investigation request resolves to `workflowMode: research` and does not route to review, ai-council, or an improvement lane.

## 2. SCENARIO CONTRACT

**Realistic user request**: A maintainer wants an iterative investigation into why a recurring routing failure happens, with a research artifact at the end.

**Exact prompt**:
```
Use deep research to investigate why our advisor sometimes routes iterative investigation prompts incorrectly, compare the registry and advisor behavior, and write the findings as a research summary.
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
- Alias evidence: `aliases` includes `"deep-research"`, `"research loop"`, `"iterative investigation workflow"`, `"research convergence detection"`, `"autoresearch"`, and `"iterative-research"`.
- Advisor evidence: `advisorRouting.routingClass: "lexical"` and `advisorRouting.legacyAdvisorId: "deep-research"`.

**Desired user-visible outcome**: The AI invokes or describes the `research` lane, names `/deep:research`, `deep-research`, `runtime-loop-type`, and `research/`, and states that the mode packet owns the detailed research loop.

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/system-deep-loop/SKILL.md` is readable.
2. `.opencode/skills/system-deep-loop/mode-registry.json` contains the `research` mode entry.
3. Skill advisor is callable if the operator chooses an advisor probe.

### Exact Command Sequence

1. **Advisor probe**:
   ```bash
   python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "Use deep research to investigate why our advisor sometimes routes iterative investigation prompts incorrectly, compare the registry and advisor behavior, and write the findings as a research summary." --threshold 0.8 > /tmp/dlw-MO-001/advisor.txt
   ```
2. **Invoke hub**: `Skill(system-deep-loop, "Use deep research to investigate why our advisor sometimes routes iterative investigation prompts incorrectly, compare the registry and advisor behavior, and write the findings as a research summary.")`.
3. **Capture route**: save the AI response to `/tmp/dlw-MO-001/response.txt`.
4. **Compare to registry**: confirm the response matches the `research` registry entry.

### Expected Signals

| Step | Signal |
|---|---|
| 1 | Advisor top skill is `system-deep-loop` or the transcript shows the legacy research identity folding into the hub. |
| 2 | Hub selects `workflowMode: research`. |
| 3 | Response names `/deep:research`, agent `deep-research`, backend `runtime-loop-type`, and artifact root `research/`. |
| 4 | No improvement-host or external-adapter backend is named. |

### Pass/Fail Criteria

- **PASS** iff the selected mode is `research` and all expected route fields match the registry.
- **PARTIAL** iff `research` is selected but the response omits one non-routing field such as `packet` or `artifactRoot`.
- **FAIL** iff any non-research mode is selected, the command is not `/deep:research`, or the backend is not `runtime-loop-type`.

### Failure Triage

1. If advisor does not surface the hub, inspect `advisorRouting.routingClass: "lexical"` and `legacyAdvisorId: "deep-research"` in the registry.
2. If the hub picks review, check whether the prompt accidentally emphasizes audit or findings severity rather than investigation.
3. If backend is wrong, verify the `research` entry's `runtimeLoopType` is not null.

## 4. SOURCE FILES

- `.opencode/skills/system-deep-loop/SKILL.md` - hub routing rule and mode table.
- `.opencode/skills/system-deep-loop/mode-registry.json` - `research` mode source of truth.

## 5. SOURCE METADATA

- **Critical path**: Yes
- **Destructive**: No
- **Sandbox**: `/tmp/dlw-MO-001/`
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
