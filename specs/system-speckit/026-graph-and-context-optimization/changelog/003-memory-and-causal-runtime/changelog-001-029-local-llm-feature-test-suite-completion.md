---
title: "Local Embeddings Foundation 029: Local-LLM Feature Test Suite Completion"
description: "Ten functional vitest groups and four performance benchmarks for the local embedding runtime shipped in one commit. The suite verified cascade resolution, default model selection, embedding shape, prefix system, auto-migration, health reporting, native module compatibility, profile-derived DB filenames, cross-platform behavior. Offline degradation was also covered."
trigger_phrases:
  - "local-llm feature test suite completion"
  - "local llm vitest groups"
  - "local embedding runtime tests"
  - "029 test suite"
  - "cascade resolution vitest"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-13

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/029-local-llm-feature-test-suite-completion` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

Phase 028 had promised a comprehensive local-LLM feature test suite covering 10 functional groups and 4 performance benchmarks, but none of those tests shipped with 028. The local embedding runtime's correctness claims (cascade resolution, provider fallback ordering, profile DB filename contracts, offline degradation) were backed only by prose. This packet created the full suite in one commit, tied to the concurrent post-014 embedding stack canonicalization that established the 4-tier cascade.

The suite shipped with 43 tests passing and 3 skipped (platform-specific). All 10 functional groups and 3 of the 4 performance benchmarks landed. A subsequent 016 purge of the llama-cpp surface removed the llama-cpp-specific groups (auto-migration, cross-platform, embedding-shape, native-modules, cascade-resolution) and the migration-throughput bench. The remaining files cover the stable portions of the runtime and continue to pass.

### Added

- Ten functional vitest group files under `mcp_server/tests/local-llm-features/` covering cascade resolution, default model selection, embedding shape, prefix system, auto-migration, health reporting, native modules, profile DB filenames, cross-platform behavior. Offline degradation was included as Group 10.
- Three performance benchmark files under `mcp_server/tests/local-llm-features/performance/` for latency, throughput. Cold-start was the third.
- `migration-throughput.bench.ts` (later removed when llama-cpp surface was purged in 016)
- `README.md` suite runbook with command lines, skip rationale. Baseline interpretation guidance was included.

### Changed

- `mcp_server/tests/local-llm-features/default-model-selection.vitest.ts` updated twice after initial ship: once for nomic default alignment, once for the hf-local HTTP model-server rewrite

### Fixed

- None

### Verification

| Check | Result |
|-------|--------|
| `npx vitest run mcp_server/tests/local-llm-features` at ship time | 40 passed, 3 skipped (commit `fce970add6`) |
| Strict-validate on packet scaffold | Passed at scaffold creation |

### Files Changed

| File | Action |
|------|--------|
| `mcp_server/tests/local-llm-features/cascade-resolution.vitest.ts` (NEW) | Created Group 1 provider resolution tests. Removed in commit `138d2e9320` when llama-cpp surface was purged. |
| `mcp_server/tests/local-llm-features/default-model-selection.vitest.ts` (NEW) | Created Group 2 model and profile slug assertions. Updated for nomic default and HTTP server rewrite. |
| `mcp_server/tests/local-llm-features/embedding-shape.vitest.ts` (NEW) | Created Group 3 shape and dtype behavior. Removed in commit `138d2e9320`. |
| `mcp_server/tests/local-llm-features/prefix-system.vitest.ts` (NEW) | Created Group 4 prefix registry behavior. |
| `mcp_server/tests/local-llm-features/auto-migration.vitest.ts` (NEW) | Created Group 5 auto-migration with isolated fixtures. Removed in commit `138d2e9320`. |
| `mcp_server/tests/local-llm-features/health-reporting.vitest.ts` (NEW) | Created Group 6 health reporting. Updated in commit `eb21410aba`. |
| `mcp_server/tests/local-llm-features/native-modules.vitest.ts` (NEW) | Created Group 7 native compatibility. Removed in commit `138d2e9320`. |
| `mcp_server/tests/local-llm-features/profile-db-filename.vitest.ts` (NEW) | Created Group 8 profile-keyed sqlite filename assertions. |
| `mcp_server/tests/local-llm-features/cross-platform.vitest.ts` (NEW) | Created Group 9 darwin/arm64 and Linux fallback behavior. Removed in commit `138d2e9320`. |
| `mcp_server/tests/local-llm-features/offline-degradation.vitest.ts` (NEW) | Created Group 10 covering cache hit, FTS5 fallback. Retry-manager behavior was also covered. |
| `mcp_server/tests/local-llm-features/performance/embedding-latency.bench.ts` (NEW) | Latency benchmark. |
| `mcp_server/tests/local-llm-features/performance/throughput.bench.ts` (NEW) | Throughput benchmark. |
| `mcp_server/tests/local-llm-features/performance/cold-start.bench.ts` (NEW) | Cold-start benchmark. |
| `mcp_server/tests/local-llm-features/performance/migration-throughput.bench.ts` (NEW) | Migration benchmark. Removed in commit `138d2e9320`. |
| `mcp_server/tests/local-llm-features/README.md` (NEW) | Suite runbook documenting command lines, skips. Baseline interpretation guidance was included. |

### Follow-Ups

- Re-implement or replace the removed llama-cpp-specific test groups for any provider the embedding runtime still routes to.
- Confirm the performance benchmark baselines are checked in and current after the nomic default and HTTP model-server rewrites.
- Update the packet implementation-summary to reflect the shipped state rather than the original pre-implementation scaffold text.
