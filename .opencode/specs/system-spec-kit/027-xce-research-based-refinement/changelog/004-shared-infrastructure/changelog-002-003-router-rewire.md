---
title: "Changelog: Speckit Commands - Router Rewire [002-speckit-commands/003-router-rewire]"
description: "Chronological changelog for the Speckit Commands - Router Rewire phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-15

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/002-speckit-commands/003-router-rewire` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/002-speckit-commands`

### Summary

Rewrote the four speckit command Markdown files as thin routers.

### Added

- Established the thin-router contract: each speckit command Markdown file now keeps only frontmatter, mode routing, the owned asset table, execution target mapping, and a presentation boundary reference, with no inline presentation text.

### Changed

- Rewrote `.opencode/commands/speckit/plan.md`, `implement.md`, `complete.md`, and `resume.md` as thin routers, stripping all inline startup questions, dashboard templates, and result-display blocks and replacing them with declarative asset-reference tables that point to the corresponding presentation Markdown and workflow YAML assets.
- Preserved all eight existing workflow YAML files unchanged, ensuring the router rewire is behavior-neutral.

### Fixed

- None.

### Verification

- Router reference grep - Routers reference presentation assets and auto/confirm YAML assets
- Presentation placement grep - Presentation templates appear in assets rather than routers
- YAML edit constraint - Existing YAML files were read-only and unmodified
- Strict validation - Run in final verification pass
- Tasks complete - 11 completed task item(s) recorded

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- None.
