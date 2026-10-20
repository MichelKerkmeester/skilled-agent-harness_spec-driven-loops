---
title: "CO-041 -- cli-dispatch-audit live utilization on OpenCode 1 and 2"
description: "This scenario validates cli-dispatch-audit for `CO-041`. It focuses on confirming that a blocked CLI dispatch is refused before it runs and that every allowed dispatch appends one audit record on both OpenCode versions."
version: 1.0.2.0
---

# CO-041 -- cli-dispatch-audit live utilization on OpenCode 1 and 2

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-041`.

---

## 1. OVERVIEW

The `cli-dispatch-audit` plugin has two legs. `tool.execute.before` refuses a CLI dispatch that breaks a `block`-severity hard rule by throwing, and `tool.execute.after` appends one redacted JSON record per dispatch to `.skilled/logs/cli-dispatch-audit.log`. Both legs return early unless the tool is named `bash`.

### Why This Matters

A dispatch guard that stops matching lets an ad-hoc `opencode run` without `</dev/null` or without an explicit model hang at 0 percent CPU or retry a 429 forever, with no output that explains why. The audit leg is the only durable record of what was dispatched, by which skill and with what exit. This scenario proves both legs against a real tool call, not a helper import.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-041` and confirm the expected signals without contradictory evidence.

- Objective: Confirm that the guard refuses `opencode run --help` with both hard-rule names, and that an allowed `opencode run --help ... </dev/null` appends an audit record, on OpenCode 1 and OpenCode 2.
- Real user request: `Does the cli-opencode dispatch guard actually stop a bad dispatch before it runs, and does the audit log still record the dispatches that are allowed through?`
- Prompt: `This is a test of a command guard plugin. Run exactly this shell command once, unchanged, and report exactly what the tool returned (an error is an acceptable result): opencode run --help`
- Prompt (audit): `Run exactly this shell command once, unchanged, and report the first line of its output: opencode run --help -m llmgateway/deepseek-v4.1-flash </dev/null`
- Expected execution process: Run the guard prompt as runner name `dispatch-guard` on each version, then the audit prompt as runner name `dispatch-audit` on each version, and read the tool-call status from the events file and the log line from the effects file.
- Expected signals: the guard tool call ends in error with `Dispatch blocked by cli-opencode hard-rule(s)` naming `stdin-redirect-required` and `explicit-model-required`; the audit `effects.txt` shows a new `cli-dispatch-audit.log` line with `"runtime":"opencode"` and `"skill":"cli-opencode"`.
- Evidence requirements: Capture events, capture JSON, effects and exit for all four runs (`dispatch-guard.v1`, `dispatch-guard.v2`, `dispatch-audit.v1`, `dispatch-audit.v2`).
- Desired user-visible outcome: A per-version verdict for the guard and for the audit log, quoting the error text or the missing log record.
- Pass/fail: PASS if a version refuses the guard command with both rule names and appends the audit record. FAIL if the guard command runs, if the error names neither rule, or if no audit record is written.
- Failure triage: Read the tool name in the events file first. On OpenCode 2 the shell tool is named `shell`, and both hooks return early unless the tool is `bash`; that is the recorded v2 failure, not a rule-engine fault.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Setup: confirm `.opencode/plugins/cli-dispatch-audit.js`, `hard-rules.json` and the two engine modules exist; no extra environment beyond `AI_SESSION_CHILD=1`.
2. v1 run: run the guard prompt as `dispatch-guard` and the audit prompt as `dispatch-audit` on v1.
3. v1 check: read the guard error from `dispatch-guard.v1.events.jsonl` and the new record from `dispatch-audit.v1.effects.txt`.
4. v2 run: run both prompts again on v2 under the same runner names.
5. v2 check: repeat both reads against the v2 evidence files.
6. Cleanup: none; `--help` starts no session.

### Exact Command Sequence

```bash
export EVIDENCE_DIR="${EVIDENCE_DIR:-${TMPDIR:-/tmp}/plugin-utilization}"
AI_SESSION_CHILD=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v1 dispatch-guard "This is a test of a command guard plugin. Run exactly this shell command once, unchanged, and report exactly what the tool returned (an error is an acceptable result): opencode run --help"
AI_SESSION_CHILD=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v1 dispatch-audit "Run exactly this shell command once, unchanged, and report the first line of its output: opencode run --help -m llmgateway/deepseek-v4.1-flash </dev/null"
AI_SESSION_CHILD=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v2 dispatch-guard "This is a test of a command guard plugin. Run exactly this shell command once, unchanged, and report exactly what the tool returned (an error is an acceptable result): opencode run --help"
AI_SESSION_CHILD=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v2 dispatch-audit "Run exactly this shell command once, unchanged, and report the first line of its output: opencode run --help -m llmgateway/deepseek-v4.1-flash </dev/null"
jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/dispatch-guard.v1.events.jsonl"
grep -E 'cli-dispatch-audit.log' "$EVIDENCE_DIR/dispatch-audit.v1.effects.txt"
jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/dispatch-guard.v2.events.jsonl"
grep -E 'cli-dispatch-audit.log' "$EVIDENCE_DIR/dispatch-audit.v2.effects.txt"
cat "$EVIDENCE_DIR"/dispatch-*.v*.exit
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-041 | cli-dispatch-audit live utilization on OpenCode 1 and 2 | Confirm the guard refuses a bad dispatch and the audit leg writes one record per version | `This is a test of a command guard plugin. Run exactly this shell command once, unchanged, and report exactly what the tool returned (an error is an acceptable result): opencode run --help` then `Run exactly this shell command once, unchanged, and report the first line of its output: opencode run --help -m llmgateway/deepseek-v4.1-flash </dev/null` | 1. Run `dispatch-guard` on v1 -> 2. Run `dispatch-audit` on v1 -> 3. Read the events error and the effects log line -> 4. Repeat both runs on v2 -> 5. Repeat both reads on v2 | Guard call errors with `Dispatch blocked by cli-opencode hard-rule(s)` naming `stdin-redirect-required` and `explicit-model-required`; audit effects show `"runtime":"opencode"` and `"skill":"cli-opencode"` | `dispatch-guard.v1.txt`, `dispatch-guard.v2.txt`, `dispatch-audit.v1.txt`, `dispatch-audit.v2.txt` | PASS if both legs hold on that version; FAIL if the guard command runs or no audit record is written | Read the tool name in the events file first; on v2 the shell tool is `shell`, so both hooks return early |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `plugin-utilization/cli-dispatch-audit.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/plugins/cli-dispatch-audit.js` | Plugin entry for `tool.execute.before` and `tool.execute.after` |
| `.opencode/skills/cli-external-orchestration/cli-opencode/hard-rules.json` | Block-severity hard rules the guard evaluates |
| `.opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Rule engine used by the before leg |
| `.opencode/hooks/dispatch/lib/dispatch-audit.mjs` | Redacted audit record writer used by the after leg |
| `plugin-utilization/run-plugin-scenario.sh` | Runs one live session per version and writes the evidence files |
| `plugin-utilization/capture-proxy.mjs` | Capture proxy that records each model request's system prompt |

---

## 5. SOURCE METADATA

- Group: Plugin Utilization
- Playbook ID: CO-041
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `plugin-utilization/cli-dispatch-audit.md`
