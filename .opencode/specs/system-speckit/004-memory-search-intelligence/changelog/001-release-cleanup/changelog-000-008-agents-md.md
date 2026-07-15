---
title: "Changelog: AGENTS.md and Runtime Routing Cleanup"
description: "Chronological changelog for the AGENTS.md and runtime-routing cleanup phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/000-release-cleanup/008-agents-md` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/000-release-cleanup`

### Summary

The AGENTS.md and runtime-routing cleanup ran against the three maintained surfaces: root `AGENTS.md`, the Codex voice mirror and the Claude routing mirror. One stale factual claim was found and fixed: the root file now reports 39 mk-spec-memory tools instead of 37. The live count was confirmed from the CLI, tool registry source and canonical skill docs. The mirror files had no stale paths, counts or routes and were left unchanged.

### Added

- Added verification evidence for the live tool counts and path-resolution checks.
- Added completed cleanup status to the phase docs.

### Changed

- Updated the root `AGENTS.md` mk-spec-memory tool count to match the live server.
- Marked the phase spec, plan, task list, checklist and summary as complete.

### Fixed

- Corrected the only confirmed stale count across the maintained AGENTS and runtime-routing surfaces.
- Kept the Codex and Claude mirrors unchanged because their route and path claims were current.

### Verification

| Check | Result |
|-------|--------|
| Stale-reference scan | PASS, no actionable hit |
| Path resolution | PASS, every referenced path in root `AGENTS.md` resolves |
| Tool counts | PASS, mk-spec-memory 39, advisor 9 and code-index 8 |
| Edited-prose voice | PASS, edited line has no em dash, semicolon or Oxford comma |
| Task completion | PASS, 15 done, 0 open |
| Strict validation | PASS, exits 0 |

### Files Changed

| File | Action | What changed |
|---|---|---|
| `AGENTS.md` | Modified | Fixed mk-spec-memory tool count |
| `spec.md` | Updated | Status set to complete |
| `plan.md` | Updated | Quality gates marked done |
| `tasks.md` | Updated | All cleanup tasks checked |
| `checklist.md` | Updated | Verification items checked |
| `implementation-summary.md` | Updated | Executed cleanup closeout |

### Follow-Ups

- Treat broader governance-doc voice restyling as separate, higher-blast work.
- Keep mirror files unchanged until a concrete stale route, count or path appears.
