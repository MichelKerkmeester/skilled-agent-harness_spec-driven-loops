---
title: "Local Embeddings Foundation Phase 1: Prefix Registry Architecture"
description: "Model-keyed prefix registry with env-var override layer shipped across hf-local.ts, factory.ts plus cocoindex shared.py. Replaces hardcoded Nomic prefix that caused silent 5-8% recall loss when running non-Nomic embedding models. Build plus type-check plus 11 smoke assertions all pass."
trigger_phrases:
  - "prefix registry architecture"
  - "PREFIX_REGISTRY shipped"
  - "getPrefixFor embedding"
  - "hf-local prefix override"
  - "cocoindex query prompt registry"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-12

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/001-prefix-registry-architecture` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

Both the TypeScript `HfLocalProvider` and the Python `cocoindex_code/shared.py` hardcoded the Nomic embedding prefix on every encode call, producing a silent 5-8% retrieval recall loss whenever a non-Nomic model was loaded. No mechanism existed to configure a different prefix without source edits.

A model-keyed prefix registry with an env-var override layer was introduced across three source files. `PREFIX_REGISTRY` in `hf-local.ts` maps six initial model IDs to their document and query prefixes. The `getPrefixFor(modelId, kind)` resolver applies the resolution order: env override first, then registry lookup, then empty-string fallback. `VALID_PROVIDER_DIMENSIONS['hf-local']` was extended with five new model entries so the startup dimension check passes for any of them. In Python, `_QUERY_PROMPT_MODELS` was converted from a set to a dict with Qwen3 entries added. `resolve_query_prompt_name()` was wired into `create_embedder()` with the same env-override logic.

Build plus type-check plus 11 smoke assertions (6 Node plus 5 Python) passed. The legacy `TASK_PREFIX` export was retained for three back-compat consumers that are scoped to a follow-on packet.

### Added

- `PREFIX_REGISTRY` constant in `hf-local.ts` mapping 6 model IDs to document and query prefix strings
- `ModelPrefixConfig` TypeScript type for the registry shape
- `getPrefixFor(modelId, kind)` resolver with env-override, registry lookup, plus empty-string fallback
- `COCOINDEX_QUERY_PROMPT_NAME` env-override path in `shared.py`
- `resolve_query_prompt_name()` function in `shared.py` with env override support
- Qwen3 entries (3 model sizes) in `_QUERY_PROMPT_MODELS` dict in `shared.py`
- Smoke-test scripts `scratch/test-prefix-registry.mjs` (Node, 6 assertions) and `scratch/test-cocoindex-prompts.py` (Python, 5 assertions)

### Changed

- `embedDocument` and `embedQuery` in `hf-local.ts` now call `getPrefixFor()` instead of hardcoding the Nomic prefix
- `VALID_PROVIDER_DIMENSIONS['hf-local']` in `factory.ts` extended with 5 new model-to-dimension entries (EmbeddingGemma, E5-large, mxbai-large, Snowflake-Arctic-L v2, bge-m3)
- `_QUERY_PROMPT_MODELS` in `shared.py` converted from a `set` to a `dict[str, str]` so query-prompt names are model-keyed
- `create_embedder()` in `shared.py` rewired to call `resolve_query_prompt_name()` instead of the former set-membership check

### Fixed

- Nomic prefix (`search_document:` / `search_query:`) was prepended unconditionally regardless of the loaded model. Models such as EmbeddingGemma and Qwen3 received the wrong prefix, degrading retrieval recall by approximately 5-8%. The registry resolves the correct prefix per model ID.
- No way to override the prefix without source edits. Env vars `HF_EMBEDDINGS_PREFIX_DOC`, `HF_EMBEDDINGS_PREFIX_QUERY` plus `COCOINDEX_QUERY_PROMPT_NAME` now provide a config-only escape hatch.

### Verification

| Check | Result |
|-------|--------|
| Build (`npm run build`) | Exit 0 |
| Type-check (`npx tsc --noEmit`) | Exit 0 |
| Node smoke test (`scratch/test-prefix-registry.mjs`, 6 assertions) | PASS |
| Python smoke test (`scratch/test-cocoindex-prompts.py`, 5 assertions) | PASS |
| Strict packet validation (`validate.sh --strict`) | Exit 0 per implementation-summary |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts` | Added `PREFIX_REGISTRY`, `ModelPrefixConfig`, `getPrefixFor()`. Rewired `embedDocument` and `embedQuery` to use the resolver. |
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | Extended `VALID_PROVIDER_DIMENSIONS['hf-local']` with 5 new model entries. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py` | Converted `_QUERY_PROMPT_MODELS` set to dict, added `import os`, added `resolve_query_prompt_name()`, rewired `create_embedder()`. |
| `scratch/test-prefix-registry.mjs` (NEW) | Node smoke-test script, 6 assertions covering resolution order and env-override edge cases. |
| `scratch/test-cocoindex-prompts.py` (NEW) | Python smoke-test script, 5 assertions covering Qwen3 lookup, unknown fallback plus env override. |

### Follow-Ups

- Refactor the three legacy `TASK_PREFIX` consumers (`shared/embeddings.ts`, `shared/index.ts`, `mcp_server/lib/providers/embeddings.ts`) to call `getPrefixFor()` directly. Retained for back-compat in this packet.
- Sub-phase 002 requires EmbeddingGemma-300m download from a gated Hugging Face repo. User authentication or a fallback to `mixedbread-ai/mxbai-embed-large-v1` is needed before model installation can proceed.
