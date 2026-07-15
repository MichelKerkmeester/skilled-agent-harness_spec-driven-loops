---
title: "Feature Specification: maintenance-grace covers background embedding"
description: "019 made a reindex's scan survive launcher re-election, but its maintenance marker was scoped to the scan job. The scan defers embeddings, so the real vector writes happen in the post-scan background-embedding queue, which stayed busy-but-unprotected and a separate re-election interrupted it. The marker writer is now a shared, reference-counted module so both the scan and the embedding queue hold it through their overlap."
trigger_phrases:
  - "maintenance grace background embedding"
  - "maintenance marker reference counted embedding queue"
  - "reindex post-scan embedding burst re-election"
  - "027 002/020"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/002-memory-store-and-search/019-maintenance-grace-background-embedding"
    last_updated_at: "2026-06-17T16:00:00Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Extracted a shared reference-counted marker and wired the embedding queue into it"
    next_safe_action: "Confirm a full reindex plus its post-scan embedding burst survives at deploy time"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-002-020-maintenance-grace-embedding"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Should the maintenance marker protect the post-scan background-embedding queue, not just the scan?"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: maintenance-grace covers background embedding

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
| **Status** | Complete (code) |
| **Created** | 2026-06-17 |
| **Branch** | `system-speckit/003-xce-research-based-refinement` |
| **Parent Spec** | ../spec.md |
| **Phase** | 20 (memory-store-and-search track) |
| **Predecessor** | 019-maintenance-grace-daemon-survives-reelection |
| **Successor** | None |
| **Handoff Criteria** | The marker writer is a shared reference-counted module; the scan and the background-embedding queue both hold it through their overlap; the marker unit test plus the existing scan-job and launcher-guard suites pass; full live reindex-plus-embedding survival is the deploy-time check |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase is the direct follow-on to 019. 019 made a reindex's SCAN survive launcher re-election by writing a maintenance-active marker that the launcher reads to adopt a busy-but-healthy daemon instead of reaping it. But that marker was scoped to the scan job. Because the scan defers embeddings (`asyncEmbedding`), the real vector writes happen AFTER the scan, in the background-embedding queue (`lib/providers/retry-manager.ts` draining `embedding_status='pending'` rows). That queue is busy-but-unprotected: a live run saw a separate re-election recycle the daemon DURING the post-scan embedding burst, interrupting the embeddings. Search stayed up and the gap drained on a later queue pass, but the reindex was not re-election-proof end to end. 019's own limitations section flagged this as the loop-closing follow-on.

**Scope Boundary**: Widening WHO writes the maintenance marker so the post-scan embedding queue is protected too. The launcher-side adopt/reap guard from 019 is unchanged; this phase only changes how and when the marker is written so the scan and the embedding queue can both hold it.

**Dependencies**:
- The 019 launcher adopt guards, which already adopt a daemon holding a fresh marker; this phase only widens who writes that marker.
- The existing background scan IIFE in `handlers/memory-index.ts` and the existing `runBackgroundJob` in `lib/providers/retry-manager.ts`.

**Deliverables**:
- A shared, reference-counted marker module exposing `beginMaintenance(label) -> { refresh(), end() }`.
- The scan IIFE refactored onto the shared module, replacing its inline writer.
- The background-embedding queue wired into the shared module after its empty-queue guard.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
019 made a reindex's scan survive launcher re-election, but its maintenance marker was scoped to the scan job. Because the scan defers embeddings (`asyncEmbedding`), the real vector writes happen in the POST-scan background-embedding queue (`lib/providers/retry-manager.ts` draining `embedding_status='pending'` rows). That queue is busy-but-unprotected, so a live run saw a separate re-election recycle the daemon DURING the post-scan embedding burst, interrupting the embeddings. Search stayed up and the deferred gap drained on a later queue pass, but the reindex was not re-election-proof end to end.

### Purpose
The maintenance marker now covers both the scan and the post-scan background-embedding queue, so a daemon that is busy with either is adopted by the launcher rather than reaped, and a full reindex plus its post-scan embedding burst survives launcher contention end to end.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A shared, reference-counted marker module `lib/storage/maintenance-marker.ts` exposing `beginMaintenance(label) -> { refresh(), end() }`: writes `<DATABASE_DIR>/.maintenance-active.json` (180s TTL, 20s self-refresh), keeps the file present while >=1 holder is active, removes it at 0, and is idempotent on `end()`.
- The scan IIFE in `handlers/memory-index.ts` refactored to call the shared module, replacing its inline writer.
- The background-embedding queue: `runBackgroundJob` in `retry-manager.ts` calls `beginMaintenance('embedding-queue')` ONLY after its empty-queue guard and `end()`s in its existing `finally`.

### Out of Scope
- The 019 launcher-side adopt/reap guard, the launcher-read marker fields (`childPid`, `activeUntilMs`), the TTL, the marker file, and the marker-dir resolution; this phase only widens who writes the marker, not how the launcher reads it. (The auxiliary payload field `jobId` → `labels[]` already changed in 019's writer to support the reference-counted overlap; 020 reuses that `labels[]` shape and does not change it further.)
- Making the heaviest synchronous embedding phases cooperative (chunk-and-yield) so the daemon stays responsive rather than only un-reaped; that is a noted follow-on.
- A full live end-to-end reindex run; that is the deploy-time confirmation, not a code deliverable.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/storage/maintenance-marker.ts` | Add | Shared reference-counted marker module exposing `beginMaintenance(label) -> { refresh(), end() }` |
| `mcp_server/handlers/memory-index.ts` | Modify | Scan IIFE refactored onto the shared module, replacing its inline writer |
| `mcp_server/lib/providers/retry-manager.ts` | Modify | `runBackgroundJob` wired into `beginMaintenance('embedding-queue')` after the empty-queue guard, ending in the existing `finally` |
| `mcp_server/tests/maintenance-marker.vitest.ts` | Add | New unit test for the shared reference-counted module |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The marker writer is a shared reference-counted module | `beginMaintenance(label)` returns `{ refresh(), end() }`; the marker file is present while >=1 holder is active, removed at 0, and `end()` is idempotent; TTL 180s with a 20s self-refresh |
| REQ-002 | The background-embedding queue is protected | `runBackgroundJob` calls `beginMaintenance('embedding-queue')` only after its empty-queue guard and `end()`s in its existing `finally`, so the daemon holds the marker through the post-scan embedding burst |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The scan and the embedding queue overlap without clobbering | Reference counting lets the scan (which defers embeddings) and the embedding queue (which drains them) both hold the marker through their overlap; neither one's `end()` removes the file while the other still holds it |
| REQ-004 | An idle tick never marks | `beginMaintenance('embedding-queue')` runs only after the empty-queue guard, so a tick with no pending rows never writes or leaves a lingering marker |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The marker unit test (`maintenance-marker.vitest.ts`) plus the existing scan-job and launcher-guard suites pass.
- **SC-002**: A full force reindex plus its post-scan embedding burst runs with the daemon surviving (deploy verification): the scan and the embedding queue overlap under one reference-counted marker, and an idle embedding tick never marks.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A holder leaks its reference and pins the marker | If `end()` is missed the marker could outlive its work and shield a daemon that is no longer busy | The 180s TTL bounds the leak: an un-refreshed marker expires and the normal reap resumes; `end()` is idempotent and the embedding queue ends in its existing `finally` |
| Dependency | The 019 launcher adopt guard and marker file | This phase reuses the same marker file, the launcher-read fields (`childPid`, `activeUntilMs`), TTL, and dir resolution unchanged; only the writer is widened (the `labels[]` auxiliary payload was already introduced in 019) | Keeping the launcher-read fields and dir resolution identical means the launcher reads the marker exactly as in 019 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. Full live confirmation (a real reindex plus its post-scan embedding burst surviving end-to-end on the live daemon) is the deploy-time check, not a code question.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
