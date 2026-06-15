---
title: "Changelog: Doctor Commands - Router Rewire [004-doctor-commands/003-router-rewire]"
description: "Chronological changelog for the Doctor Commands - Router Rewire phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/004-doctor-commands/003-router-rewire` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/004-doctor-commands`

### Summary

The three doctor command Markdown files were rewritten as thin routers.

### Added

- Three thin routers were created at `.opencode/commands/doctor/speckit.md`, `mcp.md`, and `update.md` that delegate display to dedicated presentation Markdown assets while preserving existing workflow YAML routing through `_routes.yaml`.
- Each router includes an asset table naming the workflow YAML and presentation Markdown file it routes to, making the boundary between routing, workflow behavior, and display explicit at a glance.

### Changed

- All inline prompts, dashboards, and result templates were removed from the three doctor command Markdown files and relocated to `doctor_*_presentation.md` assets under `.opencode/commands/doctor/assets/`.
- Command Markdown files now contain only frontmatter, routing contract, execution order, and routing rules, keeping the presentation boundary clean.

### Fixed

- None.

### Verification

- Router-to-presentation mapping - Passed: all three routers reference new presentation assets
- Router-to-workflow mapping - Passed: all referenced workflow YAML assets exist
- YAML edit ban - Passed: no existing *.yaml workflow assets were edited
- Strict validation - Recorded in final verification output
- Tasks complete - 11 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/commands/doctor/speckit.md` | Rewritten | Route /doctor <target> through _routes.yaml, existing target YAML, and doctor_speckit_presentation.md |
| `.opencode/commands/doctor/mcp.md` | Rewritten | Route `/doctor:mcp install |
| `.opencode/commands/doctor/update.md` | Rewritten | Route /doctor:update to existing update YAML and doctor_update_presentation.md |

### Follow-Ups

- None.
