---
title: "Feature Specification: Vector Resilience Durability"
description: "Vector-shard quarantine repair intent must survive process restarts, and normal reindex completion must clear stale degraded-vector state when it rebuilds the affected shard. This phase makes the repair intent durable with a per-shard sentinel and verifies the stuck-degraded recovery path."
trigger_phrases:
  - "vector shard repair sentinel"
  - "repair intent durability"
  - "degraded vector health"
  - "quarantine rebuild"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/020-vector-resilience-durability"
    last_updated_at: "2026-06-11T08:50:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Completed durable vector repair sentinel"
    next_safe_action: "Monitor vector repair regressions"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/observability/retrieval-observability.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/vector-shard-read-path-resilience.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "vector-resilience-durability-2026-06-11"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Use a per-shard repair sentinel under the database checkpoints directory so active profiles do not collide."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Vector Resilience Durability

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-06-11 |
| **Branch** | `028-mcp-to-cli-tool-transition` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 20 of 20 |
| **Predecessor** | `019-skill-advisor-cross-session-reconnect` |
| **Successor** | None |
| **Handoff Criteria** | TypeScript, targeted vector-shard tests, strict spec validation, and comment-hygiene checks pass. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase closes the vector-resilience durability gap in the System Spec Kit memory server. The affected behavior lives in the vector shard attach, quarantine, repair scheduling, reindex completion, and degraded-vector observability paths.

**Scope Boundary**: Only durable vector-shard repair intent and degraded-state cleanup are in scope. Live `mcp_server/database/**` shards and host daemon sockets are out of scope.

**Dependencies**:
- Existing temp-fixture vector shard test harness in `tests/vector-shard-read-path-resilience.vitest.ts`.
- Existing atomic sentinel write pattern in `lib/search/vector-index-store.ts`.
- Existing reindex repair completion and degraded-vector observability APIs.

**Deliverables**:
- Per-shard repair-pending sentinel written before quarantine rename.
- Boot attach resume that schedules the repair when the sentinel remains after restart.
- Reindex completion cleanup that clears stale degraded-vector state for the rebuilt shard.
- Regression tests for restart durability and clear-on-reindex behavior.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Vector-shard quarantine currently records the rebuild intent only in process memory. If the process exits after the shard is renamed aside but before the repair reindex is started or completed, the next process can attach a replacement shard while losing the explicit repair intent and degraded-health continuity.

The degraded-vector flag can also stay stuck after a successful normal reindex rebuilds the active profile shard. That leaves health reporting in degraded mode even though the shard has already been replaced with valid vector rows.

### Purpose
Persist vector-shard repair intent across restarts and clear stale degraded state when a successful reindex has rebuilt the affected shard.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Write a per-shard repair-pending sentinel before quarantining a corrupted shard.
- Resume the pending repair during `attachActiveVectorShard` when the sentinel survives restart.
- Clear the pending sentinel only when the rebuild-completed path runs for the affected shard.
- Clear stale degraded-vector health after a normal, non-repair reindex completes for the same shard.
- Add temp-fixture regression tests that do not touch live shard files or host daemon sockets.

### Out of Scope
- Changing vector scoring, hybrid retrieval, ranking, or schema migration behavior.
- Reworking checkpoint `.needs-rebuild` sentinel semantics for derived artifact repair.
- Touching live `mcp_server/database/**` shards.
- Starting or stopping host MCP daemons.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` | Modify | Add per-shard repair sentinel write/read/clear helpers and boot attach resume. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts` | Modify | Clear sentinel and degraded state when repair or matching normal reindex completes. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/observability/retrieval-observability.ts` | Modify | Clear stale active job id when a completion matches the degraded shard. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/vector-shard-read-path-resilience.vitest.ts` | Modify | Add restart-durability and clear-degraded regression coverage. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/020-vector-resilience-durability/*` | Modify | Replace scaffold placeholders with phase documentation and evidence. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| VRD-001 | Persist vector-shard repair intent before quarantine rename. | A repair-pending sentinel exists after quarantine starts and before repair completes. |
| VRD-002 | Resume repair from persisted intent on boot attach. | A temp-fixture restart test with a pending sentinel schedules repair and rebuilds vector rows. |
| VRD-003 | Clear repair sentinel only through rebuild completion. | The sentinel remains while rebuilding and is absent after repair completion. |
| VRD-004 | Clear stale degraded-vector state after normal reindex. | A non-repair reindex for the same shard changes health from degraded to healthy. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| VRD-005 | Preserve existing quarantine, rebuild, and scoring behavior. | Existing read-path resilience test remains green with unchanged vector IDs. |
| VRD-006 | Keep tests isolated from live shards and host daemons. | Tests use `os.tmpdir()` database roots, assert shard paths are outside `/mcp_server/database/`, and set `SPECKIT_IPC_SOCKET_DIR` under the temp root. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npx tsc --noEmit` passes in `.opencode/skills/system-spec-kit/mcp_server`.
- **SC-002**: `npx vitest run tests/vector-shard-read-path-resilience.vitest.ts` passes with the original resilience case plus restart-durability and clear-degraded cases.
- **SC-003**: Strict spec validation passes for this phase folder.
- **SC-004**: Comment-hygiene grep finds no code comments containing spec paths, phase labels, or requirement IDs introduced by this work.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Duplicate repair scheduling if attach is called repeatedly while a sentinel remains. | Extra work could be queued before the first repair clears the sentinel. | Keep behavior additive and rely on the existing completion path to clear the sentinel; do not add a new cross-module scheduler lock in this phase. |
| Risk | Normal reindex clearing the wrong degraded state. | Health could be marked healthy for an unrelated shard. | Clear only when the degraded snapshot basename matches the active shard path rebuilt by the reindex. |
| Dependency | Existing `EmbeddingProfile.getVectorShardPath` layout. | Sentinel path depends on profile-specific shard filenames. | Store one sentinel per shard basename in the database `checkpoints/` directory. |
| Dependency | Vitest mock embedder harness. | Tests must avoid network and real embedders. | Use the existing mocked registry and execution router. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
