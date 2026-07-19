---
id: IL-002
category: improvement_lane_routing
stage: routing
title: "IL-002: Model Benchmark Command-Bridge Routing"
description: "Verify /deep:model-benchmark routes to the model-benchmark improvement lane through command-bridge routing."
expected_intent: model-benchmark
expected_resources:
  - deep-improvement/references/model-benchmark/evaluator-contract.md
  - deep-improvement/references/model-benchmark/lane-b-mechanics.md
expected_workflow_mode: model-benchmark
expected_leaf_resources: []
version: "1.2.0.0"
---

# IL-002: Model Benchmark Command-Bridge Routing

## 1. OVERVIEW

This scenario verifies that the model benchmark lane is reached by its command bridge, not by a bare advisor alias.

## 2. SCENARIO CONTRACT

**Realistic user request**: A maintainer wants to benchmark model behavior against a prompt framework.

**Exact prompt**:
```
/deep:model-benchmark Run a model benchmark for the prompt framework candidates and compare model behavior against the current harness.
```

**Expected route**:
- Mode: `model-benchmark`
- Command: `/deep:model-benchmark`
- Agent: `deep-improvement`
- Backend: `improvement-host`
- Runtime loop type: `null`
- Loop host mode: `model-benchmark`
- Packet: `deep-improvement`
- Artifact root: `improvement/`

**Why this route is expected**:
- Registry fields: `workflowMode: "model-benchmark"`, `runtimeLoopType: null`, `backendKind: "improvement-host"`, `loopHostMode: "model-benchmark"`, `command: "/deep:model-benchmark"`, `agent: "deep-improvement"`, `artifactRoot: "improvement/"`.
- Alias evidence: `aliases` includes `"model benchmark"`, `"benchmark a model"`, `"prompt framework benchmark"`, and `"benchmark-harness"`.
- Advisor evidence: `advisorRouting.routingClass: "command-bridge"` and `advisorRouting.packetSkillName: "deep-improvement"`.

**Desired user-visible outcome**: The AI routes to `model-benchmark` only because the `/deep:model-benchmark` command is present, names `deep-improvement` as the shared packet, and does not claim a legacy advisor alias for this lane.

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/system-deep-loop/mode-registry.json` contains the `model-benchmark` mode entry.
2. The orchestrator can accept `/deep:model-benchmark` command prompts.

### Exact Command Sequence

1. **Invoke command surface**: enter the exact prompt into the orchestrator runtime.
2. **Capture route**: save the AI response to `/tmp/dlw-IL-002/response.txt`.
3. **Compare to registry**: confirm the response matches the `model-benchmark` registry entry.

### Expected Signals

| Step | Signal |
|---|---|
| 1 | Command surface selects `/deep:model-benchmark`. |
| 2 | Route resolves to `workflowMode: model-benchmark`. |
| 2 | Response names backend `improvement-host`, loop host mode `model-benchmark`, and artifact root `improvement/`. |
| 3 | Response states or implies command-bridge behavior, not lexical or alias-fold advisor behavior. |

### Pass/Fail Criteria

- **PASS** iff `/deep:model-benchmark` resolves to `model-benchmark` with the expected registry fields.
- **PARTIAL** iff route is correct but the response does not explicitly mention command-bridge behavior.
- **FAIL** iff the lane fires from a bare advisor alias, routes to `agent-improvement`, or assigns a non-null runtime loop type.

### Failure Triage

1. If agent-improvement wins, verify the exact prompt includes `/deep:model-benchmark`.
2. If advisor alias behavior is claimed, re-read `advisorRouting.routingClass: "command-bridge"`.
3. If backend is wrong, compare against `backendKind: "improvement-host"`.

## 4. SOURCE FILES

- `.opencode/skills/system-deep-loop/SKILL.md` - improvement family routing rule.
- `.opencode/skills/system-deep-loop/mode-registry.json` - `model-benchmark` source of truth.

## 5. SOURCE METADATA

- **Critical path**: Yes
- **Destructive**: No for this routing test
- **Sandbox**: `/tmp/dlw-IL-002/`
- **Concurrent-safe**: Run serially with other command-bridge tests
- **Last validated**: pending first manual run
