---
title: "Feature Specification: Rewrite hf-local as an HTTP model-server client"
description: "Replace the in-process hf-local pipeline body with an ollama-shaped HTTP/socket client that keeps public provider APIs, client-side prefixes, readiness retry, and runtime dimension adoption."
trigger_phrases:
  - "hf-local HTTP client"
  - "ollama shaped hf-local"
  - "HF_EMBED_SERVER_READY_TIMEOUT_MS"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/003-hf-local-http-client"
    last_updated_at: "2026-05-29T08:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Rewrote hf-local as HTTP client; surface stable; 86 vitest green; review clean"
    next_safe_action: "Phase 004: launcher supervision wires + supervises the 002 server"
    blockers: []
    key_files:
      - "shared/embeddings/providers/hf-local.ts"
      - "shared/embeddings/providers/ollama.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000293"
      session_id: "029-003-spec"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "dependsOn: 002-hf-model-server."
      - "Public IEmbeddingProvider surface preserved; dispose is a client no-op"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Rewrite hf-local as an HTTP model-server client

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Implemented (tsc + 86 embedding vitest green; review clean; wired live in 004) |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 6 |
| **Predecessor** | 002-hf-model-server |
| **Successor** | 004-launcher-supervision |
| **Handoff Criteria** | hf-local.ts no longer imports or runs transformers directly. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3 of 6** of the embedding-consolidation and hf-local-server decomposition: Replace the in-process hf-local pipeline body with an ollama-shaped HTTP/socket client that keeps public provider APIs, client-side prefixes, readiness retry, and runtime dimension adoption.

**Scope Boundary**: Replace the pipeline execution body with socket/tcp HTTP calls modeled on ollama.ts. Does NOT include Creating the model server endpoint (phase 002).

**Dependencies**:
- Parent packet: `../spec.md`.
- dependsOn: 002-hf-model-server.

**Deliverables**:
- Replace the pipeline execution body with socket/tcp HTTP calls modeled on ollama.ts.
- Keep embedDocument, embedQuery, generateEmbedding, warmup, healthCheck, getMetadata, getProfile, and canLoad stable.
- Apply PREFIX_REGISTRY/getPrefixFor client-side before POST.
- Retry ECONNREFUSED, ENOENT, and loading responses up to HF_EMBED_SERVER_READY_TIMEOUT_MS.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
hf-local.ts currently owns in-process transformers execution. After the model server exists, keeping that load path in the provider would duplicate lifecycle, dimension, timeout, and readiness behavior instead of matching the proven ollama client shape.

### Purpose
Collapse hf-local.ts into an HTTP client against the local model server while preserving the IEmbeddingProvider surface and keeping prefixes client-side.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the pipeline execution body with socket/tcp HTTP calls modeled on ollama.ts.
- Keep embedDocument, embedQuery, generateEmbedding, warmup, healthCheck, getMetadata, getProfile, and canLoad stable.
- Apply PREFIX_REGISTRY/getPrefixFor client-side before POST.
- Retry ECONNREFUSED, ENOENT, and loading responses up to HF_EMBED_SERVER_READY_TIMEOUT_MS.
- Adopt server-reported dimension and keep per-vector length assertions.

### Out of Scope
- Creating the model server endpoint (phase 002).
- Launcher spawn/supervision (phase 004).
- Deleting sidecar files (phase 005).
- Changing factory/importer public contracts.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `shared/embeddings/providers/hf-local.ts` | Modify | Rewrite as ollama-shaped HTTP client with readiness retry |
| `shared/embeddings/providers/ollama.ts` | Reference | Client pattern for fetch timeout, parse rows, model-missing handling, and prefixes |
| `shared/embeddings/factory.ts` | Verify | Factory imports and provider creation remain unchanged |
| `mcp_server/tests/embeddings*.vitest.ts` | `Modify/Add` | Client prefix, readiness, dim, and 404 behavior coverage |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Public provider surface must remain unchanged | Factory and importers compile without interface changes |
| REQ-002 | Prefixes must remain client-side | `Query/document inputs are prefixed before /api/embed; server receives final text` |
| REQ-003 | Readiness must be two-layer and non-fatal | `Connect failures and 503/loading are retried up to HF_EMBED_SERVER_READY_TIMEOUT_MS` |
| REQ-004 | `Runtime dimension must be adopted from server health/embed output` | Client validates vector lengths against server-reported dim instead of static local model map |
| REQ-005 | Missing model must map to provider cascade behavior | 404 model-missing response follows ollama-style isModelMissingResponse handling |
| REQ-006 | dispose must become a client no-op | Provider dispose does not own native model state after rewrite |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | `canLoad must probe /api/health` | `Availability reflects ready/loading server state without starting native load in-process` |
| REQ-008 | Per-request timeout boundary must be clear | EMBEDDING_TIMEOUT applies after readiness, not to the cold-load wait |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: hf-local.ts no longer imports or runs transformers directly.
- **SC-002**: Prefixes still apply for query and document embeddings.
- **SC-003**: Cold-start readiness is retried instead of surfacing as an immediate error.
- **SC-004**: Factory and provider public contracts are unchanged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Cold model load could consume normal embed timeout | High | Separate readiness timeout from post-ready EMBEDDING_TIMEOUT |
| Risk | Moving prefixes might double-prefix or omit prefixes | High | Keep prefix code in hf-local.ts and assert request payload text in tests |
| Risk | 404 handling could become a hard failure | Med | Mirror ollama.ts missing-model semantics |
| Dependency | Phase 002 endpoint contract | High | Do not implement until /api/embed and /api/health response shapes are stable |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should healthCheck return loading as degraded or healthy?
- Should HF_EMBED_SERVER_URL override both UDS and tcp discovery for tests?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->

