---
title: "Template Levels Phase 010/006: Command Markdown and YAML alignment"
description: "Audited 18 in-scope command assets (6 Markdown files and 12 YAML workflow assets under .opencode/commands/spec_kit/) for stale template-system references, banned public vocabulary leaks, and missing current-behavior notes. Removed all stale references. Preserved YAML structure and step ordering. Added current-behavior notes for validation exit codes, path hardening, and save locking where they affect command behavior."
trigger_phrases:
  - "phase 010/006 changelog"
  - "command md yaml alignment"
  - "spec_kit command audit"
  - "workflow yaml alignment"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-02

> Spec folder: `026-graph-and-context-optimization/008-template-levels/006-command-md-yaml-alignment` (Level 3)
> Parent packet: `026-graph-and-context-optimization/008-template-levels`

### Summary

Phase 006 audited the AI-facing command surfaces for `/spec_kit` after the template-level refactor. The 6 command Markdown files under `.opencode/commands/spec_kit/` and 12 command YAML workflow assets under `.opencode/commands/spec_kit/assets/` were reviewed for stale references to deleted scripts (`compose.sh`, `wrap-all-templates`), deleted folder names (`level_N/` directories), and the retired architecture label. Current-behavior notes were added only where they affect command invocation: validation exit codes, path traversal rejection, canonical save locking, batch inline rendering, and phase-mode syntax.

YAML files received the higher-risk attention because they drive runtime command behavior. Each edit preserved step IDs, ordering, and structural shape. All 12 YAML files parse cleanly after edits.

### Added

- Current-behavior notes in command Markdown where they affect command invocation: validation exit codes (1 for bad flags, 2 for validation failures, 3 for missing folders), `SPECKIT_POST_VALIDATE=1`, path traversal rejection, save locking, and batch rendering.

### Changed

- 6 command Markdown files (`complete.md`, `deep-research.md`, `deep-review.md`, `implement.md`, `plan.md`, `resume.md`): stale references removed. Current-behavior notes added where relevant.
- 12 YAML workflow assets (`spec_kit_*_auto.yaml` and `spec_kit_*_confirm.yaml`): stale references removed. Vocabulary preserved or corrected. Step IDs and ordering unchanged.
- `graph-metadata.json`: registered 006 as active child.

### Fixed

- Zero stale-pattern hits remain in `.opencode/commands/spec_kit/`.
- Zero banned public vocabulary leaks in user-facing command prose (excluding legitimate runtime workflow terms and concrete `templates/manifest/` directory references).
- All 12 YAML files parse cleanly with Python yaml.safe_load.

### Verification

- `workflow-invariance.vitest.ts` passes after edits.
- 006 packet validates in strict mode.
- Prior sibling packets (003, 004, 005) validate cleanly.
- YAML parse gate: all 12 workflow assets parsed successfully.

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/commands/spec_kit/complete.md` | Stale references removed. Exit-code and validation notes added. |
| `.opencode/commands/spec_kit/deep-research.md` | Stale references removed. |
| `.opencode/commands/spec_kit/deep-review.md` | Stale references removed. |
| `.opencode/commands/spec_kit/implement.md` | Stale references removed. Path hardening notes added. |
| `.opencode/commands/spec_kit/plan.md` | Stale references removed. Phase-mode syntax note added. |
| `.opencode/commands/spec_kit/resume.md` | Stale references removed. Save-locking note added. |
| `.opencode/commands/spec_kit/assets/spec_kit_*_auto.yaml` (6 files) | Stale references corrected. |
| `.opencode/commands/spec_kit/assets/spec_kit_*_confirm.yaml` (6 files) | Stale references corrected. |
| `008-template-levels/graph-metadata.json` | 006 registered as active child. |

One commit: `de27ce62f9`.

### Follow-Ups

- **Phase 007 (fleet marker sweep).** Validate and clean fleet markers across spec folders.
- **Phase 008 (z_archive marker sweep).** Validate and clean archive markers.