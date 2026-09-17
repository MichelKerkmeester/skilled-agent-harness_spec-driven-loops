---
title: "HVT-002 -- A scanner finding is a candidate, not a verdict"
description: "This scenario validates the sense check for `HVT-002`. It confirms a mechanical finding is decided by word sense rather than spelling, so the literal sense of a blocked term survives and the metaphorical sense does not."
stage: routing
version: 1.1.0.4
---

# HVT-002 -- A scanner finding is a candidate, not a verdict

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `HVT-002`.

---

## 1. OVERVIEW

This scenario validates the sense check for `HVT-002`. It confirms a mechanical finding is decided by word sense rather than spelling, so the literal sense of a blocked term survives and the metaphorical sense does not.

### Why This Matters

The scanner matches spelling. `harness` the noun, meaning the AI runtime, is the literal sense the standard permits. `harness` the verb, meaning "use", is a hard blocker. Both are reported identically, with a line and a column each and nothing in the output separates them.

That leaves two ways to fail, and they fail in opposite directions. Accepting every finding edits correct prose and quietly changes what a sentence names. Dismissing every finding turns the mechanical pass into decoration. The shipped worked example in `references/scoring-and-verification.md` section 5 is exactly this case: two hard blockers on a document that passed review, both correct, both kept.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HVT-002` and confirm the expected signals without contradictory evidence.

- Objective: confirm each mechanical finding is decided by sense, with one occurrence edited, one kept and the kept one recorded as an exception
- Real user request: `The scanner flagged the same word twice in this file. One of them looks fine to me.`
- Prompt: `The scanner flagged two occurrences of the same word in this file. Fix the writing.`
- Expected execution process: the scope gate loads first, `scripts/hvr_scan.py` runs with `--all` so each occurrence carries a line and a column, section 4 of `references/scope-and-exemptions.md` supplies the sense rule and each occurrence is read in its own sentence before anything is edited.
- Expected signals: the reply names the sense of each occurrence separately, edits the metaphorical one, keeps the literal one and records the kept one as an exception with its reason. The re-scan still reports the kept occurrence.
- Desired user-visible outcome: the user gets one edit, one recorded exemption and the reason each was decided that way.
- Pass/fail: PASS when the two occurrences receive different decisions and the kept one is recorded with a reason. FAIL when both are edited, both are dismissed or the kept one appears with no note.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `The scanner flagged two occurrences of the same word in this file. Fix the writing.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HVT-002 | A scanner finding is a candidate | Verify word sense decides each finding, so the literal occurrence survives and the metaphorical one does not | `The scanner flagged two occurrences of the same word in this file. Fix the writing.` | 1. `agent: Read references/scope-and-exemptions.md section 4` -> 2. `bash: cp .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/tests/fixtures/voice-two-senses.md /tmp/hvr-hvt-002.md` -> 3. `bash: python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py /tmp/hvr-hvt-002.md --all` -> 4. `agent: Read each reported occurrence in its own sentence, state its sense and edit only the blocked one` -> 5. `bash: python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py /tmp/hvr-hvt-002.md --all` | Step 1: the sense rule is loaded before any edit. Step 2: the copy is written outside the packet. Step 3: both occurrences appear with a line and a column. Step 4: the two senses are named separately. Step 5: the literal occurrence is still reported and the metaphorical one is gone | The prompt as typed, both scanner listings with line and column, the sense stated for each occurrence, the diff and the exception row for the kept occurrence | PASS when the two occurrences receive different decisions and the kept one carries a recorded reason. FAIL when both are edited, both are dismissed or the kept one has no note | 1. Check that `--all` was used. Without it the grouped report gives one line for the term and the two occurrences cannot be told apart. 2. Check whether the sense was stated per occurrence or once for the term. A single verdict for a term is the failure this scenario catches. 3. Confirm the kept occurrence is still reported by the step 5 re-scan. A scan that no longer reports it means the occurrence was edited after all |

### Commands

1. `agent: Read references/scope-and-exemptions.md section 4 and state the sense rule`
2. `bash: cp .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/tests/fixtures/voice-two-senses.md /tmp/hvr-hvt-002.md`
3. `bash: python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py /tmp/hvr-hvt-002.md --all`
4. `agent: Read each reported occurrence in its own sentence, state whether the sense is literal or metaphorical and edit only the blocked one`
5. `bash: python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py /tmp/hvr-hvt-002.md --all`

### Expected

Step 1 loads the sense rule, which lives in the scope gate rather than in the standard, because the standard was written for the writing and not for the tooling around it. Step 2 copies the shipped fixture out of the packet, because this scenario edits its target and precondition 6 fails any run that leaves a diff under the packet. Step 3 lists both occurrences with a line and a column, which is the only way to read each one in context. Step 4 names the two senses separately and edits the blocked one. Step 5 still reports the kept occurrence, and that surviving finding is the proof the pass declined it deliberately rather than missing it.

### Evidence

Capture the prompt exactly as typed, both `--all` listings, the sentence around each occurrence, the sense stated for each, the diff of the edit and the exception row recording the kept occurrence and its reason. Record the before and after hard-blocker counts, since the count should drop by exactly one.

### Pass / Fail

- **Pass**: the two occurrences receive different decisions, the metaphorical one is edited, the literal one is untouched and the kept one carries a recorded reason.
- **Fail**: both occurrences are edited, both are dismissed, the kept one appears with no note or the decision is stated once for the term rather than once per occurrence.

### Failure Triage

1. Confirm `--all` was used. The grouped report collapses a term to one row, so a run without it never had the information this scenario asks for.
2. Read how the decision was phrased. "This word is fine" is a verdict on a term. The scenario needs a verdict on an occurrence.
3. Re-run the scan and confirm the kept occurrence is still reported. A pass that edits both and reports a clean scan has produced a better number and a worse document.
4. If the run edited the literal occurrence, check whether the scope gate was loaded at all. Section 4 is where the sense rule lives, and its absence explains the whole failure.

### Optional Supplemental Checks

Repeat with a term the standard lists as context-dependent, such as the industry noun sense against the photographic sense. The same two-decision shape should hold, which proves the sense check is a habit rather than a memorised pair of words.

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
| [`references/scope-and-exemptions.md`](../../references/scope-and-exemptions.md) | Section 4 carries the sense rule and the accuracy caveat |
| [`references/hvr-rules.md`](../../references/hvr-rules.md) | Sections 6 and 8 list the terms, including the context-dependent set |
| [`references/scoring-and-verification.md`](../../references/scoring-and-verification.md) | Section 5 is the shipped worked example of two correct findings that were kept |
| [`SKILL.md`](../../SKILL.md) | Section 3 step 3, which states that a finding is a candidate |
| [`scripts/tests/fixtures/voice-two-senses.md`](../../scripts/tests/fixtures/voice-two-senses.md) | The shipped target, carrying `harness` as a noun and as a verb, copied out before the edit |

---

## 5. SOURCE METADATA

- Group: TELL DETECTION
- Playbook ID: HVT-002
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `tell-detection/word-sense-is-a-candidate.md`
