# Iteration 5: Job 2 angle A — embeddings subsystem live termination post-009

## Focus

Re-derive (not from README) which embeddings modules terminate in a live consumer after the dead-half removal: the advisor daemon's chain, the model server's chain, and the adapters-vs-providers relationship.

## Findings

| # | path:line | Declared purpose | Observed | Severity | Recommendation |
|---|-----------|------------------|----------|----------|----------------|
| R5-01 | `shared/embeddings/adapters/ollama.ts` (366 lines) vs `shared/embeddings/providers/ollama.ts` (OllamaProvider) | Two contracts for one backend | **Two parallel live implementations of the same Ollama backend.** The adapter path: `skill-graph-db.ts:1219` `getAdapter(active.name)` → `registry.ts:71` `new OllamaAdapter` → `adapter.embed()` (:1314). The provider path: `skill-graph-db.ts:18` `createEmbeddingsProvider` → `factory.ts` → `providers/ollama.ts`. Both run in the same daemon flow; each carries its own manifest/prefix tables, HTTP client, timeout/retry handling and config (adapter reads `OLLAMA_REQUEST_TIMEOUT_MS`/`OLLAMA_BASE_URL`; provider reads `OLLAMA_EMBEDDINGS_MODEL`/`OLLAMA_BASE_URL`). Round one's census called `embeddings/adapter` a shim — **corrected: it is the live embed path** for the advisor's graph indexing; the duplicate implementation is the finding. | **P1** | merge: one implementation (getAdapter wraps the factory provider, or the adapter contract is implemented by providers) — the largest duplication left in the live half |
| R5-02 | `registry.ts:79-87` | getAdapter throws for unwired backends | `MANIFESTS` = exactly one entry (nomic, backend 'ollama', registry.ts:25) — the 'api'/'sentence-transformers' throw-branches can never fire; the round-one "NotImplementedError = re-export-only" is still not exact (it IS thrown, from an unreachable branch). | P2 | document: defensive branch, 0 triggers |
| R5-03 | `bin/hf-model-server.cjs:447` | Model server | Imports `@huggingface/transformers` directly; **0** `@spec-kit/shared` imports in `bin/` (only a launcher comment). The shared `hf-local` provider is the advisor's CLIENT of that server — the socket directory/file-name contract (see R4-01/R4-02) is the entire shared↔bin coupling. Live termination: advisor only. | P2 (verified-positive) | document: the package's model-server coupling is contract-only |
| R5-04 | `embeddings/types.ts` `BackendKind` vs `factory.ts` `SupportedProviderName` | Backend taxonomy | Two distinct backend taxonomies in one package: `BackendKind` ('api'\|'ollama'\|'sentence-transformers') describes the adapter/registry world; `SupportedProviderName` ('voyage'\|'openai'\|'hf-local'\|'ollama') describes the factory/provider world. Only 'ollama' overlaps; an Ollama adapter and an Ollama provider carry the same backend under different names. | P2 | document: two taxonomies is a vocabulary seam the next maintainer must map |
| R5-05 | `embedders/` mirrors | Advisor local mirror layer | `embedders/{registry,adapter,adapters/ollama,types}.ts` are pure re-export mirrors; `embedders/schema.ts` + `index.ts` are local logic importing the shared stack; production consumers: skill-graph-db (factory + schema + registry + adapter type), scorer/projection (registry+types). The mirror layer is real and live — not residue, but it IS the isolation boundary drawn mid-package (round-one L7; stands). | P2 (verified-positive/recorded) | (none) |

## Ruled out this iteration

- The factory/providers chain as "the only" live embeddings path (round one's verified-positive read) — the adapter path is equally live; the correction is R5-01.
- The `vec_metadata`/`vec_${dim}` convention as residue: advisor-owned and written (schema.ts), unchanged from round one; not re-listed.
- The bin model-server as a shared consumer (R5-03: 0 imports).

## Sources Consulted

- Advisor production `@spec-kit/shared` imports (16 statements / 11 files, exact lines)
- `skill-graph-db.ts:18,26-27,42,1184-1219,1314` (both chains)
- `embedders/index.ts` re-export block; `embedders/schema.ts:15-16`
- `shared/embeddings/registry.ts:1-95` (MANIFESTS, NotImplementedError, getAdapter)
- `shared/embeddings/adapter.ts` (71 lines), `adapters/ollama.ts` (header + 30 lines), `providers/ollama.ts` (header)
- `bin/*.cjs` shared-import sweep (0 hits + comment); `hf-model-server.cjs:447`
- `shared/embeddings/types.ts` BackendKind; `factory.ts` SupportedProviderName

## Assessment

- newInfoRatio: 0.85 — R5-01 corrects a round-one census row (adapter = shim → adapter = live duplicate implementation) with new evidence; R5-02/R5-04 are new taxonomy rows; R5-03/R5-05 verify.
- Confidence: high (both chains read at the exact lines; no execution needed).

## Reflection

- Worked: following `getAdapter` into the registry and then into the advisor's call site — the "shim" label from round one dissolved on the first consumer read; the duplication arrived uninvited.
- Failed: nothing; the layer's README ("consumers import through adapters/ollama.js") misdirected for one step.
- Ruled out: the dist copy of the monolith (stale).

## Recommended Next Focus

Iteration 6 (job 2, angle B): the package-root / database-directory resolver proliferation — count every root resolver and directory derivation post-009 (config.ts resolvePackageRoot, factory resolveSpecKitPackageRoot, profile findUp ×2, workspace/repo-root.mjs, review-research-paths.cjs, runtime-side copies), and check shared code's runtime-layout assumptions.
