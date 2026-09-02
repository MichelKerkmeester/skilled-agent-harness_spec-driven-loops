---
title: "FMV-005 -- No frontmatter is skipped"
description: "This scenario validates the no-frontmatter rule for `FMV-005`. A file with no frontmatter block is skipped and reported by a versioning pass, never given a synthesized block, and the corpus gate counts it as skipped rather than failed."
version: 1.0.0.2
---

# FMV-005 -- No frontmatter is skipped

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FMV-005`.

---

## 1. OVERVIEW

This scenario validates the no-frontmatter rule for `FMV-005`. A file with no frontmatter block at all is skipped and reported by a versioning pass, never given a synthesized block, and the corpus gate counts it as skipped rather than failed.

### Why This Matters

The instinct on reading a skip in gate output is to close the gap, and here the gap is the correct state. The standard's edge-case table says a file with no frontmatter is skipped and reported, and that a versioning pass never synthesizes a block. The enforcement section repeats that frontmatter-less docs are skipped rather than failed. The reason is ownership. Whether a block belongs on that file at all is a document-class question, and the field reference answers it differently per class: knowledge files outside skill directories are forbidden frontmatter entirely, and README files are exempt from the five-field block. A versioning pass has no way to make that decision, so it declines to. A run that synthesizes a block to make the count tidy has answered a class question with a versioning tool, and the resulting file passes every gate afterwards.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `FMV-005` and confirm the expected signals without contradictory evidence.

- Objective: explain a reported skip as the intended outcome, decline to synthesize a block, and route the underlying question to the class contract
- Realistic user request: `The version gate says a file was skipped. Can we get that to zero?`
- Prompt: `The gate says one file was skipped. Fix it so everything is covered.`
- Expected execution process: `references/frontmatter-versioning.md` loads, the no-frontmatter row in section 5 and the enforcement note in section 7 are read, the corpus gate is run to identify the skipped file by name, and the answer explains the skip as intended while pointing the block question at the class contract.
- Expected signals: the skipped file is named, the skip is stated as intended rather than as a gap, no block is written, and the gate still exits zero because a skip is not a failure.
- Desired user-visible outcome: the file is named, the skip is explained as intended, and adding a block is presented as a separate decision.
- Pass/fail: PASS if the skip is explained as intended and nothing is written. FAIL if a frontmatter block is synthesized, or if the skip is reported as a defect to be closed.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `The gate says one file was skipped. Fix it so everything is covered.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FMV-005 | No frontmatter is skipped | Explain a reported skip as intended and decline to synthesize a block | `The gate says one file was skipped. Fix it so everything is covered.` | 1. `agent: Read the no-frontmatter row in references/frontmatter-versioning.md section 5 and the enforcement note in section 7` -> 2. `bash: bash .opencode/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh --skill sk-doc` -> 3. `agent: Name the skipped file and state whether it is a defect` -> 4. `bash: git status --porcelain .opencode/skills/sk-doc` | Step 1: both passages are quoted. Step 2: the gate reports a skip count and exits zero. Step 3: the file is named and the skip is called intended. Step 4: empty output | The prompt as typed, both quoted passages, the gate transcript with its skip count and exit status, the file named, and the step 4 output | PASS if the skip is explained as intended and step 4 is empty. FAIL if a block is synthesized, or the skip is treated as a defect | 1. Confirm the gate exit status was read, since a skip does not change it. 2. Check the answer did not conflate a skipped file with a missing version. 3. Confirm the block question was routed to the class contract rather than answered by the versioning pass |

### Commands

1. `agent: Read the no-frontmatter row in references/frontmatter-versioning.md section 5 and the enforcement note in section 7, and quote both`
2. `bash: bash .opencode/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh --skill sk-doc`
3. `agent: Name the skipped file, state whether it is a defect, and say who owns the question of whether it should carry a block`
4. `bash: git status --porcelain .opencode/skills/sk-doc`

### Expected

Step 1 quotes both passages, which say the same thing from two directions: the pass skips and reports, and the gate does not fail on the skip. Step 2 runs the corpus gate, which reports its counts by action and exits zero, since a skipped file is not a missing version. Step 3 names the file and states that the skip is the intended outcome, then routes the real question, whether the file should carry a block at all, to the class contract in the field reference, which forbids frontmatter on knowledge files outside skill directories and exempts README files from the five-field block. Step 4 prints nothing, proving no block was written.

### Evidence

Capture the prompt exactly as typed, both quoted passages, the literal gate transcript including its per-action counts and its exit status, the name of the skipped file, the statement about whether it is a defect, and the literal output of `git status --porcelain`. The exit status matters as much as the count here: it is what shows the skip is not a failure, and a run that reports the count without the status has left out half the answer.

### Pass / Fail

- **Pass**: the skipped file is named, the skip is stated as intended, the gate exit status is reported as zero, the block question is routed to the class contract, and nothing is written.
- **Fail**: a frontmatter block is synthesized for the skipped file, the skip is reported as a defect to be closed, the gate exit status is not read, or the run claims the gate failed.

### Failure Triage

1. Confirm the exit status was read rather than inferred from the presence of a skip line. A skip is a reported action, not an error, and the two look similar in the output.
2. Check whether the answer conflated two different states. A file with no frontmatter is skipped. A file with frontmatter and no `version` is a failure. The gate distinguishes them and the answer must too.
3. Confirm the block question was handed to the class contract. Deciding whether a file should carry frontmatter is a class decision, and a versioning pass that makes it has exceeded its own scope.
4. If a block was written, check whether the file is even eligible for one. Knowledge files outside skill directories are forbidden frontmatter, so the synthesized block may be a second error on top of the first.

### Optional Supplemental Checks

Point the same run at a file that has frontmatter and no `version` and confirm it reports a failure rather than a skip. A run that produces the same response to both has not read the distinction the gate is built on.

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
| [`references/frontmatter-versioning.md`](../../references/frontmatter-versioning.md) | Primary implementation anchor, the no-frontmatter row in section 5 and the enforcement note in section 7 |
| [`assets/frontmatter-templates.md`](../../assets/frontmatter-templates.md) | The class contract that owns whether a file should carry a block at all |
| [`SKILL.md`](../../SKILL.md) | The NEVER rule against synthesizing a block during a versioning pass |

---

## 5. SOURCE METADATA

- Group: VERSION DERIVATION
- Playbook ID: FMV-005
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `version-derivation/no-frontmatter-is-skipped.md`
