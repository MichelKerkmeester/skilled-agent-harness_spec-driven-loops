---
id: IL-001
category: improvement_lane_routing
stage: routing
title: "IL-001: Agent Improvement Lane Routing"
description: "Verify improve/evaluate/score agent requests fold through the deep-improvement advisor identity to the agent-improvement lane."
expected_intent: agent-improvement
expected_resources:
  - deep-improvement/SKILL.md
expected_workflow_mode: agent-improvement
expected_leaf_resources:
  - workflow_mode: agent-improvement
    leaf_resource_id: references/agent_improvement/candidate_proposal_format.md
  - workflow_mode: agent-improvement
    leaf_resource_id: references/agent_improvement/score_dimensions.md
  - workflow_mode: agent-improvement
    leaf_resource_id: references/shared/promotion_gate_contract.md
version: "1.2.0.0"
---

# IL-001: Agent Improvement Lane Routing

## 1. OVERVIEW

This scenario verifies the alias-fold default for the improvement family: a bare agent evaluation request resolves to `workflowMode: agent-improvement`, not to the model, skill, or external AI-system lanes.

## 2. SCENARIO CONTRACT

**Realistic user request**: A maintainer wants to evaluate and score an agent candidate before promotion.

**Exact prompt**:
```
Evaluate and score the code agent candidate, compare it against the current baseline, and recommend whether to promote or roll back the agent change.
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
- Mutating: `true`

**Why this route is expected**:
- Registry fields: `workflowMode: "agent-improvement"`, `runtimeLoopType: null`, `backendKind: "improvement-host"`, `loopHostMode: "agent-improvement"`, `command: "/deep:agent-improvement"`, `agent: "deep-improvement"`, `artifactRoot: "improvement/"`, `mutating: true`.
- Alias evidence: `aliases` includes `"improve agent"`, `"evaluate agent"`, `"agent scoring"`, `"score agent candidate"`, and `"promote or rollback agent change"`.
- Advisor evidence: `advisorRouting.routingClass: "alias-fold"`, `advisorRouting.legacyAdvisorId: "deep-improvement"`, and `advisorRouting.advisorDefaultMode: true`.

**Desired user-visible outcome**: The AI routes to the agent-improvement lane, names the shared `deep-improvement` packet, and states that this is the alias-fold default for the legacy `deep-improvement` advisor identity.

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/system-deep-loop/mode-registry.json` contains the `agent-improvement` mode entry.
2. The skill advisor is callable if the operator chooses an advisor probe.

### Exact Command Sequence

1. **Advisor probe**:
   ```bash
   python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "Evaluate and score the code agent candidate, compare it against the current baseline, and recommend whether to promote or roll back the agent change." --threshold 0.8 > /tmp/dlw-IL-001/advisor.txt
   ```
2. **Invoke hub**: `Skill(system-deep-loop, "Evaluate and score the code agent candidate, compare it against the current baseline, and recommend whether to promote or roll back the agent change.")`.
3. **Capture route**: save the AI response to `/tmp/dlw-IL-001/response.txt`.
4. **Compare to registry**: confirm the response matches the `agent-improvement` registry entry.

### Expected Signals

| Step | Signal |
|---|---|
| 1 | Advisor transcript surfaces `system-deep-loop` or legacy `deep-improvement` folding into the hub. |
| 2 | Hub selects `workflowMode: agent-improvement`. |
| 3 | Response names `/deep:agent-improvement`, agent `deep-improvement`, backend `improvement-host`, and loop host mode `agent-improvement`. |
| 4 | Response keeps `runtimeLoopType` as null and does not invent an improvement runtime loop type. |

### Pass/Fail Criteria

- **PASS** iff the selected mode is `agent-improvement` and all expected route fields match the registry.
- **PARTIAL** iff the mode is correct but the response omits the alias-fold explanation.
- **FAIL** iff any other improvement lane is selected, a command-bridge lane is claimed from a bare advisor alias, or `runtimeLoopType` is not null.

### Failure Triage

1. If the wrong lane wins, inspect `advisorDefaultMode: true` on the `agent-improvement` entry.
2. If backend is wrong, verify `backendKind: "improvement-host"`.
3. If a runtime loop type is invented, re-read the registry discriminator rule that improvement-host modes use explicit null.

## 4. SOURCE FILES

- `.opencode/skills/system-deep-loop/SKILL.md` - improvement family routing rule.
- `.opencode/skills/system-deep-loop/mode-registry.json` - `agent-improvement` source of truth.

## 5. SOURCE METADATA

- **Critical path**: Yes
- **Destructive**: No for this routing test; the real lane can mutate when executing promotions.
- **Sandbox**: `/tmp/dlw-IL-001/`
- **Concurrent-safe**: Yes for routing probe only
- **Last validated**: pending first manual run
