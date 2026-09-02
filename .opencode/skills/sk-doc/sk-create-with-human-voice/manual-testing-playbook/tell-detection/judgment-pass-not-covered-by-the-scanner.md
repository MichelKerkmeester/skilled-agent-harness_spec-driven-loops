---
title: "HVT-003 -- The judgment pass the scanner cannot run"
description: "This scenario validates the judgment pass for `HVT-003`. It confirms the eleven categories the scanner prints as unchecked are answered by a reader, so a clean mechanical result is never reported as a clean document."
stage: routing
version: 1.1.0.2
---

# HVT-003 -- The judgment pass the scanner cannot run

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `HVT-003`.

---

## 1. OVERVIEW

This scenario validates the judgment pass for `HVT-003`. It confirms the eleven categories the scanner prints as unchecked are answered by a reader, so a clean mechanical result is never reported as a clean document.

### Why This Matters

The scanner ends every run with the same line, whether it found six blockers or none: `NOT scored here: three-item enumeration, triple headers, setup language, synonym cycling, false ranges, fragmented headers, copula avoidance, significance inflation, generic conclusions, sentence rhythm, personality`.

That line exists because the standard weights those categories at 65% between structure, content and voice, while the term lists the scanner covers weight 20%. So a document can score `100/100` mechanically and still be four-fifths unmeasured. The failure is attractive rather than obvious: an exit code is cheap, unambiguous and reads like a result. This is the scenario that separates a scan from a score.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HVT-003` and confirm the expected signals without contradictory evidence.

- Objective: confirm a reader answers the unchecked categories, so the reported verdict covers the whole standard rather than the term lists
- Real user request: `Is this draft good enough to publish?`
- Prompt: `Score this draft against the human voice rules and tell me whether it is ready to publish.`
- Expected execution process: the scope gate loads first, `scripts/hvr_scan.py` runs and returns the mechanical block, `references/scoring-and-verification.md` section 2 supplies the two-pass order and a reader then answers the four judgment groups: structural patterns, sentence-level habits, content habits and voice.
- Expected signals: the reply carries the mechanical block and a separate set of judgment findings, kept apart so each is traceable to its pass. A verdict quoting only the ceiling or the exit code does not appear.
- Desired user-visible outcome: the user gets the mechanical number and a reader's findings, and can see which came from which pass.
- Pass/fail: PASS when both passes are reported separately and the judgment groups are each addressed. FAIL when the verdict rests on the scanner's exit code or ceiling alone, even on a document with no mechanical findings.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Score this draft against the human voice rules and tell me whether it is ready to publish.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HVT-003 | The judgment pass the scanner cannot run | Verify the eleven unchecked categories are answered by a reader rather than implied by a clean mechanical result | `Score this draft against the human voice rules and tell me whether it is ready to publish.` | 1. `agent: Read references/scoring-and-verification.md section 2` -> 2. `bash: python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <target>` -> 3. `agent: Answer the four judgment groups against the target text` -> 4. `agent: Report the mechanical block and the judgment findings as two separate lists` | Step 1: the two-pass order is stated before any number. Step 2: the mechanical block ends with the not-scored list. Step 3: each judgment group carries either a finding or an explicit nothing-found. Step 4: the two lists stay separate | The prompt as typed, the full scanner block including the not-scored list, the exit status, the four judgment groups with their findings and the final verdict with the basis it rests on | PASS when both passes are reported separately and every judgment group is addressed. FAIL when the verdict rests on the exit code or the ceiling alone | 1. Search the reply for the not-scored list. Its absence usually means the scanner block was summarised, and the summary is where the eleven categories go missing. 2. Count the judgment groups addressed. Fewer than four means the pass was partly run and wholly reported. 3. Check whether the verdict cites a number or a reading. A verdict citing only a number is the failure, whatever the number was |

### Commands

1. `agent: Read references/scoring-and-verification.md section 2 and state the two-pass order`
2. `bash: python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <target>`
3. `agent: Answer the four judgment groups against the target text, naming a finding or an explicit nothing-found for each`
4. `agent: Report the mechanical block and the judgment findings as two separate lists`

### Expected

Step 1 states that the mechanical pass runs first because it is cheap and unarguable, and that the judgment pass follows because nothing in it can be settled by a pattern. Step 2 returns the scanner block, which ends with the eleven unchecked categories on every run. Step 3 answers the four groups the standard organises those categories into. Step 4 keeps the two results apart, so a reader can tell which claim came from a machine and which came from a person.

### Evidence

Capture the prompt exactly as typed, the full scanner block with the not-scored list intact, the exit status, the four judgment groups with a finding or an explicit nothing-found for each and the final verdict together with the basis it rests on. A verdict with no stated basis cannot be graded, because the whole scenario is about which pass the verdict came from.

### Pass / Fail

- **Pass**: the mechanical block and the judgment findings appear as two lists, every judgment group is addressed and the verdict names the basis it rests on.
- **Fail**: the verdict rests on the exit code or the ceiling alone, the not-scored list is dropped from the transcript or a judgment group is left unaddressed.

### Failure Triage

1. Look for the not-scored list in the transcript. A summarised scanner block is the usual place the eleven categories disappear, and the summary reads as a faithful report.
2. Count the judgment groups that received an answer. Structural patterns, sentence-level habits, content habits and voice are four groups and three of four is a partly run pass reported as a whole one.
3. Re-run the scenario against a target with no mechanical findings at all. If the verdict is still a pass with no judgment findings, the run is reading the exit code and nothing else.
4. Confirm `references/scoring-and-verification.md` was loaded. Section 2 is where the two-pass order lives, and a run that never read it has no reason to expect a second pass.

### Optional Supplemental Checks

Feed the shipped clean fixture through the same prompt. It reports no mechanical findings and a ceiling of `100/100`, so any reply that calls it publish-ready without a reading has demonstrated the failure on a target where the failure is unmistakable.

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
| [`references/scoring-and-verification.md`](../../references/scoring-and-verification.md) | Section 2 carries the two-pass order and the judgment list |
| [`references/hvr-rules.md`](../../references/hvr-rules.md) | Sections 4 and 5 define the structural, content and voice categories the judgment pass answers |
| [`scripts/hvr_scan.py`](../../scripts/hvr_scan.py) | Prints the unchecked categories on every run, including a run with no findings |
| [`SKILL.md`](../../SKILL.md) | Section 3 step 4, and success criterion 4 |

---

## 5. SOURCE METADATA

- Group: TELL DETECTION
- Playbook ID: HVT-003
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `tell-detection/judgment-pass-not-covered-by-the-scanner.md`
