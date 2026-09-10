---
title: "CACHE-011 -- A repeated request and a run of differing failures escalate separately"
description: "This scenario validates that the retry guard escalates a repeated request and a streak of differing failures on their own counters for `CACHE-011`, each with a message that describes what actually happened."
stage: routing
version: 1.0.0.0
---

# CACHE-011 -- A repeated request and a run of differing failures escalate separately

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CACHE-011`.

---

## 1. OVERVIEW

This scenario validates that the guard tracks two different failures independently: the same request repeating, and consecutive all-failed batches whose errors differ. Each escalates on its own schedule and says which case it is.

### Why This Matters

A turn that re-issues the identical failing call is burning budget on one request. A turn failing four different ways is not converging, which is a different problem. Collapsing the two into one counter meant four unrelated failures aborted under a message asserting the same request had been re-billed -- an operator reading that message would look for a repeat that never happened.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CACHE-011` and confirm the expected signals without contradictory evidence.

- Objective: confirm each counter escalates on its own threshold with an accurate message.
- Real user request: `Stop the agent burning my budget when every tool call is failing.`
- Prompt: drive a turn whose whole tool batch fails, first with an identical error, then with differing errors.
- Expected execution process: run consecutive all-failed batches and read the guard text at each escalation.
- Expected signals: identical failures warn on the 3rd batch and abort on the 4th, naming a repeated request; differing failures warn on the 4th turn and abort on the 6th, saying the errors differ.
- Desired user-visible outcome: the turn stops before the budget does, and the message names the real reason.
- Pass/fail: PASS if both paths escalate at their own thresholds with matching text; FAIL if differing failures abort under the repeated-request message, or if a successful call fails to reset the streaks.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request: stop a failing turn without mislabelling why.
2. Drive four consecutive batches that fail with the same error and record the text at each step.
3. Start a fresh session and drive six batches failing with different errors each time.
4. Confirm the abort messages differ and match the case that occurred.
5. Insert one successful tool call mid-run and confirm both streaks reset.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CACHE-011 | Repeat and streak escalate separately | Verify each counter has its own threshold and honest message | `Read /nonexistent/path and tell me what is in it.` | 1. drive 4 consecutive identical all-failed batches -> 2. read the guard text at batch 3 and 4 -> 3. new session, drive 6 all-failed batches with differing errors -> 4. read the text at turn 4 and 6 | Step 2: notice at 3, abort at 4 naming a repeated request; step 4: notice at 4, abort at 6 saying the errors differ | The guard text captured at each escalation point | PASS if both paths escalate at their own thresholds with matching text; FAIL if differing errors abort as a repeat | 1. Confirm every call in each batch failed -- one success resets both streaks by design. 2. Confirm the errors really differ, since the signature is normalized before comparison. 3. Confirm guard state is per-session: a new session starts both counters at zero. |

### Optional Supplemental Checks

Confirm the guard never rewrites or retries the request itself, and that transport-level retries remain the provider's concern.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../index.ts` | Batch assembly, the two escalation counters, and the guard messages |
| `../../tests/retry-loop-guard.test.ts` | Regression anchor for both escalation paths |

---

## 5. SOURCE METADATA

- Group: Retry Loop Guard
- Playbook ID: CACHE-011
- Canonical root source: `../manual-testing-playbook.md`
- Feature file path: `retry-loop-guard/repeat-and-streak-escalate-separately.md`
