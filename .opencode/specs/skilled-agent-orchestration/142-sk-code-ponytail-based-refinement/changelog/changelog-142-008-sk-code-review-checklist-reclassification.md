---
title: "Changelog: Phase 8: sk-code-review Checklist Reclassification from references to assets [142-sk-code-ponytail-based-refinement/008-sk-code-review-checklist-reclassification]"
description: "Chronological changelog for the Phase 8 sk-code-review checklist reclassification."
trigger_phrases:
  - "phase changelog"
  - "checklist reclassification"
  - "sk-code-review assets"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/142-sk-code-ponytail-based-refinement/008-sk-code-review-checklist-reclassification` (Level 1)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/142-sk-code-ponytail-based-refinement`

### Summary

Phase 8 moved reusable `sk-code-review` checklist artifacts to the place the framework expects reusable checklists to live. Six files were filed under `references/`, but reviewers apply them as assets rather than read them as doctrine. The review doctrine did not change, only the location, routing and overview shape.

### Added

- No new additions recorded.

### Changed

- Classified the 10 `references/` files as asset or reference and picked the 6 to move.
- Mapped the full by-path coupling and bidirectional cross-link topology.
- Confirmed the mirror structure is untracked and hardlinked.
- Confirmed the canary keys on `pr_state_dedup.md`.
- Used `git mv` to move the six checklists from `references/` to `assets/` under `sk-code-review/assets/`.
- Re-pathed bidirectional cross-links. Moved files now point to `../references/quick_reference`, and staying refs point to `../assets/`.
- Updated `SKILL.md` routing, `RESOURCE_MAP`, Resource Domains, README and `graph-metadata`.

### Fixed

- Aligned each moved checklist to the asset OVERVIEW with Purpose and Usage.
- Restructured fix-completeness.

### Verification

| Check | Result |
|-------|--------|
| Asset validation | PASS: `validate_document.py --type asset` on six moved checklists returned 6/6 VALID with OVERVIEW Purpose and Usage |
| Stale path sweep | PASS: Grep sweep for `references/<moved>` returned 0 stale, with changelogs excluded by design |
| Relative links | PASS: moved and staying refs all resolve on disk |
| Rule canary | PASS: `check-rule-copies.js` exited 0 |
| Skill validation | PASS: `validate_document.py --type skill` on `SKILL.md` returned VALID |
| Mirror parity | PASS: `.claude` and `.codex` assets match `.opencode` |
| Task ledger | PASS: 14 completed task item(s) recorded |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `sk-code-review/references/<6>.md → assets/<6>.md` | Moved | Reclassified to assets and aligned to template |
| `sk-code-review/SKILL.md` | Updated | Re-pathed routing, `RESOURCE_MAP` and Resource Domains to `assets/` |
| `sk-code-review/README.md, graph-metadata.json` | Updated | Re-pathed reference table and metadata |
| `sk-code-review/references/{review_core,review_ux_single_pass,quick_reference}.md` | Updated | Re-pathed sibling cross-links |
| `sk-code-review/manual_testing_playbook/**` | Updated | Applied 19 source-anchor edits |
| `sk-code/references/opencode/{python,shell}/quality_standards.md` | Updated | Updated cross-skill pointers |

### Follow-Ups

- Historical changelogs still cite the old `references/` paths. This is intentional.
- v1.1 through v1.4 document the state at their release.
- The move is recorded in v1.5.0.0.
- External links to a moved file should update to `sk-code-review/assets/<name>.md`.
