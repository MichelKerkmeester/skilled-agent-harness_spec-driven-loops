---
title: "HVS-002 -- Code and quotations stay byte-identical"
description: "This scenario validates the protected-span rule for `HVS-002`. It confirms a voice pass edits no code block, quotation, error string, command, generated file, released changelog entry or byte-pinned fixture."
stage: routing
version: 1.1.0.2
---

# HVS-002 -- Code and quotations stay byte-identical

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `HVS-002`.

---

## 1. OVERVIEW

This scenario validates the protected-span rule for `HVS-002`. It confirms a voice pass edits no code block, quotation, error string, command, generated file, released changelog entry or byte-pinned fixture.

### Why This Matters

Every failure in this class is silent. A sample stops working. A fixture whose bytes are the assertion fails, and the failure looks like a code bug in whatever the fixture was testing. A generated file is overwritten on the next run, so the edit vanishes and takes the reviewer's trust with it. An error string stops matching what the system emits, which turns a searchable message into a dead end.

The scanner covers part of this and only part. It masks fenced blocks, inline code spans and frontmatter, so those never reach the findings list. It cannot see a quotation in running prose, so a quoted sentence with a blocked word in it arrives looking exactly like the author's own sentence. That gap is the reason this scenario grades the diff rather than the report.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HVS-002` and confirm the expected signals without contradictory evidence.

- Objective: confirm no protected span changes during an `apply` run, and that the scanner's default masking is understood rather than assumed
- Real user request: `Tidy up the writing in this doc. It has some code samples and a copied error message in it.`
- Prompt: `Clean up the writing in this document. It has a few code samples and an error message in it.`
- Expected execution process: the scope gate loads first, section 3 supplies the protected classes, the scanner runs with its default masking, prose findings are edited and the diff is read back span by span before the run is reported.
- Expected signals: the diff touches prose only. Every fenced block, inline code span, quotation, error string and command is byte-identical. The reply states that fenced blocks and inline code spans were masked by default and that `--include-code` would opt back in.
- Desired user-visible outcome: the prose improves and the carried text is unchanged afterwards.
- Pass/fail: PASS when the diff touches prose only and the protected spans are byte-identical. FAIL when any protected span changes, however much better the surrounding prose reads.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Clean up the writing in this document. It has a few code samples and an error message in it.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HVS-002 | Code and quotations stay byte-identical | Verify a voice pass edits prose only and leaves every protected span untouched | `Clean up the writing in this document. It has a few code samples and an error message in it.` | 1. `agent: Read references/scope-and-exemptions.md section 3` -> 2. `bash: python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <target>` -> 3. `agent: Edit prose findings only` -> 4. `bash: git diff --stat <target>` | Step 1: the protected classes are named. Step 2: no finding falls inside a fenced block or an inline code span. Step 3: the edits are confined to prose. Step 4: the changed lines are prose lines | The prompt as typed, the scanner block, the full diff, a per-span reading of the diff against the protected classes and the reply's statement about default masking | PASS when the diff touches prose only and every protected span is byte-identical. FAIL when any protected span changes | 1. Read the diff span by span rather than by hunk. A one-word change inside a quoted error string sits in a hunk that otherwise looks like prose. 2. If a finding was reported inside a fenced block, check whether `--include-code` was passed. It opts into code spans and its effect is easy to mistake for a masking bug. 3. Re-run any test that pins the target's bytes. A fixture edit surfaces as an unrelated test failure |

### Commands

1. `agent: Read references/scope-and-exemptions.md section 3 and name the protected classes present in the target`
2. `bash: python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <target>`
3. `agent: Edit the prose findings only, leaving every protected span untouched`
4. `bash: git diff --stat <target>`

### Expected

Step 1 names the classes the target carries: fenced samples, inline code spans, the quoted error string and any command or path. Step 2 returns findings from prose only, because masking is on by default. Step 3 edits those findings. Step 4 shows a diff confined to prose lines, which is the assertion. The reply also says that fenced blocks and inline code spans were masked and that `--include-code` would have opted back in, because a run that reaches the right answer without knowing why will reach the wrong one on the next target.

### Evidence

Capture the prompt exactly as typed, the scanner block, the complete diff rather than a summary, a per-span reading of the diff against the protected classes and the reply's statement about default masking. Where the target is covered by a byte-drift check or a test that pins its content, record that check's result before and after.

### Pass / Fail

- **Pass**: the diff touches prose lines only, every fenced block, inline code span, quotation, error string and command is byte-identical and the reply explains the masking it relied on.
- **Fail**: any protected span changes, or the run reports a protected span as improved.

### Failure Triage

1. Read the diff span by span. A single word changed inside a quoted error string is the hardest case to see and the most expensive to ship.
2. If findings appeared inside a fenced block, check the command for `--include-code`. It turns masking off deliberately, and its output looks like a masking failure to anyone who did not pass it.
3. Re-run whatever pins the target's bytes. A fixture edit surfaces later as a failing test that blames the wrong change.
4. If a generated file was edited, find its generator and re-run it. The edit is already gone or is about to be, and the correct fix is upstream.

### Optional Supplemental Checks

Run the scanner twice on an unedited copy of the target, once plain and once with `--include-code` and compare the counts. The difference is exactly the violations living inside protected spans, which quantifies what the masking is holding back on this specific document.

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
| [`references/scope-and-exemptions.md`](../../references/scope-and-exemptions.md) | Section 3, both tables of never-in-scope spans |
| [`scripts/hvr_scan.py`](../../scripts/hvr_scan.py) | Masks fenced blocks, inline code spans and frontmatter by default. `--include-code` opts back in |
| [`scripts/tests/fixtures/voice-dirty.md`](../../scripts/tests/fixtures/voice-dirty.md) | Carries its violations twice, once maskable, as the shipped proof of the masking |
| [`SKILL.md`](../../SKILL.md) | Rule NEVER 2, and success criterion 3 |

---

## 5. SOURCE METADATA

- Group: SCOPE GATE
- Playbook ID: HVS-002
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `scope-gate/code-and-quotations-untouched.md`
