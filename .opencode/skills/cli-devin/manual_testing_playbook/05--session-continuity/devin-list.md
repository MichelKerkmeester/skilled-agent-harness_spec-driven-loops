---
title: "DV-016 -- devin list (session inventory)"
description: "This scenario validates that devin list (alias ls) enumerates available sessions with timestamps and ids that match the ones used by --resume."
---

# DV-016 -- devin list (session inventory)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DV-016`.

---

## 1. OVERVIEW

This scenario validates `devin list` (alias `ls`) for `DV-016`. The subcommand enumerates available sessions with timestamps and ids — the inventory surface the calling AI uses to pick the right `--resume <id>` target.

### Why This Matters

`devin list` completes the session-management toolkit alongside `--continue` and `--resume <id>`. Without a parseable list, the calling AI cannot programmatically pick a specific session — it can only resume the most recent. The list is also the operator's audit surface for what sessions exist on the profile.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `devin list` enumerates sessions with parseable ids and timestamps that match the ids accepted by `--resume`.
- Real user request: `Show me all my Devin sessions so I can pick the right one to resume.`
- Prompt: `Dispatch two new sessions, then run devin list, and confirm both newly created sessions appear with parseable timestamps and ids.`
- Expected execution process: Operator dispatches two short sessions back-to-back -> runs `devin list` -> confirms both new sessions appear with parseable ids and timestamps -> verifies an id from the list works with `--resume`.
- Expected signals: `devin list` exits 0. Output enumerates sessions with ids and timestamps. The two newly dispatched sessions appear in the list. Ids are in a parseable format usable with `--resume`.
- Desired user-visible outcome: An operator-visible session inventory the calling AI can use to programmatically pick the right resume target.
- Pass/fail: PASS if `devin list` exits 0 AND both new sessions appear AND ids are parseable. FAIL if exit non-zero OR if new sessions are missing from the list.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Dispatch session A with a unique sentinel.
2. Dispatch session B with a different unique sentinel.
3. Run `devin list`.
4. Parse the list for session ids and timestamps.
5. Confirm both newly dispatched sessions appear at the top of the list.
6. Pick one id and verify `devin --resume <id>` works.
7. Return a PASS/FAIL verdict naming the count of sessions enumerated.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DV-016 | `devin list` (session inventory) | Verify list enumerates sessions with parseable ids and timestamps | `Dispatch two new sessions, then run devin list, and confirm both newly created sessions appear with parseable timestamps and ids.` | 1. `devin "Say 'session A' once." --model swe-1.6 --permission-mode auto > /tmp/dv-016-a.txt 2>&1 </dev/null; echo "A exit: $?"` -> 2. `devin "Say 'session B' once." --model swe-1.6 --permission-mode auto > /tmp/dv-016-b.txt 2>&1 </dev/null; echo "B exit: $?"` -> 3. `bash: devin list > /tmp/dv-016-list.txt 2>&1; echo "List exit: $?"` -> 4. `bash: head -10 /tmp/dv-016-list.txt` -> 5. `bash: grep -cE '[a-f0-9-]{8,}' /tmp/dv-016-list.txt` | Steps 1-3: all exit 0; Step 4: list output is parseable (timestamps + ids); Step 5: at least 2 session-id-like strings present | All three captured stdouts, the list output, terminal transcript | PASS if `devin list` exits 0 AND both new sessions visible AND ids parseable; FAIL if exit non-zero OR if new sessions missing | (1) Confirm `devin list` is in `devin --help`; (2) try `devin ls` alias; (3) inspect list format with `devin list --help` (if supported) |

### Optional Supplemental Checks

- Confirm list ordering is consistent (newest first or oldest first — note the convention).
- Test pagination if the list is long (`--limit` flag if supported).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` (§3 Subcommand Map) | Documents `devin list` / `ls` |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 Essential Commands (list sessions) |
| `../../references/devin_tools.md` (§1.7) | Cross-CLI session-continuity comparison |

---

## 5. SOURCE METADATA

- Group: Session Continuity
- Playbook ID: DV-016
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--session-continuity/devin-list.md`
