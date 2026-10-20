---
title: "CO-045 -- session-cleanup live utilization on OpenCode 1 and 2"
description: "This scenario validates session-cleanup for `CO-045`. It focuses on confirming that startup safety warnings are injected and the dispose hook writes its log line on both OpenCode versions."
version: 1.0.5.0
---

# CO-045 -- session-cleanup live utilization on OpenCode 1 and 2

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-045`.

---

## 1. OVERVIEW

The `session-cleanup` plugin has three surfaces. Its `event` hook runs the startup guards on `session.created`, `experimental.chat.system.transform` injects their warnings once, and `dispose` runs the cleanup script and logs to `SESSION_CLEANUP_LOG_PATH`.

### Why This Matters

The startup guards are the first thing that tells an operator the worktree is unsafe, such as mismatched git hook links. The dispose log is the only record that cleanup ran when a session ended. If either surface stops firing, an unsafe worktree looks clean and a skipped cleanup leaves no trace. This scenario checks both halves on each version.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-045` and confirm the expected signals without contradictory evidence.

- Objective: Confirm that the startup warnings reach the system prompt and the dispose hook appends a line to `SESSION_CLEANUP_LOG_PATH` on OpenCode 1 and OpenCode 2.
- Real user request: `Does session-cleanup still warn me about the worktree at startup and still write its cleanup line when the session ends?`
- Prompt: `Reply with the single word OK.`
- Expected execution process: Point `SESSION_CLEANUP_LOG_PATH` at a fresh temporary log, run the prompt through the scenario runner on v1 and then on v2 with `AI_SESSION_CHILD=1`, and read the captured system prompt and the log file for each version.
- Expected signals: the system prompt holds `[session-cleanup] Startup safety warnings:` (in a worktree whose git hook links point elsewhere it also shows `[check-git-hooks] Invalid git hook symlink(s)`); `SESSION_CLEANUP_LOG_PATH` gains a line such as `action=skip reason=no-session-pid`.
- Evidence requirements: Capture events, capture JSON, effects and exit for both versions, plus the contents of `SESSION_CLEANUP_LOG_PATH`.
- Desired user-visible outcome: A per-version verdict for the startup half and the dispose half, quoting the injected warning line and the log line.
- Pass/fail: PASS if both halves hold on that version. FAIL if the warning line is absent or no dispose line is written. Record each half separately when only one holds.
- Failure triage: Confirm `SESSION_CLEANUP_LOG_PATH` is exported to the run so the log is not written to a default path. For a missing startup warning, check whether the session delivered `session.created`; on OpenCode 2 the bridge delivers it once per session, before that session's first event or system transform, because `opencode2 run` sends none for its own session.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Setup: `LOG_DIR="$(mktemp -d)" || exit 1; [ -d "$LOG_DIR" ] || exit 1` and `export SESSION_CLEANUP_LOG_PATH="$LOG_DIR/session-cleanup.log"` so the log is new for this scenario.
2. v1 run: run the exact prompt through the scenario runner on v1 with `AI_SESSION_CHILD=1` and the log path exported.
3. v1 check: grep the capture file for the startup warning and read the log file for the dispose line.
4. v2 run: run the same prompt through the scenario runner on v2 with the same environment.
5. v2 check: repeat the capture grep and the log read against the v2 evidence.
6. Cleanup: `rm -rf "$LOG_DIR"`.

### Exact Command Sequence

```bash
export EVIDENCE_DIR="${EVIDENCE_DIR:-$(git rev-parse --show-toplevel)/.skilled/skills/.state/plugin-utilization}"
LOG_DIR="$(mktemp -d)" || exit 1; [ -d "$LOG_DIR" ] || exit 1
trap 'rm -rf "$LOG_DIR"' EXIT
export SESSION_CLEANUP_LOG_PATH="$LOG_DIR/session-cleanup.log"
AI_SESSION_CHILD=1 SESSION_CLEANUP_LOG_PATH="$SESSION_CLEANUP_LOG_PATH" bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v1 baseline "Reply with the single word OK."
jq -r '.system[]' "$EVIDENCE_DIR/baseline.v1.capture.jsonl" | grep -E '\[session-cleanup\] Startup safety warnings:'
cat "$SESSION_CLEANUP_LOG_PATH"
AI_SESSION_CHILD=1 SESSION_CLEANUP_LOG_PATH="$SESSION_CLEANUP_LOG_PATH" bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v2 baseline "Reply with the single word OK."
jq -r '.system[]' "$EVIDENCE_DIR/baseline.v2.capture.jsonl" | grep -E '\[session-cleanup\] Startup safety warnings:'
cat "$SESSION_CLEANUP_LOG_PATH"
cat "$EVIDENCE_DIR/baseline.v1.exit" "$EVIDENCE_DIR/baseline.v2.exit"

rm -rf "$LOG_DIR"
trap - EXIT
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-045 | session-cleanup live utilization on OpenCode 1 and 2 | Confirm the startup warning and the dispose log line on both versions | `Reply with the single word OK.` | 1. Export a fresh `SESSION_CLEANUP_LOG_PATH` -> 2. Run `baseline` on v1 -> 3. Grep the capture for the startup line and read the log -> 4. Run on v2 -> 5. Repeat both reads -> 6. Remove the temporary log directory | System prompt holds `[session-cleanup] Startup safety warnings:`; the log gains a line such as `action=skip reason=no-session-pid` | `baseline.v1.txt`, `baseline.v2.txt` | PASS if both halves hold on that version; FAIL if the warning or the dispose line is missing | Confirm the log path is exported; a missing startup warning points at `session.created`, which the v2 bridge delivers once per session, before that session's first event or system transform, because `opencode2 run` sends none for its own session |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `plugin-utilization/session-cleanup.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/plugins/session-cleanup.js` | Plugin entry: `event`, `experimental.chat.system.transform` and `dispose` |
| `plugin-utilization/run-plugin-scenario.sh` | Runs one live session per version and writes the evidence files |
| `plugin-utilization/capture-proxy.mjs` | Capture proxy that records each model request's system prompt |

---

## 5. SOURCE METADATA

- Group: Plugin Utilization
- Playbook ID: CO-045
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `plugin-utilization/session-cleanup.md`
