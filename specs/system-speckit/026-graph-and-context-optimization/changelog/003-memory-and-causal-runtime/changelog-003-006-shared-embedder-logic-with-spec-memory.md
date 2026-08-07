---
title: "003/006 Changelog: Shared Embedder Logic with Spec-Memory"
description: "Shared embedder contract surface promoted to a workspace-wide host. Skill-advisor and mk-spec-memory now consume identical adapter, types, registry and Ollama adapter via thin re-export shims. The llama-cpp adapter was purged. The default flipped to the auto sentinel with a content-type-aware cascade wired at daemon bootstrap."
trigger_phrases:
  - "shared embedder logic skill-advisor"
  - "skill-advisor spec-memory embedder parity"
  - "auto sentinel default embedder"
  - "ensureActiveEmbedder cascade"
  - "llama-cpp purge skill-advisor"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-21

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/003-skill-advisor-stack/006-shared-embedder-logic-with-spec-memory` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/003-skill-advisor-stack`

### Summary

Skill-advisor and mk-spec-memory maintained separate embedder registries with competing defaults and parallel factory implementations. Any update to one skill's embedder layer risked silent drift in the other. The `embeddinggemma-300m` default in skill-advisor was stale relative to mk-spec-memory's post-phase-007 state.

The canonical adapter contract surface (interface, types, registry, Ollama adapter) was promoted from mk-spec-memory's local `mcp_server/lib/embedders/` into the shared workspace host at `.opencode/skills/system-spec-kit/shared/embeddings/`. Both skills' local files became thin re-export shims preserving all existing relative-path imports. Skill-advisor's `llama-cpp-baseline` adapter was deleted for parity with mk-spec-memory's phase-007 purge. The active-embedder default flipped from `embeddinggemma-300m` to the `'auto'` sentinel with an `ensureActiveEmbedder()` helper that invokes the shared cascade at daemon bootstrap. A single follow-up commit (deep-review remediation) closed all three P1 advisories and three P2 cleanup items, lifting the verdict from CONDITIONAL to PASS.

### Added

- Shared embedder contract surface at `.opencode/skills/system-spec-kit/shared/embeddings/`: `adapter.ts`, `types.ts`, `registry.ts` (7 text-tuned manifests), `adapters/ollama.ts` (NEW)
- `ensureActiveEmbedder(db, options?)` helper in `system-skill-advisor/mcp_server/lib/embedders/schema.ts` that resolves the `'auto'` sentinel via the shared cascade and persists the winner to `vec_metadata`
- `contentType: 'text' | 'code'` parameter on `shared/embeddings/auto-select.ts` (default `'text'`) to keep the CocoIndex code-tuned path explicit and future-proof
- `system-skill-advisor/mcp_server/tests/embedders/ensure-active-embedder.vitest.ts` (5 cases): auto-sentinel cascade fires. concrete-pointer cascade skipped. stale-pointer migration. `contentType` wiring. idempotency (NEW)
- `system-skill-advisor/mcp_server/tests/embedders/shared-factory-parity.vitest.ts` (9 cases): MANIFESTS reference identity, `NotImplementedError` class identity, manifest-lookup parity, adapter-shape parity, `listManifests` / `listSupportedDimensions` identity, negative cases (NEW)

### Changed

- Both skills' local `mcp_server/lib/embedders/{adapter,types,registry,adapters/ollama}.ts` converted to thin `export * from '@spec-kit/shared/embeddings/...'` re-export shims
- `system-skill-advisor/mcp_server/lib/embedders/schema.ts` `DEFAULT_ACTIVE_EMBEDDER` flipped from `{ name: 'embeddinggemma-300m', dim: 768 }` to `{ name: 'auto', dim: 0 }`
- `system-skill-advisor/mcp_server/advisor-server.ts` `main()` now calls `ensureActiveEmbedder()` between `initSkillGraphDb()` and `startupSkillGraphScan()`; errors degrade gracefully with `console.warn` rather than aborting the process
- `system-skill-advisor/INSTALL_GUIDE.md` section 12 (all six subsections) rewritten for the shared registry and `'auto'` default
- `system-skill-advisor/README.md` pluggable-layer subsection updated to reflect post-006 contract vocabulary

### Fixed

- Hardcoded `provider: 'ollama'` in `schema.ts` replaced with `backendToProvider(manifest?.backend)` so non-Ollama cascade winners are stored with the correct provider label
- `INSTALL_GUIDE.md` section 12.6 cross-reference now matches section 12.1 and `auto-select.ts`: Ollama to hf-local to OpenAI to Voyage (ADR-014 local-first order)
- `mcp_server/lib/embedders/index.ts` barrel preamble now names `ensureActiveEmbedder()` and the `'auto'` sentinel cascade

### Verification

| Check | Result |
|-------|--------|
| `npm run build` on `@spec-kit/shared` workspace | PASS |
| `npm run typecheck` on `system-spec-kit/mcp_server` and `system-skill-advisor/mcp_server` | PASS |
| Embedder vitests (20 of 20): `registry.vitest.ts`, `schema.vitest.ts`, `ensure-active-embedder.vitest.ts` (5 cases), `shared-factory-parity.vitest.ts` (9 cases) | PASS |
| `validate.sh --strict` on packet: 0 errors, 0 warnings | PASS |
| `git grep -l 'llama-cpp\|LlamaCppProvider\|embeddinggemma'` across `system-skill-advisor/` | Empty (purge confirmed) |
| Deep-review verdict (iter-001, early convergence): 0 P0, 3 P1 closed by remediation commit | PASS |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/shared/embeddings/adapter.ts` (NEW) | Canonical `EmbedderAdapter` interface promoted from mk-spec-memory with wider `embed(texts, options?)` signature |
| `.opencode/skills/system-spec-kit/shared/embeddings/types.ts` (NEW) | `BackendKind` enum and `EmbedderManifest` type |
| `.opencode/skills/system-spec-kit/shared/embeddings/registry.ts` (NEW) | `MANIFESTS` (7 text-tuned entries) and factory helpers |
| `.opencode/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts` (NEW) | `OllamaAdapter` with `/api/embed` plus `/api/embeddings` fallback |
| `.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts` | Added optional `contentType: 'text' \| 'code'` parameter (default `'text'`) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/{adapter,types,registry,adapters/ollama}.ts` | Converted to thin re-export shims |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/{adapter,types,registry,adapters/ollama}.ts` | Converted to thin re-export shims |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/llama-cpp-baseline.ts` | Deleted for parity with mk-spec-memory phase-007 purge |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts` | Default flipped to `'auto'` sentinel. `ensureActiveEmbedder()` helper added. `backendToProvider()` mapping added. |
| `.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts` | Bootstrap now calls `ensureActiveEmbedder()` before first scan |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/embedders/shared-factory-parity.vitest.ts` (NEW) | 9-case parity regression |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/embedders/ensure-active-embedder.vitest.ts` (NEW) | 5-case `ensureActiveEmbedder` coverage |
| `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` | Section 12 rewritten for shared registry and `'auto'` default |
| `.opencode/skills/system-skill-advisor/README.md` | Pluggable-layer subsection updated |

### Follow-Ups

- Remove the legacy `skill_nodes.embedding` BLOB column once production confirms no installation still reads from it (003 follow-up #3).
- Add behavior branching to the shared cascade for `contentType: 'code'` when a TypeScript code consumer materialises. Today the parameter is accepted but does not alter routing.
- Collect live daemon smoke (cold start, pointer flip observation, semantic-shadow probe) to complete the final operator-side acceptance check.
