---
title: "Feature Specification: Build hf-model-server.cjs local HTTP model server"
description: "Add a hand-written CommonJS local HTTP/UDS model server that wraps the existing transformers load path and exposes ollama-shaped /api/embed plus /api/health endpoints."
trigger_phrases:
  - "hf model server"
  - "local HTTP embeddings server"
  - "hf-model-server.cjs"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/002-hf-model-server"
    last_updated_at: "2026-05-29T07:55:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented hf-model-server.cjs; node --check + 7 vitest green; review clean"
    next_safe_action: "Phase 003: rewrite hf-local.ts as an HTTP client against this server"
    blockers: []
    key_files:
      - ".opencode/bin/hf-model-server.cjs"
      - "shared/embeddings/providers/hf-local.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000292"
      session_id: "029-002-spec"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Architecture dependsOn: none after phase 001 establishes the nomic canonical default."
      - "Self-warm is best-effort; a warm-up failure must not pin server state to error"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Build hf-model-server.cjs local HTTP model server

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Implemented (node --check + 7 vitest green; review clean; not yet wired in) |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 6 |
| **Predecessor** | 001-nomic-only-consolidation |
| **Successor** | 003-hf-local-http-client |
| **Handoff Criteria** | Server answers /api/health during loading and ready states. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2 of 6** of the embedding-consolidation and hf-local-server decomposition: Add a hand-written CommonJS local HTTP/UDS model server that wraps the existing transformers load path and exposes ollama-shaped /api/embed plus /api/health endpoints.

**Scope Boundary**: Hand-written .opencode/bin/hf-model-server.cjs with no dist-build coupling. Does NOT include Launcher supervision and crash-loop handling (phase 004).

**Dependencies**:
- Parent packet: `../spec.md`.
- Architecture dependsOn: none after phase 001 establishes the nomic canonical default.

**Deliverables**:
- Hand-written .opencode/bin/hf-model-server.cjs with no dist-build coupling.
- Dynamic import of @huggingface/transformers and relocation of existing HfLocalProvider.getModel() load logic.
- Unix domain socket listener at <dbDir>/hf-embed.sock plus tcp fallback.
- /api/health during loading and /api/embed that awaits the in-flight load.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
hf-local currently owns transformers model loading inside provider/sidecar execution paths. The next architecture needs a single local service that binds before model load completes, reports readiness during cold start, and centralizes the existing MPS-to-CPU fallback, load timeout, dtype resolution, single-flight loading, and dispose-drain assertions.

### Purpose
Create .opencode/bin/hf-model-server.cjs: a pure-Node mini-ollama for local HF embeddings that exposes POST /api/embed and GET /api/health, derives dimensions at runtime, and stays prefix-agnostic so clients remain the prefix source of truth.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Hand-written .opencode/bin/hf-model-server.cjs with no dist-build coupling.
- Dynamic import of @huggingface/transformers and relocation of existing HfLocalProvider.getModel() load logic.
- Unix domain socket listener at <dbDir>/hf-embed.sock plus tcp fallback.
- /api/health during loading and /api/embed that awaits the in-flight load.
- Runtime dimension derivation from the first embedding length.

### Out of Scope
- Launcher supervision and crash-loop handling (phase 004).
- Rewriting hf-local.ts into an HTTP client (phase 003).
- Client-side prefix selection; the server must stay prefix-agnostic.
- Multi-model residency.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/hf-model-server.cjs` | Add | `Pure-Node HTTP/UDS server wrapping relocated transformers load logic` |
| `shared/embeddings/providers/hf-local.ts` | `Reference/Modify` | Source of load logic to relocate; phase 003 performs the client rewrite |
| `mcp_server/tests/embedders/hf-model-server.vitest.ts` | Add | `Server readiness, runtime dim, UDS/tcp, and single-session tests` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Server must bind before model load resolves | `GET /api/health answers while state is loading during cold start` |
| REQ-002 | Server must reuse existing HF load behavior | MPS-to-CPU fallback, MODEL_LOAD_TIMEOUT=120000, dtype resolution, loadingPromise single-flight, dispose-drain, and getSessionCount===1 assertion are preserved |
| REQ-003 | `POST /api/embed must await mid-load requests` | An embed request issued while loading blocks on the in-flight load and returns embeddings once ready |
| REQ-004 | Transport must support UDS and tcp fallback | `Default socket is <dbDir>/hf-embed.sock; HF_EMBED_SERVER_URL / SPECKIT_IPC_SOCKET_DIR=tcp://... paths are tested` |
| REQ-005 | Dimension must be runtime-derived | Response includes embeddings and dim where dim comes from embedding vector length rather than a static registry map |
| REQ-006 | Server must stay prefix-agnostic | `No query/document prefix logic is added server-side; clients own PREFIX_REGISTRY application` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Self-warm after load | Server runs one warm embed after model load so first real request avoids extra initialization |
| REQ-008 | Operator health payload is useful | `/api/health returns state, model, dim, device, and loadTimeMs when available` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Server answers /api/health during loading and ready states.
- **SC-002**: POST /api/embed returns embedding rows and runtime dim after cold load.
- **SC-003**: UDS and tcp transports both work.
- **SC-004**: Existing HF load safety behavior is moved, not rewritten.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Relocating load logic could drop battle-tested native fallback behavior | High | Move the existing logic verbatim and cover native-load branches with focused tests |
| Risk | Health endpoint could treat loading as failure | Med | Model loading as healthy and make embed await the existing loadingPromise |
| Risk | UDS behavior can differ across platforms/sandboxes | Med | Cover tcp fallback in phase tests |
| Dependency | Phase 001 canonical fallback | Med | Read default model through getCanonicalFallback('hf-local') |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the server expose request queue depth in /api/health, or keep v1 health minimal?
- Should self-warm input be a fixed internal probe string or reused from existing provider warmup text?
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

