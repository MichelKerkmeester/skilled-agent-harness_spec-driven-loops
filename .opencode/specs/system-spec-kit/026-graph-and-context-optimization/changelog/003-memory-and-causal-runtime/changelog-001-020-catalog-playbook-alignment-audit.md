---
title: "Catalog and playbook alignment audit for local embeddings default set"
description: "Audited and updated feature catalog and manual testing playbook entries after local embedding provider defaults changed to llama-cpp GGUF and hf-local ONNX. Replaced stale all-MiniLM-L6-v2 and Voyage-only wording. Applied a targeted code graph scan remediation discovered during verification."
trigger_phrases:
  - "catalog playbook alignment audit"
  - "local embeddings default update"
  - "embeddinggemma llama-cpp hf-local docs"
  - "stale all-MiniLM voyage wording fix"
  - "code graph incremental scan head drift"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-13

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/020-catalog-playbook-alignment-audit`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

Feature catalog and manual testing playbook entries across system-spec-kit and mcp-coco-index still described Voyage-only defaults, `all-MiniLM-L6-v2` model names. API-first assumptions also remained after the local embedding provider cascade changed. This audit packet recorded the source-of-truth defaults for both the memory provider cascade (`llama-cpp` with `unsloth/embeddinggemma-300m-GGUF` active. `hf-local` ONNX q8 fallback) and the CocoIndex default model (`sbert/google/embeddinggemma-300m` with `InstructionRetrieval`). All P0/P1 catalog and playbook files were updated to reflect current defaults. Reranker, Code Graph plus Skill Advisor surfaces were left unchanged because they do not own embedding-provider defaults. During verification a stored-scope code graph scan entered a stale full-scan loop that blocked graph refresh. A targeted `scan.ts` remediation was applied: incremental scans now survive Git HEAD drift. Successful incremental scans refresh the candidate manifest. Failed-scan metadata now lists structural persistence errors before parse-error noise.

### Added

- Provider cascade table in `.opencode/skills/system-spec-kit/feature_catalog/19--feature-flag-reference/05-5-embedding-and-api.md` with full explicit-env to Voyage to OpenAI to `llama-cpp` to `hf-local` ordering.
- Provider cascade validation steps in `.opencode/skills/system-spec-kit/manual_testing_playbook/19--feature-flag-reference/032-5-embedding-and-api.md` covering local and fallback defaults.
- Current provider profile and model IDs in `.opencode/skills/system-spec-kit/feature_catalog/14--pipeline-architecture/23-embeddings-and-retry-api.md`.
- Regression tests in `code_graph/tests/code-graph-scan.vitest.ts` covering incremental HEAD drift behavior and structural failed-scan metadata ordering (38 tests total).

### Changed

- `.opencode/skills/mcp-coco-index/feature_catalog/03--indexing-pipeline/04-embedding-provider-selection.md`: replaced stale `all-MiniLM-L6-v2` wording with `sbert/google/embeddinggemma-300m` and `InstructionRetrieval` defaults.
- `.opencode/skills/mcp-coco-index/README.md`, `INSTALL_GUIDE.md`, `SKILL.md`, `assets/config_templates.md`, `references/settings_reference.md`, `references/tool_reference.md`: aligned current-default wording with EmbeddingGemma while preserving `all-MiniLM-L6-v2` and `voyage-code-3` as documented alternatives.
- `.opencode/skills/mcp-coco-index/manual_testing_playbook/03--configuration/001-default-model-verification.md`: scenario now validates `sbert/google/embeddinggemma-300m` and `InstructionRetrieval` instead of stale model.
- `.opencode/skills/mcp-coco-index/feature_catalog/feature_catalog.md` and `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md`: root summaries aligned with current embedding defaults.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts`: incremental scans now honored across Git HEAD drift. Candidate manifest refreshed after successful incremental scans. Failed-scan metadata now lists structural persistence errors before parse-error diagnostics.

### Fixed

- `code_graph_scan` entered a stale full-scan loop when Git HEAD changed but a stored-scope incremental scan was requested. The handler now preserves `skipFreshFiles: true` across HEAD drift.
- Successful incremental scans did not refresh the candidate manifest, causing stale readiness signals. Manifest refresh now runs after any promotable scan including incremental paths.
- `last_failed_scan.reason=structural_persistence_error` was hidden behind parse-error entries in failed-scan metadata. Structural persistence errors are now listed first.

### Verification

| Check | Result |
|-------|--------|
| Source-of-truth defaults captured | PASS: memory provider cascade and CocoIndex defaults recorded in spec.md and implementation-summary.md. |
| P0/P1 target paths updated | PASS: nine catalog and playbook files updated across system-spec-kit and mcp-coco-index. |
| P2/P3 caveats applied | PASS: docs/spec taxonomy, reranking plus non-impact surfaces caveated or left unchanged with rationale. |
| Target docs modified. runtime code preserved | PASS: approved documentation files edited. Embedding runtime code stayed untouched. |
| Strict validation | PASS after final run. |
| Placeholder scan | PASS after final run. |
| Stale default grep | PASS after final run for stale current-default/recommended wording. |
| Focused code graph scan regression | PASS: `npm exec -- vitest run code_graph/tests/code-graph-scan.vitest.ts` passed with 38 tests. |
| TypeScript typecheck | PASS: `npm run typecheck` completed successfully. |
| Code graph refresh post-remediation | PASS: incremental scan completed in 8.3s. Full scan with `verify:true` in 143s with `failedScan: null`. |
| Gold-verification battery | PASS: 28/28 probes at overall 1.0 after `code-graph-gold-queries.json` probes aligned to declaring files. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/feature_catalog/19--feature-flag-reference/05-5-embedding-and-api.md` | Updated | Added full provider cascade and `llama-cpp` GGUF plus `hf-local` ONNX q8 defaults. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/19--feature-flag-reference/032-5-embedding-and-api.md` | Updated | Added validation steps for full cascade and local/fallback defaults. |
| `.opencode/skills/system-spec-kit/feature_catalog/14--pipeline-architecture/23-embeddings-and-retry-api.md` | Updated | Added current provider profile and model IDs. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/219-embeddings-and-retry-api.md` | Updated | Added provider profile and model ID validation to the manual scenario. |
| `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | Updated | Mirrored corrected embedding/API flag summary. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Updated | Mirrored corrected EX-032 summary. |
| `.opencode/skills/mcp-coco-index/feature_catalog/03--indexing-pipeline/04-embedding-provider-selection.md` | Updated | Replaced stale `all-MiniLM-L6-v2` and Voyage expectations with EmbeddingGemma and `InstructionRetrieval`. |
| `.opencode/skills/mcp-coco-index/feature_catalog/08--configuration/01-user-settings.md` | Updated | Aligned settings documentation with EmbeddingGemma and `InstructionRetrieval`. |
| `.opencode/skills/mcp-coco-index/feature_catalog/feature_catalog.md` | Updated | Removed stale root summary expectations for old model and Voyage defaults. |
| `.opencode/skills/mcp-coco-index/manual_testing_playbook/03--configuration/001-default-model-verification.md` | Updated | Scenario validates current model and prompt instead of stale model. |
| `.opencode/skills/mcp-coco-index/README.md` | Updated | Replaced stale current-default/recommended wording while preserving alternatives. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts` | Updated | Honors incremental scans on Git HEAD drift. Refreshes candidate manifest on incremental promotion. Lists structural errors before parse-error noise. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts` | Updated | Covers incremental HEAD drift and structural failed-scan metadata ordering. 38 tests pass. |

### Follow-Ups

- Restart the MCP server to load parser-skip-list-to-warnings routing and `memory_index_scan` rejection-reason surfacing. Both changes are present in `mcp_server/dist/` but the running process loaded handlers before those edits landed.
- Verify `memory-save.ts` graph-metadata sufficiency exemption is stable after MCP restart. The live check showed `graph-metadata.json` indexing with `status: deferred` rather than `status: rejected` after the patch.
- Keep `all-MiniLM-L6-v2` and `voyage-code-3` references in mcp-coco-index docs as documented alternatives framed clearly as non-default options.
- Confirm Code Graph and Skill Advisor docs require no embedding-default update after any future provider cascade change. Neither subsystem owns embedding provider defaults.
