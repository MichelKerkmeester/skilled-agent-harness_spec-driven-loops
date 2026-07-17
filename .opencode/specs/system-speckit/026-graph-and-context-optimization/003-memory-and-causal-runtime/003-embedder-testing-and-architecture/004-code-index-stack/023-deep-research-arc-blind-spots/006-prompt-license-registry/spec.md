---
title: "Feature Specification: 023A2 Prompt License Registry"
description: "Make CocoIndex embedder and reranker prompt/license metadata first-class registry fields with typed accessors and startup validation."
trigger_phrases:
  - "023A2"
  - "prompt license registry"
  - "embedder registry"
  - "reranker license"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/006-prompt-license-registry"
    last_updated_at: "2026-05-19T22:55:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented registry accessors"
    next_safe_action: "Run full verification"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registry.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/tests/test_registry_accessors.py"
    session_dedup:
      fingerprint: "sha256:023a200000000000000000000000000000000000000000000000000000000000"
      session_id: "023-deep-research-arc-blind-spots/006-prompt-license-registry"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3 selected as E by user."
---
# Feature Specification: 023A2 Prompt License Registry

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
023A1 persisted query/document prompt metadata and 023D added license metadata, but consumers still had to know which optional helper or metadata object to read. That left the registry weaker than the fingerprint contract: prompt and license data existed, but the access path was not a stable, typed API.

### Purpose
Make the model registry the single source for embedder prompts and embedder/reranker licenses, then expose stable accessors for CLI, daemon, config, fingerprint, and tests.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add first-class `query_prompt_name` and `document_prompt_name` fields to embedder specs.
- Add typed accessors for embedders, rerankers, prompts, and licenses.
- Re-export the accessors through `cocoindex_code.registry`.
- Add registry validation callable from daemon startup and `ccc doctor`.
- Update prompt/license consumers to read through registry helpers.
- Add tests for accessor typing, completeness, unknown-model errors, and duplicate prompt registry removal.

### Out of Scope
- Multi-dimensional vector storage from 023A3.
- Calibration sweeps from 023B.
- Doctor UX work already shipped in 023D.
- Git commit or branch management.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py` | Modify | Add first-class prompt fields, aliases, accessors, and registry self-test. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registry.py` | Create | Provide stable public registry import surface. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py` | Modify | Resolve prompt names via registry accessors. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | Modify | Route registered-model policy reads through typed accessors. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py` | Modify | Add registry self-test to doctor and use typed license accessors. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py` | Modify | Run registry self-test at daemon startup. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/index_metadata.py` | Modify | Read reranker license through registry accessor. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/observability.py` | Modify | Preserve wrapper while reading reranker license through registry accessor. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_registry_accessors.py` | Create | Cover 023A2 accessor and completeness contract. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_doctor.py` | Modify | Account for the registry-contract doctor check. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Embedder prompt fields are first-class. | `EmbedderSpec` dataclass fields include `query_prompt_name` and `document_prompt_name`. |
| REQ-002 | License reads are accessor-based. | `embedder_license(name)` and `rerank_license(name)` return registry license strings or clear `KeyError`. |
| REQ-003 | Registry access path is stable. | `cocoindex_code.registry` exports embedder/reranker specs and accessors. |
| REQ-004 | Startup validation exists. | Daemon startup and `ccc doctor` can call registry validation. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Duplicate prompt registries are eliminated. | Tests assert no competing `_QUERY_PROMPT_MODELS` source registry exists. |
| REQ-006 | Unknown model errors are actionable. | Accessors raise `KeyError` with registered-name hint. |
| REQ-007 | Existing prompt behavior is preserved. | Nomic query prompt remains `query`; Gemma query/document prompts remain `InstructionRetrieval`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Prompt, license, and commercial-safe metadata are read from one registry API.
- **SC-002**: `ccc doctor` includes a registry metadata contract check before model-license checks.
- **SC-003**: Full `pytest tests/ -q`, `ruff check`, alignment verification, and strict spec validation pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 023A1 metadata fingerprint | Prompt metadata must already exist in fingerprint/schema. | Read 023A1 implementation summary before edits. |
| Dependency | 023D license registry | License/commercial-safe fields must already exist. | Read 023D implementation summary before edits. |
| Risk | Import cycles | Config, registry, CLI, daemon imports could loop. | Keep `registry.py` as a thin wrapper over `registered_embedders.py`. |
| Risk | Generated build artifacts | Stale `build/lib` may contain old strings. | Tests scan source tree and ignore build output. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Registry validation must fail fast before daemon runtime work if required metadata disappears.
- **NFR-R02**: Unknown custom models remain allowed in config paths that previously tolerated them; only typed accessors raise.

### Maintainability
- **NFR-M01**: New callers should import from `cocoindex_code.registry`, not from private dicts or optional metadata lookups.
- **NFR-M02**: Prompt params stay compatible with upstream-style `indexing_params` and `query_params`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Registry Access
- Unknown embedder name raises a clear `KeyError` when a typed accessor is requested.
- Unknown reranker variant still matches registered prefixes when applicable.
- Models with no prompt still expose prompt fields with `None` values.

### Runtime Boundaries
- `ccc doctor` fails the registry contract if metadata fields drift.
- Daemon startup fails before serving requests if registry validation fails.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Registry, config, CLI, daemon, metadata wrappers, tests, docs. |
| Risk | 13/25 | Import-cycle and compatibility risk, but no storage migration. |
| Research | 8/20 | Prior packet summaries and source inspection only. |
| **Total** | **37/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
