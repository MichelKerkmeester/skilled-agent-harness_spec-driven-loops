---
title: "mcp coco index mcp server cocoindex code: Code README"
description: "Code-facing README for .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code."
trigger_phrases:
  - "mcp-coco-index mcp_server/cocoindex_code"
  - "code README"
---

# mcp coco index mcp server cocoindex code

First-party code for this skill area.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

This README documents the code-bearing folder `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code` so operators can understand its role without opening every source file first. It follows the sk-doc skill README structure while staying focused on code navigation.

### Usage

Use this file to identify the folder boundary, the likely verification path, and the local source files that need sk-code conventions. Keep behavior details in source comments and higher-level workflow details in the owning `SKILL.md`.

### Key Statistics

| Metric | Value |
|---|---:|
| Code files | 21 |
| README scope | Direct files in this folder |
| Audit context | Internal validation notes |
| v1.2.0 additions | `fts_index.py`, `fusion.py`, `reranker.py` (opt-in retrieval-quality modules) |
| v1.3.0 additions | `chunkers/` tree-sitter code-aware chunking |

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

**Step 1: Confirm the owner.**

Start with `.opencode/skills/mcp-coco-index/SKILL.md` for runtime routing and workflow boundaries.

**Step 2: Inspect the local code.**

```bash
rg --files .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code
```

Expected result: the command lists the source files summarized below.

**Step 3: Verify changes.**

Load this folder through the owning skill workflow or MCP server entrypoint.

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

| Feature | What It Does |
|---|---|
| Folder boundary | Documents direct code files under `mcp_server/cocoindex_code`. |
| sk-code alignment | Points reviewers at OpenCode naming, header, error-handling, and type-discipline checks. |
| Verification handoff | Records the expected owner and audit packet for follow-up work. |
| Hybrid retrieval (v1.2.0) | `fts_index.py` + `fusion.py` add SQLite FTS5 + RRF fusion (opt-in via `COCOINDEX_HYBRID=1`). |
| Cross-encoder rerank (v1.2.0) | `reranker.py` adds a local GTE multilingual rerank pass (opt-in via `COCOINDEX_RERANK=1`). |
| Mirror-aware dedup (v1.2.1) | `path_utils.py` + `query.py` collapse runtime mirror aliases before rerank, preferring the canonical mirror copy. |
| Code-aware chunking (v1.3.0) | `chunkers/` uses tree-sitter grammars for Python, TypeScript/TSX, JavaScript, Go, Rust, and Java so chunks align with definitions instead of blind line windows. |

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:structure -->
## 4. STRUCTURE

| Path | Purpose |
|---|---|
| `__init__.py` | Package marker for the `cocoindex_code` module. |
| `__main__.py` | Entry point for `python -m cocoindex_code`. |
| `_version.py` | Fork version string (`0.2.3+spec-kit-fork.0.2.0`). |
| `cli.py` | `ccc` CLI command implementations (search, index, status, init, reset, daemon, mcp). |
| `client.py` | Client-side daemon IPC wrapper. |
| `chunkers/` | Tree-sitter grammar registry and `CodeAwareSplitter`; falls back to `RecursiveSplitter` when disabled, unsupported, or parse-invalid. |
| `config.py` | Environment-variable configuration loader; defaults for chunking, hybrid, rerank live here. |
| `daemon.py` | Background daemon that manages projects, indexing, and search IPC. |
| `fts_index.py` | **v1.2.0.** SQLite FTS5 helpers for the lexical channel of hybrid search. |
| `fusion.py` | **v1.2.0.** Reciprocal Rank Fusion (RRF) for combining vector + FTS5 rankings. |
| `indexer.py` | Per-project indexing pipeline: discovery, chunking, embedding, storage. |
| `observability.py` | Structured logging and metrics helpers. |
| `path_utils.py` | Pure helpers for mirror-prefix detection, path-stem extraction, and canonical mirror selection. |
| `project.py` | Per-project state and lifecycle (`ProjectRegistry`). |
| `protocol.py` | Msgpack IPC protocol shared by daemon + client. |
| `query.py` | Search execution: vector query, optional hybrid fusion, optional rerank. |
| `registered_embedders.py` | Vetted embedder registry (jina-code default + alternatives). |
| `reranker.py` | **v1.2.0.** Optional GTE multilingual cross-encoder rerank over top-K candidates. |
| `schema.py` | Result row dataclasses (`QueryResult`, telemetry fields). |
| `server.py` | MCP stdio server exposing `search` + `cocoindex_refresh_index`. |
| `settings.py` | `~/.cocoindex_code/global_settings.yml` and per-project settings loader. |
| `shared.py` | Cross-cutting utilities (path resolution, normalization). |

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

| Setting | Default | Purpose |
|---|---|---|
| sk-code surface | OPENCODE | Applies OpenCode TypeScript, JavaScript, Python, Shell, and config conventions. |
| README scope | Direct folder | This file documents this folder, not sibling folders. |
| `COCOINDEX_CANONICAL_MIRROR` | `.opencode` | Preferred runtime mirror representative when duplicate mirror chunks compete. |
| `COCOINDEX_MIRROR_PREFIXES` | `[".opencode/", ".codex/", ".gemini/", ".claude/"]` | JSON list of runtime mirror prefixes. Set to `[]` to disable mirror collapse. |
| `COCOINDEX_CODE_AWARE_CHUNKING` | `true` | Enables tree-sitter code-aware chunking for supported languages. Set to `false` to restore the pre-015 `RecursiveSplitter` path globally. |
| `COCOINDEX_TREE_SITTER_LANGUAGES` | `{}` | Optional JSON object for adding grammar specs with `module`, `function`, `top_level_node_types`, and `doc_comment_node_types`. |

### Mirror Dedup Behavior

Hybrid query results run a mirror-collapse pass before the existing source-realpath/content-hash dedup. When several runtime mirror paths represent the same chunk, the query keeps the configured canonical mirror copy, defaulting to `.opencode/`. If the canonical copy is absent, the first ranked mirror copy is kept. Non-mirror same-stem files are preserved, and the existing line-range dedup still runs afterward.

### Code-Aware Chunking

Supported code files route through `CodeAwareSplitter` before embedding. The splitter parses the file with tree-sitter, emits chunks for top-level definitions, includes immediately preceding doc comments, and uses `RecursiveSplitter` inside any single definition larger than `2 * COCOINDEX_CODE_CHUNK_SIZE`.

Unsupported languages, parse errors, and `COCOINDEX_CODE_AWARE_CHUNKING=false` use the pre-015 `RecursiveSplitter` path unchanged. Because chunk boundaries change, switching this flag on or off requires `ccc reset --force && ccc index` before comparing retrieval results.

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

**Audit this folder**

```text
User request: Check .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code for sk-code and README coverage.
Skill routing: sk-code plus sk-doc.
Expected output: Findings recorded in the 026 audit report.
```

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

| What You See | Cause | Fix |
|---|---|---|
| README appears stale | Source files changed after this audit | Refresh the structure table and rerun the 026 audit check. |
| Verification command is unclear | Folder is a helper boundary | Use the nearest package or skill-level verification command. |

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:related-documents -->
## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`mcp-coco-index/SKILL.md`](../../SKILL.md) | Runtime instructions for the owning skill. |
| [`sk-code/SKILL.md`](../../../sk-code/SKILL.md) | OpenCode coding standards and verification routing. |
| [`sk-doc skill_readme_template.md`](../../../sk-doc/assets/skill/skill_readme_template.md) | README structure used for this code README. |

<!-- /ANCHOR:related-documents -->
