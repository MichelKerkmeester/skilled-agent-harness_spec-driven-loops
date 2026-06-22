---
title: "Changelog: Skill Advisor Workspace-Root Resolution"
description: "Chronological changelog for the skill-advisor workspace-root resolution phase, relocated into the skill-advisor subsystem as phase 008."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-22

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-skill-advisor/008-advisor-workspace-root-resolution` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-skill-advisor`

### Summary

Relocated into the skill-advisor subsystem as phase 008. This phase, completed 2026-06-21, makes the skill advisor resolve its workspace root deterministically rather than from the process working directory. `resolveWorkspaceRoot()` walks up from the module's own location until it finds the directory that contains `.opencode/skills/system-skill-advisor`. The startup scan and the daemon initialization, which previously passed `process.cwd()`, now use the resolver, so the advisor always writes to the canonical `<root>/.opencode/skills/.advisor-state/` and never spawns a nested state directory.

### Added

- `resolveWorkspaceRoot()`, a deterministic module-anchored walk-up resolver.
- Startup scan and daemon initialization now consume the resolver in place of `process.cwd()`.

### Changed

- Relocated from `system-skill-advisor/001-advisor-workspace-root-resolution` to `003-skill-advisor/008-advisor-workspace-root-resolution`, surgical metadata only with no content change.
- The workspace-root source moved from the process working directory to a module-anchored walk-up.

### Fixed

- A nested `.opencode/.advisor-state/` could be created when the advisor ran from a working directory below the repo root. The walk-up resolution prevents it.

### Verification

- Phase completed 2026-06-21, and `validate.sh --strict` passes at the new location with zero errors.
