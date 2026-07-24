---
title: "CU-008 -- --force/--yolo + --sandbox toggle"
description: "This scenario validates Cursor's --force/-f/--yolo unattended approval alias and the --sandbox enabled|disabled toggle for `CU-008`. It focuses on confirming both approval aliases behave identically and that --sandbox is an independent dimension from the approval decision."
version: 1.0.0.0
---

# CU-008 -- --force/--yolo + --sandbox toggle

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CU-008`.

---

## 1. OVERVIEW

This scenario validates `--force`/`-f`/`--yolo` ("Run Everything") and the `--sandbox enabled|disabled` toggle for `CU-008`. It focuses on confirming unattended "Run Everything" dispatch works with either sandbox setting, and that approval and OS-level sandbox are two independent dimensions.

### Why This Matters

SKILL.md's "Dispatch-Critical Gotchas" section is explicit: "`--auto-review`/`--force` are the write-capable escalation, not `--sandbox`." Conflating the two would lead an orchestrator to believe `--sandbox enabled` alone grants safe unattended writes, which it does not - the approval flag governs that, independently of the sandbox toggle.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-008` and confirm the expected signals without contradictory evidence.

- Objective: Verify `--force`/`--yolo` both auto-approve unattended, and that `--sandbox enabled|disabled` is accepted as an independent, orthogonal toggle.
- Real user request: `Just let Cursor run everything for this one and don't ask me anything.`
- Prompt: `Generate /tmp/cli-cursor-playbook-cu008/greet.ts: a small greet(name: string): string function. Write the file.`
- Expected execution process: Operator confirms preconditions -> pre-cleans the target temp directory -> dispatches once with `--force --sandbox disabled`, once with `--yolo --sandbox enabled` (a second, separately pre-cleaned target path) -> inspects both written files -> confirms both invocations were accepted without a CLI-level flag rejection.
- Expected signals: Both `cursor-agent -p ... --force --sandbox disabled </dev/null` and `cursor-agent -p ... --yolo --sandbox enabled </dev/null` exit 0 unattended. Both target files exist with a working `greet` function. Neither invocation is rejected as an unrecognized-flag combination.
- Desired user-visible outcome: Evidence that unattended "Run Everything" dispatch works with either sandbox setting, and that approval and OS-sandbox are two independent dimensions an operator can combine deliberately.
- Pass/fail: PASS if both invocations exit 0 unattended AND both files exist with correct content. FAIL if either invocation hangs, is rejected as an invalid flag combination, or either file is missing/incorrect.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain language: "Run everything unattended, no approval prompts."
2. Pre-clean both target temp directories (`cu008-force` and `cu008-yolo`).
3. Dispatch invocation 1 with `--force --sandbox disabled`.
4. Dispatch invocation 2 with `--yolo --sandbox enabled`.
5. Inspect both written files and both exit codes.
6. Return a PASS/FAIL verdict naming both flag combinations and their observed exit codes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-008 | --force/--yolo + --sandbox toggle | Verify --force/--yolo auto-approve unattended with either --sandbox setting | `Generate /tmp/cli-cursor-playbook-cu008/greet.ts: a small greet(name: string): string function. Write the file.` | 1. `bash: rm -rf /tmp/cli-cursor-playbook-cu008-force /tmp/cli-cursor-playbook-cu008-yolo && mkdir -p /tmp/cli-cursor-playbook-cu008-force /tmp/cli-cursor-playbook-cu008-yolo` -> 2. `bash: timeout 120 cursor-agent -p "Generate /tmp/cli-cursor-playbook-cu008-force/greet.ts: a small greet(name: string): string function. Write the file." --model auto --force --sandbox disabled --output-format text </dev/null > /tmp/cli-cursor-cu008-force.txt 2>&1; echo "exit=$?" >> /tmp/cli-cursor-cu008-force.txt` -> 3. `bash: timeout 120 cursor-agent -p "Generate /tmp/cli-cursor-playbook-cu008-yolo/greet.ts: a small greet(name: string): string function. Write the file." --model auto --yolo --sandbox enabled --output-format text </dev/null > /tmp/cli-cursor-cu008-yolo.txt 2>&1; echo "exit=$?" >> /tmp/cli-cursor-cu008-yolo.txt` -> 4. `bash: ls /tmp/cli-cursor-playbook-cu008-force/greet.ts /tmp/cli-cursor-playbook-cu008-yolo/greet.ts` -> 5. `bash: grep -i "greet" /tmp/cli-cursor-playbook-cu008-force/greet.ts /tmp/cli-cursor-playbook-cu008-yolo/greet.ts` | Step 1: both temp dirs clean; Step 2: exit `0`, no `timeout`-triggered `124`; Step 3: exit `0`, no `timeout`-triggered `124`; Step 4: both files exist; Step 5: both contain a `greet` function | Both dispatched stdout captures with recorded exit codes, both generated files | PASS if both invocations exit `0` unattended AND both files exist with correct content; FAIL if either invocation is rejected, hangs (`124`), or either file is missing/wrong | (1) Re-run with a longer timeout if genuinely slow rather than hung; (2) confirm `-f`/`--force` and `--yolo` are truly aliases per `references/cli-reference.md` (not a version-specific divergence); (3) inspect stdout for a CLI-level flag-rejection message |

### Optional Supplemental Checks

- Confirm `-f` (short form) behaves identically to `--force` by re-running invocation 1 with `-f` substituted for `--force`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` (Dispatch-Critical Gotchas) | Documents `--auto-review`/`--force` as the approval escalation, distinct from `--sandbox` |
| `../../references/cli-reference.md` (§4 Command-Line Flags) | Authoritative flag reference for `--force`/`-f`/`--yolo`/`--sandbox` |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli-reference.md` | §4 Essential Flags table |
| `../../SKILL.md` | Dispatch-Critical Gotchas - the approval-vs-sandbox distinction |

---

## 5. SOURCE METADATA

- Group: Approvals And Sandbox
- Playbook ID: CU-008
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `approvals-and-sandbox/force-yolo-sandbox-toggle.md`
