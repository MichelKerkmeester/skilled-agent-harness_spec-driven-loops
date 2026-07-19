---
title: "ID-007 -- Licensing and provenance integrity"
description: "This scenario validates Licensing and provenance integrity for `ID-007`. It focuses on confirming the skill is Apache-2.0 only: design_principles.md is unchanged Apache content, LICENSE.txt is present, and no vendored MIT data, search-script, vendored-license, or third party notice material remains on disk."
version: 1.5.0.5
id: ID-007
expected_intent: DESIGN_PRINCIPLES
expected_resources:
  - references/design-process/design-principles.md
  - ../shared/register.md
---

# ID-007 -- Licensing and provenance integrity

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ID-007`.

**Exact prompt**

```
Confirm the design data and principles in this skill are properly licensed and attributed before we ship it.
```

---

## 1. OVERVIEW

This scenario validates Licensing and provenance integrity for `ID-007`. It focuses on confirming the skill is Apache-2.0 only: `design_principles.md` is unchanged Apache content, `LICENSE.txt` is present, and no vendored MIT data, search-script, vendored-license, or third party notice material remains on disk.

### Why This Matters

ID-007 protects the skill's right to ship. After the de-vendor, the only licensed content is the vendored Apache-2.0 guidance from Anthropic's `frontend-design` skill. The vendored MIT data and search were removed, and the aesthetic inventory is now sourced live from a real design system and never copied into the skill. If the Apache principles drift from upstream, if `LICENSE.txt` is missing, or if any leftover vendored MIT data, search-script, vendored-license, or third party notice material is left behind, the skill carries a provenance defect that blocks release regardless of how good the design output is. A clean grep over the legacy de-vendor tokens is the pass signal.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ID-007` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `design_principles.md` is unchanged Apache-2.0 content, `LICENSE.txt` resolves on disk, and no leftover vendored MIT data, search-script, vendored-license, or third party notice material remains anywhere in the skill.
- Real user request: `Make sure this skill is Apache-2.0 only and nothing from the old MIT data is left behind before we ship.`
- Prompt: `Confirm the design data and principles in this skill are properly licensed and attributed before we ship it.`
- Expected execution process: Confirm `design_principles.md` declares the Apache-2.0 upstream and carries no local edits to its guidance, confirm `LICENSE.txt` exists, and prove the legacy de-vendor artifacts are ABSENT by name: the removed search script (`design_search.py`), the removed data files (`*.csv` under `references/`), and any vendored MIT license or notice file (`LICENSE-MIT`, `NOTICE*`, `THIRD_PARTY*`). Check by file absence with `ls`/`find`, not a prose word-grep: the phrases "vendored from Anthropic" (the legitimate Apache attribution in SKILL.md/README.md/design_principles.md) and "third party notice" (the no-cache rule in design_inventory.md) appear by design and will false-positive a word grep.
- Expected signals: Step 1: `design_principles.md` declares the Apache-2.0 upstream and its guidance is unmodified; Step 2: `LICENSE.txt` resolves on disk; Step 3: the de-vendor grep returns no remaining vendored data, search-script, vendored-license, or notice material
- Desired user-visible outcome: a provenance report confirming `design_principles.md` is unchanged Apache-2.0 content, `LICENSE.txt` is present, and the skill is Apache-2.0 only with no vendored MIT material or notices remaining.
- Pass/fail: PASS if the principles are unchanged, `LICENSE.txt` resolves, and the de-vendor grep is clean; FAIL if the principles were edited away from upstream, `LICENSE.txt` is missing, or any leftover vendored MIT data, search-script, vendored-license, or notice material remains

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain provenance-check language.
2. Confirm the skill claims Apache-2.0 only and names `LICENSE.txt` as its single license.
3. Execute the deterministic steps exactly as written.
4. Compare the on-disk reality against the references in `SKILL.md` and the reference docs.
5. Return a concise final verdict that names any principle drift, missing `LICENSE.txt`, or leftover MIT material when the scenario fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ID-007 | Licensing and provenance integrity | Confirm design_principles.md is unchanged Apache-2.0 content, LICENSE.txt resolves on disk, and no leftover vendored MIT material or notices remain anywhere in the skill. | `Confirm the design data and principles in this skill are properly licensed and attributed before we ship it.` | bash: rg -n "Adapted verbatim from Anthropic" references/design-process/design-principles.md -> bash: ls LICENSE.txt -> bash: package_skill.py . --check (PASS) plus a grep over the legacy de-vendor tokens scoped to authored docs and metadata returns nothing | Step 1: design_principles.md declares the Apache-2.0 upstream and its guidance is unmodified; Step 2: LICENSE.txt resolves on disk; Step 3: the de-vendor token grep returns no remaining vendored data, search-script, vendored-license, or notice material | Terminal transcript, the Apache upstream citation, the LICENSE.txt existence check, and the empty de-vendor token grep result | PASS if the principles are unchanged, LICENSE.txt resolves, and the de-vendor token grep is clean; FAIL if the principles were edited away from upstream, LICENSE.txt is missing, or any leftover vendored MIT material or notice remains | 1. Diff references/design-process/design-principles.md against the upstream frontend-design skill; 2. List LICENSE.txt and confirm it is the Apache-2.0 terms; 3. Re-run the de-vendor token grep and remove any leftover vendored material it surfaces |

### Optional Supplemental Checks

If the de-vendor token grep surfaces any match, record the exact path and line as a provenance defect for the skill maintainer rather than a playbook defect, then remove the leftover reference and re-grep until clean. The Apache-2.0 `LICENSE.txt` body itself legitimately contains license boilerplate that mentions third party notice placement, so scope the grep to the skill's authored docs and metadata rather than `LICENSE.txt`. Keep supplemental evidence separate from the primary verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../README.md` | Skill overview and current operator-facing description |

### Implementation Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | The frontmatter Apache-2.0 license declaration and the upstream provenance note |
| `../../references/design-process/design-principles.md` | The vendored Apache-2.0 principles and the upstream attribution line |
| `../../LICENSE.txt` | The Apache-2.0 terms for the vendored Anthropic base, the skill's single license |

---

## 5. SOURCE METADATA

- Group: Licensing And Provenance
- Playbook ID: ID-007
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `licensing-and-provenance/licensing-and-provenance-integrity.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
