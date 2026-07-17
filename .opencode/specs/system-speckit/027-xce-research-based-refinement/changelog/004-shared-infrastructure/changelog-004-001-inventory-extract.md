---
title: "Changelog: Doctor Commands - Inventory and Extract [004-doctor-commands/001-inventory-extract]"
description: "Chronological changelog for the Doctor Commands - Inventory and Extract phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/004-doctor-commands/001-inventory-extract` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/004-doctor-commands`

### Summary

The doctor command family was inventoried and inline presentation contracts were classified for extraction.

### Added

- A full inventory was produced cataloging all three doctor command Markdown files (`speckit.md`, `mcp.md`, `update.md`), the `_routes.yaml` manifest, and every existing workflow YAML asset, establishing the baseline for the presentation split.
- An extraction map was created classifying every inline prompt, dashboard, and result block by command surface and display category, providing the blueprints for the subsequent author-presentation and router-rewire phases.

### Changed

- Each router now includes a Presentation Boundary section naming the content categories moved to its dedicated presentation asset, making the split between routing and display traceable.

### Fixed

- None.

### Verification

- Command inventory - Passed: three Markdown routers found
- Workflow asset inventory - Passed: existing YAML assets mapped and left untouched
- Extraction coverage - Passed: startup, dashboard, and result display categories mapped for each command
- Strict validation - Recorded in final verification output
- Tasks complete - 11 completed task item(s) recorded

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- None.
