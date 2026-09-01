---
title: "FMC-002 -- Class row before field row"
description: "This scenario validates class-first diagnosis for `FMC-002`. It focuses on a field that one document class requires and another does not carry, and on reading the class row before the field row."
version: 1.0.0.0
---

# FMC-002 -- Class row before field row

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FMC-002`.

---

## 1. OVERVIEW

This scenario validates class-first diagnosis for `FMC-002`. It focuses on a field that one document class requires and another does not carry, and on reading the class row before the field row when a validator names a field rather than a fix.

### Why This Matters

The packet README says almost every rejected block is a field that one class requires and another forbids, and that reading the field row before the class row wastes the most time. The reason it wastes time is that the field looks correct on its own. `allowed-tools` is a required field for a skill manifest and is simply not part of the five-field block a reference or asset carries, so two neighbouring files disagreeing about it is the contract working rather than an inconsistency to be reconciled. A run that answers this by editing one of the two files to match the other has made a correct document wrong, and nothing will report it until the advisor stops harvesting the block.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `FMC-002` and confirm the expected signals without contradictory evidence.

- Objective: diagnose a field-level rejection by resolving both files' document classes before comparing their field sets
- Realistic user request: `Two files in the same skill disagree about a frontmatter field and only one gets rejected. Which one do I fix?`
- Prompt: `The validator says my file is missing allowed-tools, but the file right next to it does not have allowed-tools and it passes. Which one is wrong?`
- Expected execution process: `assets/frontmatter-templates.md` loads, the two files are resolved to their classes before either field set is compared, section 4 supplies the required field list per class, and the answer states that `allowed-tools` is required for a skill manifest and absent from the reference and asset block.
- Expected signals: the reply names two different document classes, states that neither file is wrong, and cites the class row rather than reasoning from the two files against each other. No edit is proposed to the passing file.
- Desired user-visible outcome: the user learns the two files are different document classes, and which row settles it.
- Pass/fail: PASS if both classes are named and the answer is that neither file is wrong. FAIL if the passing file is edited to match, if the two files are compared to each other without resolving their classes, or if the answer arrives with no citation of the class row.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `The validator says my file is missing allowed-tools, but the file right next to it does not have allowed-tools and it passes. Which one is wrong?`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FMC-002 | Class row before field row | Diagnose a field-level rejection by resolving both files' classes before comparing their field sets | `The validator says my file is missing allowed-tools, but the file right next to it does not have allowed-tools and it passes. Which one is wrong?` | 1. `agent: Name the document class of each of the two files before comparing any field` -> 2. `agent: Read the required-field list for each class in assets/frontmatter-templates.md section 4` -> 3. `agent: State whether either file is wrong and why` -> 4. `bash: python3 .opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py .opencode/skills/sk-doc/sk-create-frontmatter --check --strict` | Step 1: two different classes are named. Step 2: `allowed-tools` appears in the manifest list and not in the reference and asset list. Step 3: the answer is that neither file is wrong. Step 4: `Result: PASS`, confirming both classes in the packet are valid as they stand | The prompt as typed, the two classes named, the two required-field lists quoted, the verdict given, and the gate transcript with its exit status | PASS if both classes are resolved first and neither file is declared wrong. FAIL if an edit is proposed to the passing file, or the two files are compared directly without class resolution | 1. Check whether the class was named before the first field comparison. The ordering is the behavior under test. 2. Confirm the required-field lists were read per class rather than inferred from the two files. 3. Re-read the packet README troubleshooting row that maps this exact symptom to the class row |

### Commands

1. `agent: Name the document class of each of the two files before comparing any field`
2. `agent: Read the required-field list for each class in assets/frontmatter-templates.md section 4`
3. `agent: State whether either file is wrong, and name the row that settles it`
4. `bash: python3 .opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py .opencode/skills/sk-doc/sk-create-frontmatter --check --strict`

### Expected

Step 1 resolves both files to classes. A skill manifest and a reference document are different classes with different required fields, and that is the whole answer. Step 2 reads section 4 and finds `allowed-tools` required for the manifest and absent from the five-field reference and asset block. Step 3 concludes that neither file is wrong and that the rejected file is missing a field its own class requires. Step 4 runs the packaging gate, which is the right control here because it checks both classes in one pass: it validates the packet's `SKILL.md` and walks the `references/` and `assets/` subtrees against the resource-doc field set. The fast validator would not serve, since it reads only `SKILL.md` and can therefore see just one of the two classes in dispute. A `Result: PASS` with both files untouched is the evidence that neither was wrong.

### Evidence

Capture the prompt exactly as typed, the two document classes the run named, the two required-field lists as quoted from section 4, the verdict, and the literal output and exit status of the packaging gate. Record the order in which the class and the field were discussed, because a correct answer reached by comparing the two files to each other is a lucky answer and will not survive the next pair.

### Pass / Fail

- **Pass**: both classes are named before any field comparison, the required-field lists are cited per class, the answer is that neither file is wrong, and the gate run is shown.
- **Fail**: an edit is proposed to the passing file, the two files are compared directly without resolving their classes, the answer names a field rule with no class attached, or no gate run is shown.

### Failure Triage

1. Confirm the field reference was loaded. Without it the run has no class table and can only compare the two files to each other.
2. Check the ordering explicitly. Naming the class after the conclusion is not the same behavior as naming it before, and only the second one generalizes.
3. Read the packet README troubleshooting table. Its first row maps this exact symptom to the class row in section 4 and is the shortest confirmation the answer is the documented one.

### Optional Supplemental Checks

Repeat with `argument-hint`, which the contract marks as commands only. Confirm the same class-first path produces the same shape of answer. A run that handles `allowed-tools` correctly and then treats `argument-hint` as a universal requirement has memorized one row rather than learned the table.

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
| [`assets/frontmatter-templates.md`](../../assets/frontmatter-templates.md) | Primary implementation anchor, sections 4 and 5 |
| [`README.md`](../../README.md) | The class-is-the-first-question section and the troubleshooting row for this symptom |
| [`SKILL.md`](../../SKILL.md) | The fix-a-rejected-block path |

---

## 5. SOURCE METADATA

- Group: FIELD AND CLASS RESOLUTION
- Playbook ID: FMC-002
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `field-and-class-resolution/class-row-before-field-row.md`
