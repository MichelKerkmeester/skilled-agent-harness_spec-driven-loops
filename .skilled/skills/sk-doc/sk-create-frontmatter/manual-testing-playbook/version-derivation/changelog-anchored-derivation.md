---
title: "FMV-001 -- Changelog-anchored derivation"
description: "This scenario validates anchor derivation for `FMV-001`. The anchor is the higher of the manifest frontmatter version and the highest changelog filename version, compared as integer tuples rather than as strings."
version: 1.0.0.4
---

# FMV-001 -- Changelog-anchored derivation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FMV-001`.

---

## 1. OVERVIEW

This scenario validates anchor derivation for `FMV-001`. The anchor is the higher of the skill manifest's own frontmatter version and its highest changelog filename version, compared as integer tuples, and both inputs have to be read before an answer is given.

### Why This Matters

The shortcut is to read the manifest and stop. The standard says the changelog is frequently the more current of the two and gives a real pair where the frontmatter and the changelog disagree, which is exactly why the anchor is a maximum rather than a lookup. The second failure is subtler: comparing the two as strings instead of as integer tuples. String comparison agrees with tuple comparison for most pairs, so a run that never states which comparison it used can be right for a long time and then be wrong the first time a segment reaches double digits, where a string comparison ranks a nine above a ten. Both failures produce a plausible version number that no validator rejects, because the format is valid and only the value is wrong.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `FMV-001` and confirm the expected signals without contradictory evidence.

- Objective: derive a child document's version from the correct anchor, having read both anchor inputs and compared them as integer tuples
- Realistic user request: `What version number does a new doc in this skill start at?`
- Prompt: `What version should a new reference doc in this skill get?`
- Expected execution process: the question is about `version`, so `references/frontmatter-versioning.md` loads, section 3 supplies the anchor formula, both inputs are read, the higher one is selected as integer tuples, and section 4 supplies the child rule of inherited major and minor, patch seeded zero, and build from the file's own gated edit count.
- Expected signals: the reply names both anchor inputs with their values, states which one won, states that the comparison was made as integer tuples, and produces a four-part version whose major and minor match the anchor.
- Desired user-visible outcome: the derived version, plus both inputs and which one won.
- Pass/fail: PASS if both inputs are read, the comparison is stated, and the derived version follows the child rule. FAIL if only one input is read, if the comparison method is unstated, or if the answer is a version with no derivation behind it.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `What version should a new reference doc in this skill get?`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FMV-001 | Changelog-anchored derivation | Derive a child version from the correct anchor after reading both inputs and comparing them as integer tuples | `What version should a new reference doc in this skill get?` | 1. `agent: Read references/frontmatter-versioning.md section 3 and state the anchor formula` -> 2. `agent: Read the SKILL.md frontmatter version and the highest changelog filename version` -> 3. `agent: Select the higher as integer tuples and apply the section 4 child rule` -> 4. `bash: node .opencode/skills/sk-doc/shared/scripts/frontmatter-version.mjs compute --skill sk-doc --manifest-out scratch-fmv-001` | Step 1: the formula is quoted as a maximum of two inputs. Step 2: both values are reported. Step 3: the winner is named and the comparison is stated as integer tuples. Step 4: the engine's derived version for the packet's docs matches the hand derivation | The prompt as typed, both anchor inputs with their values, the winner and the comparison method, the derived version, the engine transcript, and confirmation the scratch manifest was removed | PASS if both inputs are read, the comparison is stated, and the hand derivation matches the engine. FAIL if one input is skipped, the comparison is unstated, or no engine run is shown | 1. Confirm both inputs were read. Reading the manifest alone is the documented shortcut. 2. Check the comparison was tuple-based, which only shows up on a double-digit segment. 3. Confirm `--skill` was given a top-level skill name, since the packet name discovers zero files and reports success over an empty set |

### Commands

1. `agent: Read references/frontmatter-versioning.md section 3 and state the anchor formula`
2. `agent: Read the SKILL.md frontmatter version and the highest changelog filename version for the target skill`
3. `agent: Select the higher of the two as integer tuples, then apply the section 4 child rule`
4. `bash: node .opencode/skills/sk-doc/shared/scripts/frontmatter-version.mjs compute --skill sk-doc --manifest-out scratch-fmv-001`

### Expected

Step 1 quotes the anchor as the maximum of the normalized manifest version and the normalized highest changelog filename version. Step 2 reports both values, which is the part the shortcut skips. Step 3 selects the higher one as integer tuples and applies the child rule: major and minor inherited, patch seeded zero, build from the file's own gated edit count. Step 4 runs the engine in its read-only compute mode and prints a derived version per file, giving an independent derivation to check the hand answer against. The `--manifest-out` argument is mandatory in this scenario: without it the engine writes its manifest pair into the repository root, which is run residue the operator then has to clean up.

### Evidence

Capture the prompt exactly as typed, both anchor inputs with their values and the file each came from, the selected anchor, an explicit statement that the comparison was made as integer tuples, the derived version, the literal engine transcript with its exit status, and confirmation that the scratch manifest files were removed after the run. Record both inputs, because the anchor is a comparison and a single reading cannot be graded.

### Pass / Fail

- **Pass**: both anchor inputs are read and reported, the winner is named, the comparison is explicitly tuple-based, the child rule is applied, and the hand derivation agrees with the engine output.
- **Fail**: only the manifest is read, the changelog is ignored or assumed to be lower, the comparison method is unstated, the child rule is misapplied, or a version is produced with no derivation shown.

### Failure Triage

1. Confirm both inputs were read. Reading the manifest alone is the documented shortcut and produces the right answer whenever the two happen to agree, which hides it.
2. Check the comparison method. A string comparison is indistinguishable from a tuple comparison until a segment reaches double digits, so the method has to be stated rather than inferred from a correct result.
3. Confirm the skill has a changelog directory at all. When it does not, the standard falls back to the frontmatter version and records the anchor source, and that fallback should be named rather than silently used.
4. Check the `--skill` value. It takes a top-level skill directory name, so this packet resolves through `sk-doc`. Passing the packet name discovers zero files and reports success over an empty set.

### Optional Supplemental Checks

Re-derive by hand for a skill whose changelog is ahead of its manifest and confirm the changelog wins. The standard names that case as the common one, so a run that always picks the manifest will look correct on a skill where the two agree.

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
| [`references/frontmatter-versioning.md`](../../references/frontmatter-versioning.md) | Primary implementation anchor, sections 2, 3 and 4 |
| [`README.md`](../../README.md) | The plain-language statement of the anchor and the four-part rationale |
| [`SKILL.md`](../../SKILL.md) | The derive-a-version path |

---

## 5. SOURCE METADATA

- Group: VERSION DERIVATION
- Playbook ID: FMV-001
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `version-derivation/changelog-anchored-derivation.md`
