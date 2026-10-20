---
title: "CO-052 -- system-deep-loop-guard live utilization on OpenCode 1 and 2"
description: "This scenario validates the system-deep-loop-guard plugin for CO-052. It focuses on the task-dispatch guard that refuses a deep-loop dispatch whose declared mode the target agent does not have."
version: 1.0.4.0
---

# CO-052 -- system-deep-loop-guard live utilization on OpenCode 1 and 2

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CO-052`.

---

## 1. OVERVIEW

This scenario validates the `system-deep-loop-guard` plugin for `CO-052`. The plugin hooks `tool.execute.before` for `task` and checks a deep-loop dispatch against the mode registry. A declared mode the target agent does not have is a warning, or a refusal when `SYSTEM_DEEP_LOOP_GUARD_REJECT=1` is set. The recorded run uses the refusal path so the guard's decision is visible in a tool result.

### Why This Matters

A deep-loop dispatch that declares a mode its target agent never had otherwise starts a subagent on the wrong contract and returns a plausible answer with no signal that the route was invalid. The guard turns that mismatch into a visible refusal before the subagent runs. If the tool name and its argument shape drift between OpenCode versions, the guard stops seeing the dispatch at all, and the same wrong route completes silently.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-052` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the guard refuses a deep-loop dispatch whose declared mode the target agent does not have, on both OpenCode versions.
- Real user request: `If I dispatch a deep-research subagent with a mode it does not have, does the guard stop it before the subagent runs, and does that hold on both OpenCode versions?`
- Prompt (v1): `This is a test of a dispatch guard plugin. Use the task tool once to dispatch the deep-research subagent with this exact prompt, then report exactly what the tool returned (an error is an acceptable result): Deep Route: target_agent=deep-research mode=bogus-mode Reply with the single word OK and do nothing else.`
- Prompt (v2): the same text with `subagent` in place of `task`.
- Expected execution process: run the scenario runner on v1 with the task tool named, read the captured events for the dispatch call, then repeat on v2 with the subagent tool named and read its events the same way.
- Expected signals: the tool call ends in error with `system-deep-loop-guard: Deep Route mode mismatch -- dispatch targets subagent_type="deep-research" (registry modes="research") but the prompt declares mode="bogus-mode"`.
- Evidence requirements: the captured events file for each version, the tool call status and error text read from it, and the run exit status.
- Desired user-visible outcome: a refusal that names the target agent, the registry modes it actually has, and the mode the prompt declared, on each version.
- Pass/fail: PASS if the dispatch call ends in error with that message. FAIL if the subagent runs and answers `OK`, or if the guard produces no tool-level decision.
- Failure triage: Read the tool name and argument shape from the events first. On v2 the tool is `subagent` with argument `agent`; the bridge reports it to the guard as `task` with `subagent_type` set from `agent`, so a refusal missing on v2 alone points at the bridge.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Setup: confirm the plugin at `.opencode/plugins/system-deep-loop-guard.js`, its core at `.opencode/hooks/task-dispatch/lib/dispatch-guard.cjs`, and the registry at `.opencode/skills/system-deep-loop/mode-registry.json` exist. Export `AI_SESSION_CHILD=1` and `SYSTEM_DEEP_LOOP_GUARD_REJECT=1`.
2. v1 run: run the runner with `v1`, the name `deep-loop-guard`, and the v1 prompt naming `task`.
3. v1 check: read the tool call from the events file and confirm the error text.
4. v2 run: run the runner with `v2`, the same name, and the v2 prompt naming `subagent`.
5. v2 check: read the tool call from the events file and confirm the error text.
6. Cleanup: none.

### Exact Command Sequence

```bash
export EVIDENCE_DIR="${EVIDENCE_DIR:-$(git rev-parse --show-toplevel)/.skilled/skills/.state/plugin-utilization}"
export AI_SESSION_CHILD=1
export SYSTEM_DEEP_LOOP_GUARD_REJECT=1

bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v1 deep-loop-guard "This is a test of a dispatch guard plugin. Use the task tool once to dispatch the deep-research subagent with this exact prompt, then report exactly what the tool returned (an error is an acceptable result): Deep Route: target_agent=deep-research mode=bogus-mode Reply with the single word OK and do nothing else."

bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v2 deep-loop-guard "This is a test of a dispatch guard plugin. Use the subagent tool once to dispatch the deep-research subagent with this exact prompt, then report exactly what the tool returned (an error is an acceptable result): Deep Route: target_agent=deep-research mode=bogus-mode Reply with the single word OK and do nothing else."

jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/deep-loop-guard.v1.events.jsonl"
jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/deep-loop-guard.v2.events.jsonl"
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-052 | system-deep-loop-guard | Refuse a deep-loop dispatch whose declared mode the target agent does not have | `This is a test of a dispatch guard plugin. Use the task tool once to dispatch the deep-research subagent with this exact prompt, then report exactly what the tool returned (an error is an acceptable result): Deep Route: target_agent=deep-research mode=bogus-mode Reply with the single word OK and do nothing else.` (v2: `subagent` in place of `task`) | Runner on v1 and v2 as above, then the `jq` tool-call check on each events file | Tool call ends in error with `system-deep-loop-guard: Deep Route mode mismatch -- dispatch targets subagent_type="deep-research" (registry modes="research") but the prompt declares mode="bogus-mode"` | `deep-loop-guard.v1.events.jsonl`, `deep-loop-guard.v2.events.jsonl` | PASS only on that tool error on both versions | Read tool name and argument shape first; on v2 the tool is `subagent` with argument `agent` and the bridge reports it as `task` with `subagent_type` set from `agent`, so a refusal missing on v2 alone points at the bridge |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `plugin-utilization/run-plugin-scenario.sh` | Runs the scenario on v1 or v2 and writes the evidence files |
| `plugin-utilization/capture-proxy.mjs` | Capture proxy that records each model request's system prompt and tools |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/plugins/system-deep-loop-guard.js` | The plugin under test: `tool.execute.before` guard for deep-loop dispatches |
| `.opencode/hooks/task-dispatch/lib/dispatch-guard.cjs` | Core dispatch guard and mode-mismatch decision |
| `.opencode/skills/system-deep-loop/mode-registry.json` | Registry that maps each target agent to its declared modes |

---

## 5. SOURCE METADATA

- Group: Plugin Utilization
- Playbook ID: CO-052
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `plugin-utilization/system-deep-loop-guard.md`
