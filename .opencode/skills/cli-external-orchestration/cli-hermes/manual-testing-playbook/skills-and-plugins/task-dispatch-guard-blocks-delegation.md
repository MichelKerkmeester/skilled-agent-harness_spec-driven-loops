---
title: "HERMES-025 -- Task-dispatch guard blocks a mismatched delegation"
description: "Confirm the repo's task-dispatch guard evaluates every task of a Hermes delegate_task call and blocks a Deep Route mode mismatch under the guard's reject switch, for `HERMES-025`."
version: 1.0.0.0
---

# HERMES-025 -- Task-dispatch guard blocks a mismatched delegation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `HERMES-025`.

---

## 1. OVERVIEW

The `repo-guards` plugin runs the task-dispatch guard core in `pre_tool_call` for `delegate_task`, joining each entry of the `tasks` array into the core's prompt and passing a task role as the subagent type. The core warns by default and rejects under `SYSTEM_DEEP_LOOP_GUARD_REJECT=1`; a rejection becomes a Hermes block, so no child spawns.

### Why This Matters

The other six runtimes run this guard through their hook adapters; a Hermes session that skipped it would be the one place the rule does not hold. The proof is the guard's own text arriving in the session.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HERMES-025` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a delegate_task whose task goal targets deep-research while declaring the review mode is blocked before any child runs when the guard's reject switch is set.
- Real user request: `Make sure Hermes cannot hand a deep-research job to a sub-agent under the wrong mode.`
- Prompt: `Call your delegate_task tool exactly once with a single task whose goal is exactly this three-line text: 'Agent: @deep-research' newline 'Deep Route: mode=review' newline 'Investigate the fan-out policy' and context 'autonomous'. Then reply with one line: DELEGATED if the tool returned a child result, or REFUSED followed by the tool's exact error text if it was refused.`
- Expected execution process: run the command sequence in §3 from the repository root with a 300-second alarm on the dispatch, capture stdout, stderr, exit code and elapsed seconds separately, then judge the result against the pass/fail criteria below.
- Expected signals: Exit code `0` within about 30 s; stdout is `REFUSED:` followed by `system-deep-loop-guard: Deep Route mode mismatch -- dispatch targets subagent_type="deep-research" (registry modes="research") but the prompt declares mode="review"`; no `platform=subagent` turn in `~/.hermes/logs/agent.log`; `session_id:` on stderr. This scenario deliberately enables the `delegation` toolset, which a fan-out leaf never gets.
- Evidence: stdout, exit code, elapsed seconds, the stderr session id, the absence of a sub-agent turn in the log
- Desired user-visible outcome: a concise verdict naming the observed guard text and the evidence behind it.
- Pass/fail: PASS when the refusal text is quoted and no child turn appears; FAIL when the session reports DELEGATED, a child turn appears, or the run hits the alarm; SKIP only on a named blocker.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook, including `command -v hermes` and the plugin allowlist entry.
3. Run the command sequence below exactly as written, from the repository root.
4. Capture stdout, stderr, exit code and elapsed seconds separately.
5. Judge the result against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
SYSTEM_DEEP_LOOP_GUARD_REJECT=1 HERMES_ENABLE_PROJECT_PLUGINS=1 perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool \
  --provider llmgateway --model glm-5.3-flash --reasoning none -t delegation,todo --max-turns 2 --run-budget 150 \
  -q "Call your delegate_task tool exactly once with a single task whose goal is exactly this three-line text: 'Agent: @deep-research' newline 'Deep Route: mode=review' newline 'Investigate the fan-out policy' and context 'autonomous'. Then reply with one line: DELEGATED if the tool returned a child result, or REFUSED followed by the tool's exact error text if it was refused." </dev/null >out.txt 2>err.txt
echo $?
cat out.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HERMES-025 | Task-dispatch guard blocks a mismatched delegation | Confirm a delegate_task whose task goal targets deep-research while declaring the review mode is blocked before any child runs when the guard's reject switch is set. | `Call your delegate_task tool exactly once with a single task whose goal is exactly this three-line text: 'Agent: @deep-research' newline 'Deep Route: mode=review' newline 'Investigate the fan-out policy' and context 'autonomous'. Then reply with one line: DELEGATED if the tool returned a child result, or REFUSED followed by the tool's exact error text if it was refused.` | the `hermes chat` dispatch in §3 | Exit code `0` within about 30 s; stdout is `REFUSED:` followed by `system-deep-loop-guard: Deep Route mode mismatch -- dispatch targets subagent_type="deep-research" (registry modes="research") but the prompt declares mode="review"`; no `platform=subagent` turn in `~/.hermes/logs/agent.log`; `session_id:` on stderr. This scenario deliberately enables the `delegation` toolset, which a fan-out leaf never gets. | stdout, exit code, elapsed seconds, the stderr session id, the absence of a sub-agent turn in the log | PASS when the refusal text is quoted and no child turn appears; FAIL when the session reports DELEGATED, a child turn appears, or the run hits the alarm; SKIP only on a named blocker. | Harness: the plugin did not load. Dependency: provider missing. Adapter: a child turn appears, which means the bridge did not read the `tasks` array or the guard received no target |

### Recorded Result

**Executed 2026-09-15**: exit 0 after 21 s, stdout carried the refusal token followed by `{"error": "system-deep-loop-guard: Deep Route mode mismatch -- ..."}`, session `20260915_075336_71898f`. Two earlier runs (before the bridge read the `tasks` array) spawned a `platform=subagent` turn and ran past a 200-second alarm.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `skills-and-plugins/task-dispatch-guard-blocks-delegation.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SYNC.md](../../../../../../.hermes/SYNC.md) | What the plugin bridges and how |
| [hook-contract.md](../../references/hook-contract.md) | The plugin hook map |
| `.opencode/hooks/task-dispatch/devin/task-dispatch-guard.cjs` | The core the bridge runs |
| `.opencode/hooks/task-dispatch/lib/dispatch-guard.cjs` | The reject switch and the mode-mismatch rule |

---

## 5. SOURCE METADATA

- Group: Skills And Plugins
- Playbook ID: HERMES-025
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `skills-and-plugins/task-dispatch-guard-blocks-delegation.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
