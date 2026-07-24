---
title: "CU-006 -- Default agent mode (write-capable)"
description: "This scenario validates Cursor's default write-capable agent mode for `CU-006`. It focuses on confirming a requested file is actually written to disk when no --mode flag is passed, in contrast to plan/ask mode's read-only behavior."
version: 1.0.0.0
---

# CU-006 -- Default agent mode (write-capable)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CU-006`.

---

## 1. OVERVIEW

This scenario validates the default agent mode (no `--mode` flag) for `CU-006`. It focuses on confirming a requested file is actually written to disk, in contrast to `CU-004`/`CU-005`'s proven read-only behavior for `--mode plan`/`--mode ask`.

### Why This Matters

Default agent mode is the write-capable baseline every code-generation delegation in this skill relies on. SKILL.md §3 "Execution Mode Roster" / `references/agent-delegation.md` §3 documents it as "Read-write, gated by `--auto-review`/`--force`/unflagged-prompt". This scenario is on the critical-path list (§5 of the root playbook): if the default agent mode silently stopped writing files, every generation-oriented delegation in this skill would regress without an obvious failure signal.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-006` and confirm the expected signals without contradictory evidence.

- Objective: Verify default agent mode (no `--mode` flag) writes a requested file to disk with exit code 0.
- Real user request: `Have Cursor write a tiny TypeScript hello-world function to a scratch file for me.`
- Prompt: `Generate /tmp/cli-cursor-playbook-cu006/hello.ts: a small TypeScript function that returns "hello world". Write the file.`
- Expected execution process: Operator confirms preconditions -> pre-cleans the target temp directory -> dispatches with no `--mode` flag, `--auto-review --sandbox enabled` -> inspects the written file on disk -> confirms the repo's own `git status --porcelain` stays clean (temp dir is outside git).
- Expected signals: `cursor-agent -p` exits 0. `/tmp/cli-cursor-playbook-cu006/hello.ts` exists and contains a working function returning `"hello world"`. `git status --porcelain` in the repo stays clean. The dispatched command line includes `--auto-review --sandbox enabled` and no `--mode` flag.
- Desired user-visible outcome: A real generated file the operator can inspect and run, proving default agent mode is genuinely write-capable where `--mode plan`/`--mode ask` are not.
- Pass/fail: PASS if exit code is 0 AND the file exists with correct content AND the repo's `git status --porcelain` stays clean. FAIL if the file is missing/incorrect, an unintended repo file changed, or exit code is non-zero.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain language: "Write a tiny TypeScript hello-world function to a scratch file."
2. Pre-clean `/tmp/cli-cursor-playbook-cu006/` and snapshot the repo's `git status --porcelain`.
3. Execute the dispatch with no `--mode` flag, `--auto-review --sandbox enabled`.
4. Inspect the written file for a working `hello world` function.
5. Re-snapshot the repo's `git status --porcelain` and confirm it is unchanged.
6. Return a PASS/FAIL verdict naming the file path and its contents.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-006 | Default agent mode (write-capable) | Verify default agent mode writes a requested file to disk with exit 0 | `Generate /tmp/cli-cursor-playbook-cu006/hello.ts: a small TypeScript function that returns "hello world". Write the file.` | 1. `bash: rm -rf /tmp/cli-cursor-playbook-cu006 && mkdir -p /tmp/cli-cursor-playbook-cu006 && git status --porcelain > /tmp/cli-cursor-cu006-pre.txt` -> 2. `cursor-agent -p "Generate /tmp/cli-cursor-playbook-cu006/hello.ts: a small TypeScript function that returns \"hello world\". Write the file." --model composer-2.5 --auto-review --sandbox enabled --output-format text </dev/null > /tmp/cli-cursor-cu006-stdout.txt 2>&1` -> 3. `bash: ls /tmp/cli-cursor-playbook-cu006/hello.ts && cat /tmp/cli-cursor-playbook-cu006/hello.ts` -> 4. `bash: grep -i "hello world" /tmp/cli-cursor-playbook-cu006/hello.ts` -> 5. `bash: git status --porcelain > /tmp/cli-cursor-cu006-post.txt && diff /tmp/cli-cursor-cu006-pre.txt /tmp/cli-cursor-cu006-post.txt` | Step 1: temp dir clean, pre-snapshot captured; Step 2: exit 0; Step 3: file exists with a TypeScript function; Step 4: file contains "hello world"; Step 5: no diff between pre/post repo snapshots | `hello.ts` file contents, dispatched stdout, exit code, pre/post `git status` snapshots | PASS if exit 0 AND the file exists with correct content AND the repo snapshot is unchanged AND the dispatched command has no `--mode` flag; FAIL if the file is missing/wrong, the repo snapshot differs, or exit is non-zero | (1) Re-run `command -v cursor-agent`; (2) confirm `--auto-review` was actually passed (an unapproved write could stall); (3) inspect stdout for an unhandled approval prompt |

### Optional Supplemental Checks

- Compile the generated file with `bash: npx tsc --noEmit --target ES2020 /tmp/cli-cursor-playbook-cu006/hello.ts` to confirm syntactic validity.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` (§3 Execution Mode Roster) | Documents default agent mode as read-write, gated by approval flags |
| `../../references/agent-delegation.md` (§3 Execution Mode Roster) | Authoritative execution-mode reference |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/agent-delegation.md` | §3 Execution Mode Roster - contrasts default agent mode against `--mode plan`/`--mode ask` |
| `../../references/cli-reference.md` | §4 `--auto-review`/`--sandbox` flag documentation |

---

## 5. SOURCE METADATA

- Group: Execution Modes
- Playbook ID: CU-006
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `execution-modes/default-agent-write-capable.md`
