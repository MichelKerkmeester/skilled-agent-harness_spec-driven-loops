---
title: "Implementation Plan: 023A2 Prompt License Registry"
description: "Consolidate CocoIndex prompt and license metadata behind first-class registry fields, accessors, validation, and tests."
trigger_phrases:
  - "023A2 plan"
  - "registry accessors"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/006-prompt-license-registry"
    last_updated_at: "2026-05-19T22:55:00Z"
    last_updated_by: "codex"
    recent_action: "Planned registry consolidation"
    next_safe_action: "Run verification"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registry.py"
    session_dedup:
      fingerprint: "sha256:023a200000000000000000000000000000000000000000000000000000000001"
      session_id: "023-deep-research-arc-blind-spots/006-prompt-license-registry"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 023A2 Prompt License Registry

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3.11 |
| **Framework** | Typer CLI, CocoIndex daemon |
| **Storage** | No data migration |
| **Testing** | pytest, ruff, strict spec validation |

### Overview
The registry becomes the single API for prompt and license metadata. `registered_embedders.py` remains the data owner; `registry.py` is the stable import façade; runtime consumers call accessors instead of reaching into optional metadata helpers.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 023A1 implementation summary read.
- [x] 023D implementation summary read.
- [x] Target files inspected before editing.

### Definition of Done
- [x] Accessors implemented and re-exported.
- [x] Prompt/license consumers routed through accessors.
- [x] Registry self-test wired into daemon and doctor.
- [x] Full pytest, ruff, alignment, and strict validation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Data-owner module plus public façade.

### Key Components
- **`registered_embedders.py`**: Owns immutable embedder/reranker specs and validation.
- **`registry.py`**: Re-exports typed accessors for clean callers.
- **`shared.py`**: Resolves query/document prompts through registry while preserving env overrides.
- **`cli.py` and `daemon.py`**: Run registry validation at operator and startup boundaries.
- **`index_metadata.py` and `observability.py`**: Read reranker license through the registry accessor.

### Data Flow
Model manifests define prompt and license metadata once. Accessors return typed specs or scalar prompt/license values. Runtime layers can still tolerate unknown custom models where the old behavior allowed them, but required accessor calls raise clear `KeyError`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `registered_embedders.py` | Manifest source | Add first-class prompt fields and accessors | `tests/test_registry_accessors.py` |
| `registry.py` | Missing | Add public registry façade | Import/type assertion tests |
| `shared.py` | Prompt resolver | Use prompt accessors under env override | `tests/test_prompt_policy_contract.py` |
| `cli.py` | Doctor checks | Add registry contract check and accessor license reads | `tests/test_doctor.py` |
| `daemon.py` | Startup | Validate registry before serving | Full pytest/import coverage |
| `index_metadata.py` / `observability.py` | License wrappers | Use `rerank_license()` with unknown fallback | Fingerprint tests |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read prior summaries for 023A1 and 023D.
- [x] Inspect registry, prompt resolver, reranker, config, CLI, daemon, and tests.

### Phase 2: Core Implementation
- [x] Add `EmbedderSpec` and `RerankerSpec` aliases.
- [x] Add `embedder_for`, `reranker_for`, `embed_query_prompt`, `embed_document_prompt`, `embedder_license`, and `rerank_license`.
- [x] Add `validate_registry` and call it from daemon startup and doctor.
- [x] Add `cocoindex_code.registry` re-export module.

### Phase 3: Verification
- [x] Add `tests/test_registry_accessors.py`.
- [x] Update doctor tests for the registry check.
- [x] Run focused pytest.
- [x] Run full pytest.
- [x] Run ruff.
- [x] Run alignment verifier.
- [x] Run strict spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Accessor return types, prompt fields, license fields, unknown errors | pytest |
| Contract | No duplicate `_QUERY_PROMPT_MODELS` registry | pytest source scan |
| Regression | Existing prompt and doctor behavior | pytest |
| Static | Python style/lint | ruff |
| Spec | Level 2 packet compliance | validate.sh --strict |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 023A1 | Internal | Shipped | Prompt metadata fields would be missing. |
| 023D | Internal | Shipped | License/commercial-safe fields would be missing. |
| Existing pytest suite | Internal | Available | Required to prove compatibility. |
| Dirty worktree | Environment | Present | Requires strict scope and no revert of user changes. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Import cycle, daemon startup failure, or prompt behavior regression.
- **Procedure**: Revert the 023A2 changes in registry, shared, config, CLI, daemon, metadata wrappers, tests, and packet docs. No index data migration is required.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Prior packet confirmation -> Registry API -> Consumer migration -> Tests -> Verification
```

| Phase | Depends On | Unblocks |
|-------|------------|----------|
| Setup | User packet prompt | Registry API |
| Registry API | Prior packet fields | Consumer migration |
| Consumer migration | Accessors | Tests |
| Verification | Tests and docs | Sentinel |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.5 hour |
| Core Implementation | Medium | 1.5 hours |
| Verification | Medium | 1 hour |
| Documentation | Low | 0.5 hour |
| **Total** | | **3.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- Confirm `pytest tests/test_registry_accessors.py tests/test_prompt_policy_contract.py tests/test_doctor.py -q` passes.
- Confirm daemon import/startup code can import `registry.py` without cycles.

### Runtime Rollback
- No runtime flag required; revert code if registry validation blocks startup unexpectedly.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Revert code/docs only.
<!-- /ANCHOR:enhanced-rollback -->
