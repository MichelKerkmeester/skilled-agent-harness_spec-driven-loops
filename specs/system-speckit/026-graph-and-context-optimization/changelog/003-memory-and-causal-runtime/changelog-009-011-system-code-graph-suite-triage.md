---
title: "system-code-graph Vitest Suite Triage: 31 Pre-Existing Failures Resolved"
description: "Triaged and fixed all 31 pre-existing vitest failures across 12 system-code-graph test files left as a baseline by arc 009 phase 007. Two product bugs were corrected. Stale mocks were updated to match current module boundaries. One obsolete assertion was deleted. The full suite now exits green with no new skips."
trigger_phrases:
  - "system-code-graph suite triage"
  - "code-graph 31 failures resolved"
  - "vitest suite triage 009 phase 011"
  - "tree-sitter isReady doc fix"
  - "blast-radius maxDepth zero fix"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-22

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/011-system-code-graph-suite-triage` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation`

### Summary

Arc 009 phase 007 shipped the code-graph launcher single-owner and `closeDb` lifecycle work but deferred 31 failing tests across 12 files as a documented out-of-scope baseline. Those failures left the broader `system-code-graph` vitest suite producing a noisy signal that would mask real regressions in future work.

This phase triaged all 31 failures. Two product bugs were found and corrected: `TreeSitterParser.isReady('doc')` was incorrectly gated on parser initialization. The `blast_radius` handler clamped `maxDepth: 0` to depth 1 instead of honoring it. The remaining 29 failures were stale mocks or assertions that no longer matched the module boundaries established when `system-code-graph` was extracted as a standalone package. All stale mocks were updated to point to local module paths. One assertion testing removed `system-spec-kit` Zod ownership of `code_graph_context` was deleted rather than skipped.

The full suite now passes: 57 files, 553 tests passed, zero failures. No new `.skip()` calls were added.

### Added

- `code_graph_context` telemetry fields (`raw_score`, `path_class`, `rankingSignals`, camelCase variants) to the standalone `system-code-graph` tool schema
- Restored local `validateToolArgs` compatibility export in `tool-schemas.ts`

### Changed

- `TreeSitterParser.isReady` now returns `true` for the `doc` language without requiring parser initialization (product bug fix)
- `blast_radius` handler now passes `maxDepth: 0` through unmodified instead of clamping to depth 1 (product bug fix)
- `runtime-detection.vitest.ts` mocks now target the local Codex hook-policy helper and scrub all runtime env markers in every `describe` block
- `startup-brief.vitest.ts` mocks now target local shared hook-state and local CocoIndex path helpers
- `graph-payload-validator.vitest.ts` mocks now target the local `system-code-graph` shared-payload path
- `code-graph-query-handler.vitest.ts` mocks now include the sanitizer export used by `handlers/query.ts`
- `code-graph-siblings-readiness.vitest.ts` now injects a deterministic local CocoIndex readiness probe mock
- `symlink-realpath-hardening.vitest.ts` now mocks the actual `system-spec-kit` validator modules imported by `memory-save.ts`
- `auto-rescan-policy.vitest.ts` assertion renamed and corrected to match the product contract (backlog strictly greater than threshold blocks)
- `code-graph-context-handler.vitest.ts` timer mock updated from `performance.now` to `process.hrtime.bigint()` to match the current expansion implementation
- `walker-dos-caps.vitest.ts` mock path corrected to the `stress_test/` location and realpath normalization aligned to `process.hrtime`-based temp root

### Fixed

- `TreeSitterParser.isReady('doc')` returning `false` without init, causing suite failures on doc-language readiness checks
- `blast_radius` ignoring `maxDepth: 0` and always returning a depth-1 traversal instead of seed-only
- 12 test files reporting failures due to stale mock paths after `system-code-graph` standalone extraction

### Verification

| Check | Result |
|-------|--------|
| Baseline reproduced: `node node_modules/vitest/vitest.mjs run --config vitest.config.ts` from `.opencode/skills/system-code-graph` before triage | 12 failing files, 31 failing tests. Full list in `scratch/baseline-failures.md`. |
| Targeted batch 1: `auto-rescan-policy`, `runtime-detection`, `graph-payload-validator`, `tree-sitter-parser` | PASSED: 4 files, 44 tests. |
| Targeted batch 2: `code-graph-context-cocoindex-telemetry-passthrough`, `code-graph-context-handler`, `edge-metadata-sanitize` | PASSED: 3 files, 30 tests. |
| Targeted batch 3: `code-graph-query-handler`, `startup-brief`, `code-graph-siblings-readiness`, `symlink-realpath-hardening`, `walker-dos-caps` | PASSED: 5 files, 52 tests. |
| Full suite post-triage: `node node_modules/vitest/vitest.mjs run --config vitest.config.ts` from `.opencode/skills/system-code-graph` | PASSED: 57 files, 1 skipped. 553 tests passed, 7 skipped, 0 failures. |
| `npm run typecheck` from `.opencode/skills/system-code-graph` | PASSED: exit 0. |
| Alignment drift check: `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-code-graph` | PASSED: exit 0. 10 pre-existing non-blocking TS module-header warnings reported. |
| Strict packet validation: `validate.sh .../011-system-code-graph-suite-triage --strict` | PASSED: exit 0, errors 0, warnings 0. |
| Arc 009 phase 007 `implementation-summary.md` Limitations anchor updated to reflect resolved baseline | DONE. |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts` | Product bug fix: `isReady('doc')` no longer requires parser initialization. |
| `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts` | Product bug fix: `blast_radius` now passes `maxDepth: 0` unmodified. |
| `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts` | Added `code_graph_context` telemetry fields and restored `validateToolArgs` export. |
| `.opencode/skills/system-code-graph/mcp_server/tests/auto-rescan-policy.vitest.ts` | Assertion corrected to match strict-greater-than backlog contract. |
| `.opencode/skills/system-code-graph/mcp_server/tests/runtime-detection.vitest.ts` | Mocks updated to local Codex hook-policy path. Runtime env cleanup added to all describe blocks. |
| `.opencode/skills/system-code-graph/mcp_server/tests/graph-payload-validator.vitest.ts` | Mock path updated to local system-code-graph shared-payload module. |
| `.opencode/skills/system-code-graph/mcp_server/tests/tree-sitter-parser.vitest.ts` | Two fixes: isReady doc assertion and module-sentinel preservation on parse error. |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts` | Three assertions fixed for standalone schema. One obsolete system-spec-kit Zod assertion deleted. (File later removed in CocoIndex decoupling.) |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-context-handler.vitest.ts` | Timer mock changed from `performance.now` to `process.hrtime.bigint()`. |
| `.opencode/skills/system-code-graph/mcp_server/tests/edge-metadata-sanitize.test.ts` | Sanitizer reference updated to `sanitizeEdgeMetadataString` export. |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-query-handler.vitest.ts` | Stale mock updated to include sanitizer export. Confidence-echo assertion corrected. |
| `.opencode/skills/system-code-graph/mcp_server/tests/startup-brief.vitest.ts` | Mocks updated to local shared hook-state and local CocoIndex path helper. |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-siblings-readiness.vitest.ts` | Deterministic CocoIndex readiness probe mock injected. |
| `.opencode/skills/system-code-graph/mcp_server/tests/symlink-realpath-hardening.vitest.ts` | Mock updated to actual system-spec-kit validator modules imported by `memory-save.ts`. |
| `.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/walker-dos-caps.vitest.ts` | Path corrected to `stress_test/` location. Realpath normalization aligned. |

### Follow-Ups

- Confirm the `code-graph-context-cocoindex-telemetry-passthrough.vitest.ts` test suite replacement covers the telemetry fields added to `tool-schemas.ts`, now that CocoIndex decoupling removed the original file.
