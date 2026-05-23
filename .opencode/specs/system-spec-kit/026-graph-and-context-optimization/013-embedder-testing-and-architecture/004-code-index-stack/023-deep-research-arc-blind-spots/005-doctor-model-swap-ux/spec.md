---
title: "Feature Specification: 023D Doctor Model Swap UX"
description: "Add CocoIndex operator doctor checks for stale CLI installs, model license risk, fingerprint drift, and model-swap reindex cost."
trigger_phrases:
  - "ccc doctor"
  - "model swap"
  - "commercial safe"
  - "reranker license"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/005-doctor-model-swap-ux"
    last_updated_at: "2026-05-19T20:36:58Z"
    last_updated_by: "codex"
    recent_action: "Implemented doctor checks"
    next_safe_action: "Run strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py"
    session_dedup:
      fingerprint: "sha256:023d000000000000000000000000000000000000000000000000000000000000"
      session_id: "023-deep-research-arc-blind-spots/005-doctor-model-swap-ux"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3 selected as E by user."
---
# Feature Specification: 023D Doctor Model Swap UX

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-19 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
CocoIndex operators had no single preflight for three high-trust failure modes: a stale global `ccc`, non-commercial default reranker licensing, and expensive model-swap reindexing. The default reranker was empirically strong but licensed CC BY-NC 4.0, which creates silent commercial risk if the operator assumes Apache-licensed project code means unrestricted model use.

### Purpose
Expose operator risk before search or reindex work proceeds, and make commercial-safe deployments fail explicitly instead of relying on tribal knowledge.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `ccc doctor` with six PASS/WARN/FAIL/INFO checks and JSON output.
- Add license and `commercial_safe` metadata to embedder and reranker registries.
- Add `COCOINDEX_COMMERCIAL_SAFE_PROFILE` enforcement at config load.
- Add reindex-cost estimation from chunk count.
- Add ADRs for license governance, reranker criteria, and pipeline-before-model discipline.

### Out of Scope
- Multi-dimensional storage from 023A3.
- Calibration sweeps from 023B.
- Request-budget logic from 023E.
- New observability counters from 023C.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py` | Modify | Add `doctor`, report rendering, and reindex estimator. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py` | Modify | Add license metadata and reranker registry. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | Modify | Add commercial-safe profile enforcement. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/index_metadata.py` | Modify | Consume reranker license from registry for 023C fingerprint metadata. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/observability.py` | Modify | Preserve observability wrappers while using shared metadata. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_doctor.py` | Create | Cover doctor output, exit codes, JSON, and estimator. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_embedder_license.py` | Create | Cover license completeness and Jina non-commercial marking. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md` | Modify | Append ADR-024 through ADR-026. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `ccc doctor` runs six health checks. | Text and JSON output each contain six check entries. |
| REQ-002 | License metadata is centralized. | Embedders and rerankers expose license and commercial-safe status from registry. |
| REQ-003 | Commercial-safe profile refuses non-commercial models. | `COCOINDEX_COMMERCIAL_SAFE_PROFILE=true` with Jina v3 raises structured config error and doctor returns rc=2. |
| REQ-004 | Reindex cost is visible. | `estimate_reindex_seconds(80000, ...)` returns about 25 minutes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Fingerprint mismatch is surfaced. | Doctor consumes 023C status fingerprint when available and skips with INFO when absent. |
| REQ-006 | Governance decisions are durable. | ADR-024, ADR-025, and ADR-026 are appended to the bake-off decision record. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Operators can run `ccc doctor` before search or model swaps and see stale CLI, license, fingerprint, and reindex-cost risks in one report.
- **SC-002**: Commercial-safe profile blocks CC BY-NC rerankers before daemon runtime work proceeds.
- **SC-003**: License governance no longer lives only in comments or external model cards.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | PyPI version lookup | Network failures could make doctor noisy. | Return INFO when latest version cannot be fetched. |
| Dependency | Daemon status | Fingerprint may be unavailable or daemon may be stopped. | Return INFO and still use local index metadata for chunk-count estimate when possible. |
| Risk | License interpretation | Custom licenses such as Gemma require operator review. | Treat only permissive licenses as commercial-safe by default. |
| Risk | Dirty worktree | Many unrelated files were already modified. | Touch only listed packet surfaces and avoid git commit. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Doctor must not require a full reindex or search request.
- **NFR-P02**: PyPI freshness checks must degrade to INFO when network access fails.

### Reliability
- **NFR-R01**: Doctor must still produce a six-check report when daemon status is unavailable.
- **NFR-R02**: Commercial-safe profile refusal must be deterministic at config load.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Environment Boundaries
- Global `ccc` resolves outside the venv and cannot import `tree_sitter`.
- `COCOINDEX_COMMERCIAL_SAFE_PROFILE=true` with `jinaai/jina-reranker-v3`.
- `COCOINDEX_RERANK=false` with no active reranker license to evaluate.

### State Transitions
- Fingerprint unavailable: doctor reports INFO.
- Index metadata available but daemon stopped: doctor estimates cost from persisted chunk count.
- PyPI unavailable: doctor reports installed version only.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | CLI, registry, config, fingerprint metadata, tests, and ADRs. |
| Risk | 15/25 | Env/config-load behavior and operator licensing risk. |
| Research | 10/20 | HF license verification and 023C fingerprint compatibility. |
| **Total** | **43/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
