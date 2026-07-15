---
title: "Implementation Summary: 022/006 CocoIndex Python Dedup"
description: "2 P1 dedups shipped: chunk-size constants + COCOINDEX_RERANK_VIA_SIDECAR default. 3 P2 audit over-flags rebutted in spec scope."
trigger_phrases: ["022/006 shipped"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/006-cocoindex-p1-dedup"
    last_updated_at: "2026-05-23T17:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Phase shipped"
    next_safe_action: "Phase 008 (rerank-sidecar dedup) or 009 (cascade env vars)"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config/config.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer/indexer.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002265"
      session_id: "016-002-022-006-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["2 P1 closed; 3 P2 rebutted"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary: 022/006 CocoIndex Python Dedup

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Complete |
| Shipped | 2026-05-23 |
| Files changed | 3 |
| Tests added | 0 (behavior preserved) |
| Python syntax | exit 0 |
| Audit findings closed | 2 P1 (f-iter006-006, f-iter006-007) + 3 P2 rebutted as over-flags |
| Wall-clock | ~10 min |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

### `cocoindex_code/config/config.py`

- Added `_DEFAULT_RERANK_VIA_SIDECAR = True` at line 29 with explanatory docstring referencing the two consumer code paths (Config.from_env + rerankers/reranker.py).
- Line 775: `_parse_bool_env("COCOINDEX_RERANK_VIA_SIDECAR", True)` → `_parse_bool_env("COCOINDEX_RERANK_VIA_SIDECAR", _DEFAULT_RERANK_VIA_SIDECAR)`.

### `cocoindex_code/indexer/indexer.py`

- Lines 38-40: 3 inline constant declarations → `from ..config.config import _DEFAULT_CHUNK_SIZE as CHUNK_SIZE, _DEFAULT_MIN_CHUNK_SIZE as MIN_CHUNK_SIZE, _DEFAULT_CHUNK_OVERLAP as CHUNK_OVERLAP`. Module-level symbols preserved for downstream `getattr(config, "chunk_size", CHUNK_SIZE)` calls at lines 321-323.

### `cocoindex_code/rerankers/reranker.py`

- `_rerank_via_sidecar_enabled` function body: lazy import `from ..config.config import _DEFAULT_RERANK_VIA_SIDECAR` inside function (avoids module-load circular import); inline `return True` → `return _DEFAULT_RERANK_VIA_SIDECAR`.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

Main-agent direct execution while 004b cli-opencode dispatch ran in background (parallel throughput). ~10 minutes wall-clock.

1. Investigation: confirmed the 2 duplicate sites + verified 3 P2 over-flags.
2. 4 Edit calls applied.
3. Python syntax check exit 0 on all 3 modified files.
4. Ban-list verification: indexer.py inline CHUNK_* constants → 0 hits; canonical constant import-graph traced 4 hits across config.py + reranker.py.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

- **Lazy import in reranker.py** to avoid circular dependency at module load (config.py → embedders → reranker.py chain).
- **`as` alias in indexer.py** preserves the `CHUNK_SIZE` / `MIN_CHUNK_SIZE` / `CHUNK_OVERLAP` symbols so downstream `getattr(config, ..., CHUNK_SIZE)` calls don't need updating.
- **3 P2 over-flags rebutted** rather than acted on: settings.py:87 is an instance-level default (legitimate); rerankers_jina_v3.py:54 model_name param IS used (stored + consumed in _load_model); registered_embedders.py:137-139 historical comment preserves audit trail.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

- `python3 -m py_compile config.py indexer.py reranker.py` → exit 0
- `grep -E "^CHUNK_SIZE *=|^MIN_CHUNK_SIZE *=|^CHUNK_OVERLAP *=" indexer.py` → 0 hits (was 3)
- `grep -rn "_DEFAULT_RERANK_VIA_SIDECAR" cocoindex_code/` → 4 hits (config.py:29 decl, :775 Config.from_env, reranker.py:42 import, :46 return)
- Strict-validate phase 006 → exit 0 (after this doc set + parent metadata update)
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

- Compiled `.pyc` files under `__pycache__/` may still contain old bytecode; Python regenerates on next module load.
- Lazy import inside `_rerank_via_sidecar_enabled` runs every call (negligible overhead since Python caches the import after first call).

### Commit Handoff

Suggested message:

```
fix(022/006): consolidate CocoIndex chunk-size + COCOINDEX_RERANK_VIA_SIDECAR defaults

Closes 2 P1 audit findings from packet 021:
- indexer.py:38-40 + config.py:22-24 chunk-size dupe: indexer.py now imports
  CHUNK_SIZE / MIN_CHUNK_SIZE / CHUNK_OVERLAP from config.py canonical defaults
- config.py:770 + reranker.py:41 COCOINDEX_RERANK_VIA_SIDECAR dual-default:
  new module-level _DEFAULT_RERANK_VIA_SIDECAR constant in config.py;
  reranker.py uses lazy import to avoid circular dependency

3 P2 audit findings rebutted as over-flags (settings.py:87 instance default
is legitimate; rerankers_jina_v3.py:54 param IS used; registered_embedders.py
historical comment preserves audit trail).
```

Explicit paths:

```
.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config/config.py
.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer/indexer.py
.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/006-cocoindex-p1-dedup/
```
<!-- /ANCHOR:limitations -->
