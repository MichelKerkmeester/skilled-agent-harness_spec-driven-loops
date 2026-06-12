---
title: "Changelog: 002-speckit-commands"
description: "Speckit command routers were split from presentation contracts and statically verified against valid workflow and presentation assets."
trigger_phrases:
  - "011 002 speckit commands changelog"
  - "speckit presentation split"
  - "speckit router references"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/002-speckit-commands` (Level 2, Phase Parent)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation`

### Summary

The speckit command family completed the same four-aspect presentation extraction as memory commands. Routers remain thin, presentation assets own startup/dashboard/result displays, and workflow YAML behavior remains the execution source.

### Added

- Dedicated speckit presentation assets for startup prompts, auto setup displays, dashboards, checkpoints, success/failure/resume/no-session displays, and next-step wording.

### Changed

- `.opencode/commands/speckit/*.md` routers now point to valid presentation and workflow assets rather than owning display templates inline.

### Fixed

- Centralized presentation contract placement for startup questions, dashboard layouts, and result displays.

### Verification

| Check | Result |
|-------|--------|
| Nested phase map | PASS: 001-004 completed |
| Presentation phrase grep | PASS: presentation phrases appear in `assets/speckit_*_presentation.*` |
| Router asset grep | PASS: routers reference valid presentation and YAML assets |
| Static reference checks | PASS: implementation summary records static file-existence checks |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/commands/speckit/*.md` | Modified | Thin-router references to workflow and presentation assets |
| `.opencode/commands/speckit/assets/speckit_*_presentation.*` | Created | Speckit display contracts |
| `002-speckit-commands/**` | Updated | Nested phase docs and verification evidence |

### Follow-Ups

- Cross-model live rendering was not executed; this phase verified static command/presentation contracts.
