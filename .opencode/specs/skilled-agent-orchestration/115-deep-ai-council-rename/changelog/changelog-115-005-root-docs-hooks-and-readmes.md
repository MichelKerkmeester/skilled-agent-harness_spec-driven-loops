---
title: "Changelog: 115/005 — root docs + hooks + skills index [115-deep-ai-council-rename/005-root-docs-hooks-and-readmes]"
description: "Chronological changelog for the 115/005 — root docs + hooks + skills index phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-21

> Spec folder: `.opencode/specs/skilled-agent-orchestration/115-deep-ai-council-rename/005-root-docs-hooks-and-readmes` (Level 1)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/115-deep-ai-council-rename`

### Summary

Target artifacts (per spec.md §3 + 001/scratch/resource-map.md §1 Phase 005): - README.md line 935 skill catalog entry - AGENTS.md line 162 Quick Reference Workflow row + line 336 Agent Definition (CLAUDE.md is symlink — automatic propagation) - .github/hooks/scripts/pre-push-council.sh CHANGED_FILES glob pattern update - .opencode/skills/README.md skill listing entry

### Added

- No new additions recorded.

### Changed

- Target artifacts (per spec.md §3 + 001/scratch/resource-map.md §1 Phase 005): - README.md line 935 skill catalog entry - AGENTS.md line 162 Quick Reference Workflow row + line 336 Agent Definition (CLAUDE.md is symlink — automatic propagation) - .github/hooks/scripts/pre-push-council.sh CHANGED_FILES glob pattern update - .opencode/skills/README.md skill listing entry

### Fixed

- No fixes recorded.

### Verification

- No explicit verification recorded.

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- Read pre-push-council.sh CHANGED_FILES glob
- [P] sed README.md
- [P] sed AGENTS.md (CLAUDE.md auto via symlink)
- [P] Edit .github/hooks/scripts/pre-push-council.sh glob
- [P] sed .opencode/skills/README.md
- rg "deep-ai-council" on 4 files = 0
