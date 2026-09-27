---
title: "CHG-011 -- Write search metadata into a global entry"
description: "This scenario validates the frontmatter contract for CHG-011. A global entry opens with the five-key block, both identity phrases for its path and a topic phrase from its own words."
version: 1.3.0.0
---

# CHG-011 -- Write search metadata into a global entry

This document captures the operator contract for the search metadata a global changelog entry carries.

## 1. OVERVIEW

This scenario validates the frontmatter contract for `CHG-011`. It focuses on the five keys, their order and the identity phrases the target path gives.

### Why This Matters

A reader asks for a changelog by component and version, such as `sk-doc v2.2.1.0`, or by what changed. The trigger index finds an entry only through the phrases in its frontmatter, so an entry written without them stays invisible to a lookup even when its prose is right.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CHG-011` and confirm the block the draft opens with.

- Objective: a global entry drafted by the workflow opens with the frontmatter block the Frontmatter Contract defines
- Realistic user request: `Write the changelog entry for the next sk-doc release.`
- Prompt: `Create a global changelog for the sk-doc component. Write the frontmatter block the SKILL.md Frontmatter Contract defines before the prose, with both identity phrases for the target path and one topic phrase, save the draft as v<next version>.md in a scratch folder named changelog outside the repository, then validate it.`
- Expected execution process: `SKILL.md` section 5 is read for the Frontmatter Contract and section 7 for step 4, the component name is read from the owning `SKILL.md`, the next version is calculated, the draft is written outside the repository and `validate_document.py` checks it.
- Expected signals: the draft opens with `title`, `description`, `trigger_phrases`, `importance_tier` and `contextType` in that order, `trigger_phrases` holds `sk-doc v<next version>` and `sk-doc <next version>` plus a topic phrase, and the validator reports no blocking error.
- Desired user-visible outcome: an entry that a lookup by component and version finds first.
- Pass/fail: PASS if the block, its order, both identity phrases, a topic phrase and a clean validator run are evidenced. FAIL if a key or an identity phrase is missing, the order differs or the validator blocks.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Create a global changelog for the sk-doc component. Write the frontmatter block the SKILL.md Frontmatter Contract defines before the prose, with both identity phrases for the target path and one topic phrase, save the draft as v<next version>.md in a scratch folder named changelog outside the repository, then validate it.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CHG-011 | Write search metadata into a global entry | Draft a global entry that opens with the frontmatter block | `Create a global changelog for the sk-doc component. Write the frontmatter block the SKILL.md Frontmatter Contract defines before the prose, with both identity phrases for the target path and one topic phrase, save the draft as v<next version>.md in a scratch folder named changelog outside the repository, then validate it.` | 1. `agent: Read SKILL.md section 5, Frontmatter Contract, and step 4 of section 7` -> 2. `bash: grep -m1 '^name:' .skilled/skills/sk-doc/SKILL.md` -> 3. `agent: Calculate the next sk-doc version and write the draft to <scratch>/changelog/v<next version>.md, frontmatter block first` -> 4. `bash: python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <scratch>/changelog/v<next version>.md --type changelog` -> 5. `bash: sed -n '1,12p' <scratch>/changelog/v<next version>.md` | Step 2 prints `name: sk-doc`. Step 4 exits 0 with no blocking error. Step 5 shows the five keys in contract order and both identity phrases | Exact prompt, contract text, component name, draft path, validator output and exit status, and the first lines of the draft | PASS if the block carries the five keys in order, both identity phrases and a topic phrase, and the validator exits 0. FAIL if a key or identity phrase is missing, the order differs or the validator blocks | 1. Reread the Frontmatter Contract and compare the keys in order. 2. Confirm the component name is the `name:` in the owning `SKILL.md`, not a folder name. 3. Rerun the validator and read its blocking errors. |

### Commands

1. `agent: Read SKILL.md section 5, Frontmatter Contract, and step 4 of section 7`
2. `bash: grep -m1 '^name:' .skilled/skills/sk-doc/SKILL.md`
3. `agent: Calculate the next sk-doc version and write the draft to <scratch>/changelog/v<next version>.md, frontmatter block first`
4. `bash: python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <scratch>/changelog/v<next version>.md --type changelog`
5. `bash: sed -n '1,12p' <scratch>/changelog/v<next version>.md`

### Expected

The draft opens with the frontmatter block, and its keys run `title`, `description`, `trigger_phrases`, `importance_tier` and `contextType`. The trigger phrases start with `sk-doc v<next version>` and `sk-doc <next version>` and end with a topic phrase taken from the entry's own words. The validator finds no blocking error.

### Evidence

Capture the prompt, the contract text, the component name, the draft path, the validator output and exit status, and the first lines of the draft.

### Pass / Fail

- **Pass**: the block carries the five keys in contract order, both identity phrases and a topic phrase, and the validator exits 0.
- **Fail**: a key or identity phrase is missing, the key order differs, or the validator reports a blocking error.

### Failure Triage

1. Reread the Frontmatter Contract and compare the keys in order.
2. Confirm the component name is the `name:` in the owning `SKILL.md`, not a folder name.
3. Rerun the validator and read its blocking errors.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root policy and scenario index |
| No feature-catalog entry | This mode has no catalog package for this scenario |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`SKILL.md`](../../SKILL.md) | Frontmatter Contract and step 4 |
| [`changelog-template.md`](../../assets/changelog-template.md) | Frontmatter block in both format skeletons |
| [`validate_document.py`](../../../shared/scripts/validate_document.py) | Blocking frontmatter check for changelog entries |

---

## 5. SOURCE METADATA

- Group: SEARCH METADATA
- Playbook ID: CHG-011
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `search-metadata/write-global-entry-metadata.md`
