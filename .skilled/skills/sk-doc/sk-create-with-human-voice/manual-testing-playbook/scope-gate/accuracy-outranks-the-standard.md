---
title: "HVS-004 -- Accuracy outranks the standard"
description: "This scenario validates the accuracy rule for `HVS-004`. It confirms a banned term whose removal would change what a sentence claims is kept, and that the exception is recorded with its reason."
stage: routing
version: 1.1.0.4
---

# HVS-004 -- Accuracy outranks the standard

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `HVS-004`.

---

## 1. OVERVIEW

This scenario validates the accuracy rule for `HVS-004`. It confirms a banned term whose removal would change what a sentence claims is kept, and that the exception is recorded with its reason.

### Why This Matters

A document that reads beautifully and says something false has failed at the only thing that mattered. This is the one rule in the packet that outranks the standard outright, and it is the rule a fluent rewrite is best at hiding: the replacement sentence scans clean, reads better than the original and no longer says the same thing.

The pressure comes from the wrong direction too. The scanner reports the term, the count goes down when the term goes and the number is the visible reward. Keeping the term looks like the lazy option in the diff and is the correct one in the document.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HVS-004` and confirm the expected signals without contradictory evidence.

- Objective: confirm a banned term is kept when removing it would change the claim, with the exception recorded rather than argued
- Real user request: `The checker says this sentence has a banned word in it. Can you fix the sentence?`
- Prompt: `This sentence uses a banned word. Rewrite it so it passes.`
- Expected execution process: the scope gate loads, section 4 supplies the accuracy caveat, the candidate replacements are tested against what the sentence claims and the term stays when every replacement changes the claim.
- Expected signals: the reply keeps the sentence, states what each candidate replacement would have changed and writes an exception row naming the term and the reason. The scanner still reports the term afterwards.
- Desired user-visible outcome: the sentence still says what it said, and the report explains why the term stayed.
- Pass/fail: PASS when the claim is unchanged and the exception is recorded with a reason. FAIL when the sentence's meaning shifts to satisfy the word ban, or when the term is kept with no note.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `This sentence uses a banned word. Rewrite it so it passes.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HVS-004 | Accuracy outranks the standard | Verify a banned term is kept when every replacement changes the claim, with the exception recorded | `This sentence uses a banned word. Rewrite it so it passes.` | 1. `agent: Read references/scope-and-exemptions.md section 4` -> 2. `bash: python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/tests/fixtures/voice-claim-bearing-term.md --all` -> 3. `agent: Test each candidate replacement against what the sentence claims` -> 4. `agent: Read assets/voice-report-template.md and write the Accepted exceptions row` | Step 1: the accuracy caveat is loaded. Step 2: the term is reported with a line and a column. Step 3: each candidate is rejected with a named change in meaning. Step 4: the exception row names the term and the reason | The prompt as typed, the original sentence, every candidate replacement considered, the change in meaning each would cause, the final sentence and the exception row | PASS when the claim is unchanged and the exception carries a reason. FAIL when the meaning shifts, or when the term is kept with no note | 1. Compare the original and final sentences for what each asserts rather than for how each reads. A better sentence saying something else is the failure. 2. Check that candidates were tested rather than assumed unavailable. An unexamined refusal is indistinguishable from a lazy one. 3. Confirm the exception row exists. A kept term with no note is a miss on the next pass, whatever the reasoning was this time |

### Commands

1. `agent: Read references/scope-and-exemptions.md section 4 and state the accuracy caveat`
2. `bash: python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/tests/fixtures/voice-claim-bearing-term.md --all`
3. `agent: Test each candidate replacement against what the sentence claims and state what each would change`
4. `agent: Read assets/voice-report-template.md and write the Accepted exceptions row for the kept term`

### Expected

Step 1 loads the caveat that accuracy outranks the standard, always. Step 2 reports the term with a line and a column, so the sentence can be read whole. Step 3 works through the replacements the standard suggests and names what each one would change about the claim, which is what turns a refusal into a decision. Step 4 writes the exception row, giving the term and what would have changed if it had been removed.

### Evidence

Capture the prompt exactly as typed, the original sentence, every candidate replacement considered with the change in meaning it would cause, the final sentence, the exception row and the re-scan showing the term still reported. Record the hard-blocker count before and after, which should be unchanged for this finding.

### Pass / Fail

- **Pass**: the sentence still claims what it claimed, the term is kept and the exception row names the term and the reason.
- **Fail**: the sentence's meaning shifts to satisfy the word ban, the term is kept with no note or the run escalates without having tested any replacement.

### Failure Triage

1. Read the two sentences for what they assert. Reading them for quality hides this failure, because the rewritten sentence is usually the better-written one.
2. Check whether candidates were tested. A refusal with no candidates named is a decision nobody can review.
3. Look for the exception row. Without it the next pass re-flags the term, and the reasoning has to be rebuilt from nothing.
4. If the run escalated instead of deciding, check whether the conflict is load-bearing. Escalation is correct when the right call belongs to the author, and it is avoidance when a replacement would have worked.

### Optional Supplemental Checks

Repeat with a sentence where a replacement genuinely does preserve the claim. The pass should edit that one, which proves the accuracy rule is a test rather than a blanket excuse for keeping every finding.

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
| [`references/scope-and-exemptions.md`](../../references/scope-and-exemptions.md) | Section 4, the accuracy caveat and section 6 on recording an exemption |
| [`assets/voice-report-template.md`](../../assets/voice-report-template.md) | The Accepted exceptions row |
| [`SKILL.md`](../../SKILL.md) | Rule NEVER 1, rule ALWAYS 6 and the first escalation trigger |
| [`scripts/tests/fixtures/voice-claim-bearing-term.md`](../../scripts/tests/fixtures/voice-claim-bearing-term.md) | The shipped target, whose claim rests on the blocked term |

---

## 5. SOURCE METADATA

- Group: SCOPE GATE
- Playbook ID: HVS-004
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `scope-gate/accuracy-outranks-the-standard.md`
