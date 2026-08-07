# Migration Runbook

## Pre-migration

Copy the source sqlite somewhere outside the repository before the explicit migration if you want a manual rollback checkpoint:

```bash
cp .opencode/skills/system-spec-kit/mcp_server/database/context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768__q8.sqlite ~/context-index__hf-local__pre-llama-cpp.sqlite
```

## Command

```bash
npx tsx .opencode/skills/system-spec-kit/scripts/migrate-embeddings-to-llama-cpp.ts \
  --source .opencode/skills/system-spec-kit/mcp_server/database/context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768__q8.sqlite \
  --target .opencode/skills/system-spec-kit/mcp_server/database/context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite
```

## Expected Runtime

The 015 benchmark measured llama-cpp query p50 at `6.45ms`. For `2488` rows, a lower-bound p50 extrapolation is about `16s`; full migration can run longer because documents are longer than the benchmark query and the script performs sqlite writes plus a 10-row validation sample.

## Post-migration Verification

Run a representative `memory_search` query through the MCP tool path and confirm relevant results return from the llama-cpp sqlite profile. The packet smoke query is:

```text
llama-cpp default flip migration setup A
```

## Rollback

Remove the new llama-cpp sqlite and set `EMBEDDINGS_PROVIDER=hf-local`. The original hf-local sqlite remains untouched by the migration helper.
