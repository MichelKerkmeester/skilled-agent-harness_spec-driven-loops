# Delta Classification

Classification compares local `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/` against upstream `/private/tmp/cocoindex-code-upstream-023F-54653/src/cocoindex_code/`.

| Local File | Upstream Analog | Classification | Rationale |
|------------|-----------------|----------------|-----------|
| `__init__.py` | `__init__.py` | `CONFLICT_RESOLVE` | Entrypoint/version behavior diverged with local fork metadata and upstream hatch-vcs versioning. |
| `__main__.py` | `__main__.py` | `MERGE_UPSTREAM` | Thin launcher; upstream simplification is likely safe during full rebase. |
| `_version.py` | None | `PRESERVE_LOCAL` | Local setuptools fork keeps explicit generated version file. |
| `cli.py` | `cli.py` | `CONFLICT_RESOLVE` | Upstream lazy-load/perf and init param defaults overlap local CLI behavior, but local has fork-specific flags and retrieval diagnostics. |
| `client.py` | `client.py` | `CONFLICT_RESOLVE` | Upstream has daemon warning/dedup behavior; local has concurrency and runtime hardening. |
| `config.py` | None | `PRESERVE_LOCAL` | Local-only config layer for embedder defaults, chunking, hybrid search, rerank, mirrors, and env validation. |
| `daemon.py` | `daemon.py` | `CONFLICT_RESOLVE` | Upstream adds embedder-param resolution and doctor checks; local carries daemon lock/backlog/runtime and retrieval stack integrations. |
| `fts_index.py` | None | `PRESERVE_LOCAL` | Local hybrid FTS5 search surface. |
| `fusion.py` | None | `PRESERVE_LOCAL` | Local RRF fusion implementation. |
| `indexer.py` | `indexer.py` | `CONFLICT_RESOLVE` | Upstream forwards indexing params and uses chunker registry; local adds source realpath, content hash, path class, canonical-resource logic, FTS metadata, and code-aware chunker dispatch. |
| `observability.py` | None | `PRESERVE_LOCAL` | Local retrieval diagnostics and telemetry. |
| `path_utils.py` | None | `PRESERVE_LOCAL` | Local mirror dedup canonicalization. |
| `project.py` | `project.py` | `CONFLICT_RESOLVE` | Upstream has query/index param contexts; local project behavior includes fork-specific schema and metadata expectations. |
| `protocol.py` | `protocol.py` | `CONFLICT_RESOLVE` | Upstream protocol has param/daemon updates; local protocol has retrieval telemetry fields. |
| `query.py` | `query.py` | `PRESERVE_LOCAL` | Local query path owns hybrid FTS/RRF, rerank, path-class boosts, mirror dedup, budget validation, and diagnostics. |
| `query_expansion.py` | None | `PRESERVE_LOCAL` | Local query expansion for hybrid FTS/dense fanout. |
| `registered_embedders.py` | None | `PRESERVE_LOCAL` | Local model metadata and Ollama/local routing registry. |
| `reranker.py` | None | `PRESERVE_LOCAL` | Local cross-encoder rerank abstraction. |
| `rerankers_jina_v3.py` | None | `PRESERVE_LOCAL` | Local Jina reranker integration. |
| `schema.py` | `schema.py` | `CONFLICT_RESOLVE` | Local schema carries fork-specific metadata fields. |
| `search_budget.py` | None | `PRESERVE_LOCAL` | Local safety/routing guard for expensive searches. |
| `server.py` | `server.py` | `CONFLICT_RESOLVE` | Upstream server has settings/init improvements; local MCP server emits fork telemetry and refresh behavior. |
| `settings.py` | `settings.py` | `CONFLICT_RESOLVE` | Upstream adds embedder params, chunkers, path mappings, many default patterns; local intentionally removes docs from defaults and adds canonical-resource paths. |
| `shared.py` | `shared.py` | `CONFLICT_RESOLVE` | Upstream has `INDEXING_EMBED_PARAMS` / `QUERY_EMBED_PARAMS`, `check_embedding`, and LiteLLM pacing; local has registry-driven prompt names and Ollama readiness. |
| `chunkers/__init__.py` | None | `PRESERVE_LOCAL` | Local code-aware chunker package has no upstream analog. |
| `chunkers/code_aware.py` | None | `PRESERVE_LOCAL` | Local grammar-aware chunking is separate from upstream's simple `chunking.py` custom registry. |
| `chunkers/grammars.py` | None | `PRESERVE_LOCAL` | Local tree-sitter grammar registry has no upstream analog; Svelte/Vue upstream change is include-pattern and SDK splitter support. |

## Upstream-Only Import Candidates

| Upstream File | Classification | Import Path |
|---------------|----------------|-------------|
| `_daemon_paths.py` | `MERGE_UPSTREAM` | Phase C or earlier if CLI import cost becomes painful. |
| `chunking.py` | `CONFLICT_RESOLVE` | Map upstream public custom chunker API onto or beside local code-aware chunkers. |
| `embedder_defaults.py` | `MERGE_UPSTREAM` | Phase B for curated `indexing_params/query_params` defaults. |
| `embedder_params.py` | `MERGE_UPSTREAM` | Phase B core import. |
| `litellm_embedder.py` | `CONFLICT_RESOLVE` | Compare with local Ollama/rate-limit path before replacing. |

## Immediate Decisions

- `PRESERVE_LOCAL`: retrieval stack and fork metadata wins.
- `MERGE_UPSTREAM`: embedder params/defaults, Svelte/Vue patterns, selected CLI lazy loading later.
- `CONFLICT_RESOLVE`: daemon, settings, shared, indexer, protocol, and server.
- `OBSOLETE_LOCAL`: local query-only prompt registry is conceptually obsolete once upstream per-side params are imported.
