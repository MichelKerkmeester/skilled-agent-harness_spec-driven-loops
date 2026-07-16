---
title: "Feature Specification: Vector Resilience Durability"
description: "Vector-shard quarantine repair intent survives process restarts through completeness-based attach assessment, orphan-quarantine backstop scheduling, in-flight repair de-duplication, and degraded-health durability signals."
trigger_phrases:
  - "vector shard repair sentinel"
  - "repair intent durability"
  - "degraded vector health"
  - "quarantine rebuild"
  - "shard completeness oracle"
  - "orphan quarantine backstop"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/002-memory-store-and-search/011-vector-resilience-durability"
    last_updated_at: "2026-06-11T08:10:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Remediated vector repair review findings"
    next_safe_action: "Monitor vector repair durability signals"
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
      - "Use shard completeness, not repair job id, to distinguish stale sentinels from unfinished repairs."
      - "Keep same-shard non-repair reindex sentinel clear as intentional stuck-degraded recovery."
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
- Boot attach assessment that clears stale sentinels only when the active shard is complete.
- Orphan-quarantine backstop scheduling when quarantine artifacts exist without a sentinel.
- In-flight repair guard that prevents duplicate repair jobs for the same shard.
- Degraded-vector health surface for failed sentinel persistence.
- Reindex completion cleanup that clears stale degraded-vector state for the rebuilt shard.
- Regression tests for restart durability, backstop recovery, de-duplication, and clear-on-reindex behavior.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Vector-shard quarantine previously relied on process memory plus a per-shard sentinel. Review found three durability gaps: stale sentinels could be resumed even after a shard was complete, sentinel-write failure could leave only orphan quarantine artifacts for the next process, and repeated attach could queue duplicate repairs while the first repair was still running.

The degraded-vector flag can also stay stuck after a successful normal reindex rebuilds the active profile shard. That leaves health reporting in degraded mode even though the shard has already been replaced with valid vector rows.

### Purpose
Persist vector-shard repair intent across restarts, use shard completeness to distinguish stale sentinels from unfinished repairs, and clear stale degraded state when a successful same-shard reindex has rebuilt the affected shard.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Write a per-shard repair-pending sentinel before quarantining a corrupted shard.
- Resume the pending repair during `attachActiveVectorShard` only when the shard is incomplete.
- Clear stale repair sentinels when the active shard's vector rowcount covers the successful memory count.
- Schedule a repair from orphan quarantine artifacts when no sentinel survived.
- Suppress duplicate in-flight repair jobs for the same shard path.
- Surface `sentinelPersisted:false` in degraded-vector health when quarantine continues after sentinel write failure.
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
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` | Modify | Add completeness-based attach assessment, orphan-quarantine backstop, sentinel failure escalation, and boot attach repair decisions. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts` | Modify | Add same-shard in-flight repair guard and preserve completion-based sentinel clearing. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/observability/retrieval-observability.ts` | Modify | Surface sentinel persistence state in degraded-vector health. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/vector-shard-read-path-resilience.vitest.ts` | Modify | Add de-duplication, ordering, sentinel failure, completeness-clear, and same/different shard clear coverage. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/011-vector-resilience-durability/*` | Modify | Update phase documentation and verification evidence. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| VRD-001 | Persist vector-shard repair intent before quarantine rename. | Rename-order coverage observes the repair sentinel rename before any quarantine rename. |
| VRD-002 | Use shard completeness to classify pending repair state. | A complete shard with a stale sentinel clears the sentinel without a repair job; an incomplete missing shard resumes repair. |
| VRD-003 | Backstop repair from orphan quarantine artifacts. | A sentinel-write failure still quarantines, schedules repair, surfaces `sentinelPersisted:false`, and schedules again after restart from orphan artifacts. |
| VRD-004 | Avoid duplicate in-flight same-shard repair jobs. | Repeated attach while a repair is running leaves exactly one repair job row and one rebuild-start event. |
| VRD-005 | Clear stale degraded-vector state after normal same-shard reindex. | A non-repair reindex for the same shard clears the active sentinel and health, while a different-shard sentinel survives. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| VRD-006 | Preserve existing quarantine, rebuild, and scoring behavior. | Existing read-path resilience test remains green with unchanged vector IDs. |
| VRD-007 | Keep tests isolated from live shards and host daemons. | Tests use `os.tmpdir()` database roots, assert shard paths are outside `/mcp_server/database/`, and set `SPECKIT_IPC_SOCKET_DIR` under the temp root. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npx tsc --noEmit` passes in `.opencode/skills/system-spec-kit/mcp_server`.
- **SC-002**: `npx vitest run tests/vector-shard-read-path-resilience.vitest.ts` passes with 8 tests covering repair, restart, ordering, de-duplication, backstop, completeness-clear, and intended same-shard clear semantics.
- **SC-003**: Strict spec validation passes for this phase folder.
- **SC-004**: Comment-hygiene grep finds no code comments containing spec paths, phase labels, or requirement IDs introduced by this work.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Duplicate repair scheduling if attach is called repeatedly while a sentinel remains. | Extra work could be queued before the first repair clears the sentinel. | Guard repair scheduling by same shard path and return the existing queued/running job id. |
| Risk | Normal reindex clearing the wrong degraded state. | Health could be marked healthy for an unrelated shard. | Clear only when the degraded snapshot basename matches the active shard path rebuilt by the reindex. |
| Risk | Sentinel write fails before quarantine rename. | Restart durability could rely only on quarantine artifacts. | Continue quarantine and in-process rebuild, mark `sentinelPersisted:false`, and backstop from orphan quarantine artifacts on attach. |
| Dependency | Existing `EmbeddingProfile.getVectorShardPath` layout. | Sentinel path depends on profile-specific shard filenames. | Store one sentinel per shard basename in the database `checkpoints/` directory. |
| Dependency | Vitest mock embedder harness. | Tests must avoid network and real embedders. | Use the existing mocked registry and execution router. |

### Known Decisions And Limitations

- Same-shard non-repair reindex completion remains an intended stuck-degraded recovery path: it clears the sentinel only after the same active shard has been atomically rebuilt.
- Different-shard sentinels are preserved across unrelated reindex completion.
- Cosmetic rebuild counter skew remains deferred; this remediation does not change the completion counter semantics.
- The completeness oracle uses successful memory rows as the expected vector set, so pending-only rows do not force repair before a completed reindex has committed vector ownership.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
