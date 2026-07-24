---
title: "CU-004 -- Plan mode (read-only)"
description: "This scenario validates Cursor's read-only --mode plan for `CU-004`. It focuses on confirming multi-step planning happens without any file writes, and that approval flags have no effect since nothing is written."
version: 1.0.0.0
---

# CU-004 -- Plan mode (read-only)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CU-004`.

---

## 1. OVERVIEW

This scenario validates `--mode plan` (shorthand `--plan`) for `CU-004`. It focuses on confirming multi-step planning happens without any file writes, and that approval flags (`--auto-review`/`--force`) have no effect in this mode.

### Why This Matters

`--mode plan` is one of Cursor's genuinely unique surfaces - no sibling CLI in this hub ships a read-only planning mode in this shape. SKILL.md §3 "Execution Mode Roster" and `references/agent-delegation.md` §3 both document it as read-only regardless of approval flags. This scenario is on the critical-path list (§5 of the root playbook) because it is the load-bearing proof that plan mode genuinely cannot write, which every downstream "safe to explore first" recommendation in this skill depends on.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-004` and confirm the expected signals without contradictory evidence.

- Objective: Verify `--mode plan` produces a multi-step plan with zero file writes, even when the prompt phrasing implies action.
- Real user request: `Can Cursor plan out migrating our REST API to GraphQL, without touching any files yet?`
- Prompt: `Plan the migration from REST to GraphQL for this repo's API layer. Do not write any files - this is planning only.`
- Expected execution process: Operator confirms preconditions -> snapshots `git status --porcelain` -> dispatches with `--mode plan --model composer-2.5` -> inspects the plan output -> re-snapshots `git status --porcelain` and confirms no diff.
- Expected signals: `cursor-agent --mode plan` exits 0. Output contains a numbered, multi-step migration plan (at minimum: schema/type mapping, resolver design, and a cutover step). `git status --porcelain` is identical before and after. The dispatched command line includes `--mode plan`.
- Desired user-visible outcome: A usable migration plan the operator can review before committing to any write-capable dispatch, with proof that plan mode is genuinely read-only regardless of prompt phrasing.
- Pass/fail: PASS if exit code is 0 AND the output contains a coherent multi-step plan AND `git status --porcelain` is unchanged. FAIL if any file changes, the plan is incoherent, or exit code is non-zero.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain language: "Plan the REST-to-GraphQL migration, planning only, no writes."
2. Snapshot `git status --porcelain` before dispatch.
3. Execute the dispatch with `--mode plan --model composer-2.5`.
4. Inspect the plan for coherent, numbered steps.
5. Re-snapshot `git status --porcelain` and diff against the pre-snapshot.
6. Return a PASS/FAIL verdict naming the number of plan steps and confirming zero file changes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-004 | Plan mode (read-only) | Verify --mode plan produces a multi-step plan with zero file writes | `Plan the migration from REST to GraphQL for this repo's API layer. Do not write any files - this is planning only.` | 1. `bash: git status --porcelain > /tmp/cli-cursor-cu004-pre.txt` -> 2. `cursor-agent -p "Plan the migration from REST to GraphQL for this repo's API layer. Do not write any files - this is planning only." --mode plan --model composer-2.5 --output-format text </dev/null > /tmp/cli-cursor-cu004.txt 2>&1` -> 3. `bash: cat /tmp/cli-cursor-cu004.txt` -> 4. `bash: git status --porcelain > /tmp/cli-cursor-cu004-post.txt && diff /tmp/cli-cursor-cu004-pre.txt /tmp/cli-cursor-cu004-post.txt` | Step 1: pre-snapshot captured; Step 2: exit 0; Step 3: output contains a numbered multi-step plan; Step 4: no diff between pre/post snapshots | Captured stdout, pre/post `git status` snapshots, exit code, dispatched command line | PASS if exit 0 AND the plan is coherent AND pre/post snapshots are identical AND the dispatched command includes `--mode plan`; FAIL if any snapshot differs, the plan is missing/incoherent, or exit is non-zero | (1) Re-run `command -v cursor-agent`; (2) confirm `--mode plan` (not `--mode ask`) was actually used in the dispatched line; (3) inspect the diff output if snapshots differ to identify the unexpected write |

### Optional Supplemental Checks

- Re-run the same prompt with default agent mode (no `--mode` flag) in a separate isolated scratch directory to contrast the write-capable behavior against this scenario's read-only result (do not run this against the live repo).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` (§3 Execution Mode Roster / Cursor Agent Delegation) | Documents `--mode plan` as read-only |
| `../../references/agent-delegation.md` (§3 Execution Mode Roster) | Authoritative execution-mode reference |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/agent-delegation.md` | §3 Execution Mode Roster - read/write column for each mode |
| `../../references/cli-reference.md` | §4 `--mode` flag documentation |

---

## 5. SOURCE METADATA

- Group: Execution Modes
- Playbook ID: CU-004
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `execution-modes/plan-mode-read-only.md`
