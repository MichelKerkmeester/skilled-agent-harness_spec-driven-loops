---
title: "Plan: 019/001 declarative registry"
description: "Implementation phases for the embedder catalog module + tests"
trigger_phrases: ["019/001 plan"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/005-declarative-registry"
    last_updated_at: "2026-05-17T20:20:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored implementation phases"
    next_safe_action: "Execute Phase 1"
    blockers: []
    key_files:
      - "cocoindex_code/registered_embedders.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000019001"
      session_id: "019-001-declarative-registry-plan"
      parent_session_id: "019-001-declarative-registry"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: 019/001 declarative registry

<!-- ANCHOR:summary -->
## 1. SUMMARY

Author `cocoindex_code/registered_embedders.py` as a Python module exposing:
- `EmbedderMetadata` dataclass (name, dim, ram_mb, disk_mb, mps_compatible, category, notes, hf_url)
- `MANIFESTS` frozen list of 4-6 vetted candidates
- API: `list_embedders()`, `get_embedder_metadata(name)`, `default_embedder()`

Plus pytest covering schema + default consistency with config.py.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Criteria |
|---|---|
| Coverage | ≥ 4 entries spanning text + code categories |
| Schema | Each entry passes EmbedderMetadata validation |
| Default alignment | `default_embedder().model_name == config._DEFAULT_MODEL` |
| Tests | pytest passes; full CocoIndex suite still 35+ pass |
| Strict-validate | Returns PASSED |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

```
cocoindex_code/
  config.py                       (reads _DEFAULT_MODEL — unchanged)
  registered_embedders.py         (NEW — declarative catalog)
    EmbedderMetadata (dataclass)
    MANIFESTS (frozen list)
    list_embedders()
    get_embedder_metadata(name)
    default_embedder()
tests/
  test_registered_embedders.py    (NEW — schema + default alignment)
```
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Author module
- Define EmbedderMetadata dataclass
- Populate MANIFESTS with 6 candidates: embeddinggemma-300m, jina-embeddings-v2-base-code (default), nomic-ai/CodeRankEmbed, BAAI/bge-code-v1, jinaai/jina-embeddings-v2-base-en, Salesforce/SFR-Embedding-Code-2B_R
- Implement list / get / default API

### Phase 2: Tests
- test_registered_embedders.py: 5-8 cases covering API + schema + default alignment

### Phase 3: Smoke + commit
- pytest run
- Strict-validate
- Commit + push
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Unit: pytest covering registry size + default + schema
- Integration: imported by 019/002's INSTALL_GUIDE generation flow (if any) or hand-quoted in docs
- No daemon needed — pure-Python module
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `cocoindex_code/config.py` (for `_DEFAULT_MODEL` reference)
- 019/002 INSTALL_GUIDE updates depend on this module
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

| Trigger | Action |
|---|---|
| Registry numbers wildly inaccurate | Replace with HF model card-cited numbers + add disclaimer |
| Schema turns out too rigid | Loosen dataclass; mark fields optional with defaults |
| Module unused in practice | Delete in a future cleanup; preserve INSTALL_GUIDE alternatives section in plain markdown |
<!-- /ANCHOR:rollback -->
