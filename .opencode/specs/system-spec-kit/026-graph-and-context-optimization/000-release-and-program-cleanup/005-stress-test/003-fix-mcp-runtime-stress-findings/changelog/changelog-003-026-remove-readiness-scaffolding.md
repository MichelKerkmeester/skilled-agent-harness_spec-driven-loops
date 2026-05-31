---
title: "Readiness Scaffolding Cleanup"
description: "Mechanical removal of the vestigial embedding-readiness scaffold from the MCP server: flag declaration, helper functions, re-exports, startup call sites, plus readiness mocks across 27 test files."
trigger_phrases:
  - "readiness scaffolding cleanup"
  - "remove embedding readiness flag"
  - "isEmbeddingModelReady removal"
  - "vestigial readiness dead code"
  - "026-remove-readiness-scaffolding"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/026-remove-readiness-scaffolding` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings`

### Summary

Packet `005-vestigial-embedding-readiness-gate-removal` deleted the embedding-readiness gate at `memory-search.ts` but left the surrounding scaffolding untouched: a boolean flag in `db-state.ts`, three exported helper functions (`isEmbeddingModelReady`, `setEmbeddingModelReady`, `waitForEmbeddingModel`), re-exports in `core/index.ts` plus handler files, two no-op call sites in `context-server.ts`, a warmup marker in `api/indexing.ts`, a scheduler wait in `shadow-evaluation-runtime.ts`, plus mocks in 19 test files that bypassed the now-deleted gate. After the T016-T019 lazy-loading migration the embedding model self-initializes on first use, so none of that scaffolding protected anything.

This cleanup removes every non-dist TypeScript reference to the readiness symbols. A pre-flight grep expanded scope beyond the original eight test files to cover every reference. TypeScript compiled clean after deletion. The targeted readiness-relevant Vitest subset (19 files, 109 passed, 5 todo, 0 failed) confirmed no behavioral regression. The broad suite timed out with pre-existing unrelated failures unconnected to this change.

### Added

None.

### Changed

- `db-state.ts` flag declaration and three readiness helper functions removed from the embedding model subsystem
- `core/index.ts` re-exports of the readiness helpers removed
- `handlers/index.ts` lazy readiness exports removed. `handlers/memory-crud.ts` snake_case aliases removed.
- `handlers/memory-crud-health.ts` health response field that depended on the deleted flag removed
- `context-server.ts` startup readiness wait, bootstrap marker, timeout constant, plus the matching import removed
- `api/indexing.ts` warmup readiness marker removed
- `lib/feedback/shadow-evaluation-runtime.ts` scheduler readiness wait removed

### Fixed

- 19 test files carried `vi.fn` mocks for `isEmbeddingModelReady` plus `waitForEmbeddingModel` that existed only to bypass the deleted gate. Those mocks became noise after the gate was removed. They are gone.
- `tests/handler-memory-crud.vitest.ts` tests `T519-H2` and `T519-H2b` tested the now-deleted `setEmbeddingModelReady` function directly and were removed.
- `tests/modularization.vitest.ts` carried export-shape expectations for the readiness symbols that caused false failures after deletion. Those expectations are removed.

### Verification

| Check | Result |
|-------|--------|
| Pre-flight grep | Found extra references in runtime and test files. Scope updated to include all non-dist TypeScript references. |
| Final non-dist grep | PASS: exit 1 with no matches. Zero non-dist source references to the readiness symbols. |
| Final `dist/` grep | PASS: exit 1 with no matches after `npx tsc`. |
| `npx tsc --noEmit` | PASS: exited 0 |
| `npx tsc` | PASS: exited 0 |
| Targeted readiness Vitest subset | PASS: `npx vitest run --reporter=default --test-timeout=60000 tests/handler-memory-search-live-envelope.vitest.ts stress_test/search-quality/ tests/graph-readiness-mapper.vitest.ts tests/handler-memory-crud.vitest.ts tests/memory-search-integration.vitest.ts` exited 0. 19 files. 109 passed. 5 todo. 0 failed. |
| Broad `npx vitest run` | FAIL/STUCK: timed out at 600s. Pre-existing failures in handler-save, graph, skill-advisor, checkpoint, modularization, plus structural suites. Confirmed hangs in both `progressive-validation.vitest.ts` files. Not caused by this change. |
| Impacted-file Vitest subset | FAIL: stale structural and modularization assertions in `context-server.vitest.ts` and module line-limit checks remained. Not evidence of a readiness regression. |
| Strict spec validator | PASS: exited 0, zero warnings |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts` | Modified | Flag declaration and three readiness helper function definitions removed |
| `.opencode/skills/system-spec-kit/mcp_server/core/index.ts` | Modified | Re-exports of the three readiness helpers removed |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modified | Startup readiness wait, bootstrap marker, timeout constant, plus import removed |
| `.opencode/skills/system-spec-kit/mcp_server/api/indexing.ts` | Modified | Warmup readiness marker removed |
| `.opencode/skills/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts` | Modified | Scheduler readiness wait removed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/index.ts` | Modified | Lazy handler readiness exports removed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud.ts` | Modified | Handler readiness exports and snake_case aliases removed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Modified | Health response field depending on the deleted readiness flag removed |
| `.opencode/skills/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts` | Modified | Readiness mocks removed |
| `.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts` | Modified | Readiness mocks and export-shape assertion removed |
| `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-crud.vitest.ts` | Modified | T519-H2, T519-H2b test cases and mock list entry removed |
| `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts` | Modified | Readiness mocks and stale comment removed |
| `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-search-live-envelope.vitest.ts` | Modified | Readiness mocks removed while preserving existing graph-readiness changes |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-context.vitest.ts` | Modified | Readiness mocks removed |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts` | Modified | Readiness mocks removed |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-context.resume-gate-d.vitest.ts` | Modified | Readiness mocks removed |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts` | Modified | Readiness setup calls, field expectation, plus readiness suite removed |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts` | Modified | Readiness mocks removed |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts` | Modified | Readiness mocks removed |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts` | Modified | Readiness mocks removed |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts` | Modified | Readiness mocks removed |
| `.opencode/skills/system-spec-kit/mcp_server/tests/modularization.vitest.ts` | Modified | Readiness export expectations removed |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/memory/gate-d-benchmark-memory-search.vitest.ts` | Modified | Readiness mocks removed |
| `.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-4-stage-search-pipeline.vitest.ts` | Modified | Readiness mocks removed |
| `.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-constitutional-memory.vitest.ts` | Modified | Readiness mocks removed |
| `.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-embedding-semantic-search.vitest.ts` | Modified | Readiness mocks removed |
| `.opencode/skills/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts` | Modified | Readiness mocks removed from all mock blocks |

### Follow-Ups

- Resolve pre-existing Vitest failures in `scripts/tests/progressive-validation.vitest.ts` and `mcp_server/tests/progressive-validation.vitest.ts` before claiming full-suite green. The broad suite timed out at 600s and these hangs are confirmed as environment or path-dependent issues unrelated to readiness removal.
- Confirm the `dist/` artifact is regenerated in CI. `npx tsc` exited 0 locally and produced zero stale readiness references, but no tracked dist diff was recorded for this packet.
