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

This scenario verifies that `model-benchmark` is a command-bridge mode. It is reached by its command, not by a bare `deep-improvement` advisor alias.

---

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator checks that the improvement family does not silently route bare benchmark wording into specialized lanes without the command surface.

**Exact prompt** (bare wording must not fire a command-bridge lane without its `/deep:*` command):
```
Benchmark a model against prompt framework candidates.
```

**Expected route**:
- A bare prompt should not claim command-bridge routing unless the matching command is present.
- The matching command is `/deep:model-benchmark`.
- The command-bridge mode uses agent `deep-improvement` and artifact root `improvement/`.

**Why this route is expected**:
- `model-benchmark` registry evidence: `advisorRouting.routingClass: "command-bridge"`, `command: "/deep:model-benchmark"`.
- Advisor contract evidence: `"command-bridge" = routed by its /deep:* command, not an advisor map entry`.

**Desired user-visible outcome**: The AI either asks the operator to use the explicit command or routes only after the command is present. It must not claim this lane is selected by a bare `deep-improvement` advisor alias.

---

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/system-deep-loop/mode-registry.json` contains the command-bridge entry.
2. Skill advisor is callable.

### Prompt

- Prompt: `Benchmark a model against prompt framework candidates.`

### Exact Command Sequence

1. **Run the bare advisor probe**: run the skill advisor once for the bare prompt and append output to `/tmp/dlw-AI-003/bare-advisor.jsonl`.
2. **Invoke hub with the bare prompt**: invoke `Skill(system-deep-loop, "<prompt>")` with that prompt.
3. **Invoke the command prompt**: rerun the scenario with its exact `/deep:*` command and save output to `/tmp/dlw-AI-003/command-routes.txt`.
4. **Compare to registry**: confirm the specialized lane activates only through its command surface.

### Expected Signals

| Step | Signal |
|---|---|
| 1 | The bare advisor prompt does not establish a command-bridge route by alias alone. |
| 2 | Hub response asks for the explicit command or avoids claiming a specialized command-bridge lane. |
| 3 | The command prompt resolves to `model-benchmark`. |
| 4 | The command route matches the registry command, agent, backend, and artifact root. |

### Evidence

- Bare-advisor probe log: `/tmp/dlw-AI-003/bare-advisor.jsonl`.
- Command-route transcript: `/tmp/dlw-AI-003/command-routes.txt`.
- The hub's response text for the bare prompt, showing whether it declined or asked for the command instead of firing the lane.

### Pass/Fail Criteria

- **PASS**: the bare prompt never directly selects `model-benchmark` — either declining the lane or asking for the explicit command — and the `/deep:model-benchmark` command prompt resolves to its exact matching mode with the registry's command, agent, and artifact root.
- **FAIL**: a bare advisor alias directly selects a command-bridge lane, or a command prompt routes to the wrong lane or omits a registry-matching field.

### Failure Triage

1. If a bare prompt fires a command-bridge lane, inspect the `advisorRoutingContract.routingClass` definition.
2. If a command prompt fails, verify the exact command string matches the registry.
3. If the bare prompt folds to `agent-improvement`, confirm whether the AI is treating it as generic improvement and not as the specialized command-bridge route.

---

## 4. SOURCE FILES

- `.opencode/skills/system-deep-loop/SKILL.md` - improvement family routing rule.
- `.opencode/skills/system-deep-loop/mode-registry.json` - command-bridge entries and contract definition.
- [manual-testing-playbook.md](../manual-testing-playbook.md) - root directory page and scenario summary.

---

## 5. SOURCE METADATA

- **Critical path**: No
- **Destructive**: No
- **Sandbox**: `/tmp/dlw-AI-003/`
- **Concurrent-safe**: The advisor probe and the command check run serially
- **Last validated**: pending first manual run
