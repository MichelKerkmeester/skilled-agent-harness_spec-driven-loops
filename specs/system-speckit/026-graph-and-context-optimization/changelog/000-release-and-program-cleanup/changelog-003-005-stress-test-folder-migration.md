---
title: "Changelog: Stress Test Folder Migration [003-post-program-quality-pass/005]"
description: "Two MCP server stress suites moved from mcp_server/tests/ into a dedicated mcp_server/stress_test/ folder. Runner wiring added so operators can reach stress coverage with npm run stress while keeping the default test suite fast."
trigger_phrases:
  - "stress test folder migration"
  - "mcp_server stress_test"
  - "session-manager-stress vitest"
  - "npm run stress mcp server"
  - "dedicated stress folder migration"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/004-followup-post-program/003-post-program-quality-pass/005-stress-test-folder-migration` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/004-followup-post-program/003-post-program-quality-pass`

### Summary

Stress-test coverage for the MCP server lived inside `mcp_server/tests/`, mixed in with the default unit and integration suite. This made it difficult to distinguish explicit stress, load and matrix-cell validation from the fast normal suite. Operators had no clear command to run stress coverage in isolation.

Two confirmed stress suites were moved out of `mcp_server/tests/` into a new dedicated `mcp_server/stress_test/` folder: `session-manager-stress.vitest.ts` (session capacity stress) and `code-graph-degraded-sweep.vitest.ts` (packet-013 degraded state cell). A `README.md` was added to document the purpose, the run commands and the boundary with default tests. Vitest discovery, TypeScript build exclusions and `package.json` were updated so `npm test` stays fast and `npm run stress` reaches only the stress folder. Direct documentation references in stress-remediation packets were refreshed to point at the new paths.

The stress suite ran cleanly at 2 files, 7 tests passed. The TypeScript build exited 0. The default test suite had pre-existing failures unrelated to this migration and was recorded as BLOCKED in the checklist.

### Added

- `mcp_server/stress_test/` folder with subdirectory layout for session, code-graph and search-quality cells
- `mcp_server/stress_test/README.md` documenting purpose, `npm run stress` command and boundary with `tests/`
- `npm run stress` script in `package.json` targeting the new dedicated folder
- `vitest.stress.config.ts` opt-in Vitest configuration for stress-only discovery

### Changed

- `mcp_server/vitest.config.ts` updated to exclude `stress_test/` from default `npm test` discovery
- `mcp_server/tsconfig.json` updated to exclude `stress_test/**/*.vitest.ts` from the production build
- `mcp_server/README.md` updated to include `stress_test/` in the server structure map
- `mcp_server/tests/README.md` updated to clarify the default suite vs stress-suite boundary

### Fixed

- Direct documentation references in stress-remediation packets now point at `mcp_server/stress_test/` rather than the old `mcp_server/tests/` paths

### Verification

| Command | Result |
|---------|--------|
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .../005-stress-test-folder-migration --strict` | PASS. 0 errors, 0 warnings |
| `cd .opencode/skills/system-spec-kit/mcp_server && npm run build` | PASS. `tsc --build` exited 0 |
| `cd .opencode/skills/system-spec-kit/mcp_server && npm test` | BLOCKED. Pre-existing suite failures unrelated to this migration (copilot-hook-wiring, plugin-bridge, handler-memory-save and others). Stress suite itself was not the cause. |
| `cd .opencode/skills/system-spec-kit/mcp_server && npm run stress` | PASS. 2 files, 7 tests passed |
| CHK-010: Stress suites live in `mcp_server/stress_test/` | PASS. `session-manager-stress.vitest.ts` and `code-graph-degraded-sweep.vitest.ts` confirmed moved |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/session/session-manager-stress.vitest.ts` | Moved | Session capacity stress coverage relocated to the dedicated folder |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts` | Moved | Packet-013 degraded state stress cell relocated to the dedicated folder |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/README.md` (NEW) | Created | Operator quickstart. Documents purpose, run commands and boundary with default tests |
| `.opencode/skills/system-spec-kit/mcp_server/vitest.config.ts` | Modified | Excludes `stress_test/` from default test discovery |
| `.opencode/skills/system-spec-kit/mcp_server/package.json` | Modified | Adds `stress` script targeting `mcp_server/stress_test/` |
| `.opencode/skills/system-spec-kit/mcp_server/tsconfig.json` | Modified | Excludes `stress_test/**/*.vitest.ts` from the production build |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Modified | Documents `stress_test/` in the MCP server folder structure |
| `.opencode/skills/system-spec-kit/mcp_server/tests/README.md` | Modified | Clarifies that `tests/` is the default suite and `stress_test/` is the opt-in stress suite |

### Follow-Ups

- Verify the default test suite (`npm test`) once pre-existing failures in `copilot-hook-wiring`, `plugin-bridge`, `handler-memory-save` and related suites are resolved in a separate remediation packet.
- Confirm `code-graph-degraded-sweep.vitest.ts` still runs cleanly after any future code-graph refactors touch its dependencies.
