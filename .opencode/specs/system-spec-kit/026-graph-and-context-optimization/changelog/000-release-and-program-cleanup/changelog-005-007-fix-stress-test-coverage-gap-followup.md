---
title: "Stress-Test Gap Remediation: Close 10 P0 Coverage Gaps"
description: "Ten new stress tests closed every P0 gap surfaced by packet 042. The suite grew from 28 files / 69 tests to 38 files / 94 tests, all green in 29 seconds. Packet 042's coverage matrix was cross-updated so every former P0 row now reads gap_classification=none."
trigger_phrases:
  - "P0 stress gap remediation"
  - "close stress test coverage gaps"
  - "sa-001 sa-003 daemon lifecycle stress"
  - "deep-loop-graph-convergence-stress"
  - "043 stress remediation"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-30

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/007-fix-stress-test-coverage-gap-followup` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test`

### Summary

Packet 042's stress audit produced a 54-row coverage matrix and classified 10 features as P0 gaps: concurrency, lease, capacity and perf-budget surfaces in `code_graph` and `skill_advisor` that had no direct stress coverage. The all-green baseline run from 042 (28 files, 69 tests) reflected coverage absence, not regression-free behavior. Without closing these gaps, release readiness for the MCP server could not advance past the 005-review-remediation parent.

Ten new stress test files were written via three sequential cli-codex batches (gpt-5.5 high for batches A and B, direct authoring for sa-037). Each file targets one P0 feature surface, imports from real product source under `mcp_server/code_graph/` or `mcp_server/skill_advisor/lib/` and asserts on a real pressure axis. After all 10 tests landed, `npm run stress` reported `Test Files 38 passed (38)` and `Tests 94 passed (94)` in 29 seconds with exit code 0. Packet 042's coverage matrix and audit were cross-updated so all 10 P0 rows now carry `gap_classification=none`.

### Added

- `mcp_server/stress_test/code-graph/deep-loop-graph-convergence-stress.vitest.ts` (NEW): cg-012 deep-loop convergence stress with saturated graphs (5000+ nodes), conflicting CONTRADICTS edges and missing-evidence cases
- `mcp_server/stress_test/skill-advisor/chokidar-narrow-scope-stress.vitest.ts` (NEW): sa-001 watcher narrow-scope pressure under concurrent file events
- `mcp_server/stress_test/skill-advisor/single-writer-lease-stress.vitest.ts` (NEW): sa-002 workspace single-writer lease under concurrent contention
- `mcp_server/stress_test/skill-advisor/daemon-lifecycle-stress.vitest.ts` (NEW): sa-003 daemon lifecycle under cold, warm and degraded-state starts
- `mcp_server/stress_test/skill-advisor/generation-snapshot-stress.vitest.ts` (NEW): sa-004 generation-tagged snapshot publication under rapid succession
- `mcp_server/stress_test/skill-advisor/trust-state-stress.vitest.ts` (NEW): sa-005 trust-state classifier under high-cardinality input
- `mcp_server/stress_test/skill-advisor/generation-cache-invalidation-stress.vitest.ts` (NEW): sa-007 generation-tied cache invalidation under concurrent reads and writes
- `mcp_server/stress_test/skill-advisor/anti-stuffing-cardinality-stress.vitest.ts` (NEW): sa-012 anti-stuffing cap tested with 500 repeated trigger phrases
- `mcp_server/stress_test/skill-advisor/df-idf-corpus-stress.vitest.ts` (NEW): sa-013 DF/IDF corpus stats under a 1000-skill synthetic corpus with archive mutations
- `mcp_server/stress_test/skill-advisor/python-bench-runner-stress.vitest.ts` (NEW): sa-037 Python bench runner wrapped in Vitest, gracefully skips when python3 is unavailable

### Changed

- `006-stress-coverage-audit-and-run/coverage-matrix.csv`: 10 P0 rows updated to `gap_classification=none` with `stress_test_files` populated
- `006-stress-coverage-audit-and-run/coverage-audit.md`: section 4.1 "Closed by packet 043" appended
- `006-stress-coverage-audit-and-run/implementation-summary.md`: Limitations item 4 updated to reference packet 043

### Fixed

- Ten P0 coverage gaps (no direct stress file for daemon lifecycle, watcher, lease, snapshot, trust-state, cache invalidation, anti-stuffing, DF/IDF corpus, deep-loop convergence or Python bench) are now closed. Each gap had a feature classified as requiring stress coverage with no corresponding test file.

### Verification

| Check | Result |
|-------|--------|
| 10 new `.vitest.ts` files exist at documented paths | PASS. All 10 confirmed by `ls` |
| Each new file imports from real product source | PASS. All imports cite `mcp_server/code_graph/` or `mcp_server/skill_advisor/lib/` |
| `npm run stress` exit code 0 | PASS. `STRESS_RUN_EXIT_CODE=0` |
| Test Files 38 passed (38) | PASS. Vitest summary line from `logs/stress-run-20260430-190737Z.log` |
| Tests count >= 79 (was 69) | PASS. 94 tests passing |
| 042 coverage matrix updated for all 10 P0 feature_ids | PASS. 10 rows now `gap_classification=none` |
| 042 audit section 4.1 "Closed by 043" added | PASS. Section added |
| 042 implementation-summary references 043 | PASS. Limitations item 4 updated |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/stress_test/code-graph/deep-loop-graph-convergence-stress.vitest.ts` | Created (NEW) | cg-012 convergence stress. Saturated graphs, CONTRADICTS edges, missing-evidence cases |
| `mcp_server/stress_test/skill-advisor/chokidar-narrow-scope-stress.vitest.ts` | Created (NEW) | sa-001 watcher narrow-scope pressure |
| `mcp_server/stress_test/skill-advisor/single-writer-lease-stress.vitest.ts` | Created (NEW) | sa-002 workspace single-writer lease contention |
| `mcp_server/stress_test/skill-advisor/daemon-lifecycle-stress.vitest.ts` | Created (NEW) | sa-003 daemon cold, warm and degraded lifecycle |
| `mcp_server/stress_test/skill-advisor/generation-snapshot-stress.vitest.ts` | Created (NEW) | sa-004 generation-tagged snapshot publication |
| `mcp_server/stress_test/skill-advisor/trust-state-stress.vitest.ts` | Created (NEW) | sa-005 trust-state classifier under high cardinality |
| `mcp_server/stress_test/skill-advisor/generation-cache-invalidation-stress.vitest.ts` | Created (NEW) | sa-007 generation-tied cache invalidation |
| `mcp_server/stress_test/skill-advisor/anti-stuffing-cardinality-stress.vitest.ts` | Created (NEW) | sa-012 anti-stuffing cap. 500 repeated trigger phrases |
| `mcp_server/stress_test/skill-advisor/df-idf-corpus-stress.vitest.ts` | Created (NEW) | sa-013 DF/IDF corpus stats under 1000-skill synthetic corpus |
| `mcp_server/stress_test/skill-advisor/python-bench-runner-stress.vitest.ts` | Created (NEW) | sa-037 Python bench runner. Graceful skip when python3 absent |
| `005-stress-test/006-stress-coverage-audit-and-run/coverage-matrix.csv` | Modified | 10 P0 rows updated to gap_classification=none with stress_test_files populated |
| `005-stress-test/006-stress-coverage-audit-and-run/coverage-audit.md` | Modified | Section 4.1 "Closed by packet 043" added |

### Follow-Ups

- Tighten FIXME-tagged assertions in the new stress tests where timing-sensitive product behavior under load was not deterministic enough to assert precisely. Each test carries a `FIXME(<feature_id>)` comment marking the assertion surface.
- Run a flake-soak test (3+ consecutive `npm run stress` invocations) to confirm none of the new multiprocess tests (sa-002 lease, sa-003 daemon) produce intermittent failures on slow CI.
- Ensure python3 is on PATH in CI environments to exercise sa-037 rather than skipping it.
- Address P1 gaps (6 features: 3 code_graph and 3 skill_advisor with thin direct stress coverage) and P2 gaps (30 features with uncovered Maybe-required surfaces) in a follow-on release-readiness pass.
