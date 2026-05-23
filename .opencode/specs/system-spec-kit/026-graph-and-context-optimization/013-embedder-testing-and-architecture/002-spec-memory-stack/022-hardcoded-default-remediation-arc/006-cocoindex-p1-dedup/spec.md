---
title: "Spec: 022/006 CocoIndex Python Dedup"
description: "2 dedups: chunk-size constants (3 values) consolidated from indexer.py + config.py to single source in config.py; COCOINDEX_RERANK_VIA_SIDECAR default consolidated to module-level _DEFAULT_RERANK_VIA_SIDECAR constant. Closes 2 P1 audit findings."
trigger_phrases: ["022/006 cocoindex dedup", "chunk-size consolidation"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/006-cocoindex-p1-dedup"
    last_updated_at: "2026-05-23T17:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Phase 006 shipped"
    next_safe_action: "Phase 008 + 009 + 010 (main-agent) while 004b dispatch continues background"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config/config.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer/indexer.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002261"
      session_id: "016-002-022-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["P2 settings.py:87 EmbeddingSettings provider=litellm default left untouched (instance-level default, not drift); P2 rerankers_jina_v3.py:54 model_name param verified IN USE (stored as self.model_name + consumed in _load_model), not unused — audit over-flag"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Spec: 022/006 CocoIndex Python Dedup

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Complete |
| Files changed | 3 (config.py + indexer.py + reranker.py) |
| Audit findings closed | 2 P1 (f-iter006-006 chunk-size dupe, f-iter006-007 rerank-via-sidecar dual-default) |
| Wall-clock | ~15 min |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

CocoIndex Python had 2 P1 default-duplication sites:
1. `CHUNK_SIZE=1500, MIN_CHUNK_SIZE=250, CHUNK_OVERLAP=200` declared in BOTH `indexer/indexer.py:38-40` AND `config/config.py:22-24`. Risk: edit one, miss the other; future bench tuning would diverge.
2. `COCOINDEX_RERANK_VIA_SIDECAR` default `True` hardcoded in BOTH `config/config.py:770` (in `Config.from_env`) AND `rerankers/reranker.py:41` (in `_rerank_via_sidecar_enabled` runtime helper). Docstring already documented "Both code paths must read the same default" — but the literal default itself was the duplicate.

Purpose: consolidate to single source in config.py; downstream imports.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add `_DEFAULT_RERANK_VIA_SIDECAR = True` module-level constant in `config/config.py` (line 29) with explanatory docstring.
- Replace inline `True` literal in `Config.from_env` `_parse_bool_env("COCOINDEX_RERANK_VIA_SIDECAR", True)` → use new constant.
- Replace inline `True` return in `rerankers/reranker.py:_rerank_via_sidecar_enabled` → use new constant (imported lazily inside function to avoid circular import at module load).
- Replace `CHUNK_SIZE=1500, MIN_CHUNK_SIZE=250, CHUNK_OVERLAP=200` inline declarations in `indexer/indexer.py:38-40` with `from ..config.config import _DEFAULT_CHUNK_SIZE as CHUNK_SIZE, _DEFAULT_MIN_CHUNK_SIZE as MIN_CHUNK_SIZE, _DEFAULT_CHUNK_OVERLAP as CHUNK_OVERLAP`.

### Out of Scope (P2 informational only)

- `config/settings.py:87` `EmbeddingSettings.provider = "litellm"` instance-level default — kept; per-instance defaults are legitimate non-drift.
- `rerankers/rerankers_jina_v3.py:54` `model_name: str = "jinaai/jina-reranker-v3"` constructor default — kept; parameter IS used (`self.model_name = model_name` then consumed in `_load_model`). Audit over-flag.
- `registered_embedders.py:137-139` "Former default" historical comment — kept; preserves audit trail.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Verification |
|---|---|---|
| R1 | `indexer.py` no longer has inline `CHUNK_SIZE = 1500` / `MIN_CHUNK_SIZE = 250` / `CHUNK_OVERLAP = 200` | `grep -E "^CHUNK_SIZE *=\|^MIN_CHUNK_SIZE *=\|^CHUNK_OVERLAP *=" indexer.py` → 0 hits |
| R2 | `config.py` has `_DEFAULT_RERANK_VIA_SIDECAR = True` at module level | `grep "_DEFAULT_RERANK_VIA_SIDECAR = True" config.py` → 1 hit |
| R3 | `Config.from_env` uses the new constant (not inline `True`) | `grep "_DEFAULT_RERANK_VIA_SIDECAR" config.py` → 2 hits (declaration + use) |
| R4 | `reranker.py` imports the new constant via lazy import | `grep "_DEFAULT_RERANK_VIA_SIDECAR" reranker.py` → 2 hits |
| R5 | Python syntax check exit 0 across all 3 modified files | `python3 -m py_compile config.py indexer.py reranker.py` |
| R6 | Strict-validate phase → exit 0 | `bash validate.sh 006-cocoindex-p1-dedup --strict` |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- R1–R6 pass
- 2 P1 audit findings closed; 3 P2 over-flagged findings rebutted in spec
- Parent arc graph-metadata.json updated
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:approach -->
## 6. APPROACH

Main-agent direct Edit. 4 Edits applied. Python syntax verified. Below cli-X dispatch ROI.
<!-- /ANCHOR:approach -->

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Risk | Mitigation |
|---|---|
| Circular import between config/config.py and rerankers/reranker.py | reranker.py uses lazy `from ..config.config import` inside function body, not at module load |
| Indexer module reference to CHUNK_SIZE breaks downstream | `as` alias preserves original symbol; downstream `getattr(config, "chunk_size", CHUNK_SIZE)` calls unchanged |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- None. P2 rebuttals documented inline.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:cross-links -->
## 9. CROSS-LINKS

- Parent arc: `../spec.md`
- Audit: `../../021-hardcoded-default-audit-deep-research/research/research.md` f-iter006-006, f-iter006-007
- Predecessor: phase 004a (shipped)
- Sibling-in-flight: phase 004b (cli-opencode background dispatch)
<!-- /ANCHOR:cross-links -->

<!-- ANCHOR:nfr -->
## 10. NON-FUNCTIONAL REQUIREMENTS

- Behavior preserved (same default values)
- No new dependencies
- Lazy import in reranker.py preserves cold-start performance
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 11. EDGE CASES

- Indexer.py:321-323 `getattr(config, "chunk_size", CHUNK_SIZE)` references — work unchanged because `CHUNK_SIZE` symbol exists (now imported alias).
- Other `Config.from_env` env-var parsing in config.py:760-790 still has inline literals (e.g., `commercial_safe_profile = _parse_bool_env(...False)`) — those are single-source, not duplicates; out of scope.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## 12. COMPLEXITY

LEVEL 2 mechanical Python dedup. 4 Edit operations.
<!-- /ANCHOR:complexity -->
