---
title: "CU-004 -- Plan mode (read-only)"
description: "This scenario validates Cursor's read-only --mode plan for `CU-004`. It proves the mode and event stream are read-only without assuming that text output is a separate numbered-plan artifact."
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

- Objective: Verify `--mode plan` exits through the read-only planning path, emits inspectable stream events, and makes zero file writes even when the prompt phrasing implies action.
- Real user request: `Can Cursor plan out migrating our REST API to GraphQL, without touching any files yet?`
- Prompt: `Plan the migration from REST to GraphQL for this repo's API layer. Do not write any files - this is planning only.`
- Expected execution process: Operator confirms preconditions -> snapshots `git status --porcelain` -> dispatches with `--mode plan --model composer-2.5 --output-format stream-json --stream-partial-output` -> inspects the JSONL event records and any plan text exposed in their payloads -> re-snapshots `git status --porcelain` and confirms no diff.
- Expected signals: `cursor-agent --mode plan` exits 0; the captured output remains parseable as stream events; any emitted plan text is treated as evidence only when present in an event payload; `git status --porcelain` is identical before and after; the dispatched command line includes `--mode plan`.
- Desired user-visible outcome: Read-only planning evidence the operator can review before committing to any write-capable dispatch, with proof that plan mode is genuinely read-only regardless of prompt phrasing.
- Pass/fail: PASS if exit code is 0, the stream output contains valid event records, and `git status --porcelain` is unchanged. Do not fail solely because the event payload does not expose a separate numbered-plan artifact; FAIL if any file changes, the event stream is malformed, or exit code is non-zero.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain language: "Plan the REST-to-GraphQL migration, planning only, no writes."
2. Snapshot `git status --porcelain` before dispatch.
3. Execute the dispatch with `--mode plan --model composer-2.5 --output-format stream-json --stream-partial-output`.
4. Inspect the JSONL event records; inspect plan text only if the selected event payload exposes it.
5. Re-snapshot `git status --porcelain` and diff against the pre-snapshot.
6. Return a PASS/FAIL verdict naming the observed event evidence and confirming zero file changes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-004 | Plan mode (read-only) | Verify --mode plan is read-only and emits stream events | `Plan the migration from REST to GraphQL for this repo's API layer. Do not write any files - this is planning only.` | 1. `git status --porcelain > /private/tmp/cli-cursor-cu004-pre.txt` -> 2. `cursor-agent -p "Plan the migration from REST to GraphQL for this repo's API layer. Do not write any files - this is planning only." --mode plan --model composer-2.5 --output-format stream-json --stream-partial-output </dev/null > /private/tmp/cli-cursor-cu004.jsonl 2>&1; status=$?; printf 'exit=%s\n' "$status" >> /private/tmp/cli-cursor-cu004.jsonl` -> 3. `cat /private/tmp/cli-cursor-cu004.jsonl` and parse the JSONL event records -> 4. `git status --porcelain > /private/tmp/cli-cursor-cu004-post.txt && diff /private/tmp/cli-cursor-cu004-pre.txt /private/tmp/cli-cursor-cu004-post.txt` | Step 1: pre-snapshot captured; Step 2: exit `0` and stream output captured; Step 3: event records are inspectable, with plan text checked only if present in a payload; Step 4: no diff between pre/post snapshots | Captured JSONL events, pre/post `git status` snapshots, exit code, and dispatched command line | PASS if exit `0`, the stream contains valid event records, pre/post snapshots are identical, and the command includes `--mode plan`; do not fail because text output lacks a separate numbered-plan artifact; FAIL if any snapshot differs, the stream is malformed, or exit is non-zero | (1) Re-run `command -v cursor-agent`; (2) confirm `--mode plan` and `--output-format stream-json` were used; (3) inspect the diff if snapshots differ; (4) if plan text is absent, retain the event evidence rather than treating the missing text channel as a mode failure |

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
