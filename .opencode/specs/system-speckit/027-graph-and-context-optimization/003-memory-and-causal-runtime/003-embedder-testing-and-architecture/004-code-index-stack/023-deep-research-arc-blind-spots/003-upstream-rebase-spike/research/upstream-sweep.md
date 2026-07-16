# Upstream Sweep

## Summary

The direct upstream repo exists at `https://github.com/cocoindex-io/cocoindex-code`. The main SDK repo path requested in the prompt, `python/cocoindex/code`, returns 404 at HEAD; the main SDK still matters for splitter/language support under `python/cocoindex/ops/text.py` and Rust `ops_text`.

Evidence commands:

- `gh api 'repos/cocoindex-io/cocoindex-code/releases?per_page=60'`
- `gh api repos/cocoindex-io/cocoindex-code/contents/src/cocoindex_code`
- `gh api repos/cocoindex-io/cocoindex-code/contents/tests`
- `gh api repos/cocoindex-io/cocoindex/contents/python/cocoindex/code`
- `gh search code 'svelte repo:cocoindex-io/cocoindex' --limit 20`
- `gh search code 'vue repo:cocoindex-io/cocoindex' --limit 20`
- Read-only clone: `/private/tmp/cocoindex-code-upstream-023F-54653`

## Releases Since v0.2.3

| Release | Published | Relevant Notes |
|---------|-----------|----------------|
| v0.2.4 | 2026-03-19 | Windows daemon console fix; dedicated daemon connection for background MCP indexing; CocoIndex dep upgrade. |
| v0.2.5 | 2026-03-20 | CLI-daemon connection simplification; restart on version mismatch; load-time indexing trigger fix; project-level operation refactor. |
| v0.2.6 | 2026-03-21 | Added `ccc doctor`; upgraded CocoIndex. |
| v0.2.7 | 2026-03-21 | README/skill docs; setting-file issues handled more gracefully. |
| v0.2.8 | 2026-03-22 | Contributing/precommit docs; `COCOINDEX_CODE_DB_PATH_MAPPING`. |
| v0.2.9 | 2026-03-24 | Settings helper path consolidation; pluggable chunker registry; missing file extensions added. |
| v0.2.10 | 2026-03-24 | Docker support; CocoIndex bumped to `1.0.0a38`. |
| v0.2.11 | 2026-04-06 | LiteLLM rate limiter. |
| v0.2.22 | 2026-04-09 | Daemon path helpers extracted to avoid CLI importing CocoIndex; CocoIndex bumped to `1.0.0a43`. Public tags jump from `v0.2.11` to `v0.2.22`. |
| v0.2.23 | 2026-04-14 | Made `sentence-transformers` optional; interactive `ccc init`. |
| v0.2.24 | 2026-04-14 | Docker workspace mount and supervised daemon; docs updates. |
| v0.2.25 | 2026-04-14 | Docker image build from local source; test dispatch. |
| v0.2.26 | 2026-04-15 | Multi-arch Docker images; slim/full variants; cache-friendly Docker layers. |
| v0.2.27 | 2026-04-15 | Registry-backed BuildKit cache. |
| v0.2.28 | 2026-04-22 | CocoIndex `1.0.0` stable; LiteLLM `encoding_format="float"` forwarding. |
| v0.2.29 | 2026-04-24 | Dropped prerelease install flags; removed unused `shared.embedder` global; added configurable `indexing_params/query_params` and curated defaults. |
| v0.2.30 | 2026-04-25 | Dropped `dimensions` knob; passed indexing kwargs into LiteLLM constructor. |
| v0.2.31 | 2026-04-27 | Skipped `encoding_format="float"` for Voyage/Bedrock. |
| v0.2.32 | 2026-05-05 | Added Svelte and Vue support; docs updates. |
| v0.2.33 | 2026-05-08 | Lazy-loaded server, pathspec, and protocol imports for CLI performance. |

No public `cocoindex-code` releases exist for `v0.2.12` through `v0.2.21`; Git tags confirm the same gap.

## Upstream Structure at HEAD

Upstream `src/cocoindex_code` contains:

- `__init__.py`, `__main__.py`
- `_daemon_paths.py`
- `chunking.py`
- `cli.py`, `client.py`, `daemon.py`, `server.py`, `protocol.py`
- `embedder_defaults.py`, `embedder_params.py`, `litellm_embedder.py`
- `indexer.py`, `project.py`, `query.py`, `schema.py`, `settings.py`, `shared.py`

Upstream tests include focused coverage for settings, protocol, daemon, e2e, chunker registry, client, LiteLLM embedder, embedder params, embedder defaults, shared helpers, and Docker e2e. Upstream has explicit tests for rejecting `dimensions`, forwarding indexing/query params, default param lookup, and Svelte/Vue language support via the main SDK tests.

## indexing_params / query_params API

Upstream adds `EmbeddingSettings.indexing_params` and `EmbeddingSettings.query_params` as optional dictionaries. Missing means unset; `{}` means explicit empty and suppresses the legacy bridge.

Accepted keys:

- `sentence-transformers`: `prompt_name`
- `litellm`: `input_type`

Rejected keys include `dimensions`, `normalize_embeddings`, and `encoding_format`. Runtime resolution lives in `embedder_params.py`; curated defaults live in `embedder_defaults.py`; forwarding happens through daemon/project/indexer/query/shared.

This likely obsoletes a local custom prompt-policy abstraction. The upstream API is narrower and better aligned with actual provider call surfaces.

## Dimensions Knob Removal

Upstream `v0.2.30` removed a per-side dimensions knob. `tests/test_embedder_params.py` rejects `dimensions`, and README states dimensions are model-wide because indexing and query vectors must have identical shape.

## Language Support

Upstream `cocoindex-code` `v0.2.32` added `**/*.svelte` and `**/*.vue` include patterns. Main SDK code search shows Svelte/Vue tree-sitter support in `rust/ops_text/src/prog_langs.rs`, docs entries, Cargo deps, and Python `detect_code_language` tests.

Local scoped import: add Svelte/Vue default include patterns. No upstream analog exists for local `chunkers/grammars.py`.

## Contradictions to Local Assumptions

- Local query-prompt registry is too narrow: upstream supports both document and query side params.
- Local should not add a per-side dimension setting.
- Local should not assume code-language expansion must live in its custom grammar registry.
- Local package dependency is no longer tracking upstream: upstream uses stable `cocoindex[litellm]>=1.0.6,<1.1.0`; local still pins `1.0.0a33`.
