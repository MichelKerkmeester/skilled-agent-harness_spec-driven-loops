---
title: "DV-007 -- Confirmed hook events smoke matrix"
description: "Exercise an isolated Devin hook configuration and verify the five lifecycle events currently reachable under devin -p; keep SessionEnd as an interactive-only supplemental check."
version: 1.0.0.0
---

# DV-007 -- Confirmed hook events smoke matrix

This document captures the realistic user-testing contract, execution flow, source anchors, and validation criteria for `DV-007`.

## 1. OVERVIEW

Verify delivery of `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, and `Stop` under a real `devin -p` session. `SessionEnd` is an interactive-only supplemental check, not a print-mode expectation. The configuration and probe log are isolated from the repository's live `.devin/hooks.v1.json`.

### Why This Matters

Hook registration is a lifecycle contract. A command can return a good answer while a guard event silently fails to run, so the evidence must come from the event log rather than the model response alone.

## 2. SCENARIO CONTRACT

- Objective: Confirm the five print-reachable events fire in an isolated `devin -p` session and record `SessionEnd` separately when an interactive session makes it observable.
- Real user request: `Run a harmless task and prove which Devin lifecycle hooks actually fire.`
- Prompt: `In this isolated test workspace, read the marker file, create a second marker file containing hook-test, and report completion. Do not access the parent repository.`
- Expected execution process: Create a temporary workspace with a top-level-event-key `.devin/hooks.v1.json` probe configuration; run `devin -p --permission-mode dangerous` so the write can complete; inspect the probe log; keep any interactive `SessionEnd` check separate.
- Expected signals: The print-mode log records `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, and `Stop`, with event payloads and timestamps. It does not need to contain `SessionEnd`.
- Desired user-visible outcome: A current five-event print-mode delivery matrix, with a separately labeled interactive `SessionEnd` observation when available.
- Pass/fail: PASS when all five print-reachable events are observed; record `SKIP: SessionEnd is not print-reachable; an interactive session is required` for the supplemental event when it is not run; FAIL when a confirmed print-mode event is absent or the configuration shape is wrong; SKIP when auth or the binary blocks execution.

## 3. TEST EXECUTION

### Exact Command Sequence

1. `DV007_DIR=$(mktemp -d /private/tmp/cli-devin-dv007.XXXXXX); mkdir -p "$DV007_DIR/.devin"; DV007_DIR="$DV007_DIR" node -e 'const fs=require("fs");const p=process.env.HOME+"/.local/share/devin/cli/trusted_workspaces.json";const c=JSON.parse(fs.readFileSync(p,"utf8"));const d=process.env.DV007_DIR;if(!c.trusted_paths.includes(d)){c.trusted_paths.push(d);fs.writeFileSync(p,JSON.stringify(c,null,2));}'`  (Devin 3000.x refuses an untrusted workspace headlessly; adding the disposable fixture to the trusted-workspace store lets the print-event probe run without an interactive trust prompt)
2. Populate only that directory's `.devin/hooks.v1.json` with probe commands using the verified top-level event-key/array schema; do not edit the repository config.
3. `cd "$DV007_DIR" && printf 'input\n' > marker.txt && devin -p --model adaptive --permission-mode dangerous -- "In this isolated test workspace, read marker.txt, create second-marker.txt containing hook-test, and report completion. Do not access the parent repository." </dev/null > stdout.txt 2>&1; status=$?; printf 'exit=%s\n' "$status" >> stdout.txt`
4. Inspect `probe.log` and correlate events by session id.
5. If an interactive session is intentionally run, inspect `SessionEnd` separately; otherwise record `SKIP: SessionEnd is not print-reachable; an interactive session is required`.

### Evidence

- Isolated hook configuration, probe log, event payloads, session id, stdout/stderr, and exit code.

### Failure Triage

- If one of the five print events is absent, verify the top-level event-key/array schema and inspect the event-specific payload before changing the hook.
- Do not classify missing `SessionEnd` in print mode as a hook failure; run the interactive supplemental check or record its named SKIP.
- Use `dangerous` as the canonical write mode; retain `bypass` only as a CLI alias if the runtime reports it.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DV-007 | Confirmed hook events smoke matrix | Verify five print-reachable hook events and separate SessionEnd | `In this isolated test workspace, read marker.txt, create second-marker.txt containing hook-test, and report completion. Do not access the parent repository.` | Isolated `.devin/hooks.v1.json` -> `devin -p --model adaptive --permission-mode dangerous -- "..."` -> inspect `probe.log`; interactive SessionEnd is supplemental | `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, and `Stop` are present; `SessionEnd` is not required in print mode | Probe log, event payloads, session id, stdout/stderr, exit code | PASS for all five print events; SKIP with the named interactive-only blocker for SessionEnd when not run; FAIL for a missing print-reachable event or invalid schema | Separate print reachability from interactive lifecycle; verify the canonical permission mode and event registration |

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Isolated-config rule and event matrix |
| `../../feature-catalog/hooks/` | No catalog entry yet; phase 010 is not present in this packet |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../../../specs/cli-external-orchestration/029-cli-devin-revival/008-devin-hook-parity/implementation-summary.md` | Corrected-schema live event evidence |
| `../../../../specs/cli-external-orchestration/029-cli-devin-revival/004-devin-hook-adapter-layer/implementation-summary.md` | Adapter registration precedent |
| `../../SKILL.md` | Devin self-invocation and dispatch rules |

## 5. SOURCE METADATA

- Group: Hooks
- Playbook ID: DV-007
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hooks/confirmed-events-smoke-matrix.md`
