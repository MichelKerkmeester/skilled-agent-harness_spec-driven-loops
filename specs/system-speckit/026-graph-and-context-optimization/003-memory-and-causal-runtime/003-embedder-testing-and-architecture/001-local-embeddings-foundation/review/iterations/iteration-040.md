# Deep Review v4 Iteration 040 - q8 unset path to profile filename

## Focus

Trace `HF_EMBEDDINGS_DTYPE` unset through `hf-local.ts` -> `factory.ts` -> `EmbeddingProfile` filename derivation.

## Findings

| ID | Severity | Location | Evidence | Recommendation |
|----|----------|----------|----------|----------------|
| None | - | - | `resolveDtype()` defaults to `q8` when `HF_EMBEDDINGS_DTYPE` is absent at `shared/embeddings/providers/hf-local.ts:151`; `getStartupEmbeddingProfile()` passes that dtype for hf-local at `shared/embeddings/factory.ts:341`; `EmbeddingProfile.createProfileSlug()` appends dtype at `shared/embeddings/profile.ts:22`. A local no-load profile check produced `context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768__q8.sqlite`. | Keep. |

## Notes

The unset path works. Explicitly setting `HF_EMBEDDINGS_DTYPE=` is different: the resolver treats an empty string as invalid and falls back to fp32. That is not the tested default path, but it is worth documenting if empty env vars are common in user configs.
