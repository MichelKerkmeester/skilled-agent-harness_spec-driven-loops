# Phased Rebase Plan

## Phase A - Dependency Version Bump

Scope: `pyproject.toml`, local `.venv`, and tests.

Code-touch surface:

- `cocoindex[litellm]` pin currently `==1.0.0a33`.
- Upstream `cocoindex-code` uses `cocoindex[litellm]>=1.0.6,<1.1.0`.
- `sentence-transformers==5.4.1` was pinned in 023F; no runtime upgrade.

Test impact:

- Run full `.venv/bin/python -m pytest tests/ -q`.
- Run ruff.
- Add compatibility smoke if CocoIndex stable changes context key, sqlite table, splitter, or embedder APIs.

Migration risk:

- Medium. Upstream crossed prerelease-to-stable SDK APIs after the local fork added custom metadata and retrieval surfaces.
- Local code imports `cocoindex.resources.*`, `sqlite.Vec0TableDef`, `RecursiveSplitter`, and embedder classes directly.

Rollback story:

- Revert dependency pin.
- Reinstall local `.venv` from old constraints.
- No data migration if index is not rebuilt under the new SDK.

023F decision: defer CocoIndex SDK bump. The spike did not prove compatibility, and shipping a stable SDK bump without full-suite evidence would violate the scope.

## Phase B - Import Upstream indexing_params/query_params

Scope: 023A1.

Code-touch surface:

- Add local equivalents of upstream `embedder_params.py` and `embedder_defaults.py`.
- Extend local `EmbeddingSettings` with `indexing_params` and `query_params`.
- Add context keys equivalent to upstream `INDEXING_EMBED_PARAMS` and `QUERY_EMBED_PARAMS`.
- Forward indexing params in `indexer.py` and query params in `query.py`.
- Update daemon doctor checks to test both sides.
- Migrate local `resolve_query_prompt_name()` registry into upstream default/legacy bridge semantics.

Test impact:

- Port upstream tests: `test_embedder_params.py`, `test_embedder_defaults.py`, `test_embed_params_forwarding.py`, and related settings round trips.
- Preserve local tests for Ollama, registered embedders, Jina rerank, hybrid retrieval, and path-class behavior.

Migration risk:

- Medium-high. This overlaps local prompt registry and EmbeddingGemma/CodeRankEmbed behavior.
- Risk is worth taking because upstream already models the correct abstraction.

Rollback story:

- Keep old query prompt registry behind a compatibility helper until tests prove equivalent behavior.
- If import fails, revert the param fields and leave 023A1 prompt-policy work blocked rather than building a parallel local design.

## Phase C - Full Module Rebase

Scope: future work outside this arc.

Code-touch surface:

- All `cocoindex_code/*.py`, possible package layout move to `src/`, tests, Docker, CLI docs, and NOTICE/changelog.
- Decide whether local code-aware chunking becomes an upstream `chunking.py` extension or remains local-only.
- Preserve fork-specific telemetry fields and schema changes explicitly.

Test impact:

- Full local suite plus upstream suite subset.
- E2E daemon and concurrency tests.
- Query quality regression suite for hybrid/RRF/rerank/path-class/mirror behavior.

Migration risk:

- High. `query.py`, `daemon.py`, `settings.py`, `shared.py`, and `indexer.py` have large overlapping edits.
- Full rebase could accidentally erase the retrieval-quality work that motivated the fork.

Rollback story:

- Perform in a dedicated packet/branch with commit slices by surface.
- Keep an escape commit before schema changes.
- Rebuild `.cocoindex_code` indexes after schema/vector compatibility checks only.
