---
title: "RRD-001 -- Always-loaded refusal"
description: "This scenario validates the always-loaded refusal for `RRD-001`. It focuses on refusing a proposal whose content must bind on every turn, and naming the always-loaded document as its destination."
stage: routing
version: 1.1.0.1
---

# RRD-001 -- Always-loaded refusal

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `RRD-001`.

---

## 1. OVERVIEW

This scenario validates the always-loaded refusal for `RRD-001`. It focuses on refusing a proposal whose content must bind on every turn, and naming the always-loaded document as its destination.

### Why This Matters

Decision test 1 decides most refusals in this workflow, and it is the least intuitive of the four. A proposal can be correct, well written, and still belong somewhere else entirely. The failure it prevents is silent and severe: a rule that must bind unconditionally, filed behind a trigger, stops binding on every turn where that trigger does not fire. The rule looks present in the repository and is absent in practice. This scenario is the primary guard on that, so it is the one to run first.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `RRD-001` and confirm the expected signals without contradictory evidence.

- Objective: refuse a proposal that must bind when no trigger has fired, and route it to the always-loaded document
- Real user request: `Add a rule that says you must always read a file before editing it.`
- Prompt: `Add a repo rule that says you must always read a file before you edit it. We keep getting blind edits and I want it written down.`
- Expected execution process: `references/decision-tests.md` loads on every path, test 1 is answered by asking what must hold on a turn where nothing fires, the READ FIRST obligation is found to bind unconditionally, and section 5 of the tests maps a test-1 refusal to the always-loaded document as a compressed row. No draft is written.
- Expected signals: the reply refuses, names decision test 1 by name, and names the always-loaded document as the destination. No new file appears under `repo-rules/` and the router row counts are unchanged.
- Desired user-visible outcome: the user learns the request was refused, which test refused it, and where the obligation actually belongs.
- Pass/fail: PASS if the request is refused by test 1 with the destination named and no file is created; FAIL if a rule file is authored, or the refusal names neither the test nor a destination.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Add a repo rule that says you must always read a file before you edit it. We keep getting blind edits and I want it written down.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RRD-001 | Always-loaded refusal | Verify a proposal that must bind every turn is refused and routed to the always-loaded document | `Add a repo rule that says you must always read a file before you edit it. We keep getting blind edits and I want it written down.` | 1. `agent: Read references/decision-tests.md` -> 2. `agent: Apply test 1 by asking what must hold on a turn where nothing fires` -> 3. `agent: Read section 5 and name the destination` -> 4. `bash: git status --porcelain repo-rules/` | Step 1: the tests are loaded before any drafting. Step 2: the answer is that the obligation binds unconditionally. Step 3: the destination is named as the always-loaded document. Step 4: empty output | The prompt as typed, the refusal text, the named test, the named destination, and the step 4 output | PASS if steps 2 and 3 refuse by test 1 and name the destination and step 4 is empty; FAIL if a file is created or the refusal is bare | 1. Confirm `references/decision-tests.md` was loaded at all, since it is the ALWAYS resource. 2. Check that test 1 was answered by the no-trigger question rather than by topic similarity. 3. Grep the always-loaded document for the READ FIRST obligation to confirm the destination claim is true rather than assumed |

### Commands

1. `agent: Read references/decision-tests.md`
2. `agent: Apply test 1 by asking what must hold on a turn where nothing fires`
3. `agent: Read section 5 of the tests and name the destination for a test-1 refusal`
4. `bash: git status --porcelain repo-rules/`

### Expected

Step 1 loads `references/decision-tests.md`, which is the ALWAYS-level resource and must appear on every path including a refusal. Step 2 answers the no-trigger question and finds that the obligation holds unconditionally, which is the definition of a test-1 failure. Step 3 names the always-loaded document as the destination, taken from section 5 of the tests rather than invented. Step 4 prints nothing, proving no file was written.

### Evidence

Capture the prompt exactly as typed, the full refusal text, the test named in the refusal, the destination named in the refusal, and the literal output of `git status --porcelain repo-rules/`. Record the count of files in `repo-rules/` before and after, because the structural assertion is a comparison and cannot be graded from a single reading.

### Pass / Fail

- **Pass**: the request is refused, the refusal names decision test 1, a destination is named, and `repo-rules/` is unchanged.
- **Fail**: a rule file is authored, or the refusal arrives without naming the failing test, or without naming where the content belongs.

### Failure Triage

1. Confirm `references/decision-tests.md` was actually loaded. It is the ALWAYS-level resource, so its absence explains every downstream failure in this scenario.
2. Check how test 1 was answered. The test asks what must hold on a turn where nothing fires. An answer reasoning from topic similarity has not run the test.
3. Grep the always-loaded document for the READ FIRST obligation. If it is genuinely absent, the destination claim was wrong and the refusal needs correcting rather than accepting.

### Optional Supplemental Checks

Re-run with a proposal that genuinely does fire on a trigger, such as a convention that applies only when deleting a file. Confirm the same tests admit it rather than refusing everything, which proves test 1 is discriminating rather than a blanket refusal.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| No feature-catalog entry | This packet ships no `feature-catalog/`, so no catalog cross-reference exists for this scenario |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`references/decision-tests.md`](../../references/decision-tests.md) | Primary implementation anchor, sections 1 and 5 |
| [`SKILL.md`](../../SKILL.md) | Resource loading levels and the create ordering |

---

## 5. SOURCE METADATA

- Group: RULE DECISION
- Playbook ID: RRD-001
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `rule-decision/always-loaded-refusal.md`
