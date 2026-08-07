---
title: "Spec Memory Stack Phase 007: Auto-Embedder Selection and llama-cpp Purge"
description: "Bootstrap auto-selection across a 4-tier precedence chain (Voyage, OpenAI, Ollama, hf-local) replaced the hardcoded embeddinggemma-300m default. The entire llama-cpp surface was purged from source, tests, docs and package metadata. Fresh daemon starts now resolve the correct embedder without operator intervention."
trigger_phrases:
  - "auto embedder selection"
  - "llama-cpp purge"
  - "embeddinggemma removal"
  - "bootstrap precedence chain embedder"
  - "ensureActiveEmbedder daemon bootstrap"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-18

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/007-auto-embedder-selection-and-llama-cpp-purge`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack`

### Summary

The spec-memory daemon had a hardcoded `DEFAULT_ACTIVE_EMBEDDER = embeddinggemma-300m` in `schema.ts`. On any fresh DB, `getActiveEmbedder()` read an empty `vec_metadata` table and fell through to gemma even though Ollama plus jina-v3 were available and selected as production by ADR-012. Operators were required to call `embedder_set('jina-embeddings-v3')` manually after every fresh daemon start. At the same time, the llama-cpp provider path was still present in source, tests and install scripts, adding dead weight and approximately 300 to 450 MB RSS when loaded.

`shared/embeddings/auto-select.ts` was introduced with a 4-tier bootstrap probe: Voyage API key, then OpenAI API key, then Ollama walking the ADR-012 priority manifest, then hf-local. The probe result is persisted to `vec_metadata` on first run. `context-server.ts` now calls `ensureActiveEmbedder()` at daemon startup so empty tables are populated automatically. `getActiveEmbedder()` stays synchronous. Async network and Python probes are confined to the daemon startup boundary. A filesystem lock prevents concurrent daemon starts from writing conflicting active pointers.

The entire llama-cpp surface was purged from system-spec-kit: `llama-cpp-availability.ts` deleted, `LlamaCppProvider` removed from `factory.ts`, `node-llama-cpp` removed from `package.json`, `embeddinggemma-300m` removed from the registry manifest, all llama-cpp test files deleted, install and migration scripts removed and all doc references cleaned. 136 files changed across the commit (+10041 minus 8203 lines). The `git grep` purge check returned no output for the llama-cpp and embeddinggemma token set under `.opencode/skills/system-spec-kit/`.

### Added

- `shared/embeddings/auto-select.ts` (NEW) with `autoSelectActiveEmbedder()` implementing the 4-tier Voyage, OpenAI, Ollama, hf-local precedence chain and fail-fast diagnostics when nothing is reachable
- `mcp_server/tests/embedder-auto-selection.vitest.ts` (NEW) covering all four tiers, fail-fast output, `vec_metadata` persistence and write-race serialization (8 tests)
- `active_embedder_provider` field persisted to `vec_metadata` alongside name and dimension so status and debug surfaces can distinguish cloud from local selections
- Filesystem lock around auto-selection to prevent concurrent daemon starts from racing on the active pointer write

### Changed

- `mcp_server/lib/embedders/schema.ts`: `DEFAULT_ACTIVE_EMBEDDER` replaced with `{name: 'auto', dim: 0}` sentinel; `getActiveEmbedder()` returns the sentinel when `vec_metadata` is empty rather than falling back to gemma
- `mcp_server/context-server.ts`: daemon bootstrap wired through `ensureActiveEmbedder()` so the async precedence probe runs once on startup when `vec_metadata` is empty
- `shared/embeddings/factory.ts`: `LlamaCppProvider` branch and `llama-cpp` entry in `SUPPORTED_PROVIDERS` removed
- `mcp_server/lib/embedders/registry.ts`: `embeddinggemma-300m` manifest entry removed
- `references/memory/embedder_architecture.md`, `mcp_server/INSTALL_GUIDE.md` and related resilience and pluggability docs updated to describe the new precedence chain

### Fixed

- Fresh daemon starts resolved gemma instead of the operator-selected jina-v3 because `vec_metadata` was empty and the hardcoded default won. Auto-selection now fills `vec_metadata` on startup so ADR-012 applies without operator intervention.
- Concurrent daemon starts could both write `vec_metadata` with conflicting embedder names. The filesystem lock serializes the write.

### Verification

| Gate | Result |
|------|--------|
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run typecheck` | PASS |
| `npx vitest --run embedder-auto-selection` from `mcp_server/` | PASS. 8 tests. |
| `npx vitest --run embedder-ollama` from `mcp_server/` | PASS. 16 tests (regression check). |
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run build` | PASS |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh` on packet | PASS |
| `git grep -l 'llama-cpp\|node-llama-cpp\|embeddinggemma\|LlamaCppProvider'` under `system-spec-kit/` | PASS. No output. Purge complete. |
| Live daemon restart smoke | BLOCKED. Sandbox returned operation not permitted for `ps` and `kill -0 4790`. Operator does the restart post-commit. |

### Files Changed

| File | What changed |
|------|--------------|
| `shared/embeddings/auto-select.ts` (NEW) | Bootstrap precedence probe: Voyage, OpenAI, Ollama, hf-local. Fail-fast diagnostics. Filesystem lock. |
| `mcp_server/tests/embedder-auto-selection.vitest.ts` (NEW) | 8 tests covering all four tiers, persistence, write-race serialization. |
| `mcp_server/context-server.ts` | Daemon bootstrap now calls `ensureActiveEmbedder()` before accepting requests. |
| `mcp_server/lib/embedders/schema.ts` | `DEFAULT_ACTIVE_EMBEDDER` replaced with `auto` sentinel. |
| `mcp_server/lib/embedders/registry.ts` | `embeddinggemma-300m` manifest entry removed. |
| `shared/embeddings/factory.ts` | `LlamaCppProvider` and `llama-cpp` SUPPORTED_PROVIDERS entry removed. |
| `shared/embeddings/llama-cpp-availability.ts` | Deleted. |
| `mcp_server/package.json` | `node-llama-cpp` dependency removed. |
| `references/memory/embedder_architecture.md` | Updated with new precedence chain and migration note for operators upgrading from pre-007. |
| `mcp_server/INSTALL_GUIDE.md` | Quickstart and troubleshooting sections updated. No more reference to embeddinggemma as default. |
| `mcp_server/tests/embedder-auto-selection.vitest.ts` (NEW) | See above. |

### Follow-Ups

- Restart the spec-memory daemon (`mk-spec-memory`, formerly PID 4790) on the operator side to exercise `ensureActiveEmbedder()` against the live `vec_metadata` table and confirm `active_embedder_provider` is written correctly.
- Delete legacy artifacts after the operator-side restart and reindex are confirmed: `context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite` (732M) and the GGUF files under `~/.cache/huggingface/gguf/embeddinggemma-300m/` (approx. 2.0G total).
