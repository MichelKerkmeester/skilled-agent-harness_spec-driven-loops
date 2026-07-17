---
title: "Factory Shard Fallback Audit: hf-local, Voyage, OpenAI Resolver Investigation"
description: "Resolver audit confirmed that only Ollama has a persisted active-embedder database resolver in factory.ts. No code change was required for hf-local/voyage/openai providers. ADR-012 shard naming evidence was recorded with current quantized filename proof."
trigger_phrases:
  - "factory shard fallback hf-local voyage openai"
  - "readActiveOllamaEmbedderFromDb only resolver"
  - "ADR-012 provider resolver follow-on"
  - "context-vectors shard naming audit"
  - "no non-Ollama active embedder resolver"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-19

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/017-factory-shard-fallback-for-hf-voyage-openai` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack`

### Summary

Predecessor packet 016 patched `readActiveOllamaEmbedderFromDb` to accept ADR-012 vector shards when the main database lacks `vec_<dim>`. Its implementation summary tracked a follow-on to apply the same fallback to the hf-local/voyage/openai providers if analogous active-embedder database resolvers existed.

A direct source search against `shared/embeddings/factory.ts` found only `readActiveOllamaEmbedderFromDb` with no hf-local/voyage/openai counterpart. Those providers resolve through `resolveProvider` using explicit `EMBEDDINGS_PROVIDER` env state, API-key presence checks and local fallback logic. None touch vec_metadata lookup.

The follow-on closed without a source edit. Shard naming evidence from `vector-index-store.ts::get_vector_shard_path` was recorded, including the current hf-local quantized filename `context-vectors__hf-local__baai_bge-base-en-v1.5__768__q8.sqlite`, which a future non-Ollama resolver must account for.

### Added

- Packet 017 documentation (spec, plan, tasks, implementation-summary) recording the no-code-change resolver audit
- ADR-012 shard naming evidence with current hf-local quantized shard filename as a reference for future resolver work

### Changed

- Parent `002-spec-memory-stack/spec.md` updated with phase documentation map row for packet 017

### Fixed

None.

### Verification

| Check | Result |
|-------|--------|
| `grep -n "readActive.*EmbedderFromDb"` against `factory.ts` | PASS. Only `readActiveOllamaEmbedderFromDb` found. |
| Broad search for `readActiveHf`, `readActiveVoyage`, `readActiveOpenai` across shared and mcp_server/lib | PASS. No non-Ollama active factory resolver found. |
| `sed -n '352,374p' vector-index-store.ts` shard path confirmation | PASS. Confirms `context-vectors__${profile.slug}.sqlite` under `vectors/`. |
| `find database/vectors -name 'context-vectors__*.sqlite'` | PASS. Confirms current Ollama and hf-local shard filenames including `__q8` suffix. |
| `npm run build` in `@spec-kit/shared` | PASS. `tsc --build` exited 0. |
| `npm run build` in `@spec-kit/mcp-server` | PASS. `tsc --build && node scripts/finalize-dist.mjs` exited 0. |
| `validate.sh --strict` on packet 017 | PASS. Exit code 0. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/specs/.../002-spec-memory-stack/spec.md` | Modified | Phase documentation map row added for packet 017. |
| `017-factory-shard-fallback-for-hf-voyage-openai/` packet docs | Created | Resolver audit finding. ADR-012 shard evidence, build verification and commit handoff recorded in the packet's spec, plan, tasks and implementation-summary. |

### Follow-Ups

- Add shard fallback for hf-local/voyage/openai if those providers gain a persisted `readActive*EmbedderFromDb` path. The Ollama pattern from packet 016 and the `__q8` shard suffix evidence here provide the implementation template.
- Confirm quantized hf-local shard filename convention when adding any future non-Ollama resolver so the glob pattern covers suffixes beyond provider slug, model and dim.
