---
title: "Changelog: sk-code Ponytail-Based Refinement [142-sk-code-ponytail-based-refinement/root]"
description: "Root rollup for the Spec 142 phased refinement of sk-code and sk-code-review."
trigger_phrases:
  - "142 root changelog"
  - "ponytail refinement rollup"
  - "sk-code review refinement"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/sk-code/z_archive/010-sk-code-ponytail-based-refinement` (Level Phase Parent)

### Summary

Spec 142 turned a research recommendation into a shipped refinement set for `sk-code` and `sk-code-review`. The work kept the ponytail lesson narrow: add review pressure where agents overbuild, add drift guards where copied rules can rot and move reusable checklist artifacts to the surfaces that match how agents consume them.

The packet shipped eight completed phase children. It added reviewer rows, a bounded `ceiling:` convention, wording canaries, agent mirror guards, a pre-write design ladder, two optional guidance add-ons, sk-code asset conformance and sk-code-review checklist reclassification.

### Included Phases

| Phase | Status | Summary |
|-------|--------|---------|
| [`001-skreview-checklist-rows`](./changelog-142-001-skreview-checklist-rows.md) | Complete | Added three sk-code-review checklist rows and a `removal_plan.md` replacement column. |
| [`002-ceiling-comment-convention`](./changelog-142-002-ceiling-comment-convention.md) | Complete | Documented the neutral `ceiling:` convention and bounded its review effect to P2 KISS or YAGNI cases. |
| [`003-wording-invariant-guards`](./changelog-142-003-wording-invariant-guards.md) | Complete | Added a rule-canary guard for load-bearing wording and Iron Law line drift. |
| [`004-mirror-stackfolder-drift-guards`](./changelog-142-004-mirror-stackfolder-drift-guards.md) | Complete | Added agent mirror and `STACK_FOLDERS` drift checks, then fixed the two real pre-existing mirror drifts. |
| [`005-design-restraint-ladder`](./changelog-142-005-design-restraint-ladder.md) | Complete | Added the pre-write Design Restraint Ladder to the always-loaded sk-code guidance path. |
| [`006-optional-addons`](./changelog-142-006-optional-addons.md) | Complete | Added the implementer anti-stall rule and the opt-in `SK_CODE_REVIEW_DEPTH` alias. |
| [`007-sk-code-asset-router-alignment`](./changelog-142-007-sk-code-asset-router-alignment.md) | Complete | Brought sk-code authoring checklist assets and smart-router prose into template conformance without changing routing. |
| [`008-sk-code-review-checklist-reclassification`](./changelog-142-008-sk-code-review-checklist-reclassification.md) | Complete | Moved six reusable sk-code-review checklist files from `references/` to `assets/` and repaired their links. |

### Added

- Three additive `sk-code-review` checklist rows for reinvented standard-library behavior, duplicated native capability and unrequested code.
- A Replacement column in `removal_plan.md` covering nothing, stdlib API, native feature and shorter equivalent.
- A neutral `ceiling:` documentation convention for intentional simplifications.
- `check-rule-copies.js`, its shell tests and the `rule-canary-sync.yml` workflow.
- `check-agent-mirror-sync.cjs`, the `agent-mirror-sync.yml` workflow and `verify_stack_folders.py`.
- The Design Restraint Ladder in the always-loaded sk-code quality guidance.
- The implementer anti-stall rule and the `SK_CODE_REVIEW_DEPTH=lite|full|ultra` advisory alias.
- The Resource Loading Levels table and fallback checklist in `sk-code/SKILL.md`.
- A new `sk-code-review/assets/` home for six checklist artifacts.

### Changed

- `code_quality_checklist.md`, `removal_plan.md`, `code_style_guide.md` and `sk-code` routing prose gained additive guidance while preserving severity models and output contracts.
- Agent mirrors and stack-folder binding gained explicit drift checks.
- Five sk-code authoring checklists were restructured to the asset template.
- Six sk-code-review checklist files were reclassified from references to assets, with routing, README, metadata, source anchors and sibling cross-links updated.
- Historical changelogs were left intact by design, because they document the state at their release.

### Fixed

- The two real pre-existing agent mirror drifts in context and codex by restoring the dropped Tool-Inventory row.
- The sk-code authoring checklist asset-template failures.
- The sk-code-review checklist location mismatch between reusable checklist artifacts and doctrine references.
- Relative links, manual testing playbook source anchors and cross-skill pointers affected by the sk-code-review move.

### Verification

| Check | Result |
|-------|--------|
| Phase task ledgers | PASS: all eight phase children record completed task items |
| Alignment drift | PASS: `verify_alignment_drift.py` passed where phases invoked it |
| Rule canary | PASS: `check-rule-copies.js` exited 0 where invoked |
| Asset validation | PASS: sk-code assets reached 11/11 VALID and sk-code-review moved assets reached 6/6 VALID |
| Skill validation | PASS: `validate_document.py --type skill` returned VALID for touched `SKILL.md` surfaces |
| Mirror parity | PASS: `.claude` and `.codex` mirror parity passed for the sk-code-review asset move |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `sk-code-review` review docs | Updated | Added review rows, removal replacement guidance and checklist reclassification |
| `sk-code` docs | Updated | Added the Design Restraint Ladder, anti-stall guidance and router conformance prose |
| `.github/workflows/rule-canary-sync.yml` | Created | Added PR canary for load-bearing wording drift |
| `.github/workflows/agent-mirror-sync.yml` | Created | Added PR guard for changed agent mirror files |
| `.opencode/hooks/pre-commit` | Updated | Added staged-agent mirror checking |
| `sk-code-review/assets/` | Created | New home for six reusable review checklist artifacts |

### Follow-Ups

- Historical changelogs still cite old `references/` paths by design. External links to moved sk-code-review checklist files should update to `sk-code-review/assets/<name>.md`.
- Several guidance additions are intentionally behavioral, not machine-enforced.
- Earlier phases were not committed at the time their summaries were captured, and their working-tree branch was `028-mcp-to-cli-tool-transition`.
