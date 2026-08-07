---
title: "Changelog: 007-presentation-asset-format"
description: "Renamed 24 command presentation assets from .md to .txt so the slash-command loader stops registering them, with display content unchanged."
trigger_phrases:
  - "004/002 007 presentation asset changelog"
  - "presentation md to txt"
  - "command asset format"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-12

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/007-presentation-asset-format` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation`

### Summary

All 24 command presentation assets were renamed from `.md` to `.txt` so they remain co-located with their command families but are no longer discovered as slash commands. The display content stayed byte-identical; only extensions and references changed.

### Added

- A sk-doc template rule documenting the presentation-extension convention.

### Changed

- Renamed `.opencode/commands/*/assets/*_presentation.md` to `*_presentation.txt`.
- Updated command routers and sk-doc generator templates to reference `.txt` presentation assets.
- Fixed doctor presentation assets' self-references to their own `.txt` paths.

### Fixed

- Prevented presentation contracts from being registered as slash commands by the loader.

### Verification

| Check | Result |
|-------|--------|
| No residual `.md` refs | PASS: no `_presentation.md` refs in command tree or sk-doc assets |
| No orphaned asset `.md` | PASS |
| No code path by `.md` | PASS: no TS/JS/CJS hardcoded loads |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/commands/*/assets/*_presentation.md` (24) | Renamed | Became `*_presentation.txt` |
| `.opencode/commands/*/*.md` | Modified | References updated to `.txt` |
| `.opencode/skills/sk-doc/assets/*` command templates/rules | Modified | Future scaffolding emits `.txt` presentation references |

### Follow-Ups

- Loader registration behavior takes full effect in a fresh session because the loader caches at session start.
