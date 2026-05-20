---
title: "Implementation Plan: 023D Doctor Model Swap UX"
description: "Implement a Typer doctor command, centralized model-license registry metadata, commercial-safe config enforcement, tests, and ADRs."
trigger_phrases:
  - "ccc doctor"
  - "operator preflight"
  - "commercial-safe profile"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/005-doctor-model-swap-ux"
    last_updated_at: "2026-05-19T20:36:58Z"
    last_updated_by: "codex"
    recent_action: "Implemented doctor checks"
    next_safe_action: "Run strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/tests/test_doctor.py"
    session_dedup:
      fingerprint: "sha256:023d000000000000000000000000000000000000000000000000000000000001"
      session_id: "023-deep-research-arc-blind-spots/005-doctor-model-swap-ux"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 023D Doctor Model Swap UX

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3.11 |
| **Framework** | Typer CLI, CocoIndex daemon IPC |
| **Storage** | `.cocoindex_code/index_meta.json` and daemon status fingerprint |
| **Testing** | pytest, ruff |

### Overview
The implementation adds a CLI-owned doctor report while keeping model policy in the registry and config layers. Doctor reads active environment choices, status fingerprint data where available, and local index metadata for chunk counts, then returns deterministic exit codes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented.
- [x] Success criteria measurable.
- [x] Dependencies identified.

### Definition of Done
- [x] Six doctor checks implemented.
- [x] License metadata and config refusal covered by tests.
- [x] ADRs appended.
- [x] Verification commands run and recorded.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
CLI orchestration with shared registry policy and config-load enforcement.

### Key Components
- **Model registry**: Owns embedder/reranker license and commercial-safe metadata.
- **Config loader**: Enforces `COCOINDEX_COMMERCIAL_SAFE_PROFILE` before daemon work proceeds.
- **Doctor command**: Aggregates parity, dependency freshness, license, fingerprint, and cost checks.
- **Index metadata**: Supplies durable fingerprint and chunk-count data for status/cost reporting.

### Data Flow
Doctor resolves active models from environment defaults, queries daemon status if available, falls back to persisted index metadata for chunk counts, and renders text or JSON with a max-severity exit code.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `registered_embedders.py` | Embedder registry only | Add license fields, commercial-safe derivation, and reranker registry | `tests/test_embedder_license.py`, `tests/test_registered_embedders.py` |
| `config.py` | Env parsing and daemon config singleton | Add commercial-safe profile refusal | `tests/test_doctor.py::test_commercial_safe_profile_blocks_jina_v3` |
| `cli.py` | Typer command surface | Add `ccc doctor`, JSON output, exit-code mapping, estimator | `tests/test_doctor.py` |
| `index_metadata.py` / `observability.py` | 023C fingerprint data | Read reranker license from registry, preserve compatibility wrappers | `tests/test_fingerprint.py` |
| Decision record | Governance source | Add ADR-024 through ADR-026 | strict spec validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read target CLI/config/registry/fingerprint surfaces.
- [x] Verify HuggingFace license metadata for active registry models.
- [x] Confirm spec packet path.

### Phase 2: Core Implementation
- [x] Add registry license metadata and commercial-safe derivation.
- [x] Add config-load refusal for commercial-safe profile.
- [x] Implement `ccc doctor` and `estimate_reindex_seconds`.
- [x] Reuse 023C fingerprint metadata instead of creating a duplicate license map.

### Phase 3: Verification
- [x] Add pytest coverage for doctor and license metadata.
- [x] Run targeted pytest.
- [x] Run ruff.
- [x] Run `ccc doctor --json`.
- [x] Run full pytest and ruff.
- [ ] Run strict spec validation and final sentinel.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Registry license fields, commercial-safe boolean, estimator | pytest |
| CLI | Doctor text output, JSON output, rc=0/1/2 | Typer CliRunner |
| Config | Daemon-level profile refusal | pytest |
| Integration | Real local doctor command | `.venv/bin/ccc doctor --json` |
| Static | Python style/lint | ruff |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| HuggingFace model cards/API | External | Green | License annotations could be stale without lookup. |
| PyPI JSON API | External | Optional | Doctor falls back to INFO if unavailable. |
| CocoIndex daemon | Internal | Optional | Fingerprint check skips with INFO if unavailable. |
| Existing 023C fingerprint surface | Internal | Green | Doctor consumes status fingerprint and index metadata. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Doctor blocks expected commercial-safe deployments incorrectly or config import fails for safe models.
- **Procedure**: Revert the packet changes in `cli.py`, `config.py`, `registered_embedders.py`, `index_metadata.py`, `observability.py`, and the two new test files. Operators can unset `COCOINDEX_COMMERCIAL_SAFE_PROFILE` as an immediate runtime rollback.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup -> Core Implementation -> Verification -> Documentation
```

| Phase | Depends On | Unblocks |
|-------|------------|----------|
| Setup | None | Core Implementation |
| Core Implementation | Setup | Verification |
| Verification | Core Implementation | Documentation |
| Documentation | Verification evidence | Strict validation |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.5 hour |
| Core Implementation | Medium | 2-3 hours |
| Verification | Medium | 1 hour |
| Documentation | Low | 0.5 hour |
| **Total** | | **4-5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- Confirm `COCOINDEX_COMMERCIAL_SAFE_PROFILE` is unset or uses a safe reranker before production daemon startup.
- Keep the existing `.cocoindex_code` directory until any model swap validates.

### Runtime Rollback
- Unset `COCOINDEX_COMMERCIAL_SAFE_PROFILE` to bypass profile enforcement.
- Set `COCOINDEX_RERANK_MODEL=BAAI/bge-reranker-v2-m3` for a commercial-safe reranker.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Revert code/docs changes and rerun `ccc reset && ccc index` only if a model swap was performed.
<!-- /ANCHOR:enhanced-rollback -->
