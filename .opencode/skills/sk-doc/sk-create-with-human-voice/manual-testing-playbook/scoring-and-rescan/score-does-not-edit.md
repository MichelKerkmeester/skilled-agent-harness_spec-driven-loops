---
id: HVR-001
title: "HVR-001 -- A score reports and does not edit"
description: "This scenario validates the score operation for `HVR-001`. It confirms a score run leaves the target byte-identical, using the shipped clean fixture as the control."
stage: routing
expected_intent: sk-create-with-human-voice
expected_resources:
  - sk-create-with-human-voice/references/scoring-and-verification.md
  - sk-create-with-human-voice/assets/voice-report-template.md
expected_leaf_resources:
  - workflow_mode: sk-create-with-human-voice
    leaf_resource_id: references/scoring-and-verification.md
  - workflow_mode: sk-create-with-human-voice
    leaf_resource_id: assets/voice-report-template.md
version: 1.0.0.0
---

# HVR-001 -- A score reports and does not edit

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `HVR-001`.

---

## 1. OVERVIEW

This scenario validates the score operation for `HVR-001`. It confirms a score run leaves the target byte-identical, using the shipped clean fixture as the control.

### Why This Matters

Two operations route to this mode. One edits and one does not, and the only thing separating them is whether bytes changed. A run that scored correctly and also tidied one sentence has collapsed the pair, and the user who asked for a number now has a diff to review.

The clean fixture is the right target because it removes every excuse. It reports no mechanical findings, a ceiling of `100/100`, and exit 0, so there is nothing to fix and any diff at all is unambiguous. The failure it catches is a helpful one: the pass sees something it could improve and improves it, on a run that was asked only to measure.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HVR-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm the score operation reports a number and writes no bytes
- Real user request: `Just tell me how this file scores. Do not touch it, I have not committed yet.`
- Prompt: `How does this file score against the human voice rules? Do not change anything.`
- Expected execution process: the scope gate loads, the operation resolves to `score` rather than `apply`, `scripts/hvr_scan.py` runs against the clean fixture, the result is reported through the report template with the two after-columns dropped, and the working tree is checked.
- Expected signals: the scanner reports `no mechanical findings`, `hard blockers: 0`, `mechanical ceiling: 100/100`, and exits 0. `git status --porcelain` for the fixture prints nothing.
- Desired user-visible outcome: the user gets a number and an unchanged file.
- Pass/fail: PASS when the reported totals match and the porcelain output is empty. FAIL when the fixture shows any diff, or when the run reports an edit it thought was an improvement.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `How does this file score against the human voice rules? Do not change anything.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HVR-001 | A score reports and does not edit | Verify the score operation returns a number and leaves the target byte-identical | `How does this file score against the human voice rules? Do not change anything.` | 1. `agent: Read references/scope-and-exemptions.md and resolve the operation` -> 2. `bash: python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/tests/fixtures/voice-clean.md` -> 3. `agent: Report through assets/voice-report-template.md with the after-columns dropped` -> 4. `bash: git status --porcelain .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/tests/fixtures/voice-clean.md` | Step 1: the operation resolves to score. Step 2: `no mechanical findings`, `hard blockers: 0`, `mechanical ceiling: 100/100`, exit 0. Step 3: the report has one set of numbers rather than two. Step 4: empty output | The prompt as typed, the full scanner block, the exit status, the filled report, and the literal step 4 output | PASS when the totals match and step 4 prints nothing. FAIL when the fixture shows any diff | 1. If step 4 is non-empty, run `git diff` on the fixture and read what changed. An improvement made during a score run is still a failure. 2. If the report carries before and after columns, the run treated the operation as an edit. Check how the operation was resolved in step 1. 3. Exit 2 means the scanner could not read the standard, and no verdict from this run is usable |

### Commands

1. `agent: Read references/scope-and-exemptions.md and resolve the operation as score rather than apply`
2. `bash: python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/tests/fixtures/voice-clean.md`
3. `agent: Report through assets/voice-report-template.md with the two after-columns dropped`
4. `bash: git status --porcelain .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/tests/fixtures/voice-clean.md`

### Expected

Step 1 resolves the operation before anything runs, because the two operations differ by exactly one property and the prompt states it outright. Step 2 returns `no mechanical findings` with a ceiling of `100/100` and exits 0, which is the shipped control for the clean fixture. Step 3 fills the report with a single set of numbers, since the template drops the after-columns on a score run. Step 4 prints nothing, and that empty line is the whole assertion.

### Evidence

Capture the prompt exactly as typed, the full scanner block including the not-scored list, the exit status, the filled report, and the literal output of step 4. Record the fixture's modification time before and after as a second reading, since an edit followed by a revert leaves porcelain empty and the timestamp changed.

### Pass / Fail

- **Pass**: the scanner reports no mechanical findings with a ceiling of `100/100` and exit 0, the report carries one set of numbers, and step 4 prints nothing.
- **Fail**: the fixture shows any diff, the report carries before and after columns, or the run describes an edit it made.

### Failure Triage

1. If step 4 printed anything, run `git diff` on the fixture and read the change. A well-meant improvement during a score run is the failure this scenario is built to catch.
2. If the report carries two sets of numbers, the run resolved the operation as `apply`. Re-read how step 1 decided, since the prompt says not to change anything.
3. Exit 2 invalidates the run. The scanner could not read the standard, so restore the standard's section headings before drawing any conclusion.
4. Compare the modification timestamp. An edit and a revert inside the same run leaves the porcelain output empty and is still the failure.

### Optional Supplemental Checks

Repeat against the dirty fixture with the same prompt. The number changes and the empty porcelain output does not, which proves the no-edit property belongs to the operation rather than to a target with nothing worth fixing.

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
| [`references/scoring-and-verification.md`](../../references/scoring-and-verification.md) | Section 6 carries the clean-fixture control |
| [`assets/voice-report-template.md`](../../assets/voice-report-template.md) | Section 2, and the instruction to drop the after-columns on a score run |
| [`scripts/tests/fixtures/voice-clean.md`](../../scripts/tests/fixtures/voice-clean.md) | The target |
| [`SKILL.md`](../../SKILL.md) | Section 2 on the two routed operations, and section 3 step 6 |

---

## 5. SOURCE METADATA

- Group: SCORING AND RESCAN
- Playbook ID: HVR-001
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `scoring-and-rescan/score-does-not-edit.md`
