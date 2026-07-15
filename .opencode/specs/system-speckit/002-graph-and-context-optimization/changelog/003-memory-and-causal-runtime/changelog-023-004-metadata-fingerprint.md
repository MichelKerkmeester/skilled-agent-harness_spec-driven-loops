---
title: "023A1 Metadata Fingerprint: Durable Compatibility Contract for mcp-coco-index"
description: "Indexing now writes index_meta.json with embedder, prompt, dimension, chunking, corpus plus reranker metadata. Daemon and query paths compare it before search and hard-refuse unsafe mismatches rather than returning semantically invalid results."
trigger_phrases:
  - "023A1 metadata fingerprint"
  - "index_meta compatibility"
  - "prompt policy invariant"
  - "embedder hard refusal"
  - "daemon project metadata isolation"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-19

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/004-metadata-fingerprint` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots`

### Summary

The mcp-coco-index fork supported multiple embedders and exposed 023C retrieval fingerprints, but compatibility checks were warning-only. An existing index could be queried with a different model, vector dimension, query prompt, document prompt or corpus root with no refusal. In a multi-project daemon, one loaded embedder could be reused across project contexts even when the runtime fingerprint changed, silently corrupting retrieval results.

023A1 turns that warning-only fingerprint into a durable compatibility contract. Indexing now writes `index_meta.json` with schema, embedder name, provider, dimension, query and document prompt names, chunking policy, corpus root, reranker, RRF flags plus version fields. Daemon and query paths compare the stored metadata before every search. Hard incompatibilities (schema version, embedder, provider, dimension, prompt, corpus root, mirror dedup preference) now refuse search with a structured error instead of returning semantically invalid vectors. Soft warnings cover chunking and reranker drift that does not invalidate the dense space. Fifteen open findings from the 023 deep-research arc were closed. A backfill CLI handles existing indexes built before this contract.

### Added

- `cocoindex_code/index_metadata.py` with `IndexMetadata` schema, `IndexCompatibility` severity tiers, atomic read/write helpers plus a backfill CLI entrypoint
- Upstream-style `indexing_params` and `query_params` fields on embedder registry entries in `registered_embedders.py`
- Query prompt and document prompt context keys in `shared.py` to prevent daemon-level globals from leaking across projects
- Per-project metadata cache and effective config hash recompute path in `daemon.py`
- Structured hard-refusal error payloads and additive fingerprint fields in `protocol.py`
- `tests/test_index_metadata.py`, `tests/test_multi_project_daemon.py` plus `tests/test_prompt_policy_contract.py` covering persisted fields, hard refusals, soft warnings, schema refusal, atomic write plus cross-project isolation

### Changed

- `registered_embedders.py`: prompt policy moved from ad-hoc inline values to upstream-style `indexing_params` and `query_params` per embedder entry
- `indexer.py`: document prompt now applied at index time using the embedder's `indexing_params`
- `query.py`: metadata compatibility check runs before every real project search and query prompt is resolved from `query_params`
- `daemon.py`: per-project embedder instances now keyed by effective config hash rather than shared globally
- `config.py`: model validation and commercial-safe checks now route through registry accessors
- `cli.py`: registry contract doctor check added to the diagnostic surface

### Fixed

- Search returned semantically invalid results when the index was built with a different embedder or dimension than the current runtime. Hard refusal on `HARD_REFUSE` tier mismatches closes the correctness gap.
- Multi-project daemon reused a single loaded embedder across projects when the effective config hash changed. Per-project metadata caching and hash-keyed recompute isolates each project.
- Query and document prompts were applied inconsistently or not at all when embedder entries lacked explicit prompt fields. Moving prompt ownership into the registry with upstream-style params closes the gap.
- Existing indexes missing `index_meta.json` could be queried without any compatibility check. Backfill CLI and hard-refuse on missing metadata provide a migration path.

### Verification

| Check | Result |
|-------|--------|
| `.venv/bin/python -m pytest tests/test_index_metadata.py tests/test_multi_project_daemon.py tests/test_prompt_policy_contract.py tests/test_fingerprint.py -q` | PASS. 16 passed in 0.59s |
| `.venv/bin/ruff check cocoindex_code tests` | PASS. All checks passed |
| `.venv/bin/python -m pytest tests/ -q` | PASS. 216 passed in 17.91s |
| Findings closure: 15 HIGH and MED findings from the 023 deep-research arc | All 15 closed or explicitly routed. FINDING-014-B and MED FINDING-001-A routed to 023B fixture work. |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/index_metadata.py` (NEW) | Metadata schema, compatibility tiers, atomic read/write helpers, backfill CLI entrypoint. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py` | Upstream-style `indexing_params` and `query_params` added to each embedder entry. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py` | Query and document prompt resolution and context keys added. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py` | Document prompt applied at index time and metadata written after chunk embedding. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py` | Metadata compatibility check runs before search and query prompt resolved from context keys. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py` | Per-project metadata cache and hash-keyed embedder recompute. Structured hard-refusal error returns. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py` | Additive fingerprint fields and structured error detail payloads. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | Registry accessor calls replace inline model validation and commercial-safe checks. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py` | Registry contract doctor check added. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py` | Settings fields for upstream-style per-side params added. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/observability.py` | Reranker license now read through registry accessors. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_index_metadata.py` (NEW) | Persisted fields, hard refusals, soft warnings, schema refusal, atomic write coverage. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_multi_project_daemon.py` (NEW) | Per-project metadata isolation and cross-project embedder hash coverage. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_prompt_policy_contract.py` (NEW) | Document and query prompt policy contract tests. |

### Follow-Ups

- Existing indexes without metadata must be backfilled via `python -m cocoindex_code.index_metadata --backfill <project>` before search will succeed.
- Full upstream `embedder_params.py` vendoring is out of scope for this packet. The local shape import keeps broader rebase work separate.
- Fixture expansion and architecture-invariant probes remain owned by 023B.
