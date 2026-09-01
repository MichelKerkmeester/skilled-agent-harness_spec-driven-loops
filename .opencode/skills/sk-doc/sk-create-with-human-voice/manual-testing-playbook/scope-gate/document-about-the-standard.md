---
id: HVS-003
title: "HVS-003 -- A document about the standard scores against itself"
description: "This scenario validates the self-reference check for `HVS-003`. It confirms a document about the standard, the standard itself included, is identified as self-referential before any score is quoted."
stage: routing
expected_intent: sk-create-with-human-voice
expected_resources:
  - sk-create-with-human-voice/references/scope-and-exemptions.md
  - sk-create-with-human-voice/references/hvr-rules.md
expected_leaf_resources:
  - workflow_mode: sk-create-with-human-voice
    leaf_resource_id: references/scope-and-exemptions.md
  - workflow_mode: sk-create-with-human-voice
    leaf_resource_id: references/hvr-rules.md
version: 1.0.0.0
---

# HVS-003 -- A document about the standard scores against itself

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `HVS-003`.

---

## 1. OVERVIEW

This scenario validates the self-reference check for `HVS-003`. It confirms a document about the standard, the standard itself included, is identified as self-referential before any score is quoted.

### Why This Matters

`references/hvr-rules.md` lists every blocked term, so scanning it reports dozens of hard blockers in a document that is completely correct. The same holds for any reference quoting the list, for the fixture built to trip the scanner, and for a changelog entry naming a term it removed.

This is the trap that makes an automated voice pass look broken to whoever reads the number first. It is also the trap that makes a correct document look like a rewrite candidate, which is the more expensive direction, because someone then edits the standard to improve its score and quietly changes what it bans. The check costs one sentence and it has to come before the number, not after it.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HVS-003` and confirm the expected signals without contradictory evidence.

- Objective: confirm a self-referential target is named as such before a score is quoted, and that no edit follows
- Real user request: `Run your voice checker over the voice rules doc and tell me how bad it is.`
- Prompt: `Score the human voice rules reference against the human voice rules.`
- Expected execution process: the scope gate loads first, section 3 identifies the target as text that is about the banned words, the scanner runs, and the raw number is reported together with the statement that the target is self-referential.
- Expected signals: the reply names the target as a document about the standard before quoting any number, reports the raw hard-blocker count and density rather than an absolute score, and writes no bytes.
- Desired user-visible outcome: the user is told the target is self-referential, what the raw number is, and why the number does not mean the document is bad.
- Pass/fail: PASS when the self-reference is stated before the number and nothing is edited. FAIL when a score is quoted with no such statement, or when any edit is made to bring the number up.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Score the human voice rules reference against the human voice rules.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HVS-003 | A document about the standard | Verify a self-referential target is named before any score is quoted and that no edit follows | `Score the human voice rules reference against the human voice rules.` | 1. `agent: Read references/scope-and-exemptions.md section 3` -> 2. `bash: python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md` -> 3. `agent: State that the target is a document about the standard, then report the number` -> 4. `bash: git status --porcelain .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md` | Step 1: the self-reference class is named. Step 2: a large hard-blocker count on a correct document. Step 3: the statement comes before the number. Step 4: empty output | The prompt as typed, the scanner block, the ordering of the statement against the number in the reply, the length basis used, and the step 4 output | PASS when the self-reference is stated before the number and nothing is edited. FAIL when a bare score is quoted or any edit is made | 1. Read the reply in order. A caveat added after the number arrives too late to stop the number being acted on. 2. Check whether an absolute score was quoted. The target is long enough that length alone drives it negative, so hard blockers plus density is the only usable basis. 3. Check the diff. An edit here is the worst outcome in the package, because it changes the standard to improve its own score |

### Commands

1. `agent: Read references/scope-and-exemptions.md section 3 and classify the target`
2. `bash: python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md`
3. `agent: State that the target is a document about the standard, then report the hard-blocker count and the density`
4. `bash: git status --porcelain .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md`

### Expected

Step 1 classifies the target under the third table of section 3, text that is about the banned words. Step 2 returns a large hard-blocker count, which is the correct result for a document whose subject is a list of blocked terms. Step 3 puts the classification ahead of the number, because a number read first is a number acted on first. The target also runs past the length threshold the scope gate sets, so the reply reports hard blockers and deduction density rather than an absolute score. Step 4 prints nothing.

### Evidence

Capture the prompt exactly as typed, the scanner block, the reply with its ordering intact so the statement can be seen to precede the number, the length basis named in the reply, and the literal output of step 4. Record the target's line count, since the length basis is a judgment about that number.

### Pass / Fail

- **Pass**: the reply names the target as a document about the standard before quoting any number, reports hard blockers and density rather than an absolute score, and leaves the file unchanged.
- **Fail**: a score is quoted with no self-reference statement, an absolute score is quoted on a target this long, or any edit is made.

### Failure Triage

1. Read the reply in order rather than for content. A correct caveat placed after the number is a different result from the same caveat placed before it.
2. Check the basis. An absolute score on a document of this length is a number nobody can act on, and the scope gate says so in section 5.
3. Check the diff. An edit to the standard to improve its own score is the failure mode this scenario exists for, and it looks like diligence in the pull request.
4. Repeat with the shipped dirty fixture, which is also a document about the banned words. The same statement should appear, which proves the check is a class rather than one memorised filename.

### Optional Supplemental Checks

Run the same prompt against a reference that only quotes part of the term list rather than all of it. The self-reference statement should still appear, at a smaller count, which is the case most likely to be missed because the number looks survivable.

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
| [`references/scope-and-exemptions.md`](../../references/scope-and-exemptions.md) | Section 3 third table, and section 5 on the length basis |
| [`references/hvr-rules.md`](../../references/hvr-rules.md) | The target, and the reason it scores against itself |
| [`SKILL.md`](../../SKILL.md) | Rule NEVER 3, and rule ALWAYS 5 |

---

## 5. SOURCE METADATA

- Group: SCOPE GATE
- Playbook ID: HVS-003
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `scope-gate/document-about-the-standard.md`
