---
title: "RRD-002 -- Existing-owner refusal"
description: "This scenario validates the existing-owner refusal for `RRD-002`. It focuses on refusing a proposal another rule already carries, and naming that rule as the destination."
stage: routing
version: 1.1.0.1
---

# RRD-002 -- Existing-owner refusal

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `RRD-002`.

---

## 1. OVERVIEW

This scenario validates the existing-owner refusal for `RRD-002`. It focuses on refusing a proposal another rule already carries, and naming that rule as the destination.

### Why This Matters

Part 2 of the four-part refusal test asks whether the proposal already has a home. The failure it prevents is duplication, and duplication in a rule set is worse than it looks. Two files carrying the same obligation drift apart, and a reader who loads one has no way to know the other exists or disagrees. The set already found this in practice: a duplicated restraint ladder whose rung numbering contradicted the authoritative one. This scenario checks that the workflow looks for an owner before it writes, and that a bare refusal is not accepted as a good one.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `RRD-002` and confirm the expected signals without contradictory evidence.

- Objective: refuse a proposal that an existing rule already owns, and name the owning rule and section
- Real user request: `We keep forgetting to run the tests before saying something is done. Add a rule.`
- Prompt: `We keep saying work is finished before anyone runs the tests. Add a repo rule that stops us claiming done without proof.`
- Expected execution process: the decision tests load, tests 1 and 2 pass, and part 2 of the four-part test finds that `evidence-and-proof.md` already carries the obligation. Section 5 maps that refusal to a new section inside the rule that already owns it, so the reply names the owning file rather than refusing in the abstract.
- Expected signals: the reply refuses, names the four-part test part 2, and names `evidence-and-proof.md` as the owner. No new file appears under `repo-rules/`.
- Desired user-visible outcome: the user learns the obligation already exists, where it lives, and that a section there is the right place for anything the existing rule is missing.
- Pass/fail: PASS if the refusal names part 2 and names the owning rule; FAIL if a new rule file is created, or the refusal names no owner.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `We keep saying work is finished before anyone runs the tests. Add a repo rule that stops us claiming done without proof.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RRD-002 | Existing-owner refusal | Verify a proposal an existing rule already carries is refused with the owner named | `We keep saying work is finished before anyone runs the tests. Add a repo rule that stops us claiming done without proof.` | 1. `agent: Read references/decision-tests.md` -> 2. `agent: Apply tests 1 through 4 in order` -> 3. `bash: grep -n "done" repo-rules/evidence-and-proof.md` -> 4. `bash: find repo-rules -name '*.md' -type f` | Step 1: the tests are loaded. Step 2: the refusal lands on part 2 of the four-part test. Step 3: matches confirm the owner really carries the obligation. Step 4: eight rule files are listed, unchanged | The prompt, the refusal text, the named test part, the named owning rule, the step 3 matches, and the step 4 listing before and after | PASS if step 2 refuses by part 2 and names `evidence-and-proof.md`, step 3 confirms the claim, and step 4 is unchanged; FAIL if a file is created or no owner is named | 1. Confirm the tests ran in order rather than stopping at the first plausible objection. 2. Run step 3 and read the matches, since a refusal citing an owner that does not carry the obligation is a wrong refusal, not a safe one. 3. If step 3 finds nothing, the proposal may genuinely have no home and the refusal must be reconsidered against part 1 and test 4 |

### Commands

1. `agent: Read references/decision-tests.md`
2. `agent: Apply tests 1 through 4 in order and report the first that fails`
3. `bash: grep -n "done" repo-rules/evidence-and-proof.md`
4. `bash: find repo-rules -name '*.md' -type f`

### Expected

Step 1 loads the tests. Step 2 passes tests 1 and 2, because the obligation fires on an action rather than binding unconditionally and is posture rather than routing, then fails part 2 of the four-part test. Step 3 returns matches showing the owner really does carry the obligation, which is what turns the refusal from a guess into a verified claim. Step 4 lists the same eight files as before the run.

### Evidence

Capture the prompt, the refusal text, the exact test part named, the owning rule named, the literal matches from step 3, and the step 4 listing taken both before and after the run.

### Pass / Fail

- **Pass**: the refusal names part 2 of the four-part test, names `evidence-and-proof.md`, and the grep in step 3 confirms that file carries the obligation.
- **Fail**: a new rule file is created, or the refusal names no owner, or the named owner does not carry the obligation when checked.

### Failure Triage

1. Confirm all four tests were run in order. Stopping at the first plausible objection produces a refusal that is right by accident and will be wrong on the next request.
2. Read the step 3 matches rather than trusting the refusal text. A citation nobody opened is the recurring defect in this workflow, and a refusal that names the wrong owner sends the user to the wrong file.
3. If step 3 finds nothing, treat the refusal as unproven. Re-run part 1 and test 4 to decide whether the proposal is a section elsewhere, a new rule, or nothing at all.

### Optional Supplemental Checks

Repeat with a proposal whose owner is less obvious, such as a convention about not widening a catch block. Confirm the workflow searches the corpus rather than pattern-matching on the most familiar rule name.

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
| [`references/decision-tests.md`](../../references/decision-tests.md) | Primary implementation anchor, sections 3 and 5 |
| [`SKILL.md`](../../SKILL.md) | The create ordering and the refusal stop point |

---

## 5. SOURCE METADATA

- Group: RULE DECISION
- Playbook ID: RRD-002
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `rule-decision/existing-owner-refusal.md`
