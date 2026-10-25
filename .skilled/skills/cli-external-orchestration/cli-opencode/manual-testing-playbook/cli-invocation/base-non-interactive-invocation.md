---
title: "CO-001 -- Base non-interactive invocation"
description: "This scenario validates the canonical opencode run dispatch for `CO-001`. It focuses on confirming the default skill shape (model + agent + variant + format + dir) returns a coherent JSON event stream and exits cleanly."
version: 1.4.10.0
---

# CO-001 -- Base non-interactive invocation

**Version note.** These commands target OpenCode 1 (1.19.3). The OpenCode 2 (2.0.32) twin is `cd <repo-root> && opencode run --standalone -m llmgateway/deepseek-v4.1-flash-1017#max --format json "<prompt>"` (see the [install reference](../../references/install-and-versions.md)). On OpenCode 2, check that `opencode models --standalone` lists the `llmgateway/` prefix of the model you pass to `-m` first; `llmgateway/deepseek-v4.1-flash-1017` is the default on both versions (DevPass), while `opencode-go/` stays selectable and needs its own v2 login (`opencode providers login opencode-go`).

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-001`.

---

## 1. OVERVIEW

On OpenCode 1, this scenario validates Base non-interactive invocation for `CO-001`. It focuses on confirming the canonical `opencode run --model llmgateway/deepseek-v4.1-flash-1017 --variant max --format json --dir <repo-root> "<prompt>"` dispatch returns a coherent JSON event stream and exits cleanly from a non-OpenCode runtime. The OpenCode 2 twin starts in the directory and carries the effort on the model id: `cd <repo-root> && opencode run --standalone -m llmgateway/deepseek-v4.1-flash-1017#max --format json "<prompt>"`.

### Why This Matters

Every other scenario in this playbook builds on this baseline. If the default skill invocation shape is broken (binary missing, self-invocation guard tripping spuriously, JSON event stream malformed), no provider override, agent route, parallel detached session or cross-repo dispatch can pass. CO-001 is the single most important critical-path test in the package. It proves the cli-opencode default invocation contract documented in SKILL.md §3 actually works end-to-end.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-001` and confirm the expected signals without contradictory evidence.

- Objective: Confirm that the canonical default invocation `opencode run --model llmgateway/deepseek-v4.1-flash-1017 --variant max --format json --dir "$(pwd)" "<prompt>" 2>&1` (OpenCode 1 only) returns a parseable JSON event stream and exits 0.
- Real user request: `From a fresh shell (no OpenCode parent), use opencode run with the cli-opencode default shape to ask: explain what the cli-opencode skill does in two sentences. On OpenCode 1 use opencode run and on OpenCode 2 use the opencode2 twin. On both, verify the JSON event stream parses and contains text and step_finish events.`
- Prompt: `Run a fresh default opencode invocation, verify step_start/tool_use/text/step_finish events on both OpenCode versions, and report the session id plus event count.`
- Expected execution process: External-AI orchestrator (Claude Code, OpenCode, Copilot or raw shell) confirms self-invocation guard does NOT trip, runs `command -v opencode`, dispatches with the default shape, captures stdout+stderr via `2>&1` and parses the newline-delimited JSON events with `jq`.
- Expected signals: On both versions, the binary check returns a path (`command -v opencode`, which is OpenCode 2 on the recommended layout and OpenCode 1 on a v1-only machine). No `OPENCODE_*` env vars set. JSON event stream contains at least one `step_start`, at least one `text` event and at least one `step_finish` event, and every event carries a non-empty `sessionID`. Exit code 0. Runtime under 90 seconds for a short prompt.
- Desired user-visible outcome: A short paragraph explaining the skill plus a one-line verdict naming the session id, event count and PASS or FAIL with reason.
- Pass/fail: PASS if exit 0 AND `step_start`, `text` and `step_finish` events are present AND a non-empty `sessionID` AND no self-invocation refusal AND total runtime under 90s. FAIL if any condition fails.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Confirm the orchestrator runtime is NOT OpenCode itself (no `OPENCODE_*` env vars, no `opencode` parent process, no live state lock).
3. On OpenCode 1, confirm `opencode` is on PATH and version is at or near v1.3.17.
4. Execute the deterministic steps exactly as written.
5. Parse the JSON event stream with `jq` and count event types.
6. Compare the observed output against the desired user-visible outcome.
7. Return a concise final answer that a real user would understand.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-001 | Base non-interactive invocation | Confirm the canonical `opencode run` default invocation returns a parseable JSON event stream and exits 0 | `Run a fresh default opencode invocation, verify step_start/tool_use/text/step_finish events on both OpenCode versions, and report the session id plus event count.` | 1. `bash: env \| grep -q '^OPENCODE_' && echo "ABORT: in-OpenCode" \|\| echo "OK: not in OpenCode"` -> 2. `bash: command -v opencode && opencode --version` (OpenCode 1 only. On OpenCode 2, check `command -v opencode2 && opencode --version` instead, which prints `opencode v2.0.32`) -> 3. `bash: opencode run --model llmgateway/deepseek-v4.1-flash-1017 --variant max --format json --dir "$(pwd)" "Explain what the cli-opencode skill does in two sentences." > /tmp/co-001-events.jsonl 2>&1` (OpenCode 1 only. OpenCode 2 twin: `bash: cd "$(pwd)" && opencode run --standalone -m llmgateway/deepseek-v4.1-flash-1017#max --format json "Explain what the cli-opencode skill does in two sentences." > /tmp/co-001-events.jsonl 2>&1`) -> 4. `bash: echo "Exit: $?"` -> 5. `bash: jq -r '.type' /tmp/co-001-events.jsonl \| sort \| uniq -c` -> 6. `bash: jq -r 'select(.type == "step_start") \| .sessionID' /tmp/co-001-events.jsonl` | Step 1: prints `OK: not in OpenCode`. Step 2: returns binary path and version starting with `1.`. Step 3: writes JSON event lines. Step 4: exit 0. Step 5: counts include `step_start` (>=1), `text` (>=1) and `step_finish` (>=1), with `tool_use` (>=1) when the run calls a tool. Step 6: prints a non-empty `sessionID` | `/tmp/co-001-events.jsonl` plus terminal transcript with timestamps, exit code, and event-type histogram | PASS if exit 0 AND step_start, text and step_finish events are present AND a non-empty sessionID AND no self-invocation refusal AND runtime under 90s. FAIL if any condition fails | 1. Verify `command -v opencode` returns a path. If missing, run `brew install opencode` (macOS) or the standalone installer. 2. Verify no `OPENCODE_*` env var is set (if set, run from a fresh shell outside OpenCode). 3. Run `opencode providers` to confirm anthropic is configured. 4. If JSON is malformed, re-run with `--print-logs --log-level DEBUG` and inspect stderr. |

### Optional Supplemental Checks

If the base scenario passes, optionally re-run with `--print-logs --log-level DEBUG` to confirm the verbose log surfaces tool calls and processing events. This helps later scenarios (CO-013..CO-017 agent dispatch and CO-026..CO-028 parallel detached) that rely on log inspection for routing verification.

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
| `../../references/cli-reference.md` | Authoritative `opencode run` flag inventory pinned to v1.3.17 on OpenCode 1, with the OpenCode 2 column beside it |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: CO-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cli-invocation/base-non-interactive-invocation.md`
