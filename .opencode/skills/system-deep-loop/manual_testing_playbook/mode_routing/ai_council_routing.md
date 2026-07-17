---
id: MO-003
category: mode_routing
stage: routing
title: "MO-003: AI Council Mode Routing"
description: "Verify a multi-seat planning deliberation request resolves to the ai-council mode through the system-deep-loop hub."
expected_intent: ai-council
expected_resources:
  - deep-ai-council/references/integration/loop_protocol.md
  - deep-ai-council/references/scoring/scoring_rubric.md
  - deep-ai-council/references/structure/output_schema.md
expected_workflow_mode: ai-council
expected_leaf_resources:
  - workflow_mode: ai-council
    leaf_resource_id: references/integration/loop_protocol.md
  - workflow_mode: ai-council
    leaf_resource_id: references/scoring/scoring_rubric.md
  - workflow_mode: ai-council
    leaf_resource_id: references/structure/output_schema.md
version: "1.2.0.0"
---

# MO-003: AI Council Mode Routing

## 1. OVERVIEW

This scenario verifies that a multi-seat planning deliberation request resolves to `workflowMode: ai-council` and uses the council runtime loop key.

## 2. SCENARIO CONTRACT

**Realistic user request**: A maintainer wants multiple AI seats to deliberate on a high-impact implementation plan before work begins.

**Exact prompt**:
```
Run an AI council planning deliberation with multiple seats to compare implementation options, critique risks, converge on a recommendation, and write council artifacts.
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
- Alias evidence: `aliases` includes `"deep-ai-council"`, `"ai council deliberation"`, `"multi-seat planning council"`, `"council convergence"`, and `"planning council"`.
- Advisor evidence: `advisorRouting.routingClass: "lexical"` and `advisorRouting.legacyAdvisorId: "deep-ai-council"`.

**Desired user-visible outcome**: The AI invokes or describes the `ai-council` lane, names `/deep:ai-council`, `ai-council`, `runtimeLoopType: council`, and `ai-council/` artifacts.

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/system-deep-loop/SKILL.md` is readable.
2. `.opencode/skills/system-deep-loop/mode-registry.json` contains the `ai-council` mode entry.
3. Skill advisor is callable if the operator chooses an advisor probe.

### Exact Command Sequence

1. **Advisor probe**:
   ```bash
   python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "Run an AI council planning deliberation with multiple seats to compare implementation options, critique risks, converge on a recommendation, and write council artifacts." --threshold 0.8 > /tmp/dlw-MO-003/advisor.txt
   ```
2. **Invoke hub**: `Skill(system-deep-loop, "Run an AI council planning deliberation with multiple seats to compare implementation options, critique risks, converge on a recommendation, and write council artifacts.")`.
3. **Capture route**: save the AI response to `/tmp/dlw-MO-003/response.txt`.
4. **Compare to registry**: confirm the response matches the `ai-council` registry entry.

### Expected Signals

| Step | Signal |
|---|---|
| 1 | Advisor top skill is `system-deep-loop` or the transcript shows the legacy council identity folding into the hub. |
| 2 | Hub selects `workflowMode: ai-council`. |
| 3 | Response names `/deep:ai-council`, agent `ai-council`, backend `runtime-loop-type`, and artifact root `ai-council/`. |
| 4 | Response preserves `runtimeLoopType: council` rather than inventing `runtimeLoopType: ai-council`. |

### Pass/Fail Criteria

- **PASS** iff the selected mode is `ai-council` and all expected route fields match the registry.
- **PARTIAL** iff `ai-council` is selected but the response omits one non-routing field such as `packet`.
- **FAIL** iff any non-council mode is selected, the command is not `/deep:ai-council`, or the runtime loop type is not `council`.

### Failure Triage

1. If advisor does not surface the hub, inspect `advisorRouting.routingClass: "lexical"` and `legacyAdvisorId: "deep-ai-council"` in the registry.
2. If runtime loop type is wrong, check the registry field `runtimeLoopType: "council"`.
3. If packet name is wrong, verify the registry's `packet: "deep-ai-council"` and `agent: "ai-council"` distinction.

## 4. SOURCE FILES

- `.opencode/skills/system-deep-loop/SKILL.md` - hub routing rule and mode table.
- `.opencode/skills/system-deep-loop/mode-registry.json` - `ai-council` mode source of truth.

## 5. SOURCE METADATA

- **Critical path**: Yes
- **Destructive**: No
- **Sandbox**: `/tmp/dlw-MO-003/`
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
