---
title: "FMC-001 -- Author a reference block"
description: "This scenario validates authoring a frontmatter block for a new reference document in `FMC-001`. It focuses on resolving the document class first, copying the five-field block that class carries, and closing it with `version` as the last key."
version: 1.0.0.4
---

# FMC-001 -- Author a reference block

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FMC-001`.

---

## 1. OVERVIEW

This scenario validates authoring a frontmatter block for a new reference document in `FMC-001`. It focuses on resolving the document class first, copying the five-field block that class carries, and closing it with `version` as the last key before the closing delimiter.

### Why This Matters

The field reference states that every doc under a skill's `references/` and `assets/` directories carries the full block of `title`, `description`, `trigger_phrases`, `importance_tier` and `contextType`, and that the advisor harvests it as routing signal. Composing that set from memory is the documented failure: the packet `SKILL.md` says several classes differ by a single field, so a block assembled by recall looks finished and is short one key. The cost is not a broken document. It is a document the advisor cannot surface, which reads exactly like a document nobody needed. This is the authoring path every other scenario in the category assumes works, so it runs first.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `FMC-001` and confirm the expected signals without contradictory evidence.

- Objective: author a complete reference-class frontmatter block from the class template and prove it with the packaging gate
- Realistic user request: `I am adding a new reference doc to a skill. What frontmatter goes at the top?`
- Prompt: `I am adding a new reference document under a skill's references folder. What frontmatter does it need?`
- Expected execution process: `assets/frontmatter-templates.md` loads on every path, the class is named as Skill Reference or Asset before any field is discussed, section 4 of that reference supplies the template verbatim, `trigger_phrases` is filled with three to eight distinctive lowercase multi-word phrases drawn from the document's own content, `importance_tier` and `contextType` are chosen from their enumerations, `version` is placed last inside the block, and the draft is written as a temporary document under the packet's `references/` so a real gate can read it.
- Expected signals: the reply names the document class before it names a field, the block carries all five fields plus `version`, `version` sits immediately before the closing delimiter, and the packaging gate reports the packet as valid with the draft in place.
- Desired user-visible outcome: a block that passes the packaging gate on the first run, with the class named as the reason each field is there.
- Pass/fail: PASS if the class is resolved first, all six keys are present in the documented order, and a gate run over the draft is shown. FAIL if the field set is assembled without naming the class, a field is missing, `version` is not the last key, or no gate output is produced.

Feature-specific caveat: this is the one scenario in the package that writes inside the packet. The draft is a temporary file under `references/`, and recovery is deleting it. Grade the scenario only after confirming the working tree is clean again.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `I am adding a new reference document under a skill's references folder. What frontmatter does it need?`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FMC-001 | Author a reference block | Author a complete reference-class block from the class template and prove it with the packaging gate | `I am adding a new reference document under a skill's references folder. What frontmatter does it need?` | 1. `agent: Read assets/frontmatter-templates.md section 4 and name the document class` -> 2. `agent: Copy the Skill Reference or Asset template verbatim and write it as a temporary doc under the packet references directory` -> 3. `agent: Place version as the last key before the closing delimiter` -> 4. `bash: python3 .opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py .opencode/skills/sk-doc/sk-create-frontmatter --check --strict` -> 5. `agent: Delete the temporary doc and confirm the working tree is clean` | Step 1: the class is named before any field. Step 2: five fields present, `trigger_phrases` between three and eight items. Step 3: `version` is the final key. Step 4: `Result: PASS`. Step 5: the tree is clean again | The prompt as typed, the class named, the authored block, the temporary path used, the gate transcript with its exit status, and the post-cleanup tree state | PASS if the class is named first, all six keys are present, `version` is last, and the gate output over the draft is shown. FAIL if the class is skipped, a key is missing, or the answer arrives with no gate run | 1. Confirm `assets/frontmatter-templates.md` was loaded at all, since it is the ALWAYS resource on every path. 2. Compare the produced field set against the class row rather than against another file. 3. Check `importance_tier` and `contextType` against their enumerations by hand, since the gate checks presence and deliberately does not enforce enum values |

### Commands

1. `agent: Read assets/frontmatter-templates.md section 4 and name the document class before naming any field`
2. `agent: Copy the Skill Reference or Asset template verbatim and write it as a temporary document under the packet's references directory`
3. `agent: Place version as the last key inside the block, immediately before the closing delimiter`
4. `bash: python3 .opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py .opencode/skills/sk-doc/sk-create-frontmatter --check --strict`
5. `agent: Delete the temporary document and confirm the working tree is clean`

### Expected

Step 1 loads the field reference, which the packet router loads on every path because every frontmatter question resolves against a class first. Step 2 produces `title`, `description`, `trigger_phrases`, `importance_tier` and `contextType`, with the description on a single line, since the parser does not handle YAML multiline block format. Step 3 places `version` last, which the versioning standard defines as field-relative rather than as a fixed line number, so it lands correctly whether the block has five fields or two. Step 4 reports `Result: PASS` and exits zero. The packaging gate is the right instrument here and the fast validator is not: the fast validator reads only the packet's `SKILL.md`, while the packaging gate walks the `references/` and `assets/` subtrees and checks the resource-doc field set the draft belongs to. Step 5 removes the draft.

### Evidence

Capture the prompt exactly as typed, the document class the run named, the full authored block, the temporary path it was written to, the literal output and exit status of the packaging gate, and the working-tree state after cleanup. Record whether the class was named before or after the first field was discussed, because that ordering is the behavior under test rather than a stylistic preference.

### Pass / Fail

- **Pass**: the class is resolved before any field rule, all five fields plus `version` are present, `version` is the last key inside the block, the gate output over the draft is included, and the draft is removed afterwards.
- **Fail**: the field set is assembled without naming the class, any of the six keys is missing, `version` sits anywhere but last, the description is written as a multiline scalar, the answer arrives with no gate run, or the draft is left behind.

### Failure Triage

1. Confirm the field reference was loaded. It is the packet's ALWAYS-level resource, so its absence explains every downstream failure in this scenario.
2. Compare the produced block against the class row in section 4, not against a neighbouring file. A neighbouring file of a different class is the wrong comparison and is the subject of `FMC-002`.
3. Check `trigger_phrases` for count and quality. The contract asks for three to eight distinctive multi-word phrases. Single generic words parse fine and carry no routing signal.
4. If `version` landed inside the `trigger_phrases` list, the insertion was line-indexed rather than field-relative. The standard specifies the last key before the closing delimiter for exactly this reason.
5. Check the enum values by hand. The packaging gate enforces presence of `importance_tier` and `contextType` and deliberately does not enforce their allowed values, so an out-of-enum value passes the gate and still breaks the contract.

### Optional Supplemental Checks

Re-run the authoring step for a `SKILL.md` instead of a reference document and confirm the field set changes to `name`, `description` and `allowed-tools`. A run that produces the same five fields for both has not resolved the class at all. It has memorized one block.

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
| [`assets/frontmatter-templates.md`](../../assets/frontmatter-templates.md) | Primary implementation anchor, sections 3, 4 and 5 |
| [`references/frontmatter-versioning.md`](../../references/frontmatter-versioning.md) | The insertion rule that places `version` last inside the block |
| [`SKILL.md`](../../SKILL.md) | Resource loading levels and the author-a-block ordering |

---

## 5. SOURCE METADATA

- Group: FIELD AND CLASS RESOLUTION
- Playbook ID: FMC-001
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `field-and-class-resolution/author-a-reference-block.md`
