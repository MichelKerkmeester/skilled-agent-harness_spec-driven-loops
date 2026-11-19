---
title: "CO-005 -- Verbose logs (--print-logs / --log-level) and the removed plugin-disable flag"
description: "This scenario validates `--print-logs` and `--log-level` for `CO-005`, and confirms the plugin-disable flag is not a `run` flag. It focuses on confirming verbose logs surface to stderr without contaminating the JSON event stream on stdout."
version: 1.4.6.0
---

# CO-005 -- Verbose logs (--print-logs / --log-level) and the removed plugin-disable flag

**Version note.** These commands target OpenCode 2 (2.3.2). `run` has no plugin-disable flag, so that leg of this scenario is a check that the flag is absent rather than a dispatch.

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-005`.

---

## 1. OVERVIEW

This scenario validates verbose logs and the absent plugin-disable flag for `CO-005`. It focuses on confirming `--print-logs` streams verbose logs to stderr and `--log-level debug` raises the verbosity without contaminating the JSON event stream on stdout, and that the plugin-disable flag is not part of the `run` flag surface.

### Why This Matters

`--print-logs` plus `--log-level` are the two operator-facing diagnostic flags for failure triage. If either malfunctions, operators lose the canonical debugging surface and every other scenario's failure triage step becomes harder. The plugin-disable escape hatch that earlier major versions offered no longer exists, so an operator who reaches for it needs to learn that from this test rather than from a failed dispatch. This test proves both diagnostic surfaces work and that the removed flag is gone.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-005` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--print-logs --log-level debug` streams verbose logs to stderr, the stdout JSON event stream remains parseable, and the plugin-disable flag is absent from `opencode run -m llmgateway/deepseek-v4.1-flash-1017 --help </dev/null`.
- Real user request: `Run the same opencode run prompt twice: once normally, and once with --print-logs --log-level debug to see verbose logs. Also confirm that the plugin-disable flag is no longer a run flag. Show me the differences.`
- Prompt: `Run baseline and --print-logs variants of the same prompt; verify exits, JSON parseability, stderr logs, and that the plugin-disable flag is absent from run --help.`
- Expected execution process: External-AI orchestrator dispatches two runs with the same prompt, captures stdout and stderr separately for each, validates JSON parses for both, validates the debug run's stderr is non-empty and greps `opencode run -m llmgateway/deepseek-v4.1-flash-1017 --help </dev/null` for the plugin-disable flag.
- Expected signals: Both runs exit 0. Both stdout streams are parseable line-delimited JSON with `step_finish`. The debug run's stderr line count is > 0. `opencode run -m llmgateway/deepseek-v4.1-flash-1017 --help </dev/null` lists no plugin-disable flag.
- Desired user-visible outcome: Verdict naming each variant's exit code, stdout event count and stderr line count, plus the plugin-disable absence result.
- Pass/fail: PASS if both runs exit 0 AND both emit parseable JSON AND the debug run's stderr is non-empty AND the plugin-disable flag is absent from `run --help`. FAIL if any check fails.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Dispatch baseline default with stdout to file, stderr to separate file.
3. Grep `opencode run --help -m llmgateway/deepseek-v4.1-flash-1017 </dev/null` for the plugin-disable flag and confirm it is absent.
4. Dispatch `--print-logs --log-level debug` with stdout to file, stderr to separate file.
5. Validate JSON parseability for both runs and stderr non-empty for the debug run.
6. Return a verdict naming both variants' summary metrics and the plugin-disable result.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-005 | Verbose logs and the removed plugin-disable flag | Confirm `--print-logs` and `--log-level debug` work without contaminating the JSON event stream on stdout, and that the plugin-disable flag is not a `run` flag | `Run baseline and --print-logs variants of the same prompt; verify exits, JSON parseability, stderr logs, and that the plugin-disable flag is absent from run --help.` | 1. `bash: opencode run --standalone -m llmgateway/deepseek-v4.1-flash-1017#max --format json "Reply with one short sentence acknowledging the prompt." > /tmp/co-005-baseline.jsonl 2> /tmp/co-005-baseline.err </dev/null && echo "BASELINE: $?"` -> 2. `bash: opencode run --help -m llmgateway/deepseek-v4.1-flash-1017 </dev/null \| grep -c -- '--pure'` -> 3. `bash: opencode run --standalone --print-logs --log-level debug -m llmgateway/deepseek-v4.1-flash-1017#max --format json "Reply with one short sentence acknowledging the prompt." > /tmp/co-005-debug.jsonl 2> /tmp/co-005-debug.err </dev/null && echo "DEBUG: $?"` -> 4. `bash: jq -e 'select(.type == "step_finish")' /tmp/co-005-baseline.jsonl > /dev/null && echo "BASELINE_JSON_OK"` -> 5. `bash: jq -e 'select(.type == "step_finish")' /tmp/co-005-debug.jsonl > /dev/null && echo "DEBUG_JSON_OK"` -> 6. `bash: wc -l /tmp/co-005-debug.err` | Step 1: BASELINE exit 0. Step 2: prints `0`, so the plugin-disable flag is absent. Step 3: DEBUG exit 0. Step 4: BASELINE_JSON_OK printed. Step 5: DEBUG_JSON_OK printed. Step 6: debug stderr line count > 0 | `/tmp/co-005-baseline.{jsonl,err}`, `/tmp/co-005-debug.{jsonl,err}`, terminal echoes for each variant and the plugin-disable grep count | PASS if both exits = 0 AND baseline + debug stdout JSON parses AND the plugin-disable flag is absent from `run --help` AND debug stderr is non-empty. FAIL if any check fails | 1. If the plugin-disable flag appears in `run --help`, the binary is not the pinned build, so reinstall with `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh v2`. 2. If debug stderr is empty, `--print-logs` may have been ignored, so re-run and double-check spelling. 3. If the JSON event stream contains stderr-style log lines, `--print-logs` may be writing to stdout instead of stderr. Separate redirects (`> stdout.log 2> stderr.log`) show this immediately. 4. `--log-level` takes a lowercase value, so `debug` is correct and `DEBUG` is not |

### Optional Supplemental Checks

For verbose log inspection, run `head -5 /tmp/co-005-debug.err` to confirm the log lines include timestamp and level prefixes (e.g., `debug`, `info`). This is the format external runtimes parse to surface progress in their own UIs.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../references/cli-reference.md` (§4 `--print-logs` and `--log-level` rows) | Diagnostic flag documentation |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Error handling table |
| `../../references/cli-reference.md` | §10 troubleshooting |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: CO-005
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cli-invocation/pure-and-print-logs.md`
