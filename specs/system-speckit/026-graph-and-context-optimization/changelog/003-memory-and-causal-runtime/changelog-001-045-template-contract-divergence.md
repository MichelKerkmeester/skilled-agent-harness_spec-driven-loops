---
title: "Phase 045: Template contract divergence fix [001-local-embeddings-foundation]"
description: "memory_save now accepts canonical V2.2 spec docs that pass spec-doc health instead of blocking them for missing generated-memory wrapper sections."
trigger_phrases:
  - "045 template contract divergence"
  - "memory_save canonical spec doc bypass"
  - "strict validate memory_save divergence"
  - "shouldBypassTemplateContract spec doc"
  - "memory save dry-run rejection spec doc"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/045-template-contract-divergence`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

During the 2026-05-14 substrate repair wave, canonical V2.2 spec documents were passing `validate.sh --strict` but failing `memory_save` dry-runs with `missing_blank_line_after_frontmatter` and six `missing_section` violations. The rejected sections were generated-memory wrapper sections, not V2.2 spec-doc anchors, revealing a cross-consumer contract divergence. The patch extended the existing `shouldBypassTemplateContract()` predicate to recognize canonical spec-doc document types and skip the wrapper enforcement when `specDocHealth.pass` is true and sufficiency passes. The fix restores agreement between the two validators without weakening generated-memory template enforcement for non-spec files.

### Added

- Regression test in `memory-save-pipeline-enforcement.vitest.ts` covering dry-run acceptance of a canonical spec doc despite generated-memory wrapper violations.
- Divergence map in the implementation summary listing memory-only markers, strict-only checks and the conceptual overlap between the two contract surfaces.

### Changed

- `shouldBypassTemplateContract()` in `memory-save.ts` now includes recognized canonical spec-doc document types alongside the existing manual-fallback evidence path.
- Spec-doc health and document type are threaded through all `shouldBypassTemplateContract()` call sites so the bypass predicate and the persistence path stay in sync.

### Fixed

- `memory_save` dry-runs for canonical V2.2 spec docs incorrectly returned `would_pass=false` with wrapper-contract violations. The bypass predicate now returns true for healthy canonical spec docs, making the violations non-blocking.

### Verification

| Check | Result |
|-------|--------|
| Pre-fix 040 strict validate | PASS: `validate.sh .../041-v-rule-cross-spec-overreach --strict` returned 0 errors and 0 warnings. |
| Pre-fix 040 dry-run | REPRODUCED: `would_pass=false`. `templateContract.valid=false`. Violations were `missing_blank_line_after_frontmatter` plus missing `continue-session`, `canonical-docs`, `overview`, `evidence`, `recovery-hints` and `memory-metadata`. |
| Post-fix 040 dry-run | PASS: `would_pass=true`. Summary: "Dry-run would pass in manual-fallback mode with deferred indexing." |
| Focused regression | PASS: `env -u EMBEDDINGS_PROVIDER npx vitest run tests/memory-save-pipeline-enforcement.vitest.ts --testNamePattern "dry-run accepts canonical spec docs"` |
| Full save-pipeline regression | PASS: `env -u EMBEDDINGS_PROVIDER npx vitest run tests/memory-save-pipeline-enforcement.vitest.ts`: 59 tests passed. |
| MCP server typecheck | PASS: `npm run typecheck --workspace=@spec-kit/mcp-server`. |
| Strict validate 037 | PASS: `validate.sh .../037-llama-cpp-embedding-worker-deep-dive --strict`: 0 errors, 0 warnings. |
| Strict validate 040 | PASS: `validate.sh .../041-v-rule-cross-spec-overreach --strict`: 0 errors, 0 warnings. |
| Strict validate 044 | PASS: `validate.sh .../045-template-contract-divergence --strict`: 0 errors, 0 warnings. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modified | Extended `shouldBypassTemplateContract()` with canonical spec-doc document types and wired spec-doc health through all call sites. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts` | Modified | Added dry-run regression proving canonical spec docs pass despite generated-memory wrapper violations. |

### Follow-Ups

- Dry-run still labels accepted canonical spec docs as manual-fallback. That label is existing behavior from the absence of generated-memory markers. It is non-blocking for healthy spec docs after this fix.
- The dry-run was verified through the local handler rather than the live MCP tool because `memory_save` was not exposed in the authoring Codex session. The handler and the MCP tool share the same implementation path and response envelope.
- No build artifact was produced. Typecheck and Vitest passed without a dist rebuild due to prior local context dist write-permission constraints.
