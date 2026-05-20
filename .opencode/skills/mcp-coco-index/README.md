---
title: "CocoIndex Code - Semantic Code Search"
description: "Semantic code search via vector embeddings, with CLI search plus MCP search and explicit refresh tools."
trigger_phrases:
  - "semantic search"
  - "cocoindex"
  - "ccc"
  - "find code that"
  - "code search"
  - "vector search"
  - "find similar code"
---

# CocoIndex Code - Semantic Code Search

> Find code by what it does, not what it says: natural-language queries resolved to semantically relevant results across 28+ languages via CLI or MCP tools.

## Forked From

This skill bundles a soft-fork of [`cocoindex-code`](https://github.com/cocoindex-io/cocoindex-code) (Apache 2.0).

- Upstream version forked: 0.2.3
- Current fork version: 0.2.3+spec-kit-fork.0.2.0
- License: Apache License, Version 2.0 (see [LICENSE](./LICENSE))
- Attribution + modifications: [NOTICE](./NOTICE)
- Changelog: [changelog/CHANGELOG.md](./changelog/CHANGELOG.md)
- Source location: [`mcp_server/cocoindex_code/`](./mcp_server/cocoindex_code/)

Modifications are limited to the `cocoindex_code` Python wrapper. The Rust-based upstream `cocoindex` package is NOT forked - it is still pulled from PyPI as a dependency.

Patches landed in the local fork: mirror-folder duplicate suppression, canonical path identity, path-class reranking for implementation-intent queries, and ranking telemetry.

**Vanilla cocoindex-code returns** per result: `file`, `lines`, `snippet`, `score`, `language`. **This fork additionally returns:** `source_realpath`, `content_hash`, `path_class` (chunk-level identity + taxonomy), `dedupedAliases`, `uniqueResultCount` (mirror-folder dedup signals), `raw_score` (pre-rerank score), and `rankingSignals` (per-result rerank breakdown). Callers writing client code against this MCP/CLI must account for the extended shape. See [`references/tool_reference.md` §7 Fork-Specific Output Telemetry](references/tool_reference.md#-7-fork-specific-output-telemetry) for the full schema, types, and reading guidance.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. FEATURES](#3--features)
- [4. STRUCTURE](#4--structure)
- [5. CONFIGURATION](#5--configuration)
- [6. USAGE EXAMPLES](#6--usage-examples)
- [7. TROUBLESHOOTING](#7--troubleshooting)
- [8. FAQ](#8--faq)
- [9. RELATED DOCUMENTS](#9--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What This Skill Does

CocoIndex Code is a semantic code search tool built on vector embeddings. Where `grep` matches exact characters, CocoIndex Code matches meaning. Ask for "retry logic with exponential backoff" and it returns code that implements that pattern, regardless of how the author named variables or functions. This makes it the right tool when you know what a piece of code does but not where it lives or what it is called.

The skill ships with two access modes. The CLI (`ccc`) is fastest for one-off queries and full index management operations. The MCP server (`ccc mcp`) exposes `search` plus `cocoindex_refresh_index`, so AI agents can query semantically by default and refresh explicitly after code changes.

Indexing is incremental and daemon-backed. The first run scans and embeds all supported files in the project. Subsequent runs update only changed files. A background daemon starts automatically on the first command, persists across calls, and restarts itself when settings or the binary version change.

If that exploration feeds into Spec Kit packet recovery, `/spec_kit:resume` remains the canonical surface. Packet continuity still comes from `handover.md`, then `_memory.continuity`, then the remaining spec docs, while generated memory artifacts stay secondary.

### Key Statistics

This skill runs version 1.2.0 and exposes 2 MCP tools (search and cocoindex_refresh_index). It supports 28+ programming languages and uses the nomic-ai/CodeRankEmbed embedding model by default via sentence-transformers (768-dim, local, no API key, Metal/MPS accelerated on Apple Silicon, auto-detected). The code-tuned default was ratified in packet 018 after a comparison against gemma-300m, nomic-CodeRankEmbed, and BAAI/bge-code-v1. Vector storage uses SQLite via sqlite-vec, with a default chunk size of 1500 characters (250 char minimum, 200 char overlap, all tunable via env vars in v1.2.0+) and cosine similarity (0.0 to 1.0) as the similarity metric. Hybrid search (FTS5 + RRF) and Qwen3-Reranker-0.6B cross-encoder rerank are default-on production features.

### Two-stage retrieval pipeline

CocoIndex Code uses **two architecturally distinct models**, not one. They run sequentially; they are not interchangeable. See [SKILL.md](SKILL.md) for the v1.2.0 retrieval defaults and operator routing rules.

| Stage | Model type | Default | Role |
|---|---|---|---|
| 1. Retrieval | Bi-encoder embedder | `sbert/nomic-ai/CodeRankEmbed` (768d, MIT) | Embeds the query and indexed chunks independently; vector cosine results are fused with FTS5 via RRF |
| 2. Reranking | Cross-encoder reranker | `Qwen/Qwen3-Reranker-0.6B` (Apache-2.0) | Scores each query + top-K candidate together with token-level attention |

Pipeline order: nomic vector lane + FTS5 lexical lane -> RRF fusion (`K=60`, vector `0.9`, FTS5 `0.5`) -> mirror dedup -> top-K rerank (`20` default) -> path-class/canonical boosts -> final ranking.

Bi-encoders cannot replace the reranker because the vector lane already uses their cosine signal. Cross-encoders cannot replace the embedder because scoring every indexed chunk would be too slow at repo scale. The default reranker is Apache-2.0 as of 2026-05-20; `jinaai/jina-reranker-v3` remains registered as an opt-in fallback with a non-commercial CC BY-NC 4.0 license.

### Key Features

- Semantic search: Query by concept or intent, not exact text
- CLI and MCP modes: `ccc` for terminal use, `ccc mcp` for AI agent integration
- Language filters: `--lang` (CLI) or `languages` (MCP) narrows results by language
- Path filters: `--path` (CLI) or `paths` (MCP) scopes results to a directory
- Incremental indexing: Only re-embeds changed files on subsequent runs
- Daemon architecture: Auto-starts, auto-restarts on version or settings change
- Spec Kit integration: Companion lifecycle tools (`ccc_status`, `ccc_reindex`, `ccc_feedback`) and code-graph/session integration are available through system-spec-kit
- Nomic default: 768d code-tuned `nomic-ai/CodeRankEmbed` via sentence-transformers; Metal/MPS auto-detected on Apple Silicon, no API key. Note: mk-spec-memory uses `jina-embeddings-v3` (1024d text-tuned), while CocoIndex uses nomic CodeRankEmbed for local code search
- 28+ languages: Language-aware chunk splitting preserves function and class boundaries

In the broader system-spec-kit stack, CocoIndex is the semantic half of a three-system retrieval model: CocoIndex finds conceptually similar code, Code Graph answers structural questions, and session bootstrap surfaces CocoIndex readiness during recovery. The companion lifecycle helpers exposed through system-spec-kit are `ccc_status`, `ccc_reindex`, and `ccc_feedback`.

### v1.2.0 Retrieval-Quality Capabilities

Three retrieval-quality capabilities ship in v1.2.0. Chunking tunables are always available; hybrid retrieval and rerank are default ON and can be disabled with env flags when operators need ablations or rollback.

- **Chunking tunables** — `CHUNK_SIZE` raised 1000 → 1500 for better function-boundary preservation; new env overrides `COCOINDEX_CODE_CHUNK_SIZE`, `COCOINDEX_CODE_CHUNK_OVERLAP`, `COCOINDEX_CODE_MIN_CHUNK_SIZE`.
- **Hybrid search** (`COCOINDEX_HYBRID=true`) — SQLite FTS5 lexical channel fused with the vector channel via Reciprocal Rank Fusion. Mirrors the retrieval stack used by `mk-spec-memory`. Tunable via `COCOINDEX_HYBRID_VECTOR_WEIGHT`, `COCOINDEX_HYBRID_FTS5_WEIGHT`, `COCOINDEX_HYBRID_RRF_K`; set `COCOINDEX_HYBRID=false` for vector-only rollback.
- **Cross-encoder rerank** (`COCOINDEX_RERANK=true`) — Local Jina v3 reranker applied to the top-K candidates. Tunable via `COCOINDEX_RERANK_MODEL`, `COCOINDEX_RERANK_TOP_K`. First use downloads the model to `~/.cache/huggingface/hub/`; set `COCOINDEX_RERANK=false` for no-rerank ablations.

Full env-var matrix with defaults and valid ranges: [INSTALL_GUIDE.md §4 "Tuning + optional retrieval features"](INSTALL_GUIDE.md).

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

**Step 1: Install and verify**

Run the idempotent bootstrap helper. It installs the binary, initializes the project if needed, and reports readiness.

```bash
bash .opencode/skills/mcp-coco-index/scripts/ensure_ready.sh --strict --require-config
```

**Step 2: Build the index**

Run from the project root. The first run scans all supported files and generates embeddings. It takes 1-5 minutes depending on codebase size.

```bash
ccc index
```

**Step 3: Check index status**

Confirm files are indexed before searching.

```bash
ccc status
```

**Step 4: Search**

Run a natural-language query. Add language and path filters to narrow results.

```bash
ccc search "authentication middleware"
ccc search "error handling" --lang typescript
ccc search "database migration" --path "src/**" --limit 5
```

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

### 3.1 FEATURE HIGHLIGHTS

CocoIndex Code resolves queries by embedding the natural-language query text and comparing the resulting vector against pre-computed vectors for every code chunk in the index. This means the search engine reads intent, not characters. A query for "graceful shutdown handler" finds code that tears down servers or releases resources, even if the words "graceful", "shutdown", or "handler" never appear in that code.

The default embedding model is `nomic-ai/CodeRankEmbed`, a 768-dimensional code-tuned BERT (161M params). It runs locally via sentence-transformers on PyTorch with Metal/MPS acceleration on Apple Silicon — auto-detected by `_resolve_device()`. No API key required. The dimension matches the previous gemma baseline (768d) so the index schema is unchanged across the swap.

The full registry of vetted alternatives — including `nomic-ai/CodeRankEmbed`, `BAAI/bge-code-v1`, and `Salesforce/SFR-Embedding-Code-2B_R` — lives in `cocoindex_code/registered_embedders.py`. See [INSTALL_GUIDE.md §4 "Choosing an embedder"](INSTALL_GUIDE.md) for the swap runbook. Cloud alternatives like `voyage/voyage-code-3` still work via LiteLLM if you set `VOYAGE_API_KEY`. Changing embedders requires `ccc reset && ccc index` because the on-disk vectors must match the live model's dimensionality.

Language and path filters apply after ranking, which means they narrow an already semantically ranked result set rather than replacing semantic ranking with keyword matching. This design keeps the filters fast and the results meaningful. For multi-query agent sessions, use the default `refresh_index=false` search path and call `cocoindex_refresh_index` explicitly after code changes. The daemon has a known concurrency issue where simultaneous `refresh_index=true` requests can cause `ComponentContext` errors.

The CLI and MCP interfaces are complementary, not redundant. The CLI handles index lifecycle operations (`index`, `status`, `reset`, `init`, `daemon`) that have no destructive MCP equivalents. The MCP server exposes `search` plus explicit `cocoindex_refresh_index`, so agents can keep search latency predictable and refresh the index only when needed.

### 3.2 FEATURE REFERENCE

**CLI commands**

| Command | Purpose | Key Flags |
|---|---|---|
| `ccc search QUERY` | Semantic search | `--lang`, `--path`, `--limit`, `--offset`, `--refresh` |
| `ccc index` | Build or update the vector index | none |
| `ccc status` | Show index statistics | none |
| `ccc init` | Initialize project (`/.cocoindex_code/`) | `-f` / `--force` |
| `ccc reset` | Reset databases | `--all` (include settings), `-f` (skip prompt) |
| `ccc mcp` | Start MCP server (stdio mode) | none |
| `ccc daemon status` | Show daemon state | none |
| `ccc daemon restart` | Restart daemon | none |
| `ccc daemon stop` | Stop daemon | none |

**MCP tool: `search`**

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `query` | string | Yes | - | Natural-language search query |
| `languages` | list or null | No | null | Filter by programming languages |
| `paths` | list or null | No | null | Filter by file paths |
| `limit` | integer | No | 5 | Maximum number of results to return |
| `offset` | integer | No | 0 | Number of results to skip for pagination |
| `refresh_index` | boolean | No | false | Trigger index refresh before searching |

**MCP tool: `cocoindex_refresh_index`**

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `paths` | list or null | No | null | Optional changed-path hints; current daemon refresh remains project-wide incremental |

**CLI vs. MCP parameter differences**

| Concept | CLI | MCP | Note |
|---|---|---|---|
| Language filter | `--lang` (repeatable flag) | `languages` (list) | CLI: one flag per language. MCP: list of strings |
| Path filter | `--path` (single string) | `paths` (list) | CLI: one path. MCP: multiple paths |
| Result limit | `--limit` (default 10) | `limit` (default 5) | Different defaults |
| Index refresh before search | `--refresh` (default false) | `refresh_index` (default false) | Same default |
| Explicit index refresh | `ccc index` | `cocoindex_refresh_index` | MCP refresh is project-wide incremental |
| Pagination | `--offset` | `offset` (default 0) | Available on both surfaces |

**Stage 1 embedding models**

| Embedder | Type | Dimensions | API Key | Best For |
|---|---|---|---|---|
| `nomic-ai/CodeRankEmbed` | Local via sentence-transformers | 768 | None | **Default.** Code-tuned. Metal/MPS auto-detect on Apple Silicon |
| `google/embeddinggemma-300m` | Local via sentence-transformers | 768 | None | Pre-018 baseline. General-text. Kept for benchmark comparisons |
| `BAAI/bge-code-v1` | Local via sentence-transformers | 768 | None | Multilingual code coverage focus |
| `Salesforce/SFR-Embedding-Code-2B_R` | Local via sentence-transformers | 2048 | None | Largest, highest quality. Needs ~4 GB RAM headroom |
| `voyage/voyage-code-3` | Cloud via LiteLLM | 1024 | `VOYAGE_API_KEY` | Higher-dim cloud option (requires API key) |

Full embedder registry with RAM/disk/MPS metadata in `cocoindex_code/registered_embedders.py`. Swap runbook in [INSTALL_GUIDE.md §4](INSTALL_GUIDE.md).

**Similarity score interpretation**

| Score Range | Meaning | Action |
|---|---|---|
| 0.8 - 1.0 | Strong match | Read this first |
| 0.6 - 0.8 | Good match | Worth reviewing |
| 0.4 - 0.6 | Moderate match | Scan for usefulness |
| 0.0 - 0.4 | Weak match | Usually skip |

### 3.3 TOOL COMPARISON

Code Graph implementation and package docs live under `.opencode/skills/system-code-graph/`; the MCP tool IDs stay `code_graph_*`, `ccc_*`, and `detect_changes`.

- `ccc search` (CocoIndex): Use when you know what code does but not where it lives. Limitation: Approximate, needs verification.
- `code_graph_query`: Use when you need exact callers, imports, or structural dependencies. Limitation: Requires the structural graph to be indexed first.
- `Grep`: Use when you know the exact text, symbol, or regex pattern. Limitation: Cannot find conceptual matches.
- `Glob`: Use when you know the file name or extension pattern. Limitation: Cannot search file contents.
- `Read`: Use when you know the exact file path. Limitation: No search capability.

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:structure -->
## 4. STRUCTURE

```text
|mcp-coco-index/
  SKILL.md                         AI agent instructions and routing logic
  README.md                        This file
  INSTALL_GUIDE.md                 Installation and initial setup guide
  assets/
    config_templates.md            MCP server configuration examples
  manual_testing_playbook/
    01--core-cli-commands/         Test cases for search, index, status, init, reset
    02--mcp-search-tool/           Test cases for MCP search tool
    ...
  references/
    cross_cli_playbook.md          Safe defaults for multi-query sessions and cross-CLI use
    downstream_adoption_checklist.md  Minimum bundle for sibling-repo rollout
    search_patterns.md             Query writing strategies and filter examples
    settings_reference.md          Embedding model switching and daemon settings
    tool_reference.md              Complete CLI and MCP parameter reference
  scripts/
    install.sh                     Install CocoIndex Code into skill venv
    update.sh                      Update to latest version
    doctor.sh                      Read-only health check (supports --json, --strict)
    ensure_ready.sh                Idempotent bootstrap (install + init + index if needed)
  mcp_server/
    .venv/
      bin/
        ccc                        CLI binary (full path for PATH-less invocation)
```

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

**Binary path**

If `ccc` is not on your PATH, use the full venv path:

```text
.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc
```

**Global settings** (`~/.cocoindex_code/global_settings.yml`)

Controls the embedding model used for all projects on this machine.

```yaml
embedding:
  provider: sentence-transformers       # or litellm for cloud models
  model: nomic-ai/CodeRankEmbed  # default 768d code-tuned (see registered_embedders.py for alternatives)
  device: auto                          # auto | cpu | cuda | mps (auto-detects if omitted)
envs:
  VOYAGE_API_KEY: "your-key-here"       # required only for voyage cloud models
```

**Project settings** (`.cocoindex_code/settings.yml`)

Created by `ccc init`. Controls which files get indexed in this project.

```yaml
include_patterns:
  - "**/*.ts"
  - "**/*.py"
exclude_patterns:
  - "node_modules/**"
  - "dist/**"
```

**MCP configuration** (`.mcp.json` for Claude Code)

```json
{
  "mcpServers": {
    "cocoindex_code": {
      "command": ".opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc",
      "args": ["mcp"],
      "env": {
        "COCOINDEX_CODE_ROOT_PATH": "."
      },
      "disabled": true
    }
  }
}
```

Set `"disabled": false` to activate. The MCP server is disabled by default to avoid adding search context to sessions that do not need it.

**Environment variables**

| Variable | Default | Description |
|---|---|---|
| `COCOINDEX_CODE_ROOT_PATH` | auto-detected | Override project root for indexing |
| `COCOINDEX_CODE_DIR` | `~/.cocoindex_code` | Override config and data directory |
| `COCOINDEX_CODE_EMBEDDING_MODEL` | `sbert/nomic-ai/CodeRankEmbed` | Override the Stage 1 embedder. Default is nomic CodeRankEmbed per `registered_embedders.py` |
| `COCOINDEX_CODE_DEVICE` | auto-detect (cuda → mps → cpu) | Override compute device. Use `cpu` as kill switch if MPS produces unstable results |
| `COCOINDEX_QUERY_PROMPT_NAME` | from registry | Override cocoindex query-prompt routing |
| `VOYAGE_API_KEY` | (none) | Required only when using Voyage cloud models |

**Root path detection order**

CocoIndex Code resolves the project root in this order:

1. `COCOINDEX_CODE_ROOT_PATH` environment variable
2. Nearest parent with `.cocoindex_code/` directory
3. Nearest parent with a project marker (`.git`, `pyproject.toml`, `package.json`, `Cargo.toml`, `go.mod`)
4. Current working directory

**Changing Stage 1 embedders**

Changing the embedder requires destroying and rebuilding the index. Different embedders produce vectors with incompatible dimensions, and mixing them corrupts results.

```bash
ccc reset
ccc index
```

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

**Example 1: Concept search with filters**

Find TypeScript error handling code in the API layer. Start broad, then add filters to narrow.

```bash
# Broad search first
ccc search "error handling and recovery"

# Add language filter
ccc search "error handling and recovery" --lang typescript

# Scope to a directory
ccc search "error handling and recovery" --lang typescript --path "src/api/" --limit 5
```

**Example 2: Multi-step discovery workflow**

Use semantic search to find candidate files, then verify with Grep and Read.

```bash
# Step 1: Semantic search finds candidate files
ccc search "rate limiting middleware" --lang typescript --limit 5

# Step 2: Grep confirms exact patterns in candidates
grep -rn "rateLimit" src/middleware/

# Step 3: Read the matched file to confirm implementation details
# Use the Read tool on the file path returned by Step 1
```

**Example 3: MCP tool call (agent context)**

An AI agent calls the MCP `search` tool directly. Set `refresh_index` to `false` on follow-up queries within the same session.

```json
{
  "query": "database connection pooling setup",
  "languages": ["python", "typescript"],
  "paths": ["src/db/"],
  "limit": 10,
  "offset": 0,
  "refresh_index": false
}
```

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

**`command not found: ccc`**

What you see: shell reports `ccc: command not found` when running any `ccc` command.

Common causes: The venv binary directory is not on PATH. This is expected after a fresh install.

Fix: Use the full path directly, or add the venv `bin` directory to PATH.

```bash
.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc status
```

---

**Empty search results for reasonable queries**

What you see: `ccc search "authentication middleware"` returns zero results or only low-score matches.

Common causes: The index has not been built yet, the index is stale after a large refactor, or the query is too specific for the embedding model to match.

Fix: Run `doctor.sh` first to check index health, then rebuild if needed.

```bash
bash .opencode/skills/mcp-coco-index/scripts/doctor.sh --strict --require-config
ccc index
```

If results are still poor, rephrase the query. Use shorter, concept-focused phrases (3-5 words) rather than long keyword lists.

---

**`ComponentContext` errors on concurrent MCP queries**

What you see: MCP search tool returns a `ComponentContext` error when multiple queries fire with `refresh_index=true` at the same time.

Common causes: The daemon has a known concurrency issue when multiple simultaneous requests each trigger a refresh.

Fix: Keep normal searches on the default `refresh_index=false` path. Use `cocoindex_refresh_index` before the search batch when code changed.

```json
{ "query": "your query" }
```

---

**Stale results after a branch switch or large merge**

What you see: Search returns files or code that no longer exist, or misses recently added implementations.

Common causes: The index reflects the previous state of the codebase. Incremental indexing tracks file changes but does not automatically detect branch switches.

Fix: Run `ccc index` to update the index. For a clean rebuild after major structural changes, reset first.

```bash
ccc reset
ccc index
```

---

**Stage 1 embedder mismatch after changing `global_settings.yml`**

What you see: Search returns no results or errors about vector dimension incompatibility after switching the embedder.

Common causes: The existing index was built with a different embedder and the vector dimensions do not match the new embedder.

Fix: Reset the index and rebuild with the new embedder.

```bash
ccc reset
ccc index
```

---

**Python version error during install**

What you see: `install.sh` fails with a message about Python version requirements.

Common causes: CocoIndex Code requires Python 3.11 or later. The system Python may be an older version.

Fix: Install Python 3.11+ and re-run the install script.

```bash
python3 --version
bash .opencode/skills/mcp-coco-index/scripts/install.sh
```

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->
## 8. FAQ

**Q: Why does CocoIndex Code expose fewer MCP tools than the CLI has commands?**

A: Index lifecycle operations (`index`, `status`, `reset`, `init`, `daemon`) are intended for human-initiated workflows. An agent asking to reset a codebase index would be a destructive action with no confirmation step. The MCP interface exposes `search` plus a bounded `cocoindex_refresh_index` hook so agent searches stay predictable while refresh remains explicit. Run broader index management commands from a terminal.

---

**Q: When should I switch from the default embedder?**

A: The default embedder (`nomic-ai/CodeRankEmbed`, 768 dimensions) provides strong code search quality out of the box and runs locally with no API key. Switch to `voyage/voyage-code-3` (1024d cloud via LiteLLM) when you want higher-dimensional cloud embeddings and have a `VOYAGE_API_KEY`. Voyage Code 3 was trained specifically on code and can give better discrimination on nuanced queries, but adds an API dependency. Switching embedders requires `ccc reset && ccc index` because vector dimensions are incompatible.

---

**Q: How often should I reindex?**

A: The daemon handles incremental updates when refresh is requested. Run `ccc index` manually after major structural changes: branch switches, large merges, or significant refactors. For day-to-day agent workflows, call `cocoindex_refresh_index` after code changes, or use `search(refresh_index=true)` for a backward-compatible one-shot refresh before search. CLI users can pass `--refresh`.

---

**Q: What is the difference between `doctor.sh` and `ensure_ready.sh`?**

A: `doctor.sh` is read-only. It inspects the environment, reports what is working and what is not, and exits with a non-zero code if any check fails. It never modifies anything. `ensure_ready.sh` is idempotent and takes action: it installs the binary if missing, initializes the project if not yet initialized, and optionally refreshes the index. Use `doctor.sh` for diagnostics and CI gates. Use `ensure_ready.sh` to bring a machine to a ready state.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

**This skill**

| Document | Purpose |
|---|---|
| [SKILL.md](SKILL.md) | AI agent instructions, routing logic, rules, and integration points |
| [INSTALL_GUIDE.md](INSTALL_GUIDE.md) | Installation and initial setup walkthrough |
| [references/tool_reference.md](references/tool_reference.md) | Complete CLI and MCP parameter reference |
| [references/search_patterns.md](references/search_patterns.md) | Query writing strategies and filter examples |
| [references/cross_cli_playbook.md](references/cross_cli_playbook.md) | Safe defaults for multi-query and cross-CLI sessions |
| [references/settings_reference.md](references/settings_reference.md) | Embedding model switching and daemon configuration |
| [assets/config_templates.md](assets/config_templates.md) | MCP server configuration examples |
| [scripts/install.sh](scripts/install.sh) | Install CocoIndex Code |
| [scripts/doctor.sh](scripts/doctor.sh) | Read-only health check |
| [scripts/ensure_ready.sh](scripts/ensure_ready.sh) | Idempotent bootstrap |

**Related skills**

| Skill | Purpose | Relationship |
|---|---|---|
| [system-spec-kit](../system-spec-kit/SKILL.md) | Context preservation and memory | Complementary: semantic memory vs. semantic code search |
| [mcp-code-mode](../mcp-code-mode/SKILL.md) | External tool integration via MCP | Peer MCP skill with a different purpose |

**External resources**

| Resource | URL |
|---|---|
| CocoIndex GitHub | https://github.com/cocoindex-io/cocoindex |
| CocoIndex Code on PyPI | https://pypi.org/project/cocoindex-code/ |
| EmbeddingGemma 300M on HuggingFace | https://huggingface.co/google/embeddinggemma-300m |
| sqlite-vec | https://github.com/asg017/sqlite-vec |

<!-- /ANCHOR:related-documents -->
