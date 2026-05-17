---
title: "Iter 1 — Correctness (commit ed5eb0e56 post-impl review)"
iter_number: 1
dimension: correctness
executor: cli-devin
model: swe-1.6
recipe: agent-config-deep-review-iter.json
review_target_commit: ed5eb0e56
write_mode: main_agent_persisted_from_stdout
write_mode_reason: "devin --permission-mode auto blocked write; main agent extracted from /tmp/devin-iter-010-001-1.output"
---

# Iter 001 — correctness — Post-impl review of ed5eb0e56

## 1. SCOPE READ

9 scope files (per packet spec.md §3):

- `lib/embedders/adapter.ts` (22 lines)
- `lib/embedders/types.ts` (18 lines)
- `lib/embedders/registry.ts` (107 lines)
- `lib/embedders/schema.ts` (121 lines)
- `lib/embedders/adapters/ollama.ts` (266 lines)
- `lib/embedders/adapters/llama-cpp-baseline.ts` (58 lines)
- `lib/embedders/index.ts` (34 lines)
- `lib/skill-graph/skill-graph-db.ts` (987 lines, focused 184-271 + 838-911)
- `lib/scorer/lanes/semantic-shadow.ts` (171 lines)

## 2. CORRECTNESS CLAIMS

1. `EmbedderAdapter` interface: consistent signatures — `embed()` returns `Promise<Float32Array[]>`, `ready()` returns `Promise<boolean>`, `EmbedderOptions.inputType` is union `'document' | 'query'` (adapter.ts:13-22, 9-11)
2. `OllamaAdapter` ctor validates manifest.backend === 'ollama' — throws TypeError otherwise (ollama.ts:149-152)
3. `LlamaCppBaselineAdapter` ctor same validation (llama-cpp-baseline.ts:16-19)
4. MANIFESTS entries with `backend: 'ollama'` all have required `ollamaName` field; dims match model cards (768d: nomic-embed-text-v1.5, jina-embeddings-v2-base-code; 1024d: jina-embeddings-v3, mxbai-embed-large-v1, bge-m3) (registry.ts:13-63)
5. `getAdapter()` switch is exhaustive: explicit cases for 'ollama' + 'llama-cpp', explicit throws for 'api' + 'sentence-transformers', never-type default branch canary (registry.ts:91-105, types.ts:5)
6. `index.ts` barrel re-exports everything consumed by `semantic-shadow.ts` (`getAdapter`, `getActiveEmbedder`) + `skill-graph-db.ts` (`ensureVecMetadataTable`, `ensureVecTableForDim`, `getActiveEmbedder`, `hasActiveEmbedderPointer`, `vecTableNameForDim`) (index.ts:5-34)
7. `getAdapter('jina-embeddings-v3')` returns OllamaAdapter — manifest has `backend: 'ollama'`, ctor validates (registry.ts:22-28 + 92-93 + ollama.ts:149-152)

## 3. FINDINGS

### P0 (must-fix; breaks shipped feature)

**None.**

### P1 (should-fix; correctness gap not breaking happy path)

**None.** The `'api'` and `'sentence-transformers'` BackendKind branches in `getAdapter()` intentionally throw `NotImplementedError` (registry.ts:99-101). These are placeholder backends for future implementation; the throw IS the correct behavior. Only `'ollama'` and `'llama-cpp'` are shipped in MANIFESTS — happy path is sound.

### P2 (nice-to-have; polish, style, docs)

**None.**

## 4. FINDINGS COUNTS

- P0: 0
- P1: 0
- P2: 0

## 5. GAPS FOR NEXT ITER

Not covered:
- Runtime behavior (actual embedder calls, network calls to Ollama, dimension validation at runtime)
- Error handling paths (OllamaAdapterError subclasses, NotImplementedError propagation)
- Integration with skill-graph-db migration beyond function call surface
- Performance characteristics (batch embedding, maxInputChars truncation)
- Thread-safety / concurrency (DB access, adapter caching)
- Manifest validation (schema validation for user-provided manifests)

## 6. JSONL DELTA ROW (appended to deep-review-state.jsonl)

```json
{"iter":1,"phase":"complete","timestamp":"2026-05-17T22:23:00Z","dimension":"correctness","new_p0":0,"new_p1":0,"new_p2":0,"running_p0":0,"running_p1":0,"running_p2":0,"converged":false,"note":"correctness review complete: 0 findings — interface consistent, manifests valid, switch exhaustive, barrel exports correct, ctor invariants hold"}
```
