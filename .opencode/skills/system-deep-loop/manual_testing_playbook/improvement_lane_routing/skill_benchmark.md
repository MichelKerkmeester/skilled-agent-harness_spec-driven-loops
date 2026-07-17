---
id: IL-003
category: improvement_lane_routing
stage: routing
title: "IL-003: Skill Benchmark Command-Bridge Routing"
description: "Verify /deep:skill-benchmark routes to the skill-benchmark improvement lane through command-bridge routing."
expected_intent: skill-benchmark
expected_resources:
  - deep-improvement/references/skill_benchmark/scoring_contract.md
  - deep-improvement/references/skill_benchmark/routing_optimization.md
expected_workflow_mode: skill-benchmark
expected_leaf_resources: []
version: "1.2.0.0"
---

# IL-003: Skill Benchmark Command-Bridge Routing

## 1. OVERVIEW

This scenario verifies that the skill benchmark lane is reached by its command bridge, not by a bare advisor alias.

## 2. SCENARIO CONTRACT

**Realistic user request**: A maintainer wants to benchmark skill routing quality.

**Exact prompt**:
```
/deep:skill-benchmark Run a skill benchmark for the routing prompts and compare skill selection accuracy against the current baseline.
```

**Expected route**:
- Mode: `skill-benchmark`
- Command: `/deep:skill-benchmark`
- Agent: `deep-improvement`
- Backend: `improvement-host`
- Runtime loop type: `null`
- Loop host mode: `skill-benchmark`
- Packet: `deep-improvement`
- Artifact root: `improvement/`

**Why this route is expected**:
- Registry fields: `workflowMode: "skill-benchmark"`, `runtimeLoopType: null`, `backendKind: "improvement-host"`, `loopHostMode: "skill-benchmark"`, `command: "/deep:skill-benchmark"`, `agent: "deep-improvement"`, `artifactRoot: "improvement/"`.
- Alias evidence: `aliases` includes `"skill benchmark"`, `"benchmark a skill"`, and `"skill routing benchmark"`.
- Advisor evidence: `advisorRouting.routingClass: "command-bridge"` and `advisorRouting.packetSkillName: "deep-improvement"`.

**Desired user-visible outcome**: The AI routes to `skill-benchmark` because `/deep:skill-benchmark` is present and does not claim the lane is selected by a bare `deep-improvement` advisor alias.

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/system-deep-loop/mode-registry.json` contains the `skill-benchmark` mode entry.
2. The orchestrator can accept `/deep:skill-benchmark` command prompts.

### Exact Command Sequence

1. **Invoke command surface**: enter the exact prompt into the orchestrator runtime.
2. **Capture route**: save the AI response to `/tmp/dlw-IL-003/response.txt`.
3. **Compare to registry**: confirm the response matches the `skill-benchmark` registry entry.

### Expected Signals

| Step | Signal |
|---|---|
| 1 | Command surface selects `/deep:skill-benchmark`. |
| 2 | Route resolves to `workflowMode: skill-benchmark`. |
| 2 | Response names backend `improvement-host`, loop host mode `skill-benchmark`, and artifact root `improvement/`. |
| 3 | Response states or implies command-bridge behavior, not lexical or alias-fold advisor behavior. |

### Pass/Fail Criteria

- **PASS** iff `/deep:skill-benchmark` resolves to `skill-benchmark` with the expected registry fields.
- **PARTIAL** iff route is correct but the response does not explicitly mention command-bridge behavior.
- **FAIL** iff the lane fires from a bare advisor alias, routes to `agent-improvement`, or assigns a non-null runtime loop type.

### Failure Triage

1. If agent-improvement wins, verify the exact prompt includes `/deep:skill-benchmark`.
2. If advisor alias behavior is claimed, re-read `advisorRouting.routingClass: "command-bridge"`.
3. If loop host mode is wrong, compare against `loopHostMode: "skill-benchmark"`.

## 4. SOURCE FILES

- `.opencode/skills/system-deep-loop/SKILL.md` - improvement family routing rule.
- `.opencode/skills/system-deep-loop/mode-registry.json` - `skill-benchmark` source of truth.

## 5. SOURCE METADATA

- **Critical path**: Yes
- **Destructive**: No for this routing test
- **Sandbox**: `/tmp/dlw-IL-003/`
- **Concurrent-safe**: Run serially with other command-bridge tests
- **Last validated**: pending first manual run
