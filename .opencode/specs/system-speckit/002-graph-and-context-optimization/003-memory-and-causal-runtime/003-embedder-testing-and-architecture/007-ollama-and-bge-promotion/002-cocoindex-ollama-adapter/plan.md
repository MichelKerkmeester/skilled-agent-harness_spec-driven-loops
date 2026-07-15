---
title: "Implementation Plan: CocoIndex Ollama Adapter"
description: "Add a registered Ollama embedder to CocoIndex and route it through the existing LiteLLM embedder factory. Keep sentence-transformers as the default path while adding daemon readiness checks, tests, and operator docs."
trigger_phrases:
  - "cocoindex ollama adapter plan"
  - "ollama embedder registry plan"
  - "litellm ollama routing plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/007-ollama-and-bge-promotion/002-cocoindex-ollama-adapter"
    last_updated_at: "2026-05-18T17:41:16Z"
    last_updated_by: "codex"
    recent_action: "Documented adapter implementation plan"
    next_safe_action: "Run targeted tests and strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "codex-2026-05-18-cocoindex-ollama-adapter"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "LiteLLM is available through the declared cocoindex[litellm] dependency."
---
# Implementation Plan: CocoIndex Ollama Adapter

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3.11, Markdown |
| **Framework** | CocoIndex Code soft fork, LiteLLM embedder path |
| **Storage** | SQLite vec0 index, unchanged |
| **Testing** | pytest targeted tests, Python compile checks, spec validation |

### Overview

This packet verifies that CocoIndex already depends on `cocoindex[litellm]` and already builds `LiteLLMEmbedder` for non-sentence-transformer providers. The implementation keeps that path, registers `ollama/nomic-embed-text`, and adds a daemon/model readiness gate before indexing starts.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in `spec.md`.
- [x] Success criteria measurable through registry, routing, docs, and tests.
- [x] Dependencies identified: `cocoindex[litellm]` is declared in `pyproject.toml`.

### Definition of Done
- [x] `ollama/nomic-embed-text` is registered with metadata and daemon flag.
- [x] Factory routes Ollama through LiteLLM with clear daemon/model failures.
- [x] Tests and docs cover the Ollama route.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Registry-gated provider extension.

### Key Components
- **Registry**: `registered_embedders.py` owns vetted model metadata and daemon requirements.
- **Factory**: `shared.py` creates either a sentence-transformers embedder or a LiteLLM embedder.
- **Configuration**: `config.py` accepts only names present in the registry.
- **Documentation**: `INSTALL_GUIDE.md` and `feature_catalog/` explain operator setup.

### Data Flow

The operator selects `ollama/nomic-embed-text` through `COCOINDEX_CODE_EMBEDDING_MODEL` or `global_settings.yml`. The registry validates the name, `shared.py` checks Ollama `/api/tags`, then CocoIndex calls LiteLLM for embeddings during indexing and query embedding.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Embedder registry | Defines allowed model names and metadata | Add daemon flag and Ollama manifest | `tests/test_registered_embedders.py` |
| Embedder factory | Creates sentence-transformers or LiteLLM embedder | Add Ollama readiness check before LiteLLM construction | `tests/test_ollama_routing.py` |
| Env config | Falls back on unknown model names | Accept Ollama via manifest lookup | `tests/test_config.py` |
| Operator docs | Explains model swaps | Add Ollama setup and catalog entry | `INSTALL_GUIDE.md`, `feature_catalog/` |

Producer inventory: `rg -n "litellm|LiteLLMEmbedder|COCOINDEX_CODE_EMBEDDING_MODEL|registered_embedders" .opencode/skills/mcp-coco-index/mcp_server`.
Consumer inventory: `rg -n "requires_ollama_daemon|ollama/nomic-embed-text|_ensure_ollama_daemon_ready" .opencode/skills/mcp-coco-index`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read packet scope and implementation files.
- [x] Verify LiteLLM dependency and current factory path.
- [x] Inspect mk-spec-memory Ollama adapter for readiness behavior.

### Phase 2: Core Implementation
- [x] Add `requires_ollama_daemon` to registry metadata.
- [x] Register `ollama/nomic-embed-text`.
- [x] Add Ollama daemon/model readiness gate in the LiteLLM factory path.
- [x] Add tests for registry, config, and mocked LiteLLM routing.

### Phase 3: Verification
- [x] Update install guide and feature catalog.
- [x] Run targeted pytest coverage.
- [x] Run strict spec validation after packet docs are complete.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Ollama tag parsing, registry metadata, config acceptance | pytest |
| Integration-light | LiteLLM call site with mocked `litellm.aembedding` | pytest |
| Syntax | Changed Python modules and tests | `compileall` |
| Manual | Ollama daemon smoke check | `curl /api/tags`, optional `ccc index` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `cocoindex[litellm]==1.0.0a33` | Python package extra | Green | LiteLLM path is importable in the existing venv. |
| Ollama daemon | Local service | Optional for unit tests, required for live smoke | Live indexing fails fast until daemon and model are available. |
| `nomic-embed-text` model | Local Ollama model | Required for live smoke | Operator must run `ollama pull nomic-embed-text`. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Ollama route breaks default indexing or introduces daemon checks for non-Ollama providers.
- **Procedure**: Revert the scoped changes to `shared.py`, `registered_embedders.py`, Ollama tests, and docs. Existing `sbert/` manifests and sentence-transformers path are otherwise unchanged.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | Commit handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 30-45 minutes |
| Core Implementation | Medium | 1-2 hours |
| Verification | Medium | 45-60 minutes |
| **Total** | | **2-4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Default sbert path unchanged.
- [x] Ollama route covered by mocked tests.
- [x] Operator docs updated.

### Rollback Procedure
1. Revert the scoped files listed in `implementation-summary.md`.
2. Restart any CocoIndex daemon using the changed checkout.
3. Run targeted config and registry tests.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Remove any Ollama-built `.cocoindex_code/` index and rebuild with the desired embedder.
<!-- /ANCHOR:enhanced-rollback -->
