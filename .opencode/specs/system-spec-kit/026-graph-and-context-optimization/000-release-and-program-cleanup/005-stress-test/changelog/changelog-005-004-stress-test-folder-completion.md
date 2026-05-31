---
title: "Stress Test Folder Completion: Content-Based Migration to Subsystem Layout"
description: "Completed the MCP server stress-test migration using content-based discovery. Moved search-quality harness, memory, session and matrix suites into subsystem folders under mcp_server/stress_test/. Added a dedicated Vitest stress config so the default test run stays focused on unit and integration feedback."
trigger_phrases:
  - "stress test folder completion"
  - "search-quality harness move"
  - "content-based stress migration"
  - "vitest stress config"
  - "stress test subsystem layout"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/004-stress-test-folder-completion` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test`

### Summary

Packet 037/005 had migrated only two filename-matching files into the stress folder, leaving the bulk of stress coverage scattered across the default test tree. This packet completed the migration using content-based discovery. Every file whose imports or test descriptions indicated stress, benchmark, concurrency or degraded-state intent was classified and moved into a subsystem folder under `mcp_server/stress_test/`. A dedicated `vitest.stress.config.ts` now routes `npm run stress` to the stress surface only. The default Vitest config explicitly excludes `stress_test/**` to keep unit and integration feedback fast. A `migration-plan.md` ledger records each candidate, its classification rationale and the ambiguous mixed-suite files intentionally left in `tests/`.

### Added

- `vitest.stress.config.ts` (NEW) discovering only `mcp_server/stress_test/**/*.{vitest,test}.ts`
- `migration-plan.md` (NEW) recording content-based discovery results, per-file classification, ambiguous mixed suites and false positives
- Subsystem folders `mcp_server/stress_test/search-quality/`, `memory/`, `session/` and `matrix/` as migration targets for the moved suites

### Changed

- `vitest.config.ts` updated to exclude `mcp_server/stress_test/**` from the default test run
- `package.json` updated to add `stress`, `stress:harness` and `stress:matrix` script targets routed through the new stress config

### Fixed

- Incomplete 037/005 migration that moved only two filename-matching files. Content-based discovery surfaced the full stress surface and the correct subsystem layout was applied.

### Verification

| Check | Result |
|-------|--------|
| Stale-path grep | PASS. No live refs returned after path-reference refresh. |
| `npm run build` | PASS |
| Strict validator | PASS. 0 errors and 0 warnings. |
| `npm test` | FAIL then HANG. Unrelated existing failures across hook, graph metadata, modularization and code-graph suites. Hang predates this packet. |
| `npm run stress` | PASS. 25 files and 63 tests discovered via the dedicated stress config. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/` | Moved | Full harness, corpus, metrics, telemetry and W-cell cases |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/memory/` | Moved | Memory search and trigger benchmarks |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/session/` | Moved | Session-manager stress and resume benchmarks |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/matrix/` | Moved | Synthetic matrix comparison suite |
| `.opencode/skills/system-spec-kit/mcp_server/vitest.config.ts` | Modified | Excludes `stress_test/**` from default test run |
| `.opencode/skills/system-spec-kit/mcp_server/vitest.stress.config.ts` | Created (NEW) | Dedicated stress-suite Vitest config |
| `.opencode/skills/system-spec-kit/mcp_server/package.json` | Modified | Adds stress script routing |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/004-stress-test-folder-completion/migration-plan.md` | Created (NEW) | Classification ledger preserving discovery rationale |

### Follow-Ups

- Rename metadata was not staged by this runtime. `git mv` failed because the sandbox could not create `.git/index.lock`. Files were moved with filesystem moves and can be detected as renames when committed by the orchestrator.
- Mixed suites remain in `tests/`. This is intentional and documented in `migration-plan.md`.
- The default test suite is not clean in this workspace. Unrelated failures across hook, graph metadata, modularization and code-graph suites preceded the hang. Verify those suites in a clean environment.
