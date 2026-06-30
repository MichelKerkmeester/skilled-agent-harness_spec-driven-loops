---
title: "Changelog: catalog and playbook realignment [143-sk-design-interface/012-catalog-playbook-realignment]"
description: "Chronological changelog for the catalog and playbook realignment phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/design/001-sk-design-interface/012-catalog-playbook-realignment` (Level 1)
> Parent packet: `.opencode/specs/design/001-sk-design-interface`

### Summary

Status: DONE. The Mobbin and Refero design-references capability from phase 009 and its hybrid initiative/ask routing from phase 011 were present in `SKILL.md` and `design_references_mcp.md`, but they were not catalogued or tested. This phase made both surfaces faithful to the shipped skill.

### Added

- Added `feature_catalog/03--design-grounding/design-references-grounding.md` for Mobbin and Refero plus hybrid routing.
- Added `design_references_mcp.md` to the critique-against feature's implementation surfaces.
- Added a manual testing playbook scenario for initiative/ask routing, source pick and guardrails.
- Updated the playbook index, cross-reference and counts.

### Changed

- Audited the feature catalog and playbook against the phase-011 reality.
- Confirmed the Mobbin and Refero capability and routing were uncatalogued and untested.
- Updated `feature_catalog/feature_catalog.md` inventory.
- Updated section 4 narrative and counts.
- Ran `sk-doc` validators with 0 issues on both indexes.
- Confirmed no Open Design regression by grep.
- Strict-validated this phase.
- Reconciled the parent map and `children_ids`.
- Marked all tasks complete.
- Confirmed no blocked tasks remain.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| Design-reference capability catalogued | PASS: new feature file added and section 4 inventory shows 2 grounding features. |
| `ID-010` scenario coverage | PASS: scenario covers initiative, ask, fall-back, source pick and negative control in house format. |
| Playbook index reconciliation | PASS: scenarios changed from 9 to 10, categories from 7 to 8, with waves and cross-reference updated. |
| No Open Design naming reintroduced | PASS: grep confirmed no regression. |
| `sk-doc` validators | PASS: both indexes and new files returned 0 issues. |
| `validate.sh <this phase> --strict` | PASS: exit 0. |
| Tasks complete | PASS: 10 completed task items recorded. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `feature_catalog/03--design-grounding/design-references-grounding.md` | Created | The Mobbin and Refero design-references feature plus hybrid routing. |
| `feature_catalog/feature_catalog.md` | Modified | Inventory, section 4 narrative and count, with grounding now at 2 features. |
| `feature_catalog/01--design-process/critique-against-defaults.md` | Modified | Added `design_references_mcp.md` to the critique-step surfaces. |
| `manual_testing_playbook/08--design-references-routing/initiative-ask-fallback-routing.md` | Created | `ID-010` initiative/ask routing scenario. |
| `manual_testing_playbook/manual_testing_playbook.md` | Modified | Index, counts from 9 to 10, categories from 7 to 8, waves and cross-reference. |

### Follow-Ups

- Doc-only realignment. No `SKILL.md` or references change and no version bump. This phase only made the catalog and playbook mirror phases 009 and 011.
- The routing scenario is operator-run. `ID-010` is a manual scenario, like the other playbook entries, and is executed by an operator in a real session rather than by an automated test.
