---
title: "Changelog: Memory Commands - Router Rewire [001-memory-commands/003-router-rewire]"
description: "Chronological changelog for the Memory Commands - Router Rewire phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/001-memory-commands/003-router-rewire` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/001-memory-commands`

### Summary

Replaced the four long memory command files with slim routers that point to presentation assets and preserve local workflow routing.

### Added

- Rewired `save.md`, `search.md`, `manage.md`, and `learn.md` as slim routers that point to their `*_presentation.md` assets and preserve local workflow routing.
- Documented the known YAML gap in `implementation-summary.md` so operators understand why workflow asset pointers are not file paths.

### Changed

- Removed inline display blocks (startup prompts, dashboards, result templates) from all four command routers; those concerns now live in presentation Markdown assets.
- Mapped each command router to its corresponding `*_presentation.md` file in `.opencode/commands/memory/assets/`.
- Preserved minimal workflow routing tables within each command router while reporting the missing YAML asset gap.
- Ran `validate.sh --strict` for this leaf.

### Fixed

- None.

### Verification

- Router presentation references - node -e reference check verified four existing Markdown assets
- Workflow YAML references - node -e reference check found no dangling memory YAML references
- Inline presentation removal - `rg -n "MEMORY:SEARCH \"<query>\"
- Strict validation - bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <leaf> --strict
- Tasks complete - 11 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/commands/memory/save.md` | assets/save_presentation.md | No existing memory YAML asset found; router reports gap |
| `.opencode/commands/memory/search.md` | assets/search_presentation.md | No existing memory YAML asset found; router reports gap |
| `.opencode/commands/memory/manage.md` | assets/manage_presentation.md | No existing memory YAML asset found; router reports gap |
| `.opencode/commands/memory/learn.md` | assets/learn_presentation.md | No existing memory YAML asset found; router reports gap |

### Follow-Ups

- Full workflow-routing separation into YAML could not be completed because the requested existing memory workflow YAML assets are absent and creating YAML assets was out of scope.
