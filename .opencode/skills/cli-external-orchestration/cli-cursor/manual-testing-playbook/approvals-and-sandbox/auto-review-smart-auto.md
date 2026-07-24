---
title: "CU-007 -- --auto-review Smart Auto"
description: "This scenario validates Cursor's --auto-review Smart Auto approval flag for `CU-007`. It focuses on confirming a safe write-capable generation task completes unattended, without an interactive approval prompt blocking completion."
version: 1.0.0.0
---

# CU-007 -- --auto-review Smart Auto

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CU-007`.

---

## 1. OVERVIEW

This scenario validates `--auto-review` ("Smart Auto") for `CU-007`. It focuses on confirming the server-side classifier auto-runs a safe write-capable generation task unattended, without an interactive approval prompt blocking completion.

### Why This Matters

`--auto-review` is the skill's documented default approval mode (SKILL.md §3 "Default Invocation") - it is not Codex's 3-tier sandbox nor Devin's 4-mode permission enum, it is Cursor's own real flag. Getting this scenario wrong would mean the skill's actual default dispatch behavior is unverified.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-007` and confirm the expected signals without contradictory evidence.

- Objective: Verify `--auto-review` auto-runs a safe write-capable generation task unattended, with exit code 0 and no operator intervention required.
- Real user request: `Have Cursor add a small clamp utility function to a scratch file, and don't make me approve every step.`
- Prompt: `Generate /tmp/cli-cursor-playbook-cu007/util.ts: a small clamp(n, min, max) utility function. Write the file.`
- Expected execution process: Operator confirms preconditions -> pre-cleans the target temp directory -> dispatches with `--auto-review --sandbox enabled` and no manual approval available (redirect stdin from `/dev/null`) -> inspects the written file -> confirms no unattended-approval-prompt stall occurred (the process exits, rather than hanging on a `y/n` prompt with no stdin to answer it).
- Expected signals: `cursor-agent -p ... --auto-review --sandbox enabled </dev/null` exits 0 within a bounded time (no hang). `/tmp/cli-cursor-playbook-cu007/util.ts` exists and contains a working `clamp` function. The dispatched command line includes `--auto-review`.
- Desired user-visible outcome: An unattended, successful generation that demonstrates Smart Auto's auto-run-safe-calls behavior for a typical delegation, distinct from the unattended-but-blunter `--force`/`--yolo` covered in `CU-008`.
- Pass/fail: PASS if exit code is 0 AND the file exists with a working `clamp` function AND the dispatch completed without hanging. FAIL if the process hangs (stdin-starved approval prompt), the file is missing/incorrect, or exit code is non-zero.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain language: "Add a clamp utility function to a scratch file, no manual approval steps."
2. Pre-clean `/tmp/cli-cursor-playbook-cu007/`.
3. Execute the dispatch with `--auto-review --sandbox enabled </dev/null` and a bounded timeout.
4. Inspect the written file for a working `clamp` function.
5. Confirm the dispatch completed within the timeout (no stdin-starved hang).
6. Return a PASS/FAIL verdict naming the file path and the observed completion time.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-007 | --auto-review Smart Auto | Verify --auto-review auto-runs a safe generation task unattended with exit 0 | `Generate /tmp/cli-cursor-playbook-cu007/util.ts: a small clamp(n, min, max) utility function. Write the file.` | 1. `bash: rm -rf /tmp/cli-cursor-playbook-cu007 && mkdir -p /tmp/cli-cursor-playbook-cu007` -> 2. `bash: timeout 120 cursor-agent -p "Generate /tmp/cli-cursor-playbook-cu007/util.ts: a small clamp(n, min, max) utility function. Write the file." --model auto --auto-review --sandbox enabled --output-format text </dev/null > /tmp/cli-cursor-cu007-stdout.txt 2>&1; echo "exit=$?" >> /tmp/cli-cursor-cu007-stdout.txt` -> 3. `bash: cat /tmp/cli-cursor-cu007-stdout.txt` -> 4. `bash: ls /tmp/cli-cursor-playbook-cu007/util.ts && grep -i "clamp" /tmp/cli-cursor-playbook-cu007/util.ts` | Step 1: temp dir clean; Step 2: `timeout` does not trip (exit is not `124`), real exit code recorded is `0`; Step 3: no unhandled approval-prompt text hanging the transcript; Step 4: `util.ts` exists with a `clamp` function | `util.ts` contents, dispatched stdout with recorded exit code, completion time observed against the 120s bound | PASS if exit is `0` (not `124` from `timeout`) AND the file exists with a working `clamp` function AND the dispatched command includes `--auto-review`; FAIL if `timeout` trips (`124`), the file is missing/wrong, or exit is otherwise non-zero | (1) Re-run with a longer timeout bound if the task is genuinely slow rather than hung; (2) inspect stdout for an approval-prompt string suggesting Smart Auto did not auto-classify the write as safe; (3) confirm `</dev/null` was actually applied |

### Optional Supplemental Checks

- Re-run the same prompt with `--force`/`--yolo` (see `CU-008`) against a separate isolated temp path and compare completion time/behavior.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` (§3 Default Invocation, §4 ALWAYS rule 6) | Documents `--auto-review` as the default approval mode and the `/dev/null` stdin convention |
| `../../references/cli-reference.md` (§4 Command-Line Flags) | Authoritative flag reference |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli-reference.md` | §4 `--auto-review`/`--sandbox` flag documentation |
| `../../SKILL.md` | §4 ALWAYS rule 6 - non-TTY stdin redirection convention |

---

## 5. SOURCE METADATA

- Group: Approvals And Sandbox
- Playbook ID: CU-007
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `approvals-and-sandbox/auto-review-smart-auto.md`
