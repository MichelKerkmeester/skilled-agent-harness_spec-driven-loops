---
title: "CO-042 -- codex-hooks-watchdog live utilization on OpenCode 2"
description: "This scenario validates codex-hooks-watchdog for `CO-042`. It focuses on confirming that a live session reports drifted user-global Codex hooks into the watchdog log on OpenCode 2."
version: 1.0.6.0
---

# CO-042 -- codex-hooks-watchdog live utilization on OpenCode 2

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-042`.

---

## 1. OVERVIEW

The `codex-hooks-watchdog` plugin runs the Codex hook installer in check mode on `session.created`. When the user-global Codex hooks drift from the repository, it appends `codex hook drift detected; run: node <installer> --check` to `.skilled/logs/codex-hooks-watchdog.log`.

### Why This Matters

Drifted Codex hooks are silent. The installer would fix them, but only if someone runs it. The watchdog turns that quiet drift into a log line at session start, so an operator sees it without remembering to check. If the plugin stops firing on session creation, the log stays empty and the drift is invisible again.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-042` and confirm the expected signals without contradictory evidence.

- Objective: Confirm that a live session with drifted Codex hooks appends `codex hook drift detected` to the watchdog log on OpenCode 2.
- Real user request: `My Codex hooks have drifted from the repository again. Does the watchdog notice that when a session starts, or do I have to remember to check?`
- Prompt: `Reply with the single word OK.`
- Expected execution process: Confirm drift with the installer in check mode, run the prompt through the scenario runner with `AI_SESSION_CHILD=1`, and read the new log line from each effects file.
- Expected signals: `effects.txt` shows a new `codex-hooks-watchdog.log` line containing `codex hook drift detected`.
- Evidence requirements: Capture the installer's check status before the runs and the effects file and exit status for the run.
- Desired user-visible outcome: A verdict naming the watchdog log line, or a SKIP, blocker: the installer check exits 0 on this machine, so there is no Codex hook drift for the plugin to report.
- Pass/fail: PASS if the log gains a `codex hook drift detected` line on the run. FAIL if the session runs and no line is written. SKIP, blocker: the installer check exits 0 on this machine, so there is no Codex hook drift for the plugin to report.
- Failure triage: Run `node .opencode/bin/install-codex-hooks.mjs --check; echo $?` first and confirm a non-zero status. If drift exists but no line is written, check whether the session delivered `session.created`; on OpenCode 2 the bridge delivers it once per session, before that session's first event or system transform, because `opencode run` sends none for its own session.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Setup: confirm drift exists with the installer check, and record its non-zero exit status.
2. Run: run the exact prompt through the scenario runner with `AI_SESSION_CHILD=1`.
3. Check: read `baseline.effects.txt` for a new `codex-hooks-watchdog.log` line.
4. Cleanup: none.

### Exact Command Sequence

```bash
export EVIDENCE_DIR="${EVIDENCE_DIR:-$(git rev-parse --show-toplevel)/.skilled/skills/.state/plugin-utilization}"
node .opencode/bin/install-codex-hooks.mjs --check; echo $?
AI_SESSION_CHILD=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh baseline "Reply with the single word OK."
grep -E 'codex hook drift detected' "$EVIDENCE_DIR/baseline.effects.txt"
cat "$EVIDENCE_DIR/baseline.exit"
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-042 | codex-hooks-watchdog live utilization on OpenCode 2 | Confirm a live session logs drifted Codex hooks on OpenCode 2 | `Reply with the single word OK.` | 1. `node .opencode/bin/install-codex-hooks.mjs --check; echo $?` returns non-zero -> 2. Run `baseline` -> 3. Grep the effects file | `codex-hooks-watchdog.log` gains a line containing `codex hook drift detected` | `baseline.txt`, and `deep-loop-guard.txt` for the subagent session observation | PASS if the line is written on the run; FAIL if the session runs and no line appears; SKIP, blocker: the installer check exits 0 on this machine, so there is no Codex hook drift for the plugin to report | Confirm the installer check is non-zero first, then check whether `session.created` was delivered |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `plugin-utilization/codex-hooks-watchdog.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/plugins/codex-hooks-watchdog.js` | Plugin entry: `session.created` runs the check and appends the log line |
| `.opencode/bin/install-codex-hooks.mjs --check` | Installer check mode the plugin runs |
| `plugin-utilization/run-plugin-scenario.sh` | Runs one live session and writes the evidence files |
| `plugin-utilization/capture-proxy.mjs` | Capture proxy that records each model request's system prompt |

---

## 5. SOURCE METADATA

- Group: Plugin Utilization
- Playbook ID: CO-042
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `plugin-utilization/codex-hooks-watchdog.md`
