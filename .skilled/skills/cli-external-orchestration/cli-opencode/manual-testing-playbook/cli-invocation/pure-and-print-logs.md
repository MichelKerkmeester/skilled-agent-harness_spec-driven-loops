---
title: "CO-005 -- Plugin disable (--pure) and verbose logs (--print-logs / --log-level)"
description: "This scenario validates `--pure`, `--print-logs`, and `--log-level` for `CO-005`. It focuses on confirming plugin loading can be selectively disabled for debugging and that verbose logs surface to stderr without contaminating the JSON event stream on stdout."
version: 1.4.5.0
---

# CO-005 -- Plugin disable (--pure) and verbose logs (--print-logs / --log-level) (OpenCode 1 only)

**Version note.** These commands target OpenCode 1 (1.19.3), and the scenario runs on OpenCode 1 only: OpenCode 2 (2.0.32) `run` has no `--pure` and leaves `--log-level` unverified (see the [install reference](../../references/install-and-versions.md)).

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-005`.

---

## 1. OVERVIEW

On OpenCode 1, this scenario validates Plugin disable and verbose logs for `CO-005`. It focuses on confirming `--pure` disables every project plugin (debugging only), `--print-logs` streams verbose logs to stderr and `--log-level DEBUG` raises the verbosity without contaminating the JSON event stream on stdout. OpenCode 2 (2.0.32) `run` has no `--pure` and leaves `--log-level` unverified ([install reference](../../references/install-and-versions.md)).

### Why This Matters

On OpenCode 1, `--pure` is the documented escape hatch for plugin loader crashes (per `references/cli-reference.md` §10 troubleshooting). NEVER rule 5 in SKILL.md mandates `--pure` is debugging-only because disabling plugins removes the entire point of cli-opencode (full plugin/skill/MCP runtime). `--print-logs` plus `--log-level DEBUG` are the two operator-facing diagnostic flags for failure triage. If any of these flags malfunction, operators lose the canonical debugging surface. Every other scenario's failure triage step becomes harder. This test proves all three diagnostic surfaces work.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-005` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--pure` (OpenCode 1 only) runs without external plugins, `--print-logs --log-level DEBUG` streams verbose logs to stderr and the stdout JSON event stream remains parseable in both cases.
- Real user request (OpenCode 1 only): `Run the same opencode run prompt three times: once normally, once with --pure to disable plugins, and once with --print-logs --log-level DEBUG to see verbose logs. Show me the differences.`
- Prompt: `Run baseline, --pure, and --print-logs variants of the same prompt; verify exits, JSON parseability, plugin silence, and stderr logs.` (OpenCode 1 only)
- Expected execution process: External-AI orchestrator dispatches three runs with the same prompt, captures stdout and stderr separately for each, validates JSON parses for runs 1 and 3, validates run 2 exits cleanly without plugin errors and validates run 3's stderr is non-empty.
- Expected signals: All three exit 0. Runs 1 and 3 stdout is parseable line-delimited JSON with `step_finish`. Run 2 (--pure, OpenCode 1 only) does NOT contain plugin load errors in stderr. Run 3 stderr line count is > 0.
- Desired user-visible outcome: Verdict naming each variant's exit code, stdout event count and stderr line count.
- Pass/fail: PASS if all three exit 0 AND runs 1 + 3 emit parseable JSON AND run 2 has no plugin errors AND run 3 stderr is non-empty. FAIL if any check fails.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Dispatch baseline default with stdout to file, stderr to separate file.
3. On OpenCode 1, dispatch `--pure` with stdout to file, stderr to separate file.
4. Dispatch `--print-logs --log-level DEBUG` with stdout to file, stderr to separate file.
5. Validate JSON parseability for runs 1 + 3, plugin-error absence for run 2 and stderr non-empty for run 3.
6. Return a verdict naming all three variants' summary metrics.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-005 | Plugin disable and verbose logs | Confirm `--pure` (OpenCode 1 only), `--print-logs` and `--log-level DEBUG` work without contaminating the JSON event stream on stdout | `Run baseline, --pure, and --print-logs variants of the same prompt; verify exits, JSON parseability, plugin silence, and stderr logs.` (OpenCode 1 only) | 1. `bash: opencode run --model llmgateway/deepseek-v4.1-flash-1017 --variant max --format json --dir "$(pwd)" "Reply with one short sentence acknowledging the prompt." > /tmp/co-005-baseline.jsonl 2> /tmp/co-005-baseline.err && echo "BASELINE: $?"` (OpenCode 1 only) -> 2. `bash: opencode run --pure --model llmgateway/deepseek-v4.1-flash-1017 --variant max --format json --dir "$(pwd)" "Reply with one short sentence acknowledging the prompt." > /tmp/co-005-pure.jsonl 2> /tmp/co-005-pure.err && echo "PURE: $?"` (OpenCode 1 only, since OpenCode 2 `run` has no `--pure`, see the [install reference](../../references/install-and-versions.md)) -> 3. `bash: opencode run --print-logs --log-level DEBUG --model llmgateway/deepseek-v4.1-flash-1017 --variant max --format json --dir "$(pwd)" "Reply with one short sentence acknowledging the prompt." > /tmp/co-005-debug.jsonl 2> /tmp/co-005-debug.err && echo "DEBUG: $?"` (`--print-logs` is kept on OpenCode 2, while `--log-level` is unverified on OpenCode 2.0.32, see the [install reference](../../references/install-and-versions.md)) -> 4. `bash: jq -e 'select(.type == "step_finish")' /tmp/co-005-baseline.jsonl > /dev/null && echo "BASELINE_JSON_OK"` -> 5. `bash: jq -e 'select(.type == "step_finish")' /tmp/co-005-debug.jsonl > /dev/null && echo "DEBUG_JSON_OK"` -> 6. `bash: grep -ciE '(plugin.*(error\|fail\|crash))' /tmp/co-005-pure.err` -> 7. `bash: wc -l /tmp/co-005-debug.err` | Step 1: BASELINE exit 0. Step 2: PURE exit 0. Step 3: DEBUG exit 0. Step 4: BASELINE_JSON_OK printed. Step 5: DEBUG_JSON_OK printed. Step 6: plugin error count = 0 in --pure stderr. Step 7: --debug stderr line count > 0 | `/tmp/co-005-baseline.{jsonl,err}`, `/tmp/co-005-pure.{jsonl,err}`, `/tmp/co-005-debug.{jsonl,err}`, terminal echoes for each variant | PASS if all 3 exits = 0 AND baseline + debug stdout JSON parses AND --pure stderr has no plugin errors AND --debug stderr is non-empty. FAIL if any check fails | 1. On OpenCode 1, if --pure fails with a plugin error, the binary may not honor the flag. File a bug and confirm version v1.3.17. 2. If --debug stderr is empty, --print-logs may have been ignored, so re-run and double-check spelling. 3. If JSON event stream contains stderr-style log lines, --print-logs may be writing to stdout instead of stderr. Separate redirects (`> stdout.log 2> stderr.log`) show this immediately. 4. NEVER use --pure for production dispatches per SKILL.md NEVER rule 5 |

### Optional Supplemental Checks

For verbose log inspection, run `head -5 /tmp/co-005-debug.err` to confirm the log lines include timestamp and level prefixes (e.g., `DEBUG`, `INFO`). This is the format external runtimes parse to surface progress in their own UIs.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../references/cli-reference.md` (§4 `--pure` (OpenCode 1 only), `--print-logs`, `--log-level` rows) | Diagnostic flag documentation |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | NEVER rule 5 (`--pure` is debugging only, OpenCode 1 only), error handling table |
| `../../references/cli-reference.md` | §10 troubleshooting (plugin load crash recovery via `--pure`, OpenCode 1 only) |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: CO-005
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cli-invocation/pure-and-print-logs.md`
