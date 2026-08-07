---
title: "Changelog: Create Commands - Inventory and Extract [003-create-commands/001-inventory-extract]"
description: "Chronological changelog for the Create Commands - Inventory and Extract phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/003-create-commands/001-inventory-extract` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/003-create-commands`

### Summary

The create command family was inventoried across command routers, existing workflow YAML assets, and inline presentation-contract sections.

### Added

- Inventoried all seven create command Markdown files in `.opencode/commands/create/` and mapped their existing workflow YAML assets (12 total), treating YAML files as read-only.
- Identified and classified inline startup-question blocks, dashboard layout sections, and results-display templates in each command router for later extraction into dedicated presentation assets.
- Drafted a routing-asset table into each command Markdown file that maps the command to its workflow YAML and planned presentation Markdown, providing a discoverable extraction baseline for the family.

### Changed

- None.

### Fixed

- None.

### Verification

- Command inventory - 7 command Markdown files accounted for
- Workflow asset inventory - 12 existing YAML files referenced; none edited
- Presentation inventory - 7 new presentation Markdown files planned and created
- Sufficiency artifact - REFERENCE_CHECK=PASS confirms router references resolve to existing assets
- Tasks complete - 11 completed task item(s) recorded

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- None.
