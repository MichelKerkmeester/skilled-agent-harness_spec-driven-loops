---
title: "Changelog: Command Documentation Cleanup"
description: "Chronological changelog for the command documentation cleanup phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-release-cleanup/006-commands` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-release-cleanup`

### Summary

This child phase executed (commit 818db21c54). All 19 command docs under `.opencode/commands` were reviewed against shipped state and the one factual drift found, a fable-mode route reference in `doctor/speckit.md`, was fixed. The `.claude/commands` mirror is a symlink so the same edit covers it. The deep-research command-router and `agent_router.md` stay deferred to the concurrent session that owns them.

### Added

- Added the Level 2 spec packet for command documentation cleanup.
- Added the task list and checklist for discovery, candidate capture, HVR edit and verification.
- Added the implementation summary that records the executed cleanup and the deferred subset.

### Changed

- Fixed the fable-mode route reference in `doctor/speckit.md` after reviewing 19 command docs.
- Recorded the deferred deep-research router and `agent_router.md` subset.

### Fixed

- Corrected the one verified factual drift found across the command docs.

### Verification

| Check | Result |
|-------|--------|
| Cleanup execution | Executed at 818db21c54, one route-drift fix, concurrent subset deferred |
| Task completion | PASS, all tasks done, 0 open |
| Strict validation | PASS, 0 errors and 0 warnings |

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/commands/doctor/speckit.md` | Modified | Fixed the fable-mode route reference |
| `spec.md` | Updated | Status set to COMPLETE, completion recorded |
| `checklist.md` | Updated | Verification items checked with evidence |
| `implementation-summary.md` | Updated | Executed cleanup closeout with deferred subset |

### Follow-Ups

- Hand the deferred deep-research router and `agent_router.md` back to the concurrent session that owns them.
