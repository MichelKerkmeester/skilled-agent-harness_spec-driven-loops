---
title: "HVT-001 -- Hard blocker terms on the dirty fixture"
description: "This scenario validates the mechanical pass for `HVT-001`. It runs the scanner over the shipped dirty fixture and confirms the hard-blocker count, the arithmetic, the masking of code spans and the non-zero exit."
stage: routing
version: 1.0.0.0
---

# HVT-001 -- Hard blocker terms on the dirty fixture

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `HVT-001`.

---

## 1. OVERVIEW

This scenario validates the mechanical pass for `HVT-001`. It runs the scanner over the shipped dirty fixture and confirms the hard-blocker count, the arithmetic, the masking of code spans and the non-zero exit.

### Why This Matters

The dirty fixture is the packet's byte-pinned control. It carries one finding of each mechanical class and carries the same violations a second time inside a fenced block and an inline code span, where they must stay invisible. Two failures hide behind a scan that looks fine. A parser that has stopped reading the standard reports fewer findings than the fixture contains, and a masking bug reports more. Both look like ordinary output, so the count is the only thing that separates them. Run this scenario before any scenario that quotes a number.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HVT-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm the mechanical pass reports every hard blocker in the shipped dirty fixture, reports the matching arithmetic, masks the duplicated violations and exits 1
- Real user request: `Can you check the voice scanner is still working before I trust it on my draft?`
- Prompt: `Run the human voice scan over the packet's dirty fixture and tell me what it finds.`
- Expected execution process: `references/scope-and-exemptions.md` loads first and identifies the target as a fixture built to trip the scanner, `scripts/hvr_scan.py` runs against `scripts/tests/fixtures/voice-dirty.md` and the reported block is read against the control in `references/scoring-and-verification.md` section 6.
- Expected signals: the report lists 6 hard blockers across the punctuation, word-blocker and phrase-blocker classes, plus two soft deductions. The totals read `hard blockers: 6`, `mechanical deductions: -33` and `mechanical ceiling: 67/100`. The scanner exits 1. Nothing from the fenced block or the inline code span appears in the output.
- Desired user-visible outcome: the user sees the findings grouped by class, the arithmetic and the list of categories the run did not check.
- Pass/fail: PASS when the three totals match, the exit status is 1 and no masked violation is reported. FAIL when any total differs, the exit status is 0 or 2 or a masked violation appears.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the human voice scan over the packet's dirty fixture and tell me what it finds.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HVT-001 | Hard blocker terms on the dirty fixture | Verify the mechanical pass reports the fixture's six hard blockers with matching arithmetic and a non-zero exit | `Run the human voice scan over the packet's dirty fixture and tell me what it finds.` | 1. `agent: Read references/scope-and-exemptions.md and classify the target` -> 2. `bash: python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/tests/fixtures/voice-dirty.md` -> 3. `bash: python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/tests/fixtures/voice-dirty.md --all` -> 4. `bash: git status --porcelain .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/tests/fixtures/voice-dirty.md` | Step 1: the target is named as a fixture built to trip the scanner. Step 2: `hard blockers: 6`, `mechanical deductions: -33`, `mechanical ceiling: 67/100`, exit 1. Step 3: every occurrence carries a line and column, none inside the fenced block or the inline code span. Step 4: empty output | The prompt as typed, the full scanner block from step 2 including the not-scored list, the per-occurrence listing from step 3, both exit statuses and the step 4 output | PASS when the three totals match, the exit status is 1 and no masked violation appears. FAIL when a total differs, the exit status is 0 or 2 or a masked violation appears | 1. Exit 2 means the scanner could not parse the standard. Check whether a section heading in `references/hvr-rules.md` moved before checking anything else. 2. A count above 6 usually means masking broke. Compare the step 3 line numbers against the fenced block in the fixture. 3. A count below 6 with exit 1 means the term lists parsed thin. Re-read the parse floors in `references/scoring-and-verification.md` section 6 |

### Commands

1. `agent: Read references/scope-and-exemptions.md and classify the target before reading any finding`
2. `bash: python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/tests/fixtures/voice-dirty.md`
3. `bash: python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/tests/fixtures/voice-dirty.md --all`
4. `bash: git status --porcelain .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/tests/fixtures/voice-dirty.md`

### Expected

Step 1 loads the scope gate, which is the ALWAYS-level resource and appears on every path including a read-only scan. Step 2 reports 6 hard blockers spread across the punctuation ban, the word blockers and the phrase blockers, plus one soft two-point deduction and one soft one-point deduction, giving `-33` and a ceiling of `67/100` and exits 1. Step 3 prints the same findings one occurrence at a time with a line and a column, which is what makes the masking claim checkable. Step 4 prints nothing, proving a scan changed no bytes.

### Evidence

Capture the prompt exactly as typed, the full scanner block from step 2 with the not-scored list intact, the per-occurrence listing from step 3, the exit status of both scanner runs and the literal output of step 4. Record the fixture's own line count as well, because the masking assertion is a comparison between reported line numbers and the fenced block's position.

### Pass / Fail

- **Pass**: the totals read 6, `-33` and `67/100`, the scanner exits 1, no violation from the fenced block or the inline code span appears and the fixture is unchanged.
- **Fail**: any total differs, the exit status is 0 or 2, a masked violation appears or the fixture shows a diff.

### Failure Triage

1. Read the exit status first. Exit 2 means the parser could not read the standard and refused to report a clean scan, so nothing downstream is trustworthy until a heading in `references/hvr-rules.md` is restored.
2. A count above 6 points at masking. Compare the line numbers from step 3 against the fenced block and the inline code span in the fixture, which sit in the lower half of the file.
3. A count below 6 with exit 1 points at a thin parse. The scanner fails closed below the floors in `references/scoring-and-verification.md` section 6, so a count between 1 and 5 means the floors are set lower than the fixture requires.
4. A diff on the fixture means an earlier scenario in the wave edited a control. Restore it with `git checkout` before re-running anything.

### Optional Supplemental Checks

Re-run step 2 with `--include-code` appended. The count rises, because the duplicated violations inside the fenced block and the inline code span are no longer masked. That is the control proving masking is on by default rather than absent.

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
| [`references/hvr-rules.md`](../../references/hvr-rules.md) | The standard, sections 3, 6, 7 and 8. The scanner parses its term lists from here at run time |
| [`references/scoring-and-verification.md`](../../references/scoring-and-verification.md) | Section 6 carries this scenario's control pair and the fail-closed behavior |
| [`scripts/hvr_scan.py`](../../scripts/hvr_scan.py) | The mechanical pass under test |
| [`scripts/tests/fixtures/voice-dirty.md`](../../scripts/tests/fixtures/voice-dirty.md) | The byte-pinned target |

---

## 5. SOURCE METADATA

- Group: TELL DETECTION
- Playbook ID: HVT-001
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `tell-detection/hard-blocker-terms.md`
