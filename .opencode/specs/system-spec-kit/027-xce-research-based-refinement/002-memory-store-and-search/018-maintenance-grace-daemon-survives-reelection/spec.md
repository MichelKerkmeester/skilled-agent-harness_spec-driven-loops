---
title: "Feature Specification: maintenance-grace daemon survives re-election"
description: "After 018 made the background scan cooperative, a full reindex still could not complete: a second launcher tried to adopt the busy daemon, its JSON-RPC liveness probe timed out during a CPU block, and the daemon was reaped+respawned mid-scan. The daemon now writes a refreshed maintenance-active marker so the launcher adopts a busy-but-healthy daemon instead of reaping it."
trigger_phrases:
  - "maintenance grace daemon survives re-election"
  - "maintenance-active marker launcher adopt"
  - "reindex daemon reaped mid-scan re-election"
  - "027 002/019"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027/002/019-maintenance-grace-daemon-survives-reelection"
    last_updated_at: "2026-06-17T16:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Added maintenance-active marker writer plus launcher adopt guards at both sites"
    next_safe_action: "Confirm a full reindex completes end-to-end on the live daemon at deploy time"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts"
      - ".opencode/bin/lib/model-server-supervision.cjs"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-002-019-maintenance-grace"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Should the launcher tolerate a busy maintenance scan instead of recycling the daemon?"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: maintenance-grace daemon survives re-election

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
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Spec** | ../spec.md |
| **Phase** | 19 (memory-store-and-search track) |
| **Predecessor** | 018-reindex-scan-responsiveness-and-cancellation |
| **Successor** | None |
| **Handoff Criteria** | Daemon writes the maintenance marker; launcher adopts a busy-but-healthy daemon at both guard sites; unit and isolated-harness tests pass; full live reindex completion is the deploy-time check |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase is the direct follow-on to 018. Making the background scan cooperative kept the event loop responsive, but a full reindex still could not run to completion: the launcher kept recycling the daemon mid-scan. The root cause was traced to `mk-spec-memory-launcher.cjs` (~line 1680) and `lib/launcher-ipc-bridge.cjs`. When a second launcher appears (e.g. the editor's MCP reconnecting mid-scan), it tries to adopt the live daemon but requires a JSON-RPC liveness reply. A daemon busy in a scan cannot reply during a CPU block, so the probe deems it wedged, reaps and respawns it, and the new daemon's boot marks the running scan failed. The launcher could not distinguish "busy with a known maintenance scan" from "wedged forever". This was confirmed empirically: re-election fired even in a clean single-launcher state, because a concurrent MCP launcher contended.

**Scope Boundary**: The launcher's adopt/reap decision when a daemon is busy with a known background maintenance scan. The 018 cooperative-yield work is the discriminator that makes a maintenance grace marker reliable; it is not re-touched here.

**Dependencies**:
- The 018 cooperative tail-loop yields, which keep a healthy scan's refresh timer firing on schedule.
- The existing launcher adopt (stale-reclaim) and dead-socket respawn paths in `mk-spec-memory-launcher.cjs`.

**Deliverables**:
- A daemon-written `.maintenance-active.json` marker, refreshed on a fixed interval during a background scan and cleared on every terminal exit.
- A pure supervision predicate that reads the marker and decides whether to adopt despite a failing probe.
- Adopt/refuse-respawn guards wired into both the stale-reclaim adopt path and the dead-socket respawn path.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After 018 made the background scan cooperative, a full reindex still could not complete. When a second launcher appears mid-scan (e.g. the editor's MCP reconnecting), it tries to adopt the live daemon but requires a JSON-RPC liveness reply. A daemon busy in a scan cannot answer during a CPU block, so the probe deems it wedged, reaps and respawns it, and the new daemon's boot marks the running scan failed. The launcher had no way to tell a daemon that is busy with a known maintenance scan from one that is wedged forever, so re-election fired even in a clean single-launcher state once a concurrent MCP launcher contended.

### Purpose
The launcher distinguishes a daemon that is busy with a known background maintenance scan from a wedged one, adopts the busy-but-healthy daemon instead of reaping it, and so lets a heavy reindex run to completion across launcher contention.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A daemon-written `<DATABASE_DIR>/.maintenance-active.json` marker (`{ childPid, activeUntilMs, labels, refreshedAtIso }`, 180s TTL) written when a background scan runs and refreshed every 20s, cleared on every terminal exit. `labels` is a `string[]` so a reference-counted writer can hold the marker across overlapping maintenance sources (the scan and the post-scan embedding queue); only `childPid` and `activeUntilMs` are read by the launcher.
- A pure supervision predicate (`maintenanceMarkerPath` / `readMaintenanceMarker` / `shouldAdoptDespiteProbe`) with injectable fs/now in `model-server-supervision.cjs`.
- Adopt/refuse-respawn guards at both the stale-reclaim adopt path and the dead-socket respawn path in `mk-spec-memory-launcher.cjs`, resolving the marker dir with the same DB-dir precedence as the daemon writer.

### Out of Scope
- The 018 event-loop yield work, which is the discriminator that makes the marker reliable but is not modified here.
- A full live end-to-end reindex run; that is the deploy-time confirmation, not a code deliverable.
- Any change to the JSON-RPC liveness probe itself or to the lease-heartbeat cadence.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/storage/maintenance-marker.ts` | Add | Shared reference-counted marker writer (`beginMaintenance(label) -> { refresh(), end() }`, 180s TTL, 20s self-refresh), consumed by the scan and (in 020) the embedding queue |
| `mcp_server/handlers/memory-index.ts` | Modify | Background scan calls `beginMaintenance('index_scan')` on the shared module plus `finally` cleanup |
| `mcp_server/lib/providers/retry-manager.ts` | Modify | `runBackgroundJob` calls `beginMaintenance('embedding-queue')`, ending in its existing `finally` (the post-scan embedding-queue protection) |
| `.opencode/bin/lib/model-server-supervision.cjs` | Modify | Pure `maintenanceMarkerPath` / `readMaintenanceMarker` / `shouldAdoptDespiteProbe` plus exports |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | Env-aware `maintenanceMarkerDir()`, the two guard sites, re-exports |
| `mcp_server/tests/launcher-maintenance-guard.vitest.ts` | Add | New unit test for the predicate via the launcher require |
| `mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts` | Modify | Extend the isolated harness with adopt and stale-marker negative-control cases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The daemon advertises a live maintenance scan | A background scan writes `.maintenance-active.json` naming the live child pid, refreshes it every ~20s with a 180s TTL, and removes it on every terminal exit |
| REQ-002 | The launcher adopts a busy-but-healthy daemon at both guard sites | A fresh marker naming the live child causes both the stale-reclaim adopt path and the dead-socket respawn path to adopt or refuse respawn instead of reaping |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The guard fails safe toward reaping | A missing/expired marker, a childPid mismatch, or a non-`alive` child all fall through to the normal reap, so a stale marker can never pin a dead or wedged daemon |
| REQ-004 | The marker dir resolves identically on both sides | The daemon writer and the launcher resolve the marker dir with the same `SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR` precedence, so the isolated fake-root harness resolves the same path |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The unit test (`launcher-maintenance-guard.vitest.ts`) and the isolated harness adopt and stale-marker negative-control cases pass.
- **SC-002**: A healthy scan keeps its 20s refresh timer (and per-phase-boundary refresh) firing so the marker stays fresh and the daemon is protected, while a genuinely wedged daemon cannot fire the timer, its marker expires within the 180s TTL, and it is reaped as before.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A recently-wedged daemon is protected by its still-fresh marker | A daemon that wedges between refreshes is shielded for up to the TTL before expiry-driven reaping resumes | Accepted bounded window: the marker expires within the 180s TTL, after which the normal reap fires |
| Dependency | 018 cooperative yields | If a scan stopped yielding, its refresh timer would not fire and the marker would expire, removing protection | This is by design: the 20s refresh firing is exactly what distinguishes healthy from wedged |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. Full live confirmation (a real reindex completing end-to-end on the live daemon) is the deploy-time check, not a code question.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
