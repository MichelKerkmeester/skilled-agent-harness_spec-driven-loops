---
title: "DV-014 -- devin --continue (resume last)"
description: "This scenario validates that devin --continue resumes the most recent session and carries forward context from the previous turn."
---

# DV-014 -- devin --continue (resume last)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DV-014`.

---

## 1. OVERVIEW

This scenario validates `devin --continue` (alias `-c`) for `DV-014`. The flag resumes the most recent Devin session and carries forward context — types defined in turn 1 are usable in turn 2 without re-introduction.

### Why This Matters

Session continuity is one of cli-devin's three documented continuity surfaces (alongside `--resume <id>` and `devin list`). Without `--continue`, multi-turn workflows would require explicit session-id capture on every step. The flag is the lowest-friction continuity surface.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `devin --continue` resumes the most recent session and that the new turn references context from the previous turn.
- Real user request: `Sketch a User type now, then in a follow-up turn write the validator for it — and don't make me re-paste the type.`
- Prompt: `Dispatch a 2-turn task: turn 1 sketches a TypeScript type, turn 2 implements a validator via --continue. Confirm turn 2 references the turn-1 type by name.`
- Expected execution process: Operator dispatches turn 1 with a User-type sketch -> captures session state -> dispatches turn 2 with `--continue` asking for a validator -> verifies turn 2 output references the User type by name from turn 1.
- Expected signals: Both invocations exit 0. Turn 2 stdout names the type introduced in turn 1 (without the operator re-pasting it). Dispatch lines reflect the `--continue` flag on turn 2.
- Desired user-visible outcome: A working two-turn task plus evidence that `--continue` preserved type definitions across dispatches.
- Pass/fail: PASS if both exit 0 AND turn 2 references the User type from turn 1 without re-introduction. FAIL otherwise.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Dispatch turn 1: sketch a TypeScript `User` type with id, name, email fields.
2. Capture turn 1 output.
3. Dispatch turn 2 with `--continue`: ask for a `validateUser` function using the type from turn 1.
4. Verify turn 2 output references `User` by name and includes the validator.
5. Return a PASS/FAIL verdict naming the continuity evidence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DV-014 | `devin --continue` (resume last) | Verify --continue resumes most recent session and preserves context | `Dispatch a 2-turn task: turn 1 sketches a TypeScript type, turn 2 implements a validator via --continue. Confirm turn 2 references the turn-1 type by name.` | 1. `devin "Sketch a TypeScript User type with id (string), name (string), email (string) fields." --model swe-1.6 --permission-mode auto > /tmp/dv-014-turn1.txt 2>&1 </dev/null; echo "T1 exit: $?"` -> 2. `bash: cat /tmp/dv-014-turn1.txt` -> 3. `devin --continue "Now write a validateUser(u) function that returns true when all User fields are non-empty strings and email contains @." --model swe-1.6 --permission-mode auto > /tmp/dv-014-turn2.txt 2>&1 </dev/null; echo "T2 exit: $?"` -> 4. `bash: grep -E "User\|validateUser" /tmp/dv-014-turn2.txt` | Steps 1 and 3: both exit 0; Step 4: turn 2 output names "User" and "validateUser" | Both captured stdouts, exit codes, terminal transcript with both dispatched command lines | PASS if both exit 0 AND turn 2 names User without re-introduction; FAIL if turn 2 errors OR if turn 2 redefines User from scratch | (1) Confirm `--continue` is in `devin --help`; (2) try `-c` short flag as alternative; (3) check session-id continuity with `devin list` |

### Optional Supplemental Checks

- Run a 3rd turn with `--continue` asking for a unit test — confirm continuity holds across 3 turns.
- Verify the resumed session id matches turn 1's session id (via `devin list`).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` (§3 Subcommand Map, §4 Flags) | Documents `--continue` / `-c` |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 Essential Commands (resume last) |
| `../../references/devin_tools.md` (§1.7) | Cross-CLI session-continuity comparison |

---

## 5. SOURCE METADATA

- Group: Session Continuity
- Playbook ID: DV-014
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--session-continuity/continue-last-session.md`
