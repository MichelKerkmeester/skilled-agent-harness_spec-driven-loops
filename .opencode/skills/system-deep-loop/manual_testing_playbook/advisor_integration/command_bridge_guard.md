---
id: AI-003
category: advisor_integration
stage: routing
title: "AI-003: Command-Bridge Guard"
description: "Verify command-bridge modes require their /deep:* command surface and do not fire from bare advisor aliases."
expected_intent: UNKNOWN
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
version: "1.2.0.0"
---

# AI-003: Command-Bridge Guard

## 1. OVERVIEW

This scenario verifies that `model-benchmark` and `skill-benchmark` are command-bridge modes. They are reached by their commands, not by a bare `deep-improvement` advisor alias.

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator checks that the improvement family does not silently route bare benchmark wording into specialized lanes without the command surface.

**Exact prompt**:
```
Benchmark a model against prompt framework candidates.
```

**Additional advisor probes** (bare wording must not fire a command-bridge lane without its `/deep:*` command):
```
Benchmark a skill against routing prompts.
```

**Expected route**:
- Bare prompts should not claim command-bridge routing unless the matching command is present.
- The matching commands are `/deep:model-benchmark` and `/deep:skill-benchmark`.
- The command-bridge modes share agent `deep-improvement` and artifact root `improvement/`.

**Why this route is expected**:
- `model-benchmark` registry evidence: `advisorRouting.routingClass: "command-bridge"`, `command: "/deep:model-benchmark"`.
- `skill-benchmark` registry evidence: `advisorRouting.routingClass: "command-bridge"`, `command: "/deep:skill-benchmark"`.
- Advisor contract evidence: `"command-bridge" = routed by its /deep:* command, not an advisor map entry`.

**Desired user-visible outcome**: The AI either asks the operator to use the explicit command or routes only after the command is present. It must not claim these lanes are selected by a bare `deep-improvement` advisor alias.

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/system-deep-loop/mode-registry.json` contains the two command-bridge entries.
2. Skill advisor is callable.

### Exact Command Sequence

1. **Run bare advisor probes**: run the skill advisor once for each bare prompt and append output to `/tmp/dlw-AI-003/bare-advisor.jsonl`.
2. **Invoke hub with bare prompts**: invoke `Skill(system-deep-loop, "<prompt>")` once for each prompt.
3. **Invoke command prompts**: rerun each scenario with its exact `/deep:*` command and save output to `/tmp/dlw-AI-003/command-routes.txt`.
4. **Compare to registry**: confirm specialized lanes activate only through command surfaces.

### Expected Signals

| Step | Signal |
|---|---|
| 1 | Bare advisor prompts do not establish a command-bridge route by alias alone. |
| 2 | Hub response asks for the explicit command or avoids claiming a specialized command-bridge lane. |
| 3 | Command prompts resolve to `model-benchmark` and `skill-benchmark`. |
| 4 | Each command route matches the registry command, agent, backend, and artifact root. |

### Pass/Fail Criteria

- **PASS** iff bare prompts do not fire command-bridge modes and command prompts do fire the exact matching modes.
- **PARTIAL** iff command prompts route correctly but bare prompt behavior is ambiguous and asks for clarification.
- **FAIL** iff a bare advisor alias directly selects a command-bridge lane, or a command prompt routes to the wrong lane.

### Failure Triage

1. If a bare prompt fires a command-bridge lane, inspect the `advisorRoutingContract.routingClass` definition.
2. If a command prompt fails, verify the exact command string matches the registry.
3. If all bare prompts fold to `agent-improvement`, confirm whether the AI is treating them as generic improvement and not as the specialized command-bridge route.

## 4. SOURCE FILES

- `.opencode/skills/system-deep-loop/SKILL.md` - improvement family routing rule.
- `.opencode/skills/system-deep-loop/mode-registry.json` - command-bridge entries and contract definition.

## 5. SOURCE METADATA

- **Critical path**: No
- **Destructive**: No
- **Sandbox**: `/tmp/dlw-AI-003/`
- **Concurrent-safe**: Advisor probes can run concurrently; command checks run serially
- **Last validated**: pending first manual run
