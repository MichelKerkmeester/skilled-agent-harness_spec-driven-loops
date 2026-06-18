---
title: "Feature Specification: reindex-scan responsiveness and cancellation [template:level_1/spec.md]"
description: "A background memory_index_scan starved the daemon's single-thread event loop for over an hour, so all IPC (status, cancel, health, search) timed out and the scan could not be cancelled. The scan now yields the event loop in its all-rows tail phases and is genuinely cancellable."
trigger_phrases:
  - "reindex scan responsiveness cancellation"
  - "memory_index_scan event loop starvation"
  - "background scan uncancellable wedge"
  - "027 002/018"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027/002/018-reindex-scan-responsiveness-and-cancellation"
    last_updated_at: "2026-06-17T14:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented tail-loop yields, processBatches early-abort, and in-memory cancel flag"
    next_safe_action: "Address the launcher lease-heartbeat re-election that recycles the daemon mid-scan"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/utils/batch-processor.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/ops/job-store.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-002-018-reindex-responsiveness"
      parent_session_id: null
    completion_pct: 90
    open_questions:
      - "Should the launcher lease-heartbeat tolerate a busy maintenance scan instead of recycling the daemon?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: reindex-scan responsiveness and cancellation

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete (code); cleanup deferred |
| **Created** | 2026-06-17 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Spec** | ../spec.md |
| **Phase** | 18 (memory-store-and-search track) |
| **Predecessor** | 017-search-and-output-intelligence-implementation |
| **Successor** | None |
| **Handoff Criteria** | Touched-surface tests pass; fix deployed; the lease-heartbeat re-election interaction documented as a follow-on |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase came out of a live incident while deploying the 017 search work. A `memory_index_scan` with `{force:true, background:true}` was run to repair a `degraded` index. It pegged the daemon's single-thread event loop for over an hour, during which every IPC call timed out and the scan could not be cancelled, so the daemon had to be SIGKILLed.

**Scope Boundary**: The event-loop starvation inside the scan. Excludes the launcher lease-heartbeat / re-election that recycles the daemon during a heavy scan, which is a separate supervision subsystem.

**Dependencies**:
- The existing maintenance-job store and the background-scan dispatch in `handlers/memory-index.ts`.

**Deliverables**:
- Tail-loop event-loop yields plus cancel checks in the two all-rows post-batch loops.
- An early-abort for `processBatches` so a cancelled run stops promptly instead of draining no-op batches.
- An in-process cancel flag so cancellation is deliverable without a DB round-trip on the contended connection.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A background `memory_index_scan` ran the entire scan on the daemon's single event-loop thread. Its `await`s only drained microtasks (synchronous better-sqlite3 work plus cache-served embeddings), and its two post-batch tail loops iterate every indexed row fully synchronously with no yield and no cancel check. On a force scan over the whole corpus the event loop was starved for over an hour, so status, cancel, health, and search IPC all timed out and the scan was uncancellable, forcing a SIGKILL that left the index partially rebuilt.

### Purpose
A background scan stays responsive to IPC and is genuinely cancellable mid-run, so a heavy reindex never wedges the daemon and never requires a SIGKILL.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Periodic event-loop yields plus cancel checks in the metadata-edge promotion loop and the causal-chain folder loop (the all-rows tail phases).
- An early-abort hook on `processBatches` that stops iterating and stops the inter-batch pacing delay when a run is cancelled.
- An in-process cancel mirror (`isCancelRequestedFast`) so a hot loop polls cancellation without a SQLite round-trip on the shared connection.

### Out of Scope
- The launcher lease-heartbeat / daemon re-election that recycles the daemon during a busy scan and marks the running scan `failed`. This is a separate supervision subsystem and is recorded as a follow-on, not fixed here.
- A full corpus reindex or the cosmetic consistency/enrichment cleanup, which the re-election interaction currently blocks.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/handlers/memory-index.ts` | Modify | Tail-loop yields + cancel checks; wire early-abort; use fast cancel check |
| `mcp_server/utils/batch-processor.ts` | Modify | `shouldAbort` early-abort option on `processBatches` |
| `mcp_server/lib/ops/job-store.ts` | Modify | In-process cancel Set + `isCancelRequestedFast`; clear on terminal |
| `mcp_server/tests/handler-memory-index-scan-jobs.vitest.ts` | Modify | Mock the new `isCancelRequestedFast` export |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The scan yields the event loop in its all-rows tail loops | A macrotask yield runs at least every ~200 rows in the metadata-edge loop and every ~50 folders in the causal-chain loop |
| REQ-002 | A cancelled run stops promptly | `processBatches` breaks on `shouldAbort`; the tail loops return the cancelled envelope on `isCancelled` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Cancellation is deliverable without DB contention | `requestCancel` sets an in-process flag; `isCancelRequestedFast` reads it with no SQLite query |
| REQ-004 | No regression in the job/scan test surface | The job-store, job-queue, batch-processor, and index-scan-jobs suites pass |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The touched-surface suites pass (68 tests across batch-processor, job-store, job-queue, job-queue-state-edge, handler-memory-index-scan-jobs).
- **SC-002**: With the fix deployed, a heavy background scan keeps the daemon responsive enough that the supervision layer governs its lifecycle, instead of the original hour-long silent wedge.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Launcher lease-heartbeat / re-election | A busy scan still gets the daemon recycled mid-run, so a full scan does not complete | Documented as a follow-on; the index is functionally healthy without it |
| Risk | Yielding mid-scan on a shared better-sqlite3 connection | A yield inside an open transaction would let another task corrupt it | Yields are placed only between self-contained per-row transactions, never inside one |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the launcher lease-heartbeat tolerate a busy maintenance scan (longer probe timeout, or a maintenance grace window) instead of recycling the daemon and failing the scan?
- Is an out-of-process scan worker the right long-term design so daemon responsiveness is guaranteed regardless of per-row cost?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
