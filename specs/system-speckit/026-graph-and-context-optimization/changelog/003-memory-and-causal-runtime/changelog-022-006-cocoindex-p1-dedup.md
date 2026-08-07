---
title: "022/006 CocoIndex Python Dedup: Chunk-Size and Rerank-Sidecar Default Consolidation"
description: "Two P1 default-duplication sites in CocoIndex Python eliminated. Chunk-size constants moved from indexer.py to config.py canonical source. COCOINDEX_RERANK_VIA_SIDECAR default consolidated to a module-level constant. Three P2 audit over-flags rebutted in spec scope."
trigger_phrases:
  - "cocoindex p1 dedup"
  - "chunk-size consolidation cocoindex"
  - "COCOINDEX_RERANK_VIA_SIDECAR default"
  - "022/006 shipped"
  - "cocoindex hardcoded default remediation"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/006-cocoindex-p1-dedup` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc`

### Summary

CocoIndex Python had two P1 default-duplication sites flagged in the 021 audit. Chunk-size values (`CHUNK_SIZE=1500`, `MIN_CHUNK_SIZE=250`, `CHUNK_OVERLAP=200`) were declared independently in both `indexer/indexer.py` and `config/config.py`, creating a silent drift risk for future bench tuning. The `COCOINDEX_RERANK_VIA_SIDECAR` default `True` was hardcoded in two places: the `Config.from_env` parse call and the `_rerank_via_sidecar_enabled` runtime helper, despite an existing docstring warning that both code paths must read the same default.

Four surgical edits consolidated both sites to single-source constants in `config.py`. A lazy import inside `reranker.py` avoids a circular dependency at module load. Module-level symbol aliases in `indexer.py` preserve all downstream `getattr(config, ...)` call sites without modification. Python syntax checks passed on all three files. Three P2 audit findings were rebutted as over-flags rather than acted on.

### Added

- `_DEFAULT_RERANK_VIA_SIDECAR = True` module-level constant at `config.py:29` with explanatory docstring referencing both consumer call sites

### Changed

- `config/config.py:775`: `_parse_bool_env("COCOINDEX_RERANK_VIA_SIDECAR", True)` replaced with `_parse_bool_env("COCOINDEX_RERANK_VIA_SIDECAR", _DEFAULT_RERANK_VIA_SIDECAR)`
- `indexer/indexer.py:38-40`: three inline constant declarations replaced with `from ..config.config import _DEFAULT_CHUNK_SIZE as CHUNK_SIZE, _DEFAULT_MIN_CHUNK_SIZE as MIN_CHUNK_SIZE, _DEFAULT_CHUNK_OVERLAP as CHUNK_OVERLAP`
- `rerankers/reranker.py`: `_rerank_via_sidecar_enabled` body changed from inline `return True` to a lazy import of `_DEFAULT_RERANK_VIA_SIDECAR` from `config.py`

### Fixed

- Chunk-size values were duplicated between `indexer.py` and `config.py`. Editing one without the other would silently diverge defaults during bench tuning.
- `COCOINDEX_RERANK_VIA_SIDECAR` default was hardcoded in two call sites despite documentation requiring a single source. Both now read the same module-level constant.

### Verification

- `python3 -m py_compile config.py indexer.py reranker.py` exited 0 on all three files.
- `grep -E "^CHUNK_SIZE *=|^MIN_CHUNK_SIZE *=|^CHUNK_OVERLAP *=" indexer.py` returned 0 hits (was 3).
- `grep -rn "_DEFAULT_RERANK_VIA_SIDECAR" cocoindex_code/` returned 4 hits: `config.py:29` declaration, `config.py:775` `Config.from_env` use, `reranker.py:42` lazy import, `reranker.py:46` return.
- Strict packet validation (`validate.sh 006-cocoindex-p1-dedup --strict`) exited 0.
- Audit findings f-iter006-006 (chunk-size dupe) and f-iter006-007 (rerank-via-sidecar dual-default) closed.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `cocoindex_code/config/config.py` | Modified | Added `_DEFAULT_RERANK_VIA_SIDECAR = True` constant at line 29. `Config.from_env` now reads constant instead of inline `True` literal. |
| `cocoindex_code/indexer/indexer.py` | Modified | Inline `CHUNK_SIZE`, `MIN_CHUNK_SIZE`, `CHUNK_OVERLAP` declarations replaced with import aliases from `config.py`. |
| `cocoindex_code/rerankers/reranker.py` | Modified | `_rerank_via_sidecar_enabled` uses lazy import of `_DEFAULT_RERANK_VIA_SIDECAR` instead of inline `return True`. |

### Follow-Ups

- Compiled `.pyc` files under `__pycache__/` may hold stale bytecode. Python regenerates them on next module load, so no manual action is required.
- Lazy import inside `_rerank_via_sidecar_enabled` runs on every call. Overhead is negligible because Python caches the import after the first invocation.
