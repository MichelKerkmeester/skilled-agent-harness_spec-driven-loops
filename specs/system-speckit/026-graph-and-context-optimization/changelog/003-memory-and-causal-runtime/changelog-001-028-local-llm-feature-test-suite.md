---
title: "028 Local-LLM Feature Test Suite: partial vitest coverage for post-014 embedding stack"
description: "The post-014 embedding stack shipped cascade resolution, profile-keyed filenames, auto-migration plus Metal acceleration with no single test artifact validating its behavior. This packet created 9 functional vitest groups and 4 performance benchmark stubs under local-llm-features/ during the remediation stream. Full 10-group coverage and the migration-throughput bench were not completed here. Remaining work moved to 029-local-llm-feature-test-suite-completion."
trigger_phrases:
  - "028 local-llm feature tests"
  - "local-llm-features vitest groups"
  - "post-014 test suite partial"
  - "hf-local llama-cpp test coverage"
  - "local embedding feature validation"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-13

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/028-local-llm-feature-test-suite` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

The 014-local-embeddings-setup-a phase shipped a major rewrite of the local embedding stack (cascade resolution, profile-keyed SQLite filenames, auto-migration between hf-local and llama-cpp plus Apple Silicon Metal acceleration) but left no single test artifact to validate its behavior. Without a feature-test suite, regressions in cascade fallback, provider resolution, token-aware chunking or the auto-migration path could land silently and only surface as production failures.

During the post-014 remediation stream, 9 functional vitest groups and 4 performance benchmark stubs shipped under `mcp_server/tests/local-llm-features/`. The suite focuses on targeted regression protection for provider resolution, runtime error propagation, offline degradation, profile-keyed filename contracts plus the prefix registry. The originally planned full 10-group coverage (including cascade-resolution, auto-migration, cross-platform, embedding-shape plus native-modules groups) and the migration-throughput performance bench were deferred to `029-local-llm-feature-test-suite-completion/` when the llama-cpp surface was later purged in favor of nomic-only defaults.

### Added

- Nine functional vitest groups under `mcp_server/tests/local-llm-features/`: `default-model-selection`, `health-reporting`, `offline-degradation`, `prefix-system`, `profile-db-filename`, `cascade-resolution`, `auto-migration`, `cross-platform` plus `embedding-shape`
- Four performance benchmark stubs under `mcp_server/tests/local-llm-features/performance/`: `embedding-latency.bench.ts`, `throughput.bench.ts`, `cold-start.bench.ts` plus `migration-throughput.bench.ts`
- `mcp_server/tests/local-llm-features/README.md` documenting test group intent, run instructions plus skip conditions

### Changed

- `mcp_server/tests/embeddings.vitest.ts` updated to canonical profile-keyed filenames (cloud dtype slug, provider-specific slugs) to match the post-014 filename contract

### Fixed

- None. This packet added new test coverage rather than correcting prior defects.

### Verification

| Check | Result |
|-------|--------|
| `npx vitest run mcp_server/tests/local-llm-features` at ship time | PASS, 40 passed, 3 skipped (llama-cpp availability-gated) |
| `npx vitest run mcp_server/tests/embeddings.vitest.ts` at ship time | PASS, 22 passed |
| Packet no longer claims full 10-group suite completion | PASS, spec.md Shipped Scope section records partial coverage only |
| Remaining coverage tracked in 029-local-llm-feature-test-suite-completion | PASS, spec.md Remaining Work section points to follow-on packet |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/tests/local-llm-features/default-model-selection.vitest.ts` (NEW) | Created | Validates default model name resolution across hf-local and llama-cpp paths |
| `mcp_server/tests/local-llm-features/health-reporting.vitest.ts` (NEW) | Created | Validates health probe output for local-LLM provider status and availability |
| `mcp_server/tests/local-llm-features/offline-degradation.vitest.ts` (NEW) | Created | Validates graceful fallback when cloud providers are unreachable |
| `mcp_server/tests/local-llm-features/prefix-system.vitest.ts` (NEW) | Created | Validates model-keyed prefix registry lookup and conflict prevention |
| `mcp_server/tests/local-llm-features/profile-db-filename.vitest.ts` (NEW) | Created | Validates profile-keyed SQLite filename contract for all provider and dtype combinations |
| `mcp_server/tests/local-llm-features/cascade-resolution.vitest.ts` (NEW, later removed) | Created | Validates 4-tier cascade fallback. Removed in a follow-on packet when llama-cpp surface was purged. |
| `mcp_server/tests/local-llm-features/auto-migration.vitest.ts` (NEW, later removed) | Created | Validates hf-local to llama-cpp auto-migration path. Removed with llama-cpp surface purge. |
| `mcp_server/tests/local-llm-features/cross-platform.vitest.ts` (NEW, later removed) | Created | Validates ARM64 vs x86_64 detection plus Metal skip assertions. Removed with llama-cpp surface purge. |
| `mcp_server/tests/local-llm-features/embedding-shape.vitest.ts` (NEW, later removed) | Created | Validates output tensor shape contracts for each provider. Removed with llama-cpp surface purge. |
| `mcp_server/tests/local-llm-features/README.md` (NEW) | Created | Test group intent, run instructions plus llama-cpp skip conditions |
| `mcp_server/tests/local-llm-features/performance/embedding-latency.bench.ts` (NEW) | Created | Latency benchmark stub for single-item embedding under hf-local and llama-cpp |
| `mcp_server/tests/local-llm-features/performance/throughput.bench.ts` (NEW) | Created | Throughput benchmark stub for batch embedding across provider configs |
| `mcp_server/tests/local-llm-features/performance/cold-start.bench.ts` (NEW) | Created | Cold-start benchmark stub measuring provider warmup time |
| `mcp_server/tests/embeddings.vitest.ts` | Modified | Updated fixture expectations to canonical post-014 filename slugs (cloud dtype, provider-specific profile names) |

### Follow-Ups

- Complete the 10-group functional coverage in `029-local-llm-feature-test-suite-completion/`, adding groups for cascade resolution, auto-migration, cross-platform behavior, embedding shape validation plus native-module detection.
- Add the migration-throughput performance benchmark that was removed when the llama-cpp surface was purged.
- Validate the remaining performance benches under the nomic-only default stack once `029` work lands.
