---
title: "Code Graph Phase 002: Self-Contained Package Migration"
description: "Behavior-preserving migration moved 34 code-graph files into a single self-contained package under mcp_server/code-graph/. All 52 code-graph tests, 85 skill-advisor tests, and 171 hook tests pass with zero regressions."
trigger_phrases:
  - "phase 002 changelog"
  - "code graph self-contained package"
  - "code graph migration"
  - "code graph package"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-25

> Spec folder: `026-graph-and-context-optimization/005-code-graph/002-code-graph-self-contained-package` (Level 2)
> Parent packet: `026-graph-and-context-optimization/004-code-graph`

### Summary

The code-graph source was scattered across 4 directories under the MCP server project. Handlers lived in one place, shared library code in another, tests in a third, and tool definitions in a fourth. This layout made it hard to understand the surface area and to dispatch targeted CI runs.

A behavior-preserving migration moved 34 files (17 library, 9 handler, 1 tool, 7 test) into a single `mcp_server/code-graph/` package. The move followed the pattern established by the skill-advisor self-contained package migration in the prior packet.

Every import path was rewritten. The dispatcher was rewired to point at the new package root. Vitest configuration was updated to resolve the new path. The git history was preserved on the old path. Commit of the new-path history was blocked by a sandboxed git index but the filesystem migration is complete.

### Added

- `mcp_server/code-graph/` package directory with 34 migrated files
- `mcp_server/code-graph/index.ts` barrel export (auto-generated from prior import surface)
- Dispatcher rewiring in `mcp_server/index.ts` to point at the new package path

### Changed

- 34 files relocated from 4 source directories into `mcp_server/code-graph/`
- All internal import paths rewritten to use package-relative paths
- Vitest config updated to resolve the new `code-graph` package root
- Vitest import paths in test files rewritten for the new layout

### Fixed

- None. This was a pure behavior-preserving migration.

### Verification

- Code-graph vitest suite: 52 of 52 tests pass.
- Skill-advisor vitest suite: 85 of 85 tests pass (no cross-package regressions).
- Hooks vitest suite: 171 of 171 tests pass (no runtime-side regressions).
- Typecheck (`npm run typecheck`): exit 0.
- ESLint: zero new violations.
- Import-path cross-consistency grep: zero stale paths found.

### Files Changed

| File | What changed |
|------|--------------|
| `mcp_server/code-graph/` (NEW, 34 files) | 17 lib + 9 handler + 1 tool + 7 test files migrated into self-contained package |
| `mcp_server/index.ts` | Dispatcher rewired to new `code-graph` package path |
| `vitest.config.ts` | Code-graph package root added to resolve paths |

### Follow-Ups

- **Commit and git-history migration.** The filesystem migration is complete but the orchestrator must stage and commit the new-path files for git history to attach to the new location. Old-path git history is intact.
