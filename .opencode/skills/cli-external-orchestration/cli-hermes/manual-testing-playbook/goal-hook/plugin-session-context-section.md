---
title: "HERMES-015 -- Plugin session-context section"
description: "Confirm the `repo-guards` plugin freezes a session-context section into the Hermes system prompt, that the section is logged, and that the session can quote it back for `HERMES-015`."
version: 1.0.0.0
---

# HERMES-015 -- Plugin session-context section

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `HERMES-015`.

---

## 1. OVERVIEW

Hermes ignores an `on_session_start` callback's return value, so the repo's session-start context travels through the system-prompt section surface instead. The plugin registers a section named `repo-guards-session-context` whose body is the shared session-start core's output and, when `HERMES_SPEC_FOLDER` names a packet, that packet's durable goal slice.

This scenario proves the section is both logged on the host side and visible to the model. `HERMES-020` is the scenario that reads the goal half specifically.

### Why This Matters

A context surface that is registered but never delivered is indistinguishable from one that works, until a session needs it. Checking the log line and the model's own quote gives two independent readings of the same delivery.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HERMES-015` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the `repo-guards` plugin freezes a session-context section into the Hermes system prompt, that the section is logged, and that the session can quote it back.
- Real user request: `Does a Hermes session know what packet I'm working on?`
- Prompt: `Quote verbatim any session-context or goal section that was frozen into your system prompt by a project plugin. If there is none, reply exactly NO_SESSION_CONTEXT.`
- Expected execution process: run the command sequence in §3 from the repository root with a 300-second alarm on each dispatch, capture stdout, stderr, exit code and elapsed seconds separately, then judge the result against the pass/fail criteria below.
- Expected signals: Exit code `0`; the agent log carries one `Session plugin prompt section: id=repo-guards-session-context plugin=repo-guards position=after_memory chars=<n>` line for that session id, with a character count reflecting the goal slice; stdout quotes the section body rather than answering `NO_SESSION_CONTEXT`.
- Evidence: The matching agent-log line with its character count, the quoted section body from stdout, the exit code, the elapsed seconds, the session id, and an explicit statement of what the section body did and did not contain.
- Desired user-visible outcome: a concise verdict naming the observed signal and the evidence behind it.
- Pass/fail: PASS when the log line is present and the session quotes the section; FAIL when the session answers `NO_SESSION_CONTEXT` while the log shows a delivered section, or when no log line appears at all; SKIP only when the plugin cannot load, naming the missing environment opt-in as the blocker.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook, including `command -v hermes`.
3. Run the command sequence below exactly as written, from the repository root.
4. Capture stdout, stderr, exit code and elapsed seconds separately for every dispatch.
5. Judge the result against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
HERMES_ENABLE_PROJECT_PLUGINS=1 perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model glm-5.3-flash --reasoning none \
  -t file,todo --max-turns 4 --run-budget 150 \
  -q "Quote verbatim any session-context or goal section that was frozen into your system prompt by a project plugin. If there is none, reply exactly NO_SESSION_CONTEXT." \
  </dev/null >out.txt 2>err.txt
echo $?
sid=$(grep -o 'session_id: .*' err.txt | awk '{print $2}')
grep "$sid" ~/.hermes/logs/agent.log | grep -i 'prompt section'
cat out.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HERMES-015 | Plugin session-context section | Confirm the `repo-guards` plugin freezes a session-context section into the Hermes system prompt, that the section is logged, and that the session can quote it back | `Quote verbatim any session-context or goal section that was frozen into your system prompt by a project plugin. If there is none, reply exactly NO_SESSION_CONTEXT.` | 1. `HERMES_ENABLE_PROJECT_PLUGINS=1 perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model glm-5.3-flash --reasoning none -t file,todo --max-turns 4 --run-budget 150 -q "Quote verbatim any session-context or goal section that was frozen into your system prompt by a project plugin. If there is none, reply exactly NO_SESSION_CONTEXT." </dev/null >out.txt 2>err.txt` -> 2. `echo $?` -> 3. `sid=$(grep -o 'session_id: .*' err.txt | awk '{print $2}')` -> 4. `grep "$sid" ~/.hermes/logs/agent.log | grep -i 'prompt section'` -> 5. `cat out.txt` | Exit code `0`; the agent log carries one `Session plugin prompt section: id=repo-guards-session-context plugin=repo-guards position=after_memory chars=<n>` line for that session id, with a character count reflecting the goal slice; stdout quotes the section body rather than answering `NO_SESSION_CONTEXT` | The matching agent-log line with its character count, the quoted section body from stdout, the exit code, the elapsed seconds, the session id, and an explicit statement of what the section body did and did not contain | PASS when the log line is present and the session quotes the section; FAIL when the session answers `NO_SESSION_CONTEXT` while the log shows a delivered section, or when no log line appears at all; SKIP only when the plugin cannot load, naming the missing environment opt-in as the blocker | No log line means the plugin never loaded: check `HERMES_ENABLE_PROJECT_PLUGINS=1` and the `plugins.enabled` entry in the user-level config, remembering that `hermes plugins list` does not display project plugins. A log line with a delivered section but a `NO_SESSION_CONTEXT` answer is a model-instruction problem; re-run before recording a FAIL. A quote covering only the leading sub-block is a prompt-precision artefact, not a delivery failure: ask for a named field, as `HERMES-020` does |

### Recorded Result

**Executed 2026-09-14, second pass**, with `HERMES_SPEC_FOLDER=specs/cli-external-orchestration/071-cli-hermes-creation`: exit 0 in 46 s for session `20260914_225329_ea18bf`; the agent log carries `Session plugin prompt section: id=repo-guards-session-context plugin=repo-guards position=after_memory chars=3402`, up from 303 in the first pass. Verdict PASS. Recorded nuance: asked to quote any section, the model returned only the leading Session Context sub-block, so this scenario proves delivery and `HERMES-020` proves the goal slice reached the same prompt.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `goal-hook/plugin-session-context-section.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [hook-contract.md](../../references/hook-contract.md) | The hook map and the system-prompt section surface |
| [SYNC.md](../../../../../../.hermes/SYNC.md) | The plugin bridge table, including the session-prompt section row |

---

## 5. SOURCE METADATA

- Group: Goal Hook
- Playbook ID: HERMES-015
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `goal-hook/plugin-session-context-section.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
