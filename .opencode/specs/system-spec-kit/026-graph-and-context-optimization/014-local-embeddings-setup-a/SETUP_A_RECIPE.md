# Setup A Recipe — Local Embeddings (EmbeddingGemma + Qwen3)

This packet does NOT bake user-specific model choices into committed configs. New users get safe defaults out-of-box (Nomic-text-v1.5 768d for memory, all-MiniLM-L6-v2 384d for code — both small, open, auto-downloads on first use).

To activate Setup A on your machine, follow this recipe. Setup A swaps both vec stores to bigger/stronger local models:

| Surface | Default | Setup A |
|---|---|---|
| Memory (Spec Kit Memory MCP) | `nomic-ai/nomic-embed-text-v1.5` (768d, ~270MB) | `onnx-community/embeddinggemma-300m-ONNX` (768d, ~620MB fp32 / ~190MB Q4) |
| Code (CocoIndex MCP) | `sbert/sentence-transformers/all-MiniLM-L6-v2` (384d, ~90MB) | `sbert/google/embeddinggemma-300m` (768d, ~620MB fp16 on Metal) |

## Prerequisites

- macOS with Apple Silicon (M-series). Setup A is hardware-validated on M5 Max 64GB but should work down to M1 with 16GB+ RAM if you don't run a chat model alongside.
- HuggingFace account + token (free) — required only for the EmbeddingGemma half because the canonical `google/embeddinggemma-300m` repo is gated. The transformers.js-compatible ONNX port `onnx-community/embeddinggemma-300m-ONNX` is mirrored from it and inherits the same gating.

## Install steps

### 1. Accept the Gemma license + create HF token

- Visit https://huggingface.co/google/embeddinggemma-300m and click **"Agree and access repository"** (one-time).
- Create a read-scope token at https://huggingface.co/settings/tokens.
- Save it to `~/.cache/huggingface/token` (mode 600):
  ```bash
  mkdir -p ~/.cache/huggingface
  umask 077
  printf 'hf_yourtoken' > ~/.cache/huggingface/token
  chmod 600 ~/.cache/huggingface/token
  ```

### 2. Pre-download both models

```bash
# Use the project's cocoindex venv Python (already has sentence-transformers + huggingface_hub installed)
PY=.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/python3

$PY -c "from huggingface_hub import snapshot_download; snapshot_download('google/embeddinggemma-300m')"
$PY -c "from huggingface_hub import snapshot_download; snapshot_download('onnx-community/embeddinggemma-300m-ONNX')"
```

Expect ~~1.3GB total in `~/.cache/huggingface/hub/`. The EmbeddingGemma pull is ~~620MB (14 files); the EmbeddingGemma ONNX pull is ~2.6GB (21 files including fp32/fp16/q4/q4f16/int8 variants).

### 3. Create the transformers.js cache symlink

transformers.js expects a flat layout `<cache>/<org>/<name>/`. huggingface_hub uses a hashed layout `<cache>/models--<org>--<name>/snapshots/<hash>/`. Bridge with a symlink:

```bash
cd ~/.cache/huggingface/hub
SNAPSHOT=$(ls -d models--onnx-community--embeddinggemma-300m-ONNX/snapshots/*/ | head -1)
mkdir -p onnx-community
ln -sfn "$PWD/$SNAPSHOT" "$PWD/onnx-community/embeddinggemma-300m-ONNX"
```

### 4. Create `.env.local` at repo root

```bash
cat > .env.local << 'EOF'
HF_EMBEDDINGS_MODEL=onnx-community/embeddinggemma-300m-ONNX
EMBEDDING_DIM=768
COCOINDEX_CODE_EMBEDDING_MODEL=sbert/google/embeddinggemma-300m
EOF
```

(File is gitignored via `*.local` in `.gitignore`.)

### 5. Restart MCP runtimes

Quit Claude Code (or whichever runtime you use), then re-launch. The MCP child processes will:
- Spec Kit Memory launcher (`spec-kit-memory-launcher.cjs`) reads `.env.local` at startup and forwards env to the context-server child.
- CocoIndex's `ccc` Python entry calls `dotenv.load_dotenv('.env.local')` at module import.

Both populate `process.env` for the MCP child before any embedding code runs. Existing process.env wins (so a shell-exported value still overrides `.env.local`).

### 6. Rebuild vec stores

Delete the stale CocoIndex index (it was built with a different dim — 384d for MiniLM default OR 768d if you previously ran Setup A but on a different model):
```bash
rm -f .cocoindex_code/target_sqlite.db
```

Memory side: nothing to delete — filename keys by provider+model+dim, so Setup A creates a new `context-index__hf-local__onnx-community__embeddinggemma-300m-ONNX__768.sqlite` file automatically.

Trigger reindex via MCP tools (Claude Code / OpenCode):
- `memory_index_scan({force: true})` — repopulates ~5k spec-doc rows
- `cocoindex_code.search({query: "test", refresh_index: true})` — rebuilds the code index (~3-4 min for ~9.7k files on Metal)

### 7. Verify

```bash
# Memory dim is 768 (Gemma native)
ls .opencode/skills/system-spec-kit/mcp_server/database/context-index__hf-local__onnx-community__embeddinggemma-300m-ONNX__768.sqlite

# CocoIndex DB grows from 0 toward ~6-~1.3GB during reindex (768d × ~30k chunks × 4 bytes)
du -sh .cocoindex_code/target_sqlite.db
```

In your MCP-enabled runtime, run:
- `memory_health()` → expect `provider=hf-local`, `model=onnx-community/embeddinggemma-300m-ONNX`, `dim=768`
- `memory_search("known trigger")` → expect <30ms p95, top-1 hit
- `cocoindex_code.search("known function name")` → expect <100ms p95

## Choosing a different model

The PREFIX_REGISTRY in `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts` ships built-in prefix conventions for these models — set `HF_EMBEDDINGS_MODEL` to any of them and prefixes are applied automatically:

| Model | Dim | Notes |
|---|---|---|
| `nomic-ai/nomic-embed-text-v1.5` | 768 | Default — auto-downloads on first use, no auth |
| `onnx-community/embeddinggemma-300m-ONNX` | 768 | Setup A — gated, transformers.js-native ONNX |
| `intfloat/e5-large-v2` | 1024 | Strong text retrieval; passage/query prefixes |
| `mixedbread-ai/mxbai-embed-large-v1` | 1024 | No prefixes; widely used |
| `Snowflake/snowflake-arctic-embed-l-v2.0` | 1024 | Matryoshka support; instruction prefix on queries |
| `BAAI/bge-m3` | 1024 | Hybrid-capable (sparse+dense+ColBERT) |

For an unregistered model, set `HF_EMBEDDINGS_PREFIX_DOC` and `HF_EMBEDDINGS_PREFIX_QUERY` in `.env.local` as needed (empty string = "no prefix" explicitly).

For CocoIndex (code side), any sentence-transformers-compatible model with `sbert/` prefix works. The `_QUERY_PROMPT_MODELS` dict in `mcp-coco-index/mcp_server/cocoindex_code/shared.py` ships prompt-name shortcuts for Nomic-embed-code, CodeRankEmbed, and Qwen3-Embedding sizes — override with `COCOINDEX_QUERY_PROMPT_NAME` if needed.

## Rollback to defaults

```bash
mv .env.local .env.local.disabled
# Restart your MCP runtime
# MCP servers fall back to Nomic-text-v1.5 (memory) + MiniLM (code) — both auto-download if absent
```

The Setup A vec stores stay on disk; they just become orphaned (~~1.3GB). Delete manually if you want the space back:
```bash
rm -f .opencode/skills/system-spec-kit/mcp_server/database/context-index__hf-local__onnx-community__embeddinggemma-300m-ONNX__768.sqlite*
rm -f .cocoindex_code/target_sqlite.db  # if currently on Setup A's 768d Qwen index
```
