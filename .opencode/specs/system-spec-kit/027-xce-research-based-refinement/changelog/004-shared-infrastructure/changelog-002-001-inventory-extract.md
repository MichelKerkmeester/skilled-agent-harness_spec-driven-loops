---
title: "Changelog: Speckit Commands - Inventory and Extract [002-speckit-commands/001-inventory-extract]"
description: "Chronological changelog for the Speckit Commands - Inventory and Extract phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/002-speckit-commands/001-inventory-extract` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/002-speckit-commands`

### Summary

Inventory found four speckit command routers and eight existing workflow YAML assets.

### Added

- Inventoried all four speckit command routers (`plan.md`, `implement.md`, `complete.md`, `resume.md`) and mapped their eight existing workflow YAML assets, confirming every command has both auto and confirm YAML pairs.
- Identified and classified inline startup-question blocks, dashboard layouts, and result-display templates for extraction into dedicated presentation Markdown assets, keeping workflow step execution in YAML unchanged.
- Drafted an extraction map recording which presentation contracts move to which presentation Markdown file, establishing the source-of-truth baseline for the family.

### Changed

- None.

### Fixed

- None.

### Verification

- Command inventory - Four command Markdown files identified
- Workflow inventory - Eight existing workflow YAML assets identified
- Presentation placement - Grep confirmed presentation-specific templates live in presentation assets
- Strict validation - Run in final verification pass
- Tasks complete - 11 completed task item(s) recorded

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- None.
