---
title: "RRD-004 -- Restraint refusal"
description: "This scenario validates the restraint refusal for `RRD-004`. It focuses on refusing a proposal backed by a best-practice appeal rather than a failure that happens today."
stage: routing
version: 1.0.0.0
---

# RRD-004 -- Restraint refusal

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `RRD-004`.

---

## 1. OVERVIEW

This scenario validates the restraint refusal for `RRD-004`. It focuses on refusing a proposal backed by a best-practice appeal rather than a failure that happens today.

### Why This Matters

The rule set is subject to its own restraint rule, and a set that grows because more rules feel thorough has failed the rule it ships. The failure this prevents is dilution: every added file raises the cost of loading the set and lowers the chance any single rule is read. This scenario also tests the one destination that is not a place. A restraint refusal goes nowhere, and the recorded reason is the whole output, because an undocumented refusal returns next quarter with nobody remembering why it was declined.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `RRD-004` and confirm the expected signals without contradictory evidence.

- Objective: refuse a proposal that names no present-day failure, and record the refusal with its reason
- Real user request: `Add a rule about writing good commit messages, it is best practice.`
- Prompt: `Add a repo rule about writing good commit messages. It is best practice and I think we should have it written down.`
- Expected execution process: the decision tests load and run in order. Tests 1 through 3 do not refuse it outright, and test 4 asks what fails today without the rule. The request offers a best-practice appeal and no named failure, which is precisely the vocabulary the restraint rule guards against, so the proposal is refused and the refusal is recorded with its reason.
- Expected signals: the reply refuses, names decision test 4, states that no present-day failure was named, and records the refusal rather than routing it to another file. No new file appears under `repo-rules/`.
- Desired user-visible outcome: the user learns the proposal was refused for lack of a concrete failure, and is invited to name one if it exists rather than being told the idea is bad.
- Pass/fail: PASS if the refusal names test 4 and the missing element is identified as a present-day failure; FAIL if a rule is written, or the refusal invents a destination for content that has none.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Add a repo rule about writing good commit messages. It is best practice and I think we should have it written down.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RRD-004 | Restraint refusal | Verify a best-practice appeal with no named failure is refused and the refusal is recorded | `Add a repo rule about writing good commit messages. It is best practice and I think we should have it written down.` | 1. `agent: Read references/decision-tests.md` -> 2. `agent: Apply tests 1 through 4 in order` -> 3. `agent: Answer test 4 by naming what fails today without the rule` -> 4. `bash: git status --porcelain repo-rules/` | Step 2: tests 1 through 3 do not refuse it. Step 3: no present-day failure can be named, so the proposal is refused. Step 4: empty output | The prompt, the refusal text, the named test, the recorded reason, and the step 4 output | PASS if step 3 refuses by test 4 for naming no present-day failure and step 4 is empty; FAIL if a rule is written, or a destination is invented for a refusal that has none | 1. Confirm the refusal came from test 4 rather than an earlier test, since refusing for the wrong reason teaches the user the wrong thing. 2. Check that no destination was invented. A restraint refusal routes nowhere and the recorded reason is the output. 3. If the user later names a real failure, the proposal is re-testable and the earlier refusal was still correct on the evidence it had |

### Commands

1. `agent: Read references/decision-tests.md`
2. `agent: Apply tests 1 through 4 in order and report the first that fails`
3. `agent: Answer test 4 by naming what fails today without the rule`
4. `bash: git status --porcelain repo-rules/`

### Expected

Step 1 loads the tests. Step 2 passes tests 1 through 3, since the content fires on an action, is not routing, and is a plausible cluster. Step 3 cannot name a failure that happens today, because the request offers only a best-practice appeal, so the proposal is refused. Step 4 prints nothing.

### Evidence

Capture the prompt, the refusal text, the test named, the reason recorded for the refusal, and the literal output of step 4. The recorded reason is the deliverable in this scenario and must be captured verbatim rather than summarized.

### Pass / Fail

- **Pass**: the refusal names decision test 4, identifies the missing element as a present-day failure, records the reason, and creates no file.
- **Fail**: a rule file is written, the refusal cites an earlier test than the one that actually applies, or a destination is invented for content that belongs nowhere.

### Failure Triage

1. Confirm the refusal came from test 4 and not from an earlier test. Refusing correctly for the wrong reason still misleads the next proposal.
2. Check that no destination was invented. Unlike the other three refusals, this one routes nowhere, and inventing a home for it puts unearned content into a real file.
3. If the operator responds with a concrete failure, re-run the tests against the new evidence. The earlier refusal remains correct on what it had, and reversing it is not an error to apologize for.

### Optional Supplemental Checks

Re-run with the same subject and a named failure attached, such as a specific incident where an unreadable history cost real debugging time. Confirm test 4 now admits it, which proves the test measures evidence rather than subject matter.

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
| [`references/decision-tests.md`](../../references/decision-tests.md) | Primary implementation anchor, sections 4 and 5 |
| [`SKILL.md`](../../SKILL.md) | The forbidden clause against adding a rule because the set looks thin |

---

## 5. SOURCE METADATA

- Group: RULE DECISION
- Playbook ID: RRD-004
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `rule-decision/no-observed-failure-refusal.md`
