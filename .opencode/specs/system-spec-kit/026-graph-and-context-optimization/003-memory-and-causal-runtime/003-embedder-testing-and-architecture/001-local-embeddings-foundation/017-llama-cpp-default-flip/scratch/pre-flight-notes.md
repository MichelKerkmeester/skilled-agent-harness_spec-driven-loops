# Pre-flight Notes

## T000 factory.ts

- `SUPPORTED_PROVIDERS` includes `openai`, `voyage`, `hf-local`, `llama-cpp`, and `auto`.
- Before this packet, `resolveProvider()` used this order: explicit non-`auto` `EMBEDDINGS_PROVIDER`, valid `VOYAGE_API_KEY`, valid `OPENAI_API_KEY`, then `hf-local`.
- `getStartupEmbeddingProfile()` derives the sqlite filename from `resolveProvider()`, so the default decision must remain synchronously knowable for startup DB path selection.
- `createEmbeddingsProvider()` creates the provider lazily and supports fallback to `hf-local` for auto-selected cloud providers.

## T001 llama-cpp.ts

- `LlamaCppProvider` implements `IEmbeddingProvider`: `embedDocument()`, `embedQuery()`, `warmup()`, `healthCheck()`, `getMetadata()`, `getProfile()`, and `getProviderName()`.
- Model path resolution honors `LLAMA_CPP_EMBEDDINGS_MODEL_PATH`, expands `~/`, and otherwise uses `~/.cache/huggingface/gguf/embeddinggemma-300m/embeddinggemma-300M-Q8_0.gguf`.
- Runtime loading is lazy and cached by model path.
- This packet added `LlamaCppProvider.canLoad()` for a cheap dependency/model availability probe before default selection commits to the provider.

## Current Default-Resolution Design

The new resolution keeps explicit user intent and paid cloud providers ahead of local defaults:

1. Explicit recognized `EMBEDDINGS_PROVIDER`.
2. `VOYAGE_API_KEY` -> `voyage`.
3. `OPENAI_API_KEY` -> `openai`.
4. `llama-cpp` when `node-llama-cpp` and the GGUF file are present.
5. `hf-local` fallback, with the required warning when llama-cpp is unavailable.
