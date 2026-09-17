---
title: "FMB-002 -- Trim that loses routing tokens"
description: "This scenario validates the inverted budget case for `FMB-002`. A description trimmed under budget by deleting the skill name and mode suffixes is a failure even though the length check now passes."
version: 1.0.0.4
---

# FMB-002 -- Trim that loses routing tokens

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FMB-002`.

---

## 1. OVERVIEW

This scenario validates the inverted budget case for `FMB-002`. A `description` trimmed under budget by deleting the skill name and the mode suffixes is a failure even though it is now short enough, because those tokens are what the advisor matches on.

### Why This Matters

This is the scenario that inverts the obvious grading rule, so it is the one most likely to be marked backwards. The length check passes. The validator stops warning. The document looks better. And the skill routes worse than it did before, because the field reference lists the skill-name token, the primary verb, the primary domain noun, the mode suffixes and the numeric specifics as the things a trim must keep, and the packet README states outright that a description trimmed by deleting the routing tokens is under budget and no longer routes. Nothing in the toolchain distinguishes a good short description from a bad one. The only signal is whether the keep list survived, which is why this scenario is critical and why passing the length check is explicitly not sufficient to pass it.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `FMB-002` and confirm the expected signals without contradictory evidence.

- Objective: reject a trim that satisfies the soft target by removing keep-list tokens, and name the tokens that have to come back
- Realistic user request: `I shortened the description in that fixture a lot and it passes now. Is it fine?`
- Prompt: `I got the description in assets/fixtures/under-budget-trim-lost-tokens.md down to 56 characters. Good enough?`
- Expected execution process: `assets/frontmatter-templates.md` loads, the keep list is read before the length is judged, the proposed description is checked token by token against that list, the missing skill-name token and mode suffixes are identified, and the answer states that the length check passing is not the question.
- Expected signals: the reply says the trim is a regression, names which keep-list tokens are missing, and proposes a longer description that is still inside the soft target. A reply that approves the trim on length alone is the failure this scenario exists to catch.
- Desired user-visible outcome: the user is told the trim is a regression despite passing the length check, and which tokens have to come back.
- Pass/fail: PASS if the trim is rejected with the missing keep-list tokens named. FAIL if the trim is approved because it is inside the target, or if the answer discusses length without checking the keep list at all.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `I got the description in assets/fixtures/under-budget-trim-lost-tokens.md down to 56 characters. Good enough?`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FMB-002 | Trim that loses routing tokens | Reject an under-budget trim that removed keep-list tokens, and name what has to come back | `I got the description in assets/fixtures/under-budget-trim-lost-tokens.md down to 56 characters. Good enough?` | 1. `agent: Read the keep list in the description budget section before judging the length` -> 2. `agent: Read assets/fixtures/under-budget-trim-lost-tokens.md and check the proposed description token by token against the keep list` -> 3. `agent: State the verdict and propose a replacement inside the soft target` -> 4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/quick_validate.py .opencode/skills/sk-doc/sk-create-frontmatter` | Step 1: the keep list is read first. Step 2: the missing skill-name token and mode suffixes are named. Step 3: the trim is rejected and a replacement is offered. Step 4: the validator runs clean on the packet as shipped, showing it reports length and nothing else | The prompt as typed, the proposed description, the keep-list check token by token, the verdict, the replacement, and the validator transcript | PASS if the trim is rejected with the missing tokens named. FAIL if it is approved on length, or if the keep list is never checked | 1. Check whether the keep list was read before or after the verdict. Reading it after the verdict is a rationalization. 2. Confirm the validator was not treated as the authority here, since it cannot see routing signal. 3. Re-read the packet README row that maps a trimmed description no longer routing to this exact cause |

### Commands

1. `agent: Read the keep list in the description budget section of assets/frontmatter-templates.md before judging the length`
2. `agent: Read assets/fixtures/under-budget-trim-lost-tokens.md and check the proposed description token by token against the keep list, naming any missing token`
3. `agent: State the verdict, and propose a replacement that keeps every keep-list token inside the soft target`
4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/quick_validate.py .opencode/skills/sk-doc/sk-create-frontmatter`

### Expected

Step 1 reads the keep list first, which is the only ordering that can produce the right verdict, since the length is already known to pass. Step 2 finds the skill-name token and the mode suffixes gone. Step 3 rejects the trim and offers a replacement that is longer than the proposal and still inside the soft target, demonstrating that the two requirements are not in tension. Step 4 is the negative control. The validator checks length, so it would be equally silent about the bad trim and the good one, and a run that cites that silence as approval has used the wrong instrument. Nothing is written in this scenario: both descriptions are proposals, and the verdict rests on the keep-list check rather than on a file changing. The input is fixed rather than supplied by the reader. The fixture carries the 547-character original alongside the 56-character trim, and a table of which keep-list tokens the trim dropped, so the verdict can be checked against the same five rows every run.

### Evidence

Capture the prompt exactly as typed, the proposed 56-character description, the token-by-token keep-list check, the verdict, the replacement description with its character count, and the validator output. That run matters because it shows what the available instrument does and does not measure, which is the whole reason this scenario is graded by hand.

### Pass / Fail

- **Pass**: the trim is rejected, the missing keep-list tokens are named individually, and a replacement inside the soft target is offered.
- **Fail**: the trim is approved because it satisfies the length check, the keep list is never consulted, the verdict names dissatisfaction without naming a missing token, or validator silence is presented as approval.

### Failure Triage

1. Check the ordering. A keep-list check performed after the verdict was reached is a rationalization and will not catch the next case.
2. Confirm the run understood which instrument answers which question. The validator answers length. Nothing in the toolchain answers routing signal, which is why the keep list is read by a person.
3. Re-read the packet README troubleshooting row for a trimmed description that no longer routes. It names this cause directly and is the shortest confirmation that the verdict is the documented one.
4. If the run approved the trim, check whether it treated the soft target as the whole contract. The budget section is a target and two lists, and only one of the three is a number.

### Optional Supplemental Checks

Give the same run the correct 125-character trim from the worked example in the same section and confirm it approves that one. A run that rejects every short description has learned caution rather than the keep list, and it will block correct trims for the same reason it caught this one.

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
| [`assets/fixtures/under-budget-trim-lost-tokens.md`](../../assets/fixtures/under-budget-trim-lost-tokens.md) | The input document: the 56-character trim under test and the original it came from |
| [`assets/frontmatter-templates.md`](../../assets/frontmatter-templates.md) | Primary implementation anchor, the keep list and the worked trim in section 3 |
| [`README.md`](../../README.md) | The statement that a description trimmed of its routing tokens no longer routes |
| [`SKILL.md`](../../SKILL.md) | The ALWAYS rule to keep the routing tokens when trimming |

---

## 5. SOURCE METADATA

- Group: DESCRIPTION BUDGET
- Playbook ID: FMB-002
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `description-budget/trim-that-loses-routing-tokens.md`
