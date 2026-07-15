---
title: "Changelog: 009-skill-frontmatter-alignment"
description: "Phase-parent campaign that standardized the canonical 5-field frontmatter contract across 22 child phases and 355 skill reference/asset docs."
trigger_phrases:
  - "000 009 frontmatter changelog"
  - "skill frontmatter alignment campaign"
  - "355 docs frontmatter contract"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-11

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment` (Level 1, Phase Parent)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup`

### Summary

This phase-parent campaign standardized skill reference and asset frontmatter across 22 child phases. The operator-selected contract requires `title`, `description`, `trigger_phrases`, `importance_tier`, and `contextType` on skill reference/asset docs, with the skill advisor as the consumer and Spec Kit Memory permanently excluded from skill-doc indexing.

### Added

- Investigation evidence proving the detailed block had no prior runtime consumer and identifying the advisor-as-consumer contract decision.
- Full frontmatter blocks across the skill reference/asset corpus, with child phases covering 21 skills plus the initial benefit investigation.

### Changed

- Normalized all child skill references/assets to the canonical 5-field contract.
- Reconciled sk-doc's own `frontmatter_templates.md` and scaffolds so new skill reference/asset docs teach the same contract.
- Updated the phase-parent `spec.md` to mark all 22 phases complete.

### Fixed

- Resolved the contradictory sk-doc guidance that said knowledge files should carry no frontmatter while templates and practice expected detailed blocks for skill references/assets.

### Verification

| Check | Result |
|-------|--------|
| Parent phase map | PASS: phases 001-022 marked Complete |
| sk-doc coverage | PASS: 39/39 docs detailed-block compliant, 0 violations |
| system-spec-kit coverage | PASS: 45/45 docs detailed-block compliant, 0 violations |
| Full-corpus parent note | PASS: parent continuity records 355/355 contract-valid |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `009-skill-frontmatter-alignment/001-frontmatter-benefit-investigation/` | Created/Updated | Investigation and operator decision recorded |
| `009-skill-frontmatter-alignment/002-022-*` | Modified | Per-skill reference/asset frontmatter normalized |
| `.opencode/skills/sk-doc/assets/frontmatter_templates.md` and scaffolds | Modified | Canonical contract guidance reconciled |
| `009-skill-frontmatter-alignment/spec.md` | Updated | Phase-parent status and child map completed |

### Follow-Ups

- Live advisor `matchedDocs` smoke depends on a fresh advisor session adopting the doc-trigger flag.
