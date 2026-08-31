---
title: "RRA-001 -- Full rule authoring"
description: "This scenario validates full rule authoring for `RRA-001`. It focuses on the one path where all four decision tests pass, producing a structurally conforming rule inside the length bands."
stage: routing
version: 1.0.0.0
---

# RRA-001 -- Full rule authoring

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `RRA-001`.

---

## 1. OVERVIEW

This scenario validates full rule authoring for `RRA-001`. It focuses on the one path where all four decision tests pass, producing a structurally conforming rule inside the length bands.

### Why This Matters

This is the only scenario in the package that ends with a file, and it is the reason the workflow exists. Everything the refusal scenarios protect is worth nothing if the admitted case produces a rule the corpus would reject. The subject is chosen because no shipped rule owns it: working alongside another session in the same repository. Checking that first is itself part of the test, since the nearest miss here is a proposal that feels new and is actually a section of an existing file.

Destructive note: this scenario writes a file. Run it on a scratch branch or revert with `git checkout` afterwards, and confirm the target path was clean before starting.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `RRA-001` and confirm the expected signals without contradictory evidence.

- Objective: author a rule that passes all four decision tests and satisfies the structural invariants and the length bands
- Real user request: `Two of us run sessions in this repo at the same time and we keep clobbering each other's edits. Make that a rule.`
- Prompt: `We often have two agent sessions working in this repo at once, and they keep overwriting each other's uncommitted edits. Add a repo rule for working safely alongside another live session.`
- Expected execution process: the decision tests load and all four pass. The content fires on an action rather than binding unconditionally, it is posture rather than routing, it is a cluster with no existing owner, and it names a failure that happens today. The anatomy reference and the rule template then load, the ten fixed elements are filled, and the creation standards are run against the draft before it is considered finished.
- Expected signals: a new file exists under `repo-rules/`, its frontmatter carries the six keys in the fixed order, the title line and both quoted lines match the corpus, dividers equal numbered sections, the closing section is a self-check checklist, and the total line count lands inside a named band.
- Desired user-visible outcome: a rule the user can read once and act on, indistinguishable in shape from the eight already shipped.
- Pass/fail: PASS if all four tests are shown to pass and the produced file satisfies every structural invariant and lands at 250 lines or fewer; FAIL if any fixed element is missing, dividers do not equal numbered sections, or the file exceeds the bands.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `We often have two agent sessions working in this repo at once, and they keep overwriting each other's uncommitted edits. Add a repo rule for working safely alongside another live session.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RRA-001 | Full rule authoring | Verify an admitted proposal produces a rule matching every structural invariant inside the length bands | `We often have two agent sessions working in this repo at once, and they keep overwriting each other's uncommitted edits. Add a repo rule for working safely alongside another live session.` | 1. `agent: Read references/decision-tests.md and show all four passing` -> 2. `bash: grep -rni -e concurrent -e 'another session' repo-rules/` -> 3. `agent: Read references/rule-anatomy.md and fill assets/repo-rule-template.md` -> 4. `agent: Read references/creation-standards.md and apply the five tests` -> 5. `bash: awk 'NR==1&&/^---$/{fm=1;next} fm&&/^---$/{fm=0;next} /^## [0-9]+\./{s++} /^---$/{d++} END{print s, d, NR}' repo-rules/NEWFILE.md` | Step 1: four passes, none skipped. Step 2: no existing owner is found. Step 3: a draft carrying the ten fixed elements. Step 4: the five standards are answered by reading, not asserted. Step 5: the printed section and divider counts are equal and the line count is inside a band | The four test answers, the step 2 output, the draft path, the five standard answers, and the step 5 counts | PASS if step 1 shows four passes, step 2 returns no match, and step 5 prints equal section and divider counts with a line count at or under 250; FAIL if a fixed element is missing, the counts differ, or the file exceeds 250 lines | 1. Run step 2 first if the run stalls, since an unnoticed existing owner turns this into a duplication defect rather than an authoring one. 2. Check the divider count against the numbered-section count directly, because that invariant holds in all nine shipped files with zero variance and is the fastest structural signal. 3. If the line count exceeds the bands, cut a section rather than compressing every line, since a rule starting long usually carries a section that belongs elsewhere |

### Commands

1. `agent: Read references/decision-tests.md and show all four tests passing with their answers`
2. `bash: grep -rni -e concurrent -e 'another session' repo-rules/`
3. `agent: Read references/rule-anatomy.md and fill assets/repo-rule-template.md`
4. `agent: Read references/creation-standards.md and apply the five tests to the draft`
5. `bash: awk 'NR==1&&/^---$/{fm=1;next} fm&&/^---$/{fm=0;next} /^## [0-9]+\./{s++} /^---$/{d++} END{print s, d, NR}' repo-rules/NEWFILE.md`

### Expected

Step 1 returns four passes with reasons, not a blanket assertion that the proposal is fine. Step 2 returns no match, confirming no shipped rule owns the subject. Step 3 produces a draft carrying all ten fixed elements: the six-key frontmatter in one order, the title line, the routed-from line, the verbatim subordination line, an unnumbered fires-when list, an unnumbered single binding sentence, a sequentially numbered uppercase body, dividers matching those sections, a closing self-check checklist, and a resolving back-link. Step 4 answers the five standards by reading the draft. Step 5 prints three numbers: numbered sections, dividers, and total lines. The command skips the frontmatter delimiters, so the first two are equal in every conforming rule and the third is at or under 250.

### Evidence

Capture the four decision-test answers with reasons, the step 2 output in full, the path and full text of the produced file, the five standards answers, and the three numbers step 5 prints. Record the band the line count falls into by name, since the bands are the operator-set constraint and a number without its band is harder to grade.

### Pass / Fail

- **Pass**: all four tests pass with stated reasons, no existing owner is found, the file carries all ten fixed elements, dividers equal numbered sections, and the total is at or under 250 lines.
- **Fail**: any fixed element is missing, the divider count differs from the numbered-section count, the file exceeds 250 lines, or the four tests were asserted rather than answered.

### Failure Triage

1. Run step 2 before anything else if the result looks wrong. An existing owner makes this a duplication defect, which is a different fix from an authoring defect.
2. Compare the divider count against the numbered-section count directly. That invariant holds in all nine shipped files with no exception, so a mismatch localizes the problem faster than reading the draft.
3. If the file exceeds the bands, remove a section rather than tightening every sentence. A new rule that starts long usually contains a section that belongs in another file or nowhere.

### Optional Supplemental Checks

Compare the produced file against the shortest shipped rule side by side. A generated rule that is longer than every shipped one on a narrower subject is a signal the draft is padded, even when every structural check passes.

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
| [`references/rule-anatomy.md`](../../references/rule-anatomy.md) | Primary implementation anchor, sections 1 and 3 |
| [`assets/repo-rule-template.md`](../../assets/repo-rule-template.md) | The blank the draft is filled from |

---

## 5. SOURCE METADATA

- Group: RULE AUTHORING
- Playbook ID: RRA-001
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `rule-authoring/full-rule-authoring.md`
