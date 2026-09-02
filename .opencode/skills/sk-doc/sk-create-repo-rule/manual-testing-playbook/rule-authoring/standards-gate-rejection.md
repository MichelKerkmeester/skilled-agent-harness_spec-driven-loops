---
title: "RRA-002 -- Standards gate rejection"
description: "This scenario validates the standards gate for `RRA-002`. It focuses on rejecting a draft that satisfies every structural check and still fails the reader tests."
stage: routing
version: 1.1.0.4
---

# RRA-002 -- Standards gate rejection

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `RRA-002`.

---

## 1. OVERVIEW

This scenario validates the standards gate for `RRA-002`. It focuses on rejecting a draft that satisfies every structural check and still fails the reader tests.

### Why This Matters

Structure is checkable and it is not the bar. A rule can carry all ten fixed elements, sit inside the length bands, pass every assertion a script can make, and still say nothing a reader would change their behavior over. The five standards are the only guard on that, and none of them can be automated. That limit is the reason the scenario exists: an operator has to read the draft and answer the questions, so the test has to prove the workflow actually does that rather than asserting the standards passed.

Destructive note: this scenario writes a draft to a scratch path. It never writes into `repo-rules/`.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `RRA-002` and confirm the expected signals without contradictory evidence.

- Objective: reject a structurally valid but thin draft, naming which of the five standards it fails
- Real user request: `Here is a draft rule I wrote. Is it good enough to ship?`
- Prompt: `Review this draft repo rule before I ship it. It has two numbered sections, six trigger phrases, and a self-check whose items repeat the section titles. Tell me whether it clears the bar.`
- Expected execution process: the creation standards load, because a draft exists and is being reviewed. The reviewer answers each of the five tests by reading the draft. The trigger-phrase test fails because six phrases sit far below the observed range of sixteen to twenty. The self-check test fails because items mirroring section titles are a table of contents with checkboxes rather than a record of obligations. The section test is applied by reading each section and saying what breaks without it.
- Expected signals: the review rejects the draft, names the failing standards explicitly, and does not report a pass merely because the structure is valid. Nothing is written into `repo-rules/`.
- Desired user-visible outcome: the author learns exactly which standards the draft fails and what would fix each, rather than receiving a general impression that it needs work.
- Pass/fail: PASS if the review rejects the draft and names the trigger-phrase and self-check failures; FAIL if the draft is accepted, or the rejection is generic and names no standard.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Review this draft repo rule before I ship it. It has two numbered sections, six trigger phrases, and a self-check whose items repeat the section titles. Tell me whether it clears the bar.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RRA-002 | Standards gate rejection | Verify a structurally valid but thin draft is rejected with the failing standards named | `Review this draft repo rule before I ship it. It has two numbered sections, six trigger phrases, and a self-check whose items repeat the section titles. Tell me whether it clears the bar.` | 1. `agent: Write the described draft to a scratch path` -> 2. `agent: Read references/creation-standards.md` -> 3. `agent: Apply the five tests and name each verdict` -> 4. `bash: git status --porcelain repo-rules/` | Step 1: a draft that is structurally valid. Step 3: the trigger-phrase test and the self-check test both fail and are named. Step 4: empty output | The draft, the five per-standard verdicts, the named failures, and the step 4 output | PASS if step 3 rejects the draft and names both failing standards; FAIL if the draft is accepted or the rejection names no standard | 1. Confirm all five standards were answered individually, since a single overall impression is the failure this scenario is designed to catch. 2. Check the trigger-phrase count against the observed range of sixteen to twenty rather than against a personal preference. 3. Check whether each self-check item traces to a sentence in the body. An item with no such sentence is decoration, and a body obligation with no item is a gap |

### Commands

1. `agent: Write the described draft to a scratch path outside repo-rules`
2. `agent: Read references/creation-standards.md`
3. `agent: Apply the five tests to the draft and state a verdict for each`
4. `bash: git status --porcelain repo-rules/`

### Expected

Step 1 produces a draft that would satisfy a structural checker: correct frontmatter, correct title line, dividers equal to its two numbered sections. Step 2 loads the standards, which is the conditional resource for a draft under review. Step 3 returns five separate verdicts. The trigger-phrase test fails at six phrases against an observed range of sixteen to twenty. The self-check test fails because the items mirror the section titles instead of tracing to obligations. Step 4 prints nothing.

### Evidence

Capture the draft in full, the five per-standard verdicts as separate answers, the specific reasons given for the two failures, and the step 4 output. A review that returns fewer than five verdicts has not run the gate, so the count of verdicts is itself evidence.

### Pass / Fail

- **Pass**: the draft is rejected, five verdicts are given, and the trigger-phrase and self-check failures are named with their reasons.
- **Fail**: the draft is accepted, or the rejection is a general impression that names no standard, or fewer than five verdicts are returned.

### Failure Triage

1. Count the verdicts. Fewer than five means the gate was summarized rather than run, which is the defect this scenario exists to catch.
2. Check the trigger-phrase judgment against the observed range of sixteen to twenty rather than against taste. The range is what the corpus does, and a review that invents its own number is not applying the standard.
3. Trace each self-check item to a sentence in the body. This is the mechanical part of an otherwise unautomatable test, and it usually reveals the failure immediately.

### Optional Supplemental Checks

Run the same gate against a shipped rule from `repo-rules/`. All five standards pass on all nine shipped rules, so a run that rejects one is measuring something other than the standard, and the measurement is wrong rather than the corpus.

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
| [`references/creation-standards.md`](../../references/creation-standards.md) | Primary implementation anchor, sections 1 through 5 |
| [`references/rule-anatomy.md`](../../references/rule-anatomy.md) | The observed ranges the standards are judged against |

---

## 5. SOURCE METADATA

- Group: RULE AUTHORING
- Playbook ID: RRA-002
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `rule-authoring/standards-gate-rejection.md`
