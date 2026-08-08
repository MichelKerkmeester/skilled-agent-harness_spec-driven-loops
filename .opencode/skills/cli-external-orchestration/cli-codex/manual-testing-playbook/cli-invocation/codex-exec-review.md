---
title: "CX-003 -- codex exec review subcommand"
description: "This scenario validates the codex exec review subcommand for `CX-003`. It focuses on confirming diff-aware review of the current uncommitted git changes produces structured findings with exit 0."
version: 1.4.0.7
---

# CX-003 -- codex exec review subcommand

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-003`.

---

## 1. OVERVIEW

This scenario validates the `codex exec review` subcommand for `CX-003`. It focuses on confirming diff-aware review of the current uncommitted git changes produces structured findings categorized by domain (security, bugs, style, performance) with exit code 0 and no file modifications.

### Why This Matters

`codex exec review` is one of the documented Codex-exclusive features (`references/cli-reference.md` §4 Profile & Review Flags, `references/codex-tools.md` §2 /review). Validating that the diff-aware subcommand actually produces categorized findings is essential for any operator using Codex as a pre-commit gate.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CX-003` and confirm the expected signals without contradictory evidence.

- Objective: Verify `codex exec review` performs diff-aware review of a deterministic changed-line defect (or reports an explicit valid no-findings result) without modifying the tree.
- Real user request: `Run a Codex review on what I have uncommitted right now and tell me whether to commit it.`
- Prompt: `Run codex exec review on an uncommitted diff and report categorized findings or an explicit no-findings result, changed-line citations when present, exit code, and no file modifications.`
- Expected execution process: Operator creates a throwaway source file with a safe parser, commits it, changes one line to introduce a deterministic `eval` security defect, dispatches `codex exec review --uncommitted`, preserves the raw combined stdout/stderr, and confirms no files were modified.
- Expected signals: `codex exec review --uncommitted` exits 0 and the raw combined output is retained. The output either contains a categorized finding with a line number mapping to the changed defect or explicitly reports no findings. No files are modified.
- Desired user-visible outcome: A reviewer-quality summary of the staged or uncommitted diff that the operator can hand to a human reviewer or use as a pre-commit gate.
- Pass/fail: PASS if exit code 0, raw stdout/stderr is retained, and the output either has a categorized finding tied to the changed line or explicitly reports no findings, while `git status --porcelain` remains unchanged. FAIL if the command fails, the output is unclassifiable, or files are modified.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Stage or maintain a small uncommitted diff (e.g., add a marker line to a throwaway scratch file under git tracking).
2. Snapshot `git status --porcelain` before dispatch.
3. Run `codex exec review --uncommitted` with the model and fast-tier flags.
4. Inspect stdout for categorized findings and a real line reference.
5. Re-snapshot `git status --porcelain` and confirm no Codex-attributable changes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-003 | codex exec review subcommand | Verify diff-aware review of uncommitted changes returns a classified result with exit 0 | `Run codex exec review on an uncommitted diff and report categorized findings or an explicit no-findings result, changed-line citations when present, exit code, and no file modifications.` | 1. `bash: mkdir -p /tmp/cli-codex-cx003 && cd /tmp/cli-codex-cx003 && git init -q && git config core.hooksPath /dev/null && git config user.email t@example.invalid && git config user.name T && git config commit.gpgsign false && printf 'export function parse(input: string): unknown { return JSON.parse(input); }\n' > scratch.ts && git add scratch.ts && git commit -q -m init && printf 'export function parse(input: string): unknown { return eval(input); }\n' > scratch.ts` -> 2. `bash: cd /tmp/cli-codex-cx003 && git status --porcelain > /tmp/cli-codex-cx003-status-pre.txt` -> 3. `bash: cd /tmp/cli-codex-cx003 && codex exec review --uncommitted --model gpt-5.6-luna -c service_tier="fast" > /tmp/cli-codex-cx003.txt 2>&1` -> 4. `bash: cat /tmp/cli-codex-cx003.txt` -> 5. `bash: cd /tmp/cli-codex-cx003 && git status --porcelain > /tmp/cli-codex-cx003-status-post.txt && diff /tmp/cli-codex-cx003-status-pre.txt /tmp/cli-codex-cx003-status-post.txt` | Step 1: throwaway repo created with a deterministic changed-line security defect; Step 2: pre-snapshot captured; Step 3: exit 0; Step 4: raw output includes either a categorized finding tied to the changed `eval` line or an explicit no-findings result; Step 5: pre/post snapshots are identical | Captured stdout `/tmp/cli-codex-cx003.txt`, pre-status, post-status, dispatched command line, exit code | PASS if Steps 1-5 succeed, raw output is retained, the review reports a categorized finding tied to the changed line or an explicit no-findings result, AND post-status is identical to pre-status; FAIL if exit non-zero, the output is unclassifiable, or unexpected files appear in post-status | (1) Confirm `codex exec review --help` lists `--uncommitted`; (2) verify the throwaway repo has a real changed-line defect (`git diff` should show the `eval` line); (3) re-run with `2>&1 \| tee` to inline stderr |

### Optional Supplemental Checks

- Repeat with `--commit HEAD~1` (commit-comparison mode) once Step 1 has at least 2 commits and confirm the same categorical structure.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../references/cli-reference.md` (§4 Profile & Review Flags) | Documents the `exec review` subcommand and supported flags |
| `../../references/codex-tools.md` (§2 /review Command) | Documents diff-aware review semantics |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli-reference.md` | `exec review` subcommand reference |
| `../../references/codex-tools.md` | Built-in /review capability documentation |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: CX-003
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cli-invocation/codex-exec-review.md`
