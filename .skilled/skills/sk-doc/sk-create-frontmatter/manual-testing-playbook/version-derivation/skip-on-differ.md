---
title: "FMV-003 -- Skip on differ"
description: "This scenario validates skip-on-differ for `FMV-003`. A human-set `version` that differs from the computed one is skipped and reported rather than silently overwritten, with `SKILL.md` as the one exception."
version: 1.0.0.4
---

# FMV-003 -- Skip on differ

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FMV-003`.

---

## 1. OVERVIEW

This scenario validates skip-on-differ for `FMV-003`. A `version` already present and differing from the computed one is skipped and reported rather than silently overwritten, an explicit update flag is the only override, and `SKILL.md` is the one intentional exception because it is the anchor of record.

### Why This Matters

A versioning pass is a bulk operation over a whole tree, and a bulk operation that overwrites deliberate values is how curated numbers quietly disappear. The standard's edge-case table gives the rule and the label the run reports: a present-and-differing version is a skip conflict, and only an explicit update flag rewrites it. The exception is written down rather than left to be inferred, and it is narrow: a `SKILL.md` whose version differs from its anchor is reconciled to the anchor, because the manifest version is the anchor of record and every child inherits from it. A run that treats the exception as general overwrites the whole tree. A run that treats it as absent leaves the anchor stale and every child derived from a value the skill has already moved past. Both produce a tree full of valid four-part versions.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `FMV-003` and confirm the expected signals without contradictory evidence.

- Objective: report a conflicting human-set version as skipped rather than overwriting it, and state the update flag and the manifest exception without using either
- Realistic user request: `Version the docs in this skill, but I set one of those numbers by hand and I want it left alone.`
- Prompt: `Run the versioning over this skill. I hand-set one of these versions on purpose, so be careful.`
- Expected execution process: `references/frontmatter-versioning.md` loads, section 5 supplies the edge-case table, the engine is run in its read-only verify mode so nothing is written, the conflicting file is identified and reported, and the update flag is described as the deliberate override rather than applied.
- Expected signals: the conflicting file is named with both versions, the outcome for it is reported as a skip rather than a rewrite, the update flag is named as the only override, and the `SKILL.md` exception is stated as narrow. No file changes.
- Desired user-visible outcome: the conflicting file is named, the run is reported as skipped for it, and the override is described rather than used.
- Pass/fail: PASS if the conflict is reported and nothing is written. FAIL if the hand-set version is overwritten, if the update flag is applied without being asked for, or if the manifest exception is stated as a general rule.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the versioning over this skill. I hand-set one of these versions on purpose, so be careful.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FMV-003 | Skip on differ | Report a conflicting human-set version as skipped, and describe the override without using it | `Run the versioning over this skill. I hand-set one of these versions on purpose, so be careful.` | 1. `agent: Read references/frontmatter-versioning.md section 5 and quote the present-and-differs row` -> 2. `bash: node .opencode/skills/sk-doc/shared/scripts/frontmatter-version.mjs verify --skill sk-doc` -> 3. `agent: Name any file whose stored version differs from the computed one, with both values` -> 4. `bash: git status --porcelain .opencode/skills/sk-doc` | Step 1: the row is quoted with its skip label. Step 2: the engine reports without writing. Step 3: the conflicting file is named with both versions. Step 4: empty output | The prompt as typed, the quoted row, the engine transcript with its exit status, the conflicting file with both versions, and the step 4 output | PASS if the conflict is reported and step 4 is empty. FAIL if anything is written, or the update flag is applied unasked | 1. Confirm the engine was run in a read-only mode, since the apply mode is the one that writes. 2. Check the exception was stated as applying to `SKILL.md` only. 3. Confirm the update flag was described rather than used, because using it is the failure the prompt sets up |

### Commands

1. `agent: Read references/frontmatter-versioning.md section 5 and quote the present-and-differs row with its label`
2. `bash: node .opencode/skills/sk-doc/shared/scripts/frontmatter-version.mjs verify --skill sk-doc`
3. `agent: Name any file whose stored version differs from the computed one, reporting both values`
4. `bash: git status --porcelain .opencode/skills/sk-doc`

### Expected

Step 1 quotes the rule and its reported label, which is the vocabulary the run should use rather than a paraphrase. Step 2 runs the engine in verify mode, which compares and reports without writing, so the whole scenario stays non-destructive. Step 3 names the conflicting file and both numbers, which is what makes the report actionable rather than a count. The answer also states that a `SKILL.md` differing from its anchor is reconciled instead, and that this exception is not gated by the update flag, because the manifest version is the anchor of record. Step 4 prints nothing, proving the run stayed read-only.

### Evidence

Capture the prompt exactly as typed, the edge-case row as quoted, the literal engine transcript with its exit status, the conflicting file with its stored and computed versions, the statement of the update flag as the override, the statement of the manifest exception, and the literal output of `git status --porcelain`. The empty status output is the central evidence: the scenario is about what was not done.

### Pass / Fail

- **Pass**: the conflict is reported with both versions, the outcome is described as a skip, the update flag is named but not used, the manifest exception is stated as narrow, and the working tree is unchanged.
- **Fail**: the hand-set version is overwritten, the update flag is applied without being asked for, the manifest exception is generalized to all files, or the run reports a count of conflicts without naming the file.

### Failure Triage

1. Confirm the engine mode. Verify compares and reports. Apply is the mode that writes. A scenario that ends with a diff has used the wrong one.
2. Check the exception statement. It applies to `SKILL.md` and to no other class, and generalizing it is the failure that overwrites a whole tree of curated numbers.
3. Confirm the update flag was described rather than used. The prompt invites care, and applying the override in response to a request for care is the trap.
4. If nothing was reported as conflicting, confirm there was a conflict to find. A clean tree produces the same silence as a run that never compared, and only the transcript distinguishes them.

### Optional Supplemental Checks

Repeat on a file whose stored version equals the computed one and confirm the run reports a no-op rather than a conflict. The edge-case table separates those two rows deliberately, and a run that reports every present version as a conflict has collapsed them.

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
| [`references/frontmatter-versioning.md`](../../references/frontmatter-versioning.md) | Primary implementation anchor, section 5 normalization and edge cases |
| [`README.md`](../../README.md) | The troubleshooting row for a version that differs and was not overwritten |
| [`SKILL.md`](../../SKILL.md) | The NEVER rule against overwriting a human-set version, with the manifest exception |

---

## 5. SOURCE METADATA

- Group: VERSION DERIVATION
- Playbook ID: FMV-003
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `version-derivation/skip-on-differ.md`
