---
title: CocoIndex Code Settings Reference
description: Complete reference for global settings, project settings, embedding models, reranker models, chunking configuration, root path discovery, and environment variables.
trigger_phrases:
  - cocoindex settings
  - cocoindex embedding model
  - cocoindex reranker model
  - cocoindex configuration reference
  - ccc global settings
  - cocoindex environment variables
---

# CocoIndex Code Settings Reference

Complete reference for all CocoIndex Code configuration files, embedding model options, reranker model options, chunking parameters, and environment variables.

---

## 1. OVERVIEW

CocoIndex Code reads per-user global settings plus per-project index settings. Use this reference to pick the active Stage 1 embedding model, understand the Stage 2 reranker, understand root-path discovery, and map environment variables without guessing from daemon behavior.

### Pipeline order

Search runs in a fixed order: Stage 1 bi-encoder embedding generates query/chunk vectors, the vector lane is fused with FTS5 through Reciprocal Rank Fusion (RRF), duplicate chunks are collapsed, Stage 2 cross-encoder reranking scores the top-K query/candidate pairs, then the final ranked results are returned.

---

## 2. GLOBAL SETTINGS

**File:** `~/.cocoindex_code/global_settings.yml`

Controls the Stage 1 embedding model and daemon environment. This file is per-user (shared across all projects).

### Schema

```yaml
embedding:
  provider: <string>    # "sentence-transformers" | "litellm"
  model: <string>       # Stage 1 embedder identifier (see Embedding Model Options below)
  device: <string|null> # "cpu" | "cuda" | "mps" | null (auto-detect)

envs:                   # Dict of environment variables injected into daemon
  VOYAGE_API_KEY: <string>
  OPENAI_API_KEY: <string>
  # ... any key-value pairs
```

### Fields

| Field                | Type          | Default                                     | Description                                      |
| -------------------- | ------------- | ------------------------------------------- | ------------------------------------------------ |
| `embedding.provider` | string        | `sentence-transformers`                     | Stage 1 embedding backend: `sentence-transformers` (local) or `litellm` (API) |
| `embedding.model`    | string        | `nomic-ai/CodeRankEmbed`                   | Stage 1 bi-encoder embedder identifier passed to the provider |
| `embedding.device`   | string / null | `null`                                      | Stage 1 embedder compute device. `null` auto-detects (GPU if available, else CPU) |
| `envs`               | dict          | `{}`                                        | Environment variables injected into the daemon process. Used for API keys |

### Example: Default Local nomic CodeRankEmbed

```yaml
embedding:
  provider: sentence-transformers
  model: nomic-ai/CodeRankEmbed
```

### Example: Voyage Code 3 Cloud Model

```yaml
embedding:
  provider: litellm
  model: voyage/voyage-code-3
envs:
  VOYAGE_API_KEY: your-key-here
```

> **CRITICAL**: Changing the Stage 1 embedding model requires `ccc reset && ccc index` to rebuild the index. Different embedders can produce different vector dimensions and cannot be mixed. Changing the Stage 2 reranker does not rebuild stored embeddings because it only scores query/candidate pairs after retrieval.

---

## 3. PROJECT SETTINGS

**File:** `<project-root>/.cocoindex_code/settings.yml`

Controls per-project indexing behavior. Created automatically by `ccc init`.

### Schema

```yaml
include_patterns:      # List of glob patterns for files to index
  - "*.py"
  - "*.ts"
  # ...

exclude_patterns:      # List of glob patterns for files to skip
  - "node_modules/**"
  - "__pycache__/**"
  # ...

language_overrides:    # List of {ext, lang} mappings for custom extensions
  - ext: ".pyx"
    lang: "python"
```

### Fields

| Field                | Type       | Default          | Description                                              |
| -------------------- | ---------- | ---------------- | -------------------------------------------------------- |
| `include_patterns`   | list[str]  | 28+ file types   | Glob patterns for files to index (see default list below) |
| `exclude_patterns`   | list[str]  | Common excludes  | Glob patterns for files to skip during indexing           |
| `language_overrides` | list[dict] | `[]`             | Map custom extensions to known languages                  |

### Default Include Patterns (28+ file types)

```
*.py, *.ts, *.js, *.tsx, *.jsx, *.rs, *.go, *.java, *.c, *.h,
*.cpp, *.cc, *.cxx, *.hpp, *.cs, *.sql, *.sh, *.bash, *.md, *.txt,
*.kt, *.kts, *.scala, *.swift, *.dart, *.lua, *.r, *.R, *.jl,
*.ex, *.exs, *.hs, *.ml, *.mli, *.pl, *.pm, *.php, *.rb,
*.yml, *.yaml, *.toml
```

### Default Exclude Patterns

```
node_modules/**, __pycache__/**, .git/**, .venv/**, venv/**,
dist/**, build/**, .next/**, target/**, *.min.js, *.min.css,
*.lock, package-lock.json, yarn.lock, *.pyc, *.pyo,
.cocoindex_code/**, .opencode/skills/*/mcp_server/.venv/**
```

---

## 4. EMBEDDING MODEL OPTIONS

Stage 1 embedding models are bi-encoders: they encode the query and chunks independently, then the vector lane compares those embeddings with cosine similarity before RRF fusion.

| Model | Provider | Key Required | Dimensions | Notes |
| ----- | -------- | ------------ | ---------- | ----- |
| `nomic-ai/CodeRankEmbed` | sentence-transformers | None | 768 | **Current local default** (ratified 2026-05-19 nomic promotion). Code-tuned, Metal/MPS auto-detected on Apple Silicon; query prompt resolves to `query` |
| `voyage/voyage-code-3` | litellm | `VOYAGE_API_KEY` | 1024 | Cloud alternative requiring API key and rebuild |
| `text-embedding-3-small` | litellm | `OPENAI_API_KEY` | 1536 | OpenAI, general-purpose |
| `gemini/gemini-embedding-001` | litellm | `GEMINI_API_KEY` | 768 | Google Gemini |
| `cohere/embed-v4.0` | litellm | `COHERE_API_KEY` | 1024 | Cohere |
| `ollama/nomic-embed-text` | litellm | None | 768 | Local via Ollama (requires Ollama running) |
| `google/embeddinggemma-300m` | sentence-transformers | None | 768 | Pre-CodeRankEmbed baseline. General-text; query prompt resolves to `InstructionRetrieval`. Kept for benchmark comparisons |

### Reranker Model Options

Stage 2 reranker models are cross-encoders: they encode the query and each retrieved candidate together with token attention. They run only on the retrieval top-K after vector/FTS5 fusion and dedup.

| Model | Type | License | Status | Notes |
|---|---|---|---|---|
| `Qwen/Qwen3-Reranker-0.6B` | Cross-encoder | Apache-2.0 | Current default | Promoted 2026-05-20 after the 73-probe expanded-fixture head-to-head bench (see `mcp_server/benchmarks/benchmark-2026-05-20/`): 30/73 hits vs jina-v3 29/73, p95 1984ms vs 2905ms, n=3 zero stddev. |
| `jinaai/jina-reranker-v3` | Cross-encoder | **CC BY-NC 4.0** | Pre-2026-05-20 default; opt-in fallback | Highest quality on the 18-probe fixture, but demoted after the 73-probe expanded-fixture bench; non-commercial. Operator-visible WARNING via `ccc doctor` and `COCOINDEX_COMMERCIAL_SAFE_PROFILE` when explicitly pinned. |
| `BAAI/bge-reranker-v2-m3` | Cross-encoder | Apache-2.0 | Commercial-safe alternative | Close runner-up on 18-probe; ships in registered_embedders.py |
| `mixedbread-ai/mxbai-rerank-base-v2` | Cross-encoder | Apache-2.0 | Commercial-safe alternative | Listed in registry; not benchmarked head-to-head on 73-probe yet |

Configure reranking with `COCOINDEX_RERANK`, `COCOINDEX_RERANK_MODEL`, and `COCOINDEX_RERANK_TOP_K`. These keys control Stage 2 only; they do not change `embedding.model` or the persisted vector index.

### Provider Details

**`sentence-transformers`** -- Runs models locally using the sentence-transformers Python library. No API key needed. Models are downloaded on first use and cached locally. Best for offline use or when API costs are a concern.

**`litellm`** -- Routes to external embedding APIs (Voyage, OpenAI, Gemini, Cohere, Nomic) or local servers (Ollama). Requires the appropriate API key set in the `envs` section of `global_settings.yml` or as an environment variable in the MCP config.

---

## 5. CHUNKING CONFIGURATION

CocoIndex Code splits source files into chunks for embedding and search. Chunking parameters are built-in and not user-configurable.

| Parameter          | Value                  | Description                                     |
| ------------------ | ---------------------- | ----------------------------------------------- |
| Chunk size         | 1,500 characters       | Target size for each chunk (retuned in v1.2.0 for function-boundary preservation; was 1000 prior) |
| Minimum chunk size | 250 characters         | Chunks smaller than this are merged with neighbors |
| Overlap            | 200 characters         | Overlap between adjacent chunks for context (retuned in v1.2.0 from 150) |
| Algorithm          | tree-sitter (code-aware) + RecursiveSplitter fallback | Tree-sitter grammars for Python/TS/TSX/JS/Go/Rust/Java; RecursiveSplitter as fallback for unsupported languages |

### Language-Aware Boundaries

The chunker respects language structure when splitting:
- Prefers splitting at function/method boundaries
- Prefers splitting at class/struct boundaries
- Falls back to line boundaries when no structural boundary is found within the chunk size
- Preserves import/include blocks as single chunks when possible

---

## 6. ROOT PATH DISCOVERY

CocoIndex Code determines the project root using the following priority order:

| Priority | Method | Description |
| -------- | ------ | ----------- |
| 1 | `COCOINDEX_CODE_ROOT_PATH` env var | Explicit override, always takes precedence |
| 2 | Nearest parent with `.cocoindex_code/` | Walks up from cwd looking for initialized project |
| 3 | Nearest parent with project markers | Looks for `.git`, `pyproject.toml`, `package.json`, `Cargo.toml`, `go.mod` |
| 4 | Current working directory | Fallback when no markers found |

### Example

```
/home/user/projects/my-app/          <-- has .git/ and .cocoindex_code/
  src/
    api/
      handlers.py                    <-- cwd here
```

Running `ccc search "handler"` from `src/api/` finds `/home/user/projects/my-app/` as root (Priority 2: `.cocoindex_code/` found).

---

## 7. ENVIRONMENT VARIABLES

### Runtime Variables

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `COCOINDEX_CODE_DIR` | `~/.cocoindex_code` | Override the global config directory location |
| `COCOINDEX_CODE_ROOT_PATH` | (auto-detected) | Override project root detection (see Root Path Discovery) |

### Retrieval Pipeline Variables

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `COCOINDEX_HYBRID` | `true` | Enable vector + FTS5 hybrid retrieval before reranking |
| `COCOINDEX_HYBRID_VECTOR_WEIGHT` | `0.9` | RRF weight for the Stage 1 vector channel |
| `COCOINDEX_HYBRID_FTS5_WEIGHT` | `0.5` | RRF weight for the FTS5 lexical channel |
| `COCOINDEX_HYBRID_RRF_K` | `60` | RRF dampening constant |
| `COCOINDEX_RERANK` | `true` | Enable the Stage 2 cross-encoder reranker |
| `COCOINDEX_RERANK_MODEL` | `Qwen/Qwen3-Reranker-0.6B` | Stage 2 cross-encoder model identifier |
| `COCOINDEX_RERANK_TOP_K` | `20` | Number of fused/deduped candidates passed to the reranker |
| `COCOINDEX_COMMERCIAL_SAFE_PROFILE` | `false` | Block active non-commercial models and surface commercial-safe alternatives |

### API Key Variables

Set these in `global_settings.yml` under `envs:` or in the MCP config's `env` section:

| Variable | Required For |
| -------- | ------------ |
| `VOYAGE_API_KEY` | `voyage/voyage-code-3` |
| `OPENAI_API_KEY` | `text-embedding-3-small` |
| `GEMINI_API_KEY` | `gemini/gemini-embedding-001` |
| `COHERE_API_KEY` | `cohere/embed-v4.0` |
| `NOMIC_API_KEY` | `nomic-ai/CodeRankEmbed` |

### Legacy Variables

These older variable names are mapped automatically for backward compatibility:

| Legacy Variable | Maps To |
| --------------- | ------- |
| `COCOSEARCH_DIR` | `COCOINDEX_CODE_DIR` |
| `COCOSEARCH_ROOT_PATH` | `COCOINDEX_CODE_ROOT_PATH` |

---

## 8. RELATED RESOURCES

| Resource         | Location                                                            |
| ---------------- | ------------------------------------------------------------------- |
| INSTALL_GUIDE    | `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md`              |
| SKILL.md         | `.opencode/skills/mcp-coco-index/SKILL.md`                      |
| Tool Reference   | `.opencode/skills/mcp-coco-index/references/tool_reference.md`  |
| Search Patterns  | `.opencode/skills/mcp-coco-index/references/search_patterns.md` |
| Config Templates | `.opencode/skills/mcp-coco-index/assets/config_templates.md`    |
