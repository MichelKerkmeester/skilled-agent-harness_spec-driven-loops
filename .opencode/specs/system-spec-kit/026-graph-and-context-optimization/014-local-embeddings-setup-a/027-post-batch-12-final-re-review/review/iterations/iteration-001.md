# Iteration 001 — Local-LLM Legacy Hunt

## Focus
I scanned the correctness surface for post-022 residue in provider resolution, model identity, profile-keyed database paths, dependency/runtime references, and stale test expectations. The main discriminator was whether a hit asserted active behavior against the canonical post-014 defaults rather than documenting legacy compatibility, historical migration context, diagnostics, or test-local fixtures.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-001-001 | P1 | correctness | .opencode/skills/system-spec-kit/shared/embeddings.ts:769 | "case 'hf-local': default: return providerInfo.config.HF_EMBEDDINGS_MODEL \|\| DEFAULT_MODEL_NAME;" | confirmed-residue | Add an explicit `llama-cpp` branch in `detectConfiguredModelName()` returning `LLAMA_CPP_EMBEDDINGS_MODEL` or `unsloth/embeddinggemma-300m-GGUF`, so pre-initialization `MODEL_NAME` matches the canonical auto-selected local provider. |
| L-001-002 | P2 | correctness | .opencode/skills/system-spec-kit/shared/embeddings.ts:765 | "(process.env.VOYAGE_API_KEY ? 'voyage-4' : DEFAULT_MODEL_NAME);" | confirmed-residue | Make cloud provider model defaults provider-native regardless of key presence: `voyage` should default to `voyage-4` and `openai` to `text-embedding-3-small`; API-key validity should stay separate from model identity. |
| L-001-003 | P2 | correctness | .opencode/skills/system-spec-kit/scripts/tests/test-embeddings-behavioral.js:242 | "assertEqual(emb.MODEL_NAME, 'onnx-community/embeddinggemma-300m-ONNX', 'EB-003: MODEL_NAME is EmbeddingGemma default');" | confirmed-residue | Update this behavioral assertion to cover the canonical auto cascade: expect llama-cpp when the GGUF runtime is available, otherwise hf-local, and add a pre-init llama-cpp assertion to prevent L-001-001 from recurring. |

## Iteration summary
- Files scanned: 4412
- New findings: 3 (P0=0, P1=1, P2=2)
- Out-of-scope/historical noted but NOT flagged: 10
- Notes: Saturation reached for this correctness pass under the supplied rules. I did not flag the Voyage -> OpenAI -> llama-cpp -> hf-local cascade, llama-cpp default-local wording, profile-keyed runtime configs, legacy model registries, `test_backward_compat.py`, vitest temp `context-index.sqlite` idioms, `/doctor` provider-detection branches, z_archive/review/evidence material, or transitive `@huggingface/transformers` ONNX references documented as not being the rejected 014/014 backend.
