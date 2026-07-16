---
title: "Feature Specification: Retire the embedding sidecar execution path"
description: "Delete the hf-local sidecar apparatus and collapse the execution router so hf-local flows through the direct factory-backed adapter like other providers, with one-release env deprecation shims."
trigger_phrases:
  - "retire sidecar"
  - "SPECKIT_EMBEDDER_EXECUTION no-op"
  - "SidecarClient removal"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/005-retire-sidecar"
    last_updated_at: "2026-05-29T12:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Retired sidecar; router collapsed to direct adapter; tsc green; review clean; 87 tests pass"
    next_safe_action: "Phase 006: skill-advisor shared wiring + env docs"
    blockers: []
    key_files:
      - "mcp_server/lib/embedders/execution-router.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000295"
      session_id: "029-005-spec"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "dependsOn: 004-launcher-supervision."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Retire the embedding sidecar execution path

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Implemented (sidecar deleted; router collapsed to direct adapter; 87 tests pass; review clean) |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 6 |
| **Predecessor** | 004-launcher-supervision |
| **Successor** | 006-skill-advisor-shared-wiring |
| **Handoff Criteria** | No live sidecar execution code remains. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5 of 6** of the embedding-consolidation and hf-local-server decomposition: Delete the hf-local sidecar apparatus and collapse the execution router so hf-local flows through the direct factory-backed adapter like other providers, with one-release env deprecation shims.

**Scope Boundary**: Delete sidecar-specific router branches, client maps, snapshots, shutdown/recycle helpers, and policy resolution. Does NOT include Changing model-server endpoint behavior.

**Dependencies**:
- Parent packet: `../spec.md`.
- dependsOn: 004-launcher-supervision.

**Deliverables**:
- Delete sidecar-specific router branches, client maps, snapshots, shutdown/recycle helpers, and policy resolution.
- Delete sidecar client/worker/testables files.
- Migrate or remove sidecar tests around the new /api/health model-server contract.
- Keep registry fallback and prefix registry behavior unchanged.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Once hf-local is a client for a launcher-supervised model server, the sidecar branch becomes redundant lifecycle machinery. Keeping it would preserve duplicate env allowlists, snapshots, recycle paths, worker tests, and policy branches that no longer own native model memory.

### Purpose
Remove the sidecar execution path and route hf-local through the same factory-backed adapter path as other providers, while keeping SPECKIT_EMBEDDER_EXECUTION as an accepted-but-ignored one-release compatibility shim.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete sidecar-specific router branches, client maps, snapshots, shutdown/recycle helpers, and policy resolution.
- Delete sidecar client/worker/testables files.
- Migrate or remove sidecar tests around the new /api/health model-server contract.
- Keep registry fallback and prefix registry behavior unchanged.
- Deprecate sidecar envs without breaking existing configs immediately.

### Out of Scope
- Changing model-server endpoint behavior.
- Changing launcher supervision behavior.
- Removing cloud provider cascades.
- Long-term env removal beyond the one-release no-op shim.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/embedders/execution-router.ts` | Modify | `Remove sidecar policy/adapter branch and collapse to direct factory-backed adapter` |
| `mcp_server/lib/embedders/sidecar-client.ts` | Delete | Remove obsolete sidecar client |
| `mcp_server/lib/embedders/sidecar-worker.ts` | Delete | Remove obsolete sidecar worker |
| `mcp_server/lib/embedders/sidecar-client.testables.ts` | Delete | Remove obsolete testables |
| `mcp_server/lib/embedders/execution-router.testables.ts` | `Modify/Delete` | Remove sidecar testable exports |
| `mcp_server/tests/embedders/*.vitest.ts` | `Modify/Delete` | `Migrate/remove sidecar-specific tests` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Router must no longer have a live sidecar branch | SIDECAR_LOCAL_PROVIDERS, shouldUseSidecar, sidecar client maps, and SidecarClient adapter branch are gone |
| REQ-002 | hf-local must use the factory-backed adapter path | `getEmbedderAdapter resolves hf-local through createDirectProviderAdapter / createFactoryBackedAdapter` |
| REQ-003 | Sidecar files must be deleted or orphan-free | No live imports remain for sidecar client, worker, testables, or env allowlist usage |
| REQ-004 | SPECKIT_EMBEDDER_EXECUTION must be a one-release no-op | Existing env is accepted and logged once instead of failing or changing routing |
| REQ-005 | Tests must move to model-server health semantics | `Sidecar snapshot/hardening tests are deleted or repointed to /api/health` |
| REQ-006 | Registry and prefix behavior must remain unchanged | `getCanonicalFallback and PREFIX_REGISTRY keep phase 001/003 behavior` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Grep must prove no live sidecar symbols remain | `rg SidecarClient/shouldUseSidecar/getSidecarWorkerSnapshot finds no live code references` |
| REQ-008 | Full relevant suite must pass | Execution-router and embedding tests are green after sidecar removal |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No live sidecar execution code remains.
- **SC-002**: hf-local routes through the direct factory-backed provider path.
- **SC-003**: Deprecated sidecar env settings do not break one release.
- **SC-004**: Tests assert model-server health/client behavior instead of sidecar behavior.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Operator configs may still set sidecar envs | Med | Keep accepted-but-ignored no-op shim and log once |
| Risk | Deleting tests may remove useful hardening coverage | Med | Repoint behavioral assertions to /api/health where still relevant |
| Risk | Router collapse could affect non-hf providers | High | Verify cloud and ollama adapter paths remain unchanged |
| Dependency | Phase 004 supervision | High | Do not remove sidecar until launcher-owned server covers lifecycle |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the one-release no-op shim live in router config parsing or env reference parsing?
- Which sidecar tests still carry behavior worth preserving against /api/health?
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

