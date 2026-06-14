---
title: "ID-007 -- Licensing and provenance integrity"
description: "This scenario validates Licensing and provenance integrity for `ID-007`. It focuses on confirming the vendored principles are unchanged, the MIT data and search are attributed, and the notices map matches what is present on disk."
---

# ID-007 -- Licensing and provenance integrity

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ID-007`.

---

## 1. OVERVIEW

This scenario validates Licensing and provenance integrity for `ID-007`. It focuses on confirming the vendored principles are unchanged, the MIT data and search are attributed, and the notices map matches what is present on disk.

### Why This Matters

ID-007 protects the skill's right to ship. The aesthetic guidance is vendored Apache-2.0 content from Anthropic's `frontend-design` skill, and the data sets plus search are MIT-licensed work from the `ui-ux-pro-max` repo. If the principles drift from upstream, or if the MIT attribution or its notices map is missing or points at files that do not exist, the skill carries a provenance defect that blocks release regardless of how good the design output is.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ID-007` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `design_principles.md` is unchanged Apache-2.0 content, the data and search carry MIT attribution, and every license or notices path the skill references actually resolves on disk.
- Real user request: `Make sure the design data and principles in this skill are properly licensed before we ship.`
- Prompt: `Confirm the design data and principles in this skill are properly licensed and attributed before we ship it.`
- Expected execution process: Inspect the frontmatter license map, confirm `design_principles.md` declares the Apache-2.0 upstream and carries no local edits to its guidance, confirm the MIT attribution for the data and search, and verify each referenced license or notices file exists.
- Expected signals: Step 1: `design_principles.md` declares the Apache-2.0 upstream and its guidance is unmodified; Step 2: the data and search carry the MIT attribution to `ui-ux-pro-max`; Step 3: each referenced license or notices path is checked for existence on disk
- Desired user-visible outcome: a provenance report confirming `design_principles.md` is unchanged Apache-2.0 content, the data and search are MIT-attributed, and an honest note on whether the referenced notices file is present.
- Pass/fail: PASS if the principles are unchanged, the MIT attribution is present, and every referenced license or notices path resolves on disk; FAIL if the principles were edited away from upstream, the MIT attribution is missing, or a referenced notices or license file does not exist

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain provenance-check language.
2. Confirm which files the skill cites as its license and attribution map before checking them.
3. Execute the deterministic steps exactly as written.
4. Compare the on-disk reality against the references in `SKILL.md` and the reference docs.
5. Return a concise final verdict that names any missing notices file or principle drift when the scenario fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ID-007 | Licensing and provenance integrity | Confirm design_principles.md is unchanged Apache-2.0 content, the data and search carry MIT attribution, and every referenced license or notices path resolves on disk. | `Confirm the design data and principles in this skill are properly licensed and attributed before we ship it.` | bash: rg -n "THIRD-PARTY-NOTICES" SKILL.md references/design_inventory.md -> bash: ls THIRD-PARTY-NOTICES.md LICENSE.txt LICENSE-ui-ux-pro-max.txt -> bash: rg -n "Adapted verbatim from Anthropic" references/design_principles.md | Step 1: design_principles.md declares the Apache-2.0 upstream and its guidance is unmodified; Step 2: the data and search carry the MIT attribution to ui-ux-pro-max; Step 3: each referenced license or notices path is checked for existence on disk | Terminal transcript, the license-map citations, and the existence check for each referenced license or notices file | PASS if the principles are unchanged, the MIT attribution is present, and every referenced license or notices path resolves; FAIL if the principles were edited away from upstream, the MIT attribution is missing, or a referenced notices or license file does not exist | 1. Diff references/design_principles.md against the upstream frontend-design skill; 2. Confirm the MIT attribution lines in design_inventory.md and design_search.py; 3. List THIRD-PARTY-NOTICES.md, LICENSE.txt, and LICENSE-ui-ux-pro-max.txt and record any that are absent |

### Optional Supplemental Checks

If the referenced notices or license files are absent, record the exact missing paths as a provenance defect for the skill maintainer rather than a playbook defect. The skill currently references `THIRD-PARTY-NOTICES.md`, `LICENSE.txt`, and `LICENSE-ui-ux-pro-max.txt` from `SKILL.md` and its reference docs; a missing file here is a real FAIL signal for this scenario. Keep supplemental evidence separate from the primary verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../README.md` | Skill overview and current operator-facing description |

### Implementation Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | The frontmatter license map and the upstream provenance note |
| `../../references/design_principles.md` | The vendored Apache-2.0 principles and the upstream attribution line |
| `../../references/design_inventory.md` | The MIT attribution for the data sets and search |

---

## 5. SOURCE METADATA

- Group: Licensing And Provenance
- Playbook ID: ID-007
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--licensing-and-provenance/licensing-and-provenance-integrity.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
