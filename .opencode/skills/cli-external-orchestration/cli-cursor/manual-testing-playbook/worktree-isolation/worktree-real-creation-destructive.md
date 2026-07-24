---
title: "CU-010 -- Real worktree creation (DESTRUCTIVE, opt-in)"
description: "This scenario validates a real Cursor-native worktree creation for `CU-010`. It focuses on confirming -w genuinely materializes an isolated checkout at the documented path, with mandatory operator approval and cleanup."
version: 1.0.0.0
---

# CU-010 -- Real worktree creation **(DESTRUCTIVE, opt-in)**

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CU-010`.

> **DESTRUCTIVE / OPT-IN**: This scenario creates a real git worktree under `~/.cursor/worktrees/`, outside this repo's own `sk-git` numbered-worktree discipline. It MUST run only with explicit operator approval captured BEFORE dispatch, and MUST be cleaned up afterward. The default verdict for this scenario in a routine playbook run is `SKIP` unless the operator explicitly authorizes it this run.

---

## 1. OVERVIEW

This scenario validates real Cursor-native worktree creation for `CU-010`, extending `CU-009`'s dry-run/inspection default. It focuses on confirming `-w <name>` genuinely materializes an isolated checkout at `~/.cursor/worktrees/<reponame>/<name>`, and that the created worktree can be cleanly torn down afterward.

### Why This Matters

`CU-009` only proves the flag surface exists; it does not prove the isolation actually works end to end. This scenario closes that gap for operators who explicitly want the stronger guarantee, while respecting the packet's resolved Open Question that real worktree creation is opt-in, not the default execution path - because it creates real on-disk state outside this repo's own `sk-git` worktree discipline and could double-isolate if run carelessly inside a deep-loop fan-out lineage.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-010` and confirm the expected signals without contradictory evidence.

- Objective: Verify `-w <name>` creates a real, isolated git worktree at the documented path, and that it can be fully cleaned up afterward.
- Real user request: `I'm okay with actually creating a disposable Cursor worktree for this one test - go ahead.` (Real user must say something equivalent BEFORE dispatch, or this scenario defaults to SKIP.)
- Prompt: `With explicit operator approval, create a real Cursor-native worktree named cu010-probe using -w, confirm it exists at ~/.cursor/worktrees/<repo>/cu010-probe, then remove it.`
- Expected execution process: Operator captures explicit approval as a written acknowledgement -> snapshots `~/.cursor/worktrees/` -> dispatches with `-w cu010-probe --mode ask --model composer-2.5` (ask mode minimizes footprint inside the new worktree itself) -> confirms the worktree directory exists -> tears it down via `git worktree remove`/manual cleanup -> re-snapshots `~/.cursor/worktrees/` to confirm no residue remains.
- Expected signals: Operator approval recorded BEFORE dispatch. `cursor-agent -p ... -w cu010-probe --mode ask --model composer-2.5` exits 0. `~/.cursor/worktrees/<repo>/cu010-probe` exists immediately after dispatch. After cleanup, `git worktree list` no longer shows the entry and the directory is removed.
- Desired user-visible outcome: Proof the native worktree flag genuinely creates an isolated checkout, with a clean teardown leaving no residual state - or, absent operator approval this run, an honest `SKIP` with the blocker named.
- Pass/fail: PASS if approval was captured BEFORE dispatch AND the worktree directory materializes AND cleanup fully removes it. SKIP if the operator does not authorize live creation this run (name the blocker: "operator approval not granted"). FAIL if the worktree fails to materialize, or if cleanup leaves residual state behind.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Capture explicit operator approval text in `/tmp/cli-cursor-cu010-approval.txt` BEFORE any dispatch. If approval is not given, record `SKIP` and stop here.
2. Snapshot `~/.cursor/worktrees/` and `git worktree list`.
3. Dispatch with `-w cu010-probe --mode ask --model composer-2.5`.
4. Confirm the new worktree directory exists.
5. Remove the worktree (`git worktree remove` from inside the main checkout, or manual directory removal plus `git worktree prune` if Cursor does not register it as a standard git worktree entry) and re-snapshot to confirm no residue.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-010 | Real worktree creation **(DESTRUCTIVE, opt-in)** | Verify -w creates a real, isolated worktree and can be fully cleaned up | `With explicit operator approval, create a real Cursor-native worktree named cu010-probe using -w, confirm it exists at ~/.cursor/worktrees/<repo>/cu010-probe, then remove it.` | 1. `bash: printf 'USER APPROVAL: I authorize the cli-cursor CU-010 manual playbook scenario to create a real Cursor worktree named cu010-probe. %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > /tmp/cli-cursor-cu010-approval.txt` -> 2. `bash: ls ~/.cursor/worktrees/ 2>/dev/null > /tmp/cli-cursor-cu010-pre.txt; git worktree list > /tmp/cli-cursor-cu010-gwl-pre.txt` -> 3. `cursor-agent -p "Confirm you are running and report your working directory." -w cu010-probe --mode ask --model composer-2.5 --output-format text </dev/null > /tmp/cli-cursor-cu010-stdout.txt 2>&1` -> 4. `bash: ls -d ~/.cursor/worktrees/*/cu010-probe 2>/dev/null` -> 5. `bash: rm -rf ~/.cursor/worktrees/*/cu010-probe && git worktree prune && ls ~/.cursor/worktrees/ 2>/dev/null > /tmp/cli-cursor-cu010-post.txt; diff /tmp/cli-cursor-cu010-pre.txt /tmp/cli-cursor-cu010-post.txt` | Step 1: approval file exists with timestamp; Step 2: pre-snapshots captured; Step 3: exit 0; Step 4: worktree directory found; Step 5: post-snapshot matches pre-snapshot (residue removed) | Approval transcript, pre/post `~/.cursor/worktrees/` and `git worktree list` snapshots, dispatched stdout, exit code | PASS if approval recorded BEFORE dispatch AND the worktree directory is confirmed to exist AND cleanup restores the pre-snapshot state; SKIP if approval was never granted this run; FAIL if the worktree never materializes, or if residue remains after cleanup | (1) Confirm `/tmp/cli-cursor-cu010-approval.txt` exists and is timestamped before treating this as anything but SKIP; (2) if the directory doesn't appear, re-check the repo name segment in the path; (3) if cleanup leaves residue, manually run `git worktree prune` and re-verify |

### Optional Supplemental Checks

- Repeat with `--worktree-base <branch>` to confirm the new worktree is based on the specified ref rather than the current `HEAD`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary. Root §5 marks this scenario destructive/opt-in |
| `../../SKILL.md` (§4 NEVER rule 1) | Forbids passing `-w` from orchestrated fan-out without explicit user approval |
| `../../references/cursor-tools.md` (§2 Native Git Worktree Isolation) | Documents the worktree path shape and the sk-git interaction caveat |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §4 NEVER rule 1 - approval requirement for `-w` |
| `../../references/cursor-tools.md` | §2 "When an Operator Might Use It Directly" - example invocation shape |

---

## 5. SOURCE METADATA

- Group: Worktree Isolation
- Playbook ID: CU-010
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `worktree-isolation/worktree-real-creation-destructive.md`
