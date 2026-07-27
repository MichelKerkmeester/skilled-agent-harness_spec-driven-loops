---
title: "DV-007 -- Confirmed hook events smoke matrix"
description: "Exercise an isolated Devin hook configuration and verify the six lifecycle events confirmed to fire under devin -p."
version: 1.0.0.0
---

# DV-007 -- Confirmed hook events smoke matrix

This document captures the realistic user-testing contract, execution flow, source anchors, and validation criteria for `DV-007`.

## 1. OVERVIEW

Verify delivery of `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop`, and `SessionEnd` under a real `devin -p` session. The configuration and probe log are isolated from the repository's live `.devin/hooks.v1.json`.

### Why This Matters

Hook registration is a lifecycle contract. A command can return a good answer while a guard event silently fails to run, so the evidence must come from the event log rather than the model response alone.

## 2. SCENARIO CONTRACT

- Objective: Confirm all six observed-live events fire in one or more print sessions.
- Real user request: `Run a harmless task and prove which Devin lifecycle hooks actually fire.`
- Prompt: `In this isolated test workspace, read the marker file, create a second marker file containing hook-test, and report completion. Do not access the parent repository.`
- Expected execution process: Create a temporary workspace with a top-level-event-key `.devin/hooks.v1.json` probe configuration; run `devin -p` with `bypass` so the write can complete; inspect the probe log.
- Expected signals: The log records `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop`, and `SessionEnd`, with event payloads and timestamps.
- Desired user-visible outcome: A current six-event delivery matrix, independent of old wrapper-schema results.
- Pass/fail: PASS when all six events are observed; FAIL when a confirmed-live event is absent or the configuration shape is wrong; SKIP when auth or the binary blocks execution.

## 3. TEST EXECUTION

1. `DV007_DIR=$(mktemp -d /tmp/cli-devin-dv007.XXXXXX); mkdir -p "$DV007_DIR/.devin"`
2. Populate only that directory's `.devin/hooks.v1.json` with probe commands using the verified top-level event-key/array schema; do not edit the repository config.
3. `cd "$DV007_DIR" && printf 'input\n' > marker.txt && devin -p "In this isolated test workspace, read marker.txt, create second-marker.txt containing hook-test, and report completion. Do not access the parent repository." --model adaptive --permission-mode bypass </dev/null > stdout.txt 2>&1; echo "exit=$?" >> stdout.txt`
4. Inspect `probe.log` and correlate events by session id.

| Feature ID | Exact command | Expected signal | Verdict |
|---|---|---|---|
| DV-007 | Isolated `devin -p ... --permission-mode bypass` | Six event names present in probe log | PASS/FAIL/SKIP |

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
