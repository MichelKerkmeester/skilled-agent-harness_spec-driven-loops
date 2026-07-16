---
title: "Changelog: Create Commands - Router Rewire [003-create-commands/003-router-rewire]"
description: "Chronological changelog for the Create Commands - Router Rewire phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/003-create-commands/003-router-rewire` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/003-create-commands`

### Summary

The seven create command Markdown files were rewritten as thin routers. Each router now contains frontmatter, a routing asset table, execution order, and routing rules.

### Added

- Seven thin routers were created at `.opencode/commands/create/agent.md`, `changelog.md`, `feature-catalog.md`, `folder_readme.md`, `sk-skill.md`, `skill.md`, and `testing-playbook.md` that delegate display to dedicated presentation Markdown assets while preserving existing workflow YAML routing.
- Each router includes a routing-asset table mapping the command to its workflow YAML and presentation Markdown file, making the separation between routing, behavior, and display explicit at a glance.

### Changed

- All inline startup prompts, dashboards, and result templates were removed from the seven create command Markdown files and relocated to `*_presentation.md` assets under `.opencode/commands/create/assets/`.
- Routers now fail closed when a referenced workflow or presentation asset is missing, preventing silent degradation from broken reference chains.
- Command Markdown files contain only frontmatter, routing contract, execution order, and routing rules, keeping the presentation boundary clean.

### Fixed

- None.

### Verification

- Routers rewritten - 7 of 7 complete
- YAML edit check - No YAML files edited
- Asset reference model - Each router points to presentation plus existing workflow YAML
- Reference artifact - REFERENCE_CHECK=PASS for all seven create command routers
- Tasks complete - 11 completed task item(s) recorded

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- None.
