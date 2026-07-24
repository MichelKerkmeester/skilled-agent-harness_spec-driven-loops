---
title: "CU-015 -- --continue same-session follow-up"
description: "This scenario validates Cursor's --continue flag for `CU-015`. It focuses on confirming a follow-up dispatch picks up the most recent session and produces a coherent continuation referencing prior turn content."
version: 1.0.0.0
---

# CU-015 -- --continue same-session follow-up

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CU-015`.

---

## 1. OVERVIEW

This scenario validates `--continue` for `CU-015`. It focuses on confirming a follow-up dispatch picks up the most recent session and produces a coherent continuation referencing the prior turn's content.

### Why This Matters

`--continue` and `--resume` are documented global flags (phase 001 confirmed their existence in `--help`), but their exact round-trip behavior for `cli-cursor` dispatch had not been separately live-verified beyond flag presence before this playbook's execution. This scenario is the first live behavioral check of `--continue`, and its result must be reported honestly - as a genuine finding, not an assumed-working flag.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-015` and confirm the expected signals without contradictory evidence.

- Objective: Verify `--continue` produces a coherent follow-up turn that correctly references content from the immediately preceding dispatch.
- Real user request: `Have Cursor sketch a User type, then immediately ask it to add a validator for that same type without re-explaining everything.`
- Prompt (Turn 1): `Sketch a TypeScript User type (id, name, email fields) and write it to /tmp/cli-cursor-playbook-cu015/user.ts.`
- Prompt (Turn 2, --continue): `Implement validate(user) for the type from Turn 1.`
- Expected execution process: Operator pre-cleans the target temp directory -> dispatches Turn 1 and confirms the file exists with a `User` type -> dispatches Turn 2 with `--continue --model auto` and no restated type definition -> inspects Turn 2's output/file changes for a correct reference to the Turn 1 `User` type's actual field shape.
- Expected signals: Turn 1 writes `/tmp/cli-cursor-playbook-cu015/user.ts` containing a `User` type with `id`/`name`/`email` fields, exit 0. Turn 2 (`cursor-agent -p ... --continue --model auto`) exits 0 and its output or file changes reference the Turn 1 `User` type's actual field names, without the operator having restated them in Turn 2's prompt.
- Desired user-visible outcome: A working multi-turn task, with an honest record of whether `--continue` round-trip behavior held up under this first live check.
- Pass/fail: PASS if Turn 2 correctly references the Turn 1 type's actual fields without restatement. FAIL if Turn 2 either errors, or produces a validator that does not match (or fabricates) the Turn 1 type's fields, indicating `--continue` did not actually carry context forward.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Pre-clean `/tmp/cli-cursor-playbook-cu015/`.
2. Dispatch Turn 1 and confirm the `User` type file exists with the expected fields.
3. Dispatch Turn 2 with `--continue`, deliberately omitting the field list from the prompt.
4. Inspect Turn 2's output/file changes for correct field references.
5. Return a PASS/FAIL verdict naming the fields Turn 2 correctly (or incorrectly) referenced.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-015 | --continue same-session follow-up | Verify --continue correctly carries forward context from the prior turn | Turn 1: `Sketch a TypeScript User type (id, name, email fields) and write it to /tmp/cli-cursor-playbook-cu015/user.ts.` Turn 2: `Implement validate(user) for the type from Turn 1.` | 1. `bash: rm -rf /tmp/cli-cursor-playbook-cu015 && mkdir -p /tmp/cli-cursor-playbook-cu015` -> 2. `cursor-agent -p "Sketch a TypeScript User type (id, name, email fields) and write it to /tmp/cli-cursor-playbook-cu015/user.ts." --model auto --auto-review --sandbox enabled --output-format text </dev/null > /tmp/cli-cursor-cu015-turn1.txt 2>&1` -> 3. `bash: cat /tmp/cli-cursor-playbook-cu015/user.ts` -> 4. `cursor-agent -p "Implement validate(user) for the type from Turn 1." --continue --model auto --auto-review --sandbox enabled --output-format text </dev/null > /tmp/cli-cursor-cu015-turn2.txt 2>&1` -> 5. `bash: cat /tmp/cli-cursor-cu015-turn2.txt` -> 6. `bash: grep -E "id\|name\|email" /tmp/cli-cursor-cu015-turn2.txt` | Step 2: Turn 1 exit 0; Step 3: `user.ts` contains a `User` type with the three fields; Step 4: Turn 2 exit 0; Step 5-6: Turn 2's output references `id`/`name`/`email` without them being restated in the Turn 2 prompt | Turn 1 file contents, both turns' stdout, exit codes for both dispatches | PASS if Turn 2 exits 0 AND correctly references the Turn 1 type's actual field names; FAIL if Turn 2 errors, or its validator references different/fabricated fields, indicating context was not carried forward | (1) Re-confirm Turn 1's file actually has the expected fields before blaming Turn 2; (2) re-run Turn 2 with `--resume` instead (see `CU-016`) to isolate whether the issue is `--continue` specifically; (3) capture `--output-format json` on Turn 1 to inspect its `session_id` for cross-reference |

### Optional Supplemental Checks

- Add a Turn 3 also using `--continue` to confirm the session chain survives more than one hop.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../references/agent-delegation.md` (§6 Session Continuity) | Documents `--continue`/`--resume` and when to use each |
| `../../references/cli-reference.md` (§4 Session & Continuity Flags) | Authoritative flag reference |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/agent-delegation.md` | §6 "When to Use Each Operation" table |
| `../../SKILL.md` | §3 Cursor Agent Delegation - session continuity mention |

---

## 5. SOURCE METADATA

- Group: Session Continuity
- Playbook ID: CU-015
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `session-continuity/continue-same-session.md`
