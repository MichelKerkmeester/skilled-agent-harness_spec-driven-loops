---
title: "HVR-002 -- The re-scan after a rewrite"
description: "This scenario validates the closing step for `HVR-002`. It confirms the scanner is re-run after any rewrite and that both numbers are reported, because rewriting to remove tells introduces new ones."
stage: routing
version: 1.1.0.4
---

# HVR-002 -- The re-scan after a rewrite

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `HVR-002`.

---

## 1. OVERVIEW

This scenario validates the closing step for `HVR-002`. It confirms the scanner is re-run after any rewrite and that both numbers are reported, because rewriting to remove tells introduces new ones.

### Why This Matters

Rewriting is where new tells come from. A sentence rewritten to drop `leverage` reaches for `utilise`, which the standard also blocks. A paragraph rewritten to break a three-item list becomes a four-item list whose fourth item says nothing, which trades a mechanical finding for a judgment one the scanner will never report.

So a single after-score proves nothing about what the pass did. The before-number is what makes the after-number mean something, and it is the only evidence the pass changed anything at all. This is also the step most likely to be dropped under time pressure, because the rewrite feels finished when the last edit lands.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HVR-002` and confirm the expected signals without contradictory evidence.

- Objective: confirm the scanner is re-run on the rewritten text and that both numbers appear in the report
- Real user request: `This reads like a machine wrote it. Can you make it sound like a person?`
- Prompt: `This draft reads like AI wrote it. Fix it.`
- Expected execution process: the scope gate loads, the scanner runs and its numbers are recorded, the in-scope spans are edited hard blockers first, the scanner runs again on the rewritten text and both readings go into the report.
- Expected signals: the report carries the before and after columns of the mechanical scan table, both filled. Any term introduced by the rewrite appears in the after-scan and is dealt with rather than left.
- Desired user-visible outcome: the user sees the before number, the after number and what changed between them.
- Pass/fail: PASS when both scans are run and both numbers reported. FAIL when only the after-number appears, when the before-number is reconstructed from memory rather than from a recorded run or when a term introduced by the rewrite is left unaddressed.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `This draft reads like AI wrote it. Fix it.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HVR-002 | The re-scan after a rewrite | Verify the scanner is re-run on the rewritten text and both numbers are reported | `This draft reads like AI wrote it. Fix it.` | 1. `bash: cp .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/tests/fixtures/voice-ai-draft.md /tmp/hvr-hvr-002.md` -> 2. `bash: python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py /tmp/hvr-hvr-002.md` -> 3. `agent: Edit in-scope spans, hard blockers first, then soft deductions, then judgment findings` -> 4. `bash: python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py /tmp/hvr-hvr-002.md` -> 5. `agent: Fill both columns of the mechanical scan table in assets/voice-report-template.md` | Step 1: the copy is written outside the packet. Step 2: a recorded before-number with its exit status. Step 3: the edit order is hard blockers first. Step 4: a second scanner block from the rewritten text. Step 5: both columns filled, and any newly introduced term named | The prompt as typed, both scanner blocks with exit statuses, the diff, the filled mechanical scan table and a list of any term the rewrite introduced | PASS when both scans are run and both numbers reported. FAIL when only the after-number appears or a newly introduced term is left unaddressed | 1. Check that step 2 ran before the edit rather than being reconstructed after it. A before-number produced from the diff is not a measurement. 2. Compare the two scanner blocks term by term. A drop in the total can hide a term that arrived, because the totals only tell you the net. 3. If the after-number is worse, report it. A rewrite that scored worse is a result, and hiding it costs the next pass its starting point |

### Commands

1. `bash: cp .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/tests/fixtures/voice-ai-draft.md /tmp/hvr-hvr-002.md`
2. `bash: python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py /tmp/hvr-hvr-002.md`
3. `agent: Edit in-scope spans in /tmp/hvr-hvr-002.md, hard blockers first, then soft deductions, then the judgment findings`
4. `bash: python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py /tmp/hvr-hvr-002.md`
5. `agent: Fill both columns of the mechanical scan table in assets/voice-report-template.md`

### Expected

Step 1 copies the shipped fixture out of the packet, because this scenario rewrites its target and precondition 6 fails any run that leaves a diff under the packet. Step 2 records the before-number, its hard-blocker count and its ceiling, with the exit status: 4 hard blockers and a ceiling of 77/100 on the shipped draft. Step 3 edits in the order the workflow fixes, hard blockers first, so the expensive findings go before the cheap ones. Step 4 runs the scanner again on the rewritten text, which is the step that catches what the rewrite brought in. Step 5 fills both columns, and the pair is what makes either number mean anything.

### Evidence

Capture the prompt exactly as typed, both scanner blocks with their exit statuses, the complete diff, the filled mechanical scan table with both columns and a term-by-term comparison of the two blocks naming anything the rewrite introduced. Record the judgment findings separately, since a three-item list traded for an empty four-item list shows up in neither scanner block.

### Pass / Fail

- **Pass**: both scans ran, both numbers are reported and every term introduced by the rewrite is either fixed or recorded as an exception.
- **Fail**: only the after-number appears, the before-number was reconstructed rather than measured or a term the rewrite introduced is left unaddressed.

### Failure Triage

1. Check the ordering in the transcript. A before-number that appears after the diff was reconstructed, and a reconstruction agrees with the edit by construction.
2. Compare the two blocks term by term rather than by total. A net improvement can carry a new hard blocker inside it, and the totals will not say so.
3. Read the diff for structure as well as terms. A list broken into four items whose fourth says nothing passes both scans and fails the standard.
4. If the after-number is worse than the before-number, confirm it was reported rather than dropped. That result is useful, and it is the one most likely to disappear.

### Optional Supplemental Checks

Copy the dirty fixture to a scratch path outside the packet, run the full sequence against the copy and confirm the before-number matches the shipped control of 6 hard blockers and `67/100`. That gives the scenario a known starting point without touching the fixture itself, and the copy is removed by deleting the scratch path.

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
| [`references/scoring-and-verification.md`](../../references/scoring-and-verification.md) | Section 4, the closing step and the reason a single after-score proves nothing |
| [`assets/voice-report-template.md`](../../assets/voice-report-template.md) | The mechanical scan table with its before and after columns |
| [`scripts/hvr_scan.py`](../../scripts/hvr_scan.py) | The pass run twice |
| [`SKILL.md`](../../SKILL.md) | Section 3 steps 7 to 9, rule ALWAYS 4 and success criterion 2 |
| [`scripts/tests/fixtures/voice-ai-draft.md`](../../scripts/tests/fixtures/voice-ai-draft.md) | The shipped target, reporting 4 hard blockers and 77/100 before the rewrite, copied out before the edit |

---

## 5. SOURCE METADATA

- Group: SCORING AND RESCAN
- Playbook ID: HVR-002
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `scoring-and-rescan/rescan-after-rewrite.md`
