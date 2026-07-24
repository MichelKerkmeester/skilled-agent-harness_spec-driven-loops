---
title: "CU-005 -- Ask mode (read-only)"
description: "This scenario validates Cursor's read-only --mode ask for `CU-005`. It focuses on confirming Q&A/explanation dispatches answer accurately against real repo content without any file writes."
version: 1.0.0.0
---

# CU-005 -- Ask mode (read-only)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CU-005`.

---

## 1. OVERVIEW

This scenario validates `--mode ask` for `CU-005`. It focuses on confirming Q&A/architecture-explanation dispatches answer accurately against real repo content, with zero file writes.

### Why This Matters

`--mode ask` is Cursor's dedicated read-only Q&A surface, distinct from `--mode plan`'s multi-step planning focus. SKILL.md §3 "Task Type Routing" recommends `--mode ask` for "Read-only exploration / architecture questions". This scenario proves the mode both refuses to write AND produces a correct, grounded answer - not just an empty read-only no-op.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-005` and confirm the expected signals without contradictory evidence.

- Objective: Verify `--mode ask` answers a real architecture question correctly, with zero file writes.
- Real user request: `Can you explain how cli-cursor's self-invocation guard actually detects that it's running inside Cursor CLI?`
- Prompt: `Explain how the self-invocation guard works in cli-cursor/SKILL.md §2 - what signals does it check and in what order?`
- Expected execution process: Operator confirms preconditions -> snapshots `git status --porcelain` -> dispatches with `--mode ask --model composer-2.5` -> inspects the answer for the correct env-var/ancestry/state-probe layering -> re-snapshots `git status --porcelain` and confirms no diff.
- Expected signals: `cursor-agent --mode ask` exits 0. Output correctly names the `CURSOR_AGENT`/`CURSOR_CONVERSATION_ID` env-var check as the first layer, process ancestry as the second, and the weaker state-probe as the third (per SKILL.md §2). `git status --porcelain` is identical before and after. The dispatched command line includes `--mode ask`.
- Desired user-visible outcome: An accurate explanation of real repo content, demonstrating `--mode ask` as a genuine read-only Q&A surface rather than a generic chatbot answer disconnected from the actual codebase.
- Pass/fail: PASS if exit code is 0 AND the answer correctly describes the 3-layer guard AND `git status --porcelain` is unchanged. FAIL if the explanation is factually wrong about the guard's layering, any file changes, or exit code is non-zero.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain language: "Explain how the self-invocation guard detects Cursor CLI."
2. Snapshot `git status --porcelain` before dispatch.
3. Execute the dispatch with `--mode ask --model composer-2.5`.
4. Inspect the answer against SKILL.md §2's actual guard code.
5. Re-snapshot `git status --porcelain` and diff against the pre-snapshot.
6. Return a PASS/FAIL verdict naming the layers the answer correctly identified.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-005 | Ask mode (read-only) | Verify --mode ask answers a real architecture question with zero file writes | `Explain how the self-invocation guard works in cli-cursor/SKILL.md §2 - what signals does it check and in what order?` | 1. `bash: git status --porcelain > /tmp/cli-cursor-cu005-pre.txt` -> 2. `cursor-agent -p "Explain how the self-invocation guard works in cli-cursor/SKILL.md section 2 - what signals does it check and in what order?" --mode ask --model composer-2.5 --output-format text </dev/null > /tmp/cli-cursor-cu005.txt 2>&1` -> 3. `bash: cat /tmp/cli-cursor-cu005.txt` -> 4. `bash: grep -iE "CURSOR_AGENT\|CURSOR_CONVERSATION_ID\|ancestry\|process" /tmp/cli-cursor-cu005.txt` -> 5. `bash: git status --porcelain > /tmp/cli-cursor-cu005-post.txt && diff /tmp/cli-cursor-cu005-pre.txt /tmp/cli-cursor-cu005-post.txt` | Step 1: pre-snapshot captured; Step 2: exit 0; Step 3: answer text present; Step 4: answer names the env-var and ancestry signals; Step 5: no diff between pre/post snapshots | Captured stdout, pre/post `git status` snapshots, exit code, dispatched command line | PASS if exit 0 AND the answer correctly identifies the env-var-then-ancestry-then-state-probe layering AND snapshots are identical; FAIL if the explanation misrepresents the guard, any file changes, or exit is non-zero | (1) Re-run `command -v cursor-agent`; (2) confirm `--mode ask` (not default agent mode) was used; (3) re-read SKILL.md §2 directly to compare against the returned answer |

### Optional Supplemental Checks

- Ask a second, unrelated read-only question in the same dispatch to confirm `--mode ask` generalizes beyond this one scripted question.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` (§2 Self-Invocation Guard, §3 Task Type Routing) | Ground-truth guard logic this scenario's answer is checked against |
| `../../references/agent-delegation.md` (§3 Execution Mode Roster) | Authoritative execution-mode reference |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §2 Self-Invocation Guard code block - the ground truth the ask-mode answer is validated against |
| `../../references/agent-delegation.md` | §4 Task-Type Routing Table |

---

## 5. SOURCE METADATA

- Group: Execution Modes
- Playbook ID: CU-005
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `execution-modes/ask-mode-read-only.md`
