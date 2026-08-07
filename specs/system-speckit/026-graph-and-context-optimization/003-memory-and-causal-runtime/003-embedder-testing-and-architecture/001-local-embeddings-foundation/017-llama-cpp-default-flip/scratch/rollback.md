# Rollback

Phase 4 validation failed the contract's EQUIVALENT bar: recall@5 overlap stayed strong at 0.926 and MRR delta stayed near zero, but Spearman top-10 was 0.816125 against the 0.85 target. The rollback action has therefore already been applied: `resolveProvider()` in `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` falls through to `hf-local` after cloud keys instead of probing `llama-cpp`.

The live data rollback is separate and intentionally simple:

1. Leave `EMBEDDINGS_PROVIDER=auto` or set `EMBEDDINGS_PROVIDER=hf-local`.
2. Remove `.opencode/skills/system-spec-kit/mcp_server/database/context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite` if you want to discard the migrated store.
3. Keep the original `context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768__q8.sqlite`; this packet never deletes it.
