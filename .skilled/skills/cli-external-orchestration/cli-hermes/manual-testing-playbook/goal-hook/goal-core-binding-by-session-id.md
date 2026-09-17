---
title: "HERMES-030 -- Shared goal core bound by Hermes session id"
description: "Confirm a Hermes session binds the packet named by HERMES_SPEC_FOLDER through the shared goal core under its own session id and renders the core's goal in its prompt, for `HERMES-030`."
version: 1.0.0.0
---

# HERMES-030 -- Shared goal core bound by Hermes session id

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `HERMES-030`.

---

## 1. OVERVIEW

The `repo-guards` plugin's `on_session_start` binds the packet named by `HERMES_SPEC_FOLDER` through `goal.cjs bind --runtime hermes --session <id>` when no goal is bound yet, and the goal section renders `goal.cjs show` for that session, falling back to the packet's durable slice when the core has nothing. The record lives under the gitignored `.opencode/skills/.state/goal/`.

### Why This Matters

The other six runtimes run this guard through their hook adapters; a Hermes session that skipped it would be the one place the rule does not hold. The proof is the guard's own text arriving in the session.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HERMES-030` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the goal section carries the bound packet and its objective, and the shared goal core reports the same goal for the session id.
- Real user request: `Does a Hermes session get the packet goal the way Pi and Cursor do?`
- Prompt: `Your system prompt carries a goal section. Reply with exactly two lines: line 1 = the text after 'Bound packet:' or after 'packet:' if present, else NO_GOAL; line 2 = the goal's objective sentence, or the first line of the goal section, verbatim.`
- Expected execution process: run the command sequence in §3 from the repository root with a 300-second alarm on the dispatch, capture stdout, stderr, exit code and elapsed seconds separately, then judge the result against the pass/fail criteria below.
- Expected signals: Exit code `0`; line 1 `specs/cli-external-orchestration/071-cli-hermes-creation`; line 2 the packet objective; `goal.cjs show` prints `STATUS=OK ACTION=show` and `goal_present=true`; the agent log shows `repo-guards-goal` under 4000 chars.
- Evidence: stdout, exit code, elapsed seconds, the stderr session id, the goal core's show output
- Desired user-visible outcome: a concise verdict naming the observed guard text and the evidence behind it.
- Pass/fail: PASS when the packet and objective are quoted and the core reports the goal for that session; FAIL on `NO_GOAL` or `goal_present=false`; SKIP only on a named blocker.

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
HERMES_SPEC_FOLDER=specs/cli-external-orchestration/071-cli-hermes-creation HERMES_ENABLE_PROJECT_PLUGINS=1 perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool \
  --provider llmgateway --model glm-5.3-flash --reasoning none -t file,todo --max-turns 1 --run-budget 90 \
  -q "Your system prompt carries a goal section. Reply with exactly two lines: line 1 = the text after 'Bound packet:' or after 'packet:' if present, else NO_GOAL; line 2 = the goal's objective sentence, or the first line of the goal section, verbatim." </dev/null >out.txt 2>err.txt
echo $?
cat out.txt
SID=$(grep -o "session_id: [0-9_a-f]*" err.txt | cut -d" " -f2)
node .opencode/hooks/goal/bin/goal.cjs show --runtime hermes --session "$SID" | head -4
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HERMES-030 | Shared goal core bound by Hermes session id | Confirm the goal section carries the bound packet and its objective, and the shared goal core reports the same goal for the session id. | `Your system prompt carries a goal section. Reply with exactly two lines: line 1 = the text after 'Bound packet:' or after 'packet:' if present, else NO_GOAL; line 2 = the goal's objective sentence, or the first line of the goal section, verbatim.` | the `hermes chat` dispatch in §3 | Exit code `0`; line 1 `specs/cli-external-orchestration/071-cli-hermes-creation`; line 2 the packet objective; `goal.cjs show` prints `STATUS=OK ACTION=show` and `goal_present=true`; the agent log shows `repo-guards-goal` under 4000 chars. | stdout, exit code, elapsed seconds, the stderr session id, the goal core's show output | PASS when the packet and objective are quoted and the core reports the goal for that session; FAIL on `NO_GOAL` or `goal_present=false`; SKIP only on a named blocker. | Harness: plugin not loaded. Dependency: provider missing. Adapter: the core reports no goal, which points at the bind never running on session start |

### Recorded Result

**Executed 2026-09-15**: exit 0 after 26 s, the packet path and the objective quoted, `goal.cjs show` reported `goal_present=true` with `objective="Execute specs/cli-external-orchestration/071-cli-hermes-creation/goal.md ..."`, section 2655 chars, session `20260915_080753_e6cc2e`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `goal-hook/goal-core-binding-by-session-id.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SYNC.md](../../../../../../.hermes/SYNC.md) | What the plugin bridges and how |
| [hook-contract.md](../../references/hook-contract.md) | The plugin hook map |
| `.opencode/hooks/goal/bin/goal.cjs` | The shared goal core |

---

## 5. SOURCE METADATA

- Group: Goal Hook
- Playbook ID: HERMES-030
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `goal-hook/goal-core-binding-by-session-id.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
