---
title: "Feature Specification: Wire skill-advisor to the shared hf model server"
description: "Point skill-advisor's semantic embedding lane at the shared hf model-server socket, add cross-launcher respawn-lock coverage, and document new HF_EMBED_SERVER env and troubleshooting contracts."
trigger_phrases:
  - "skill-advisor shared embeddings"
  - "HF_EMBED_SERVER_URL docs"
  - "hf-embed-respawn lock"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/006-skill-advisor-shared-wiring"
    last_updated_at: "2026-05-29T13:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Shared model-server supervisor extracted; both launchers wired; 5 review fixes; tests green"
    next_safe_action: "Reconcile parent 029 packet; Option B 6/6 complete"
    blockers: []
    key_files:
      - ".opencode/bin/lib/model-server-supervision.cjs"
      - ".opencode/bin/mk-skill-advisor-launcher.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000296"
      session_id: "029-006-spec"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "dependsOn: 005-retire-sidecar."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Wire skill-advisor to the shared hf model server

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Implemented (shared supervisor lib; both launchers wired; 5 review fixes; cross-launcher tests green) |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-retire-sidecar |
| **Successor** | None |
| **Handoff Criteria** | skill-advisor and mk-spec-memory can share one resident HF model server. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6 of 6** of the embedding-consolidation and hf-local-server decomposition: Point skill-advisor's semantic embedding lane at the shared hf model-server socket, add cross-launcher respawn-lock coverage, and document new HF_EMBED_SERVER env and troubleshooting contracts.

**Scope Boundary**: Set skill-advisor's semantic lane to use HF_EMBED_SERVER_URL pointing at mk-spec-memory's <dbDir>/hf-embed.sock by default. Does NOT include Implementing multi-model residency.

**Dependencies**:
- Parent packet: `../spec.md`.
- dependsOn: 005-retire-sidecar.

**Deliverables**:
- Set skill-advisor's semantic lane to use HF_EMBED_SERVER_URL pointing at mk-spec-memory's <dbDir>/hf-embed.sock by default.
- Allow skill-advisor launcher to win model-server spawn when mk-spec-memory is absent through socket-keyed respawn lock.
- Update ENV_REFERENCE.md with new HF model-server envs and sidecar deprecations.
- Document single-resident-model plus 404 fallback contract.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The architecture only pays off if mk-spec-memory and skill-advisor consume the same resident model server. Without explicit shared-socket wiring and docs, skill-advisor could keep a separate embedding path or lack a safe way to win startup when mk-spec-memory is absent.

### Purpose
Wire skill-advisor's semantic lane to the shared model-server socket, document the new env surface, and make cross-launcher single-winner behavior testable.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Set skill-advisor's semantic lane to use HF_EMBED_SERVER_URL pointing at mk-spec-memory's <dbDir>/hf-embed.sock by default.
- Allow skill-advisor launcher to win model-server spawn when mk-spec-memory is absent through socket-keyed respawn lock.
- Update ENV_REFERENCE.md with new HF model-server envs and sidecar deprecations.
- Document single-resident-model plus 404 fallback contract.
- Add troubleshooting notes for not-started/loading/crash-looped/model-mismatch health states.

### Out of Scope
- Implementing multi-model residency.
- Changing the provider cascade order.
- Removing deprecated sidecar env acceptance before the release window ends.
- Changing model-server or launcher internals beyond wiring/documentation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-skill-advisor/mcp_server/lib/embedders/index.ts` | Modify | `Point semantic lane at shared server URL/socket` |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | Add HF_EMBED_SERVER envs and deprecate sidecar envs |
| `README.md / troubleshooting docs` | Modify | Document health states and single-resident-model contract |
| `mcp_server/tests/*skill-advisor*.vitest.ts` | `Modify/Add` | Cross-launcher shared socket and absent-mk-spec-memory spawn coverage |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | skill-advisor must use the shared server socket by default | `Semantic lane resolves HF_EMBED_SERVER_URL to mk-spec-memory's <dbDir>/hf-embed.sock unless overridden` |
| REQ-002 | Absent mk-spec-memory case must be safe | Socket-keyed respawn lock lets skill-advisor launcher win one spawn without duplicate servers |
| REQ-003 | Docs must list new model-server envs | HF_EMBED_SERVER_URL, HF_EMBED_SERVER_IDLE_MS, HF_EMBED_SERVER_READY_TIMEOUT_MS, SPECKIT_HF_MODEL_SERVER_MAX_RSS_MB, and RSS self-exit env are documented |
| REQ-004 | Sidecar envs must be deprecated in docs | `SPECKIT_EMBEDDER_SIDECAR_* and SPECKIT_EMBEDDER_EXECUTION are marked deprecated/no-op as appropriate` |
| REQ-005 | Single-resident-model contract must be explicit | Docs explain 404-on-model-mismatch and provider-cascade fallback |
| REQ-006 | Troubleshooting must map health states to operator actions | Docs cover server-not-started, loading, crash-looped, and model-mismatch states |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Multi-consumer load-once must be verified | mk-spec-memory and skill-advisor share one resident server in integration coverage |
| REQ-008 | Override behavior must stay possible | `Explicit HF_EMBED_SERVER_URL override continues to work for isolated tests/deployments` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: skill-advisor and mk-spec-memory can share one resident HF model server.
- **SC-002**: Absent mk-spec-memory startup is single-winner and race-safe.
- **SC-003**: ENV_REFERENCE documents new envs and sidecar deprecations.
- **SC-004**: Troubleshooting docs explain health and model mismatch outcomes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Cross-skill socket default creates coupling | Med | Document override and keep socket path canonical |
| Risk | Two launchers may race first embed | High | Use socket-keyed respawn lock from phase 004 |
| Risk | Single-resident-model may surprise heterogeneous consumers | Med | Document 404 fallback and defer multi-model to a later packet |
| Dependency | Phase 005 sidecar retirement | High | Docs and wiring assume shared server path is the only local HF execution path |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Where should the primary troubleshooting note live besides ENV_REFERENCE.md?
- Should skill-advisor expose a diagnostic command for the shared server health payload?
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

