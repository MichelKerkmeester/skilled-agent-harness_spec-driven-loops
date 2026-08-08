---
title: "Changelog: Migration Plan [032/002]"
description: "Chronological changelog for the specs-root relocation migration design phase — two ADRs."
trigger_phrases:
  - "phase changelog"
  - "migration plan adrs"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-08-06

> Spec folder: `specs/system-speckit/032-relocate-specs-folder/002-migration-plan` (Level 3)
> Parent packet: `specs/system-speckit/032-relocate-specs-folder`

### Summary

Designed the topology-inversion migration and recorded two Accepted ADRs. ADR-001: build a new `flipToTopLevelCanonical` orchestrator on the existing `spec-root-*` primitives (byte-verified copy, quarantine-backed safety check) rather than repointing the reverse-direction migration function or writing from scratch. ADR-002: the harder decision — downstream project ownership of specs data.

### Changed

- Corrected an assumption phase 001 carried forward: `PUBLIC-RELEASE.md` shows downstream projects symlink their entire `.opencode/` directory, and git cannot track content behind a symlink — a local `!specs/` negation ("repo-owned by default") was not implementable as originally framed.

### Added

- `SPEC_KIT_SPECS_DIR` (alias `SPECKIT_SPECS_DIR`) opt-in override, mirroring the already-shipped `SPEC_KIT_DB_DIR` pattern, so a downstream project that wants to own its specs can without forcing that choice on everyone.

### Fixed

- A silent data-exposure risk in the flip design itself: post-flip, `.gitignore`'s existing `.opencode/specs/<project>` entries would match nothing (git sees only a symlink blob there), while those projects' real content would sit at `specs/<project>/` — untracked and unignored, visible to `git add -A` in a public repo. Fix: the symlink flip and the `.gitignore` rebase must land in one atomic commit, never split. This became step 4 of phase 003's runbook.
- A resolver-precedence disagreement: `context-server.ts` checked `specs` before `.opencode/specs`, `api/indexing.ts` checked the opposite order — masked while `specs` was a symlink, would silently diverge once a downstream project had its own real root. Flagged for phase 003 step 7.

### Verification

- All 21 registry entries' current precedence behavior confirmed against real code before scoping (not assumed).
- Both ADRs accepted by the operator before phase 003 began.
