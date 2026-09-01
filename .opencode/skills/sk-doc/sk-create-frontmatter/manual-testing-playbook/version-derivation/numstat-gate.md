---
title: "FMV-002 -- Numstat gate"
description: "This scenario validates the numstat gate for `FMV-002`. The build segment counts only commits whose own added-plus-deleted line count for that file is above zero, and the ungated count is three to five times too high."
version: 1.0.0.0
---

# FMV-002 -- Numstat gate

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FMV-002`.

---

## 1. OVERVIEW

This scenario validates the numstat gate for `FMV-002`. The build segment is the file's real edit count, meaning the number of commits whose own added-plus-deleted line count for that file is above zero, and the ungated count is wrong by a large multiple rather than a small one.

### Why This Matters

This is the critical scenario in the package because its failure mode is a number that looks entirely reasonable. A version of `1.5.0.19` on a document edited four times passes every format check, sorts correctly, and reads like a mature file. The standard names both inflators. A historical repository-wide path move left every file carrying its whole pre-move history as commits that changed zero of its lines, and bulk sweep commits touch a file's siblings while listing the file in the commit. Together they put a naive count at three to five times the real one. The gate removes both by asking each commit what it did to this file specifically. Nothing downstream catches an ungated number, because the corpus gate checks presence and format and never checks whether a version is the right one, so the only defence is running the gated count and the ungated count side by side.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `FMV-002` and confirm the expected signals without contradictory evidence.

- Objective: produce a gated real edit count for one file, show the ungated count beside it, and name the gap
- Realistic user request: `How many real edits has this file had? I need it for the version.`
- Prompt: `How many times has this file actually been edited? I need the build number for its version.`
- Expected execution process: `references/frontmatter-versioning.md` loads, section 4 supplies the real-edit-count rule, `git log --follow --numstat` is run for the single file, commits whose added-plus-deleted count for that file is zero are discarded, the surviving count becomes the build segment, and the ungated commit count is reported alongside it.
- Expected signals: two numbers are reported, the gated one is the smaller, the gap is named, and the two documented inflators are given as the reason. The build segment is capped, and brand-new files with zero or one commit report zero.
- Desired user-visible outcome: a gated count, the ungated count beside it, and the gap named.
- Pass/fail: PASS if both counts are shown and the gated one is used. FAIL if only one number is produced, if the gate is described but not run, or if the ungated count is used as the build segment.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `How many times has this file actually been edited? I need the build number for its version.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FMV-002 | Numstat gate | Produce a gated real edit count with the ungated count beside it and the gap named | `How many times has this file actually been edited? I need the build number for its version.` | 1. `agent: Read references/frontmatter-versioning.md section 4 and state the real edit count rule` -> 2. `bash: git log --follow --numstat -- .opencode/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md` -> 3. `agent: Count commits whose added-plus-deleted for this file is above zero, and count all commits separately` -> 4. `agent: Report both numbers, name the gap, and give the two documented inflators` | Step 1: the rule is quoted as a per-file line-count gate. Step 2: numstat rows are present for every commit. Step 3: two distinct counts. Step 4: the gated count is the smaller and the gap is explained | The prompt as typed, the rule as quoted, the full command transcript, both counts, the gap, and the two inflators named | PASS if both counts are shown and the gated one is used as the build segment. FAIL if one number is produced, the gate is described but never run, or the ungated count is used | 1. Check whether numstat rows were read, since `--follow` alone produces a commit list with no line counts. 2. Confirm zero-line commits were discarded rather than counted. 3. Compare the gated count against the engine's own derived build segment for the same file |

### Commands

1. `agent: Read references/frontmatter-versioning.md section 4 and state the real edit count rule`
2. `bash: git log --follow --numstat -- .opencode/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md`
3. `agent: Count the commits whose added-plus-deleted line count for this file is above zero, and separately count every commit listed`
4. `agent: Report both numbers, name the gap between them, and give the two documented inflators`

### Expected

Step 1 quotes the rule: the build segment counts commits whose own added-plus-deleted line count for that file is above zero, traced with `--follow` for continuity across renames and gated per file. Step 2 produces the raw material, one numstat block per commit, which is what makes the gate checkable rather than assertable. Step 3 yields two counts that differ. Step 4 names the gap and attributes it to the historical repository-wide move and to bulk sweep commits, and applies the cap on the build segment. A file with zero or one commit reports a build of zero.

### Evidence

Capture the prompt exactly as typed, the rule as quoted from section 4, the literal `git log --follow --numstat` transcript, the gated count, the ungated count, the gap between them, and the two inflators named. Both counts are required. The assertion in this scenario is a comparison, and a single number cannot be graded because a wrong build segment is a well-formed integer.

### Pass / Fail

- **Pass**: both counts are reported, the gated count is the smaller, the gated count is used as the build segment, and the gap is attributed to the documented inflators.
- **Fail**: only one count is produced, the gate is described without being run, the ungated count is used as the build segment, or the numstat rows were never read and the count came from commit headers alone.

### Failure Triage

1. Check the command as run. `git log --follow` on its own returns a commit list with no line counts, so a gate applied to that output is a gate in name only.
2. Confirm zero-line commits were discarded. A run that reports the same number for gated and ungated on a file with real history has either found a genuinely clean history or has not applied the gate, and the transcript settles which.
3. Compare the gated count against the engine's derived build segment for the same file. A disagreement is a real finding: either the hand count is wrong or the engine is, and the transcript is the tiebreaker.
4. If the resulting version looks high, check it against the shape the standard warns about. A document edited a handful of times reading in the high teens is the documented symptom of an ungated count.

### Optional Supplemental Checks

Repeat on a file created after the historical path move. The two counts should converge, because only the second inflator applies. A run whose gap is identical on both files has not measured anything file-specific.

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
| [`references/frontmatter-versioning.md`](../../references/frontmatter-versioning.md) | Primary implementation anchor, section 4 real edit count |
| [`README.md`](../../README.md) | The numstat gate concept section and the worked inflated version |
| [`SKILL.md`](../../SKILL.md) | The ALWAYS rule to gate the edit count through per-file numstat |

---

## 5. SOURCE METADATA

- Group: VERSION DERIVATION
- Playbook ID: FMV-002
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `version-derivation/numstat-gate.md`
