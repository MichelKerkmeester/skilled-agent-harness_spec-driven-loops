---
title: "CO-001 -- Base non-interactive invocation"
description: "This scenario validates the canonical opencode run dispatch for `CO-001`. It focuses on confirming the default skill shape (model + effort + format) returns a coherent JSON event stream and exits cleanly."
version: 1.4.14.0
---

# CO-001 -- Base non-interactive invocation

**Version note.** These commands target OpenCode 2 (2.3.2). Check that `opencode models --standalone` lists the `llmgateway/` prefix of the model you pass to `-m` first; `llmgateway/deepseek-v4.1-flash-1017` is the default, while `opencode-go/` stays selectable and needs its own login (`opencode auth login opencode-go`). A machine that still carries the earlier major version needs one run of `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh remove-v1`.

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-001`.

---

## 1. OVERVIEW

This scenario validates Base non-interactive invocation for `CO-001`. It focuses on confirming the canonical `cd <repo-root> && opencode run --standalone -m llmgateway/deepseek-v4.1-flash-1017#max --format json "<prompt>" </dev/null` dispatch returns a coherent JSON event stream and exits cleanly from a non-OpenCode runtime.

### Why This Matters

Every other scenario in this playbook builds on this baseline. If the default skill invocation shape is broken (binary missing, self-invocation guard tripping spuriously, JSON event stream malformed), no provider override, agent route, parallel detached session or cross-repo dispatch can pass. CO-001 is the single most important critical-path test in the package. It proves the cli-opencode default invocation contract documented in SKILL.md §3 actually works end-to-end.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-001` and confirm the expected signals without contradictory evidence.

- Objective: Confirm that the canonical default invocation `cd "$(pwd)" && opencode run --standalone -m llmgateway/deepseek-v4.1-flash-1017#max --format json "<prompt>" 2>&1 </dev/null` returns a parseable JSON event stream and exits 0.
- Real user request: `From a fresh shell (no OpenCode parent), use opencode run with the cli-opencode default shape to ask: explain what the cli-opencode skill does in two sentences. Verify the JSON event stream parses and contains text and step_finish events.`
- Prompt: `Run a fresh default opencode invocation, verify step_start/tool_use/text/step_finish events, and report the session id plus event count.`
- Expected execution process: External-AI orchestrator (Claude Code, OpenCode, Copilot or raw shell) confirms self-invocation guard does NOT trip, runs `command -v opencode`, dispatches with the default shape, captures stdout+stderr via `2>&1` and parses the newline-delimited JSON events with `jq`.
- Expected signals: The binary check returns a path (`command -v opencode`). No `OPENCODE_*` env vars set other than `OPENCODE_API_KEY`. JSON event stream contains at least one `step_start`, at least one `text` event and at least one `step_finish` event, and every event carries a non-empty `sessionID`. Exit code 0. Runtime under 90 seconds for a short prompt.
- Desired user-visible outcome: A short paragraph explaining the skill plus a one-line verdict naming the session id, event count and PASS or FAIL with reason.
- Pass/fail: PASS if exit 0 AND `step_start`, `text` and `step_finish` events are present AND a non-empty `sessionID` AND no self-invocation refusal AND total runtime under 90s. FAIL if any condition fails.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Confirm the orchestrator runtime is NOT OpenCode itself (no `OPENCODE_*` env vars other than `OPENCODE_API_KEY`, no `opencode` parent process, no live state lock).
3. Confirm `opencode` is on PATH and reports a major-2 version.
4. Execute the deterministic steps exactly as written.
5. Parse the JSON event stream with `jq` and count event types.
6. Compare the observed output against the desired user-visible outcome.
7. Return a concise final answer that a real user would understand.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-001 | Base non-interactive invocation | Confirm the canonical `opencode run` default invocation returns a parseable JSON event stream and exits 0 | `Run a fresh default opencode invocation, verify step_start/tool_use/text/step_finish events, and report the session id plus event count.` | 1. `bash: env \| grep -v '^OPENCODE_API_KEY=' \| grep -q '^OPENCODE_' && echo "ABORT: in-OpenCode" \|\| echo "OK: not in OpenCode"` -> 2. `bash: command -v opencode && opencode --version` -> 3. `bash: cd "$(pwd)" && opencode run --standalone -m llmgateway/deepseek-v4.1-flash-1017#max --format json "Explain what the cli-opencode skill does in two sentences." > /tmp/co-001-events.jsonl 2>&1 </dev/null` -> 4. `bash: echo "Exit: $?"` -> 5. `bash: jq -r '.type' /tmp/co-001-events.jsonl \| sort \| uniq -c` -> 6. `bash: jq -r 'select(.type == "step_start") \| .sessionID' /tmp/co-001-events.jsonl` | Step 1: prints `OK: not in OpenCode`. Step 2: returns the binary path and a major-2 version. Step 3: writes JSON event lines. Step 4: exit 0. Step 5: counts include `step_start` (>=1), `text` (>=1) and `step_finish` (>=1), with `tool_use` (>=1) when the run calls a tool. Step 6: prints a non-empty `sessionID` | `/tmp/co-001-events.jsonl` plus terminal transcript with timestamps, exit code, and event-type histogram | PASS if exit 0 AND step_start, text and step_finish events are present AND a non-empty sessionID AND no self-invocation refusal AND runtime under 90s. FAIL if any condition fails | 1. Verify `command -v opencode` returns a path. If missing, run `bash .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh v2`, which installs the pinned OpenCode 2. 2. Verify no `OPENCODE_*` env var other than `OPENCODE_API_KEY` is set (if one is, run from a fresh shell outside OpenCode). 3. Run `opencode auth list` to confirm the default model's provider (`llmgateway`) is configured. 4. If JSON is malformed, re-run with `--print-logs --log-level debug` and inspect stderr. |

### Optional Supplemental Checks

If the base scenario passes, optionally re-run with `--print-logs --log-level debug` to confirm the verbose log surfaces tool calls and processing events. This helps later scenarios (CO-013..CO-017 agent dispatch and CO-026..CO-028 parallel detached) that rely on log inspection for routing verification.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../references/cli-reference.md` | CLI flag reference (sections 4-5: core invocation flag table, model selection) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill default invocation contract (section 3 "Default Invocation") and ALWAYS rules 3 + 4 + 9 |
| `../../references/cli-reference.md` | Authoritative `opencode run` flag inventory for OpenCode 2 |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: CO-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cli-invocation/base-non-interactive-invocation.md`
