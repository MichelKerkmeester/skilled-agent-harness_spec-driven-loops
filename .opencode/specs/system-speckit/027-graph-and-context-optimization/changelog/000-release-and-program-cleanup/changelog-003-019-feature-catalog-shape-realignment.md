---
title: "Feature Catalog Shape Realignment: Canonical Four-Section Snippet Enforcement"
description: "Per-feature catalog snippets across six real catalog roots were realigned to the canonical sk-doc four-section shape, removing TOC drift and rebuilding skill_advisor and code_graph files from legacy section layouts."
trigger_phrases:
  - "feature catalog shape realignment"
  - "sk-doc canonical snippet shape"
  - "skill_advisor feature catalog rebuild"
  - "code_graph catalog canonical sections"
  - "catalog OVERVIEW CURRENT REALITY realignment"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-30

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/019-feature-catalog-shape-realignment` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass`

### Summary

Per-feature catalog snippets across the six real catalog roots had drifted from the canonical sk-doc four-section shape. The `skill_advisor` catalog used PURPOSE, TEST COVERAGE and RELATED headings. The `code_graph` catalog used SURFACE, TRIGGER, CLASS, CAVEATS and CROSS-REFS headings. The `sk-deep-review` catalog had redundant per-file TOC blocks. Additional lint drift was found in the `system-spec-kit` catalog beyond the original inventory.

All four affected catalog roots were brought to the canonical OVERVIEW, CURRENT REALITY, SOURCE FILES and SOURCE METADATA shape in a single commit (c2b99f5a3d). The realignment was content-preserving: legacy sections were renamed or moved, not discarded. A six-root drift audit confirmed zero DRIFT lines after the work landed.

### Added

None.

### Changed

- `skill_advisor` feature files rebuilt from PURPOSE and TEST COVERAGE shape into the canonical four H2 sections. 37 files updated across six category folders.
- `code_graph` feature files rebuilt from SURFACE, TRIGGER, CLASS, CAVEATS and CROSS-REFS shape. 17 files updated with runtime behavior moved to CURRENT REALITY and source paths moved to SOURCE FILES.
- `sk-deep-review` feature files had redundant per-file TOC blocks removed from all 19 files across four category folders.
- `system-spec-kit` lint pass found extra shape drift beyond the original inventory. Those files were folded into the same shape cleanup.
- Evergreen wording removed from touched catalog files per the evergreen-doc rule.

### Fixed

- Lint-discovered per-feature drift in the `system-spec-kit` catalog repaired. Sections beyond the canonical four H2s were converted to H3 subsections without changing content meaning.

### Verification

| Check | Result |
|-------|--------|
| Six-root shape audit | PASS. No DRIFT lines across all six catalog roots. |
| Structural Node audit | PASS. No issues found. |
| Evergreen grep | PASS. Unexempted packet-history wording removed from all touched catalog files. |
| Strict validator | PASS. Exit 0, zero errors, zero warnings. |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skill/sk-deep-review/feature_catalog/**/*.md` | Removed redundant per-file TOC blocks from 19 files across four category folders. |
| `.opencode/skill/system-spec-kit/feature_catalog/**/*.md` | Fixed lint-discovered shape drift and evergreen wording across multiple category folders. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/**/*.md` | Rebuilt 17 files from SURFACE/TRIGGER/CLASS/CAVEATS/CROSS-REFS into canonical four-section shape. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/**/*.md` | Rebuilt 37 files from PURPOSE/TEST COVERAGE/RELATED into canonical four-section shape. |

### Follow-Ups

- Broad repository grep still sees two sk-doc asset templates under a `feature_catalog` folder. Those files are documentation templates for catalog creation. They are not per-feature catalog snippets and remain untouched.
- One published filename contains historical wording. The file was not renamed because stable catalog paths are part of the published reference surface.
