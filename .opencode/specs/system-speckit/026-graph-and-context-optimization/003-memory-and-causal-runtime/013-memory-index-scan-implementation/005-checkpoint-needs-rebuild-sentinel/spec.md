---
title: "Feature Specification: checkpoint-v2 .needs-rebuild Sentinel (durable post-restore rebuild-failure marker)"
description: "After a checkpoint-v2 restore, runPostRestoreRebuilds() rebuilds FTS/communities/derived-graph best-effort and catches failures, so the restore reports SUCCESS while derived artifacts stay stale until some later scan. This packet writes a durable .needs-rebuild sentinel on a post-restore rebuild failure and repairs it on boot and before the startup scan, clearing it on success."
trigger_phrases:
  - "checkpoint needs-rebuild sentinel"
  - "post-restore derived rebuild failure"
  - "stale derived after checkpoint restore"
  - "boot derived rebuild repair"
  - "checkpoint-v2 rebuild marker"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/005-checkpoint-needs-rebuild-sentinel"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored checkpoint sentinel packet plan from follow-up research"
    next_safe_action: "Implement .needs-rebuild sentinel write + boot/scan repair on branch"
    blockers: []
    key_files:
      - "mcp_server/lib/storage/checkpoints.ts"
      - "mcp_server/context-server.ts"
      - "mcp_server/handlers/memory-index.ts"
      - "mcp_server/lib/search/vector-index-store.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "checkpoint-sentinel-packet-setup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: checkpoint-v2 .needs-rebuild Sentinel

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

A checkpoint-v2 restore reopens the database and then rebuilds derived artifacts (FTS index, community partitions, derived graph) best-effort. Those rebuilds are wrapped in try/catch, so when one fails the restore still returns SUCCESS and the base snapshot is valid, but FTS, community, and derived-graph state stay stale with nothing scheduled to repair them until an unrelated scan happens to re-index. This packet adds a durable `.needs-rebuild` sentinel that is written when a post-restore derived rebuild fails or is skipped, then checked on boot and immediately before the scheduled startup scan to run a bounded, non-fatal derived rebuild that clears the sentinel on success.

**Key Decisions**: Write a durable sentinel and repair on boot/scan (not fail the restore, not leave the existing silent stale window); export ONE shared derived-rebuild helper reused by restore, boot, and scan to avoid divergent rebuild implementations.

**Critical Dependencies**: `runPostRestoreRebuilds()` and `restoreCheckpointV2()` in `mcp_server/lib/storage/checkpoints.ts`; the boot/startup-scan sequencing in `mcp_server/context-server.ts`.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-06-02 |
| **Branch** | `005-checkpoint-needs-rebuild-sentinel` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After a checkpoint-v2 restore, `runPostRestoreRebuilds()` (`mcp_server/lib/storage/checkpoints.ts`, approx lines 1701-1772) rebuilds derived artifacts (FTS, communities, derived graph) best-effort and catches failures; `restoreCheckpointV2()` (approx lines 2456-2464) calls it after the DB swap and reopen. If a rebuild step fails, the restore still reports SUCCESS while the FTS, community, and derived-graph artifacts remain stale until some later scan re-indexes them. The existing boot FTS auto-heal is tied to the `.unclean-shutdown` marker (`mcp_server/context-server.ts`, approx lines 364-418), NOT to checkpoint-restore rebuild failures, and the startup scan (approx lines 1385-1477) indexes files and runs mutation hooks but does NOT invoke the checkpoint derived-rebuild helper, so a post-restore rebuild failure leaves a silent stale-derived window.

### Purpose
A post-restore derived-rebuild failure becomes self-healing: a durable `.needs-rebuild` sentinel triggers an immediate, bounded, non-fatal derived rebuild on the next boot and before the startup scan, and the sentinel is cleared on success.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Make `runPostRestoreRebuilds()` return a summary `{completed, failed, skipped}` and export ONE shared derived-rebuild helper reused by restore, boot, and the scan path.
- Add `.needs-rebuild` path/write/clear helpers near the restore-journal helpers in `checkpoints.ts`.
- Write the sentinel from `restoreCheckpointV2()` when the rebuild summary reports failed or skipped steps; the restore still returns success.
- Check the sentinel on boot (after DB init) and immediately before the scheduled startup scan in `context-server.ts`; run the bounded derived rebuild; clear the sentinel on success.
- Check the sentinel under the scan lease in `memory-index.ts` and report repair counts in the response, additive and in a region distinct from packet 004's enrichment backfill.
- Preserve/create rebuild-needed state for swap-done journal recovery in `vector-index-store.ts` where post-restore rebuild evidence is absent.
- Unit tests for sentinel write, successful repair (clear), failed repair (retained), and swap-done journal recovery semantics.

### Out of Scope
- Deploying the change - no `dist/` rebuild, no daemon restart, no touching the live DB - because this packet is implemented and unit-tested on a branch only and deploy is a separate confirmed step.
- Failing the restore on a derived-rebuild failure - rejected as too harsh because the source snapshot restored correctly.
- Changing the `.unclean-shutdown` boot FTS auto-heal contract - it stays as is and the sentinel path is additive.
- Reworking the enrichment backfill owned by packet 004 - this packet keeps its `memory-index.ts` edit additive and in a distinct region.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| mcp_server/lib/storage/checkpoints.ts | Modify | Return a rebuild summary, export one shared derived-rebuild helper, add `.needs-rebuild` helpers, write the sentinel on failed/skipped rebuild. |
| mcp_server/context-server.ts | Modify | Check the sentinel after DB init and before the startup scan; run the bounded derived rebuild; clear on success. |
| mcp_server/handlers/memory-index.ts | Modify | Check the sentinel under the scan lease and report repair counts; additive, distinct region from packet 004. |
| mcp_server/lib/search/vector-index-store.ts | Modify | Preserve/create rebuild-needed state for swap-done journal recovery where rebuild evidence is absent. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A restore whose post-restore derived rebuild fails or skips writes a durable `.needs-rebuild` sentinel and still returns success. | A unit test forces a rebuild-step failure during `restoreCheckpointV2()`, asserts the restore result is success, and asserts the `.needs-rebuild` file exists on disk. |
| REQ-002 | Boot and the pre-scan checkpoint run a bounded, non-fatal derived rebuild when the sentinel is present and clear it on success. | A unit test starts with the sentinel present, runs the boot/pre-scan repair, asserts derived artifacts rebuilt, and asserts the sentinel file is removed. |
| REQ-003 | One shared derived-rebuild helper is exported and reused by restore, boot, and scan (no divergent rebuild implementation). | Grep shows a single exported helper referenced by `restoreCheckpointV2()`, the boot/pre-scan path, and the scan path; no duplicated rebuild body. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | A failed repair leaves the sentinel in place and never blocks boot or the scan. | A unit test forces the repair to throw, asserts boot/scan still complete, and asserts the sentinel still exists for a later retry. |
| REQ-005 | The scan path checks the sentinel under its lease and reports repair counts, additive and in a region distinct from packet 004. | A unit test runs the scan with the sentinel present, asserts the repair count is reported, and a diff review confirms the edit region does not overlap packet 004's enrichment backfill. |
| REQ-006 | Swap-done journal recovery preserves or creates rebuild-needed state when post-restore rebuild evidence is absent. | A unit test drives swap-done journal recovery without rebuild evidence and asserts the rebuild-needed state (sentinel or equivalent) is present afterward. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A post-restore derived-rebuild failure no longer leaves a silent stale-derived window; the sentinel guarantees a bounded repair attempt on the next boot and before the startup scan.
- **SC-002**: The restore success contract is unchanged for a valid base snapshot, and a single shared rebuild helper backs restore, boot, and scan, with all new and affected vitest suites and `validate.sh --strict` passing for this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `runPostRestoreRebuilds()` / `restoreCheckpointV2()` in `checkpoints.ts` | Sentinel write hangs off the rebuild summary; wrong wiring leaves the window open | Read current code first; thread a `{completed, failed, skipped}` summary out of the rebuild helper and write the sentinel only on failed/skipped. |
| Dependency | Boot + startup-scan sequencing in `context-server.ts` | Sentinel check placed wrong runs the rebuild too early or never | Check after DB init and again immediately before the scheduled startup scan; both call the shared bounded helper. |
| Risk | Heavy derived rebuild at boot | Slow or stalled startup | Run the rebuild bounded and non-fatal, log it, and schedule it right before the startup scan. |
| Risk | Infinite sentinel retry on a persistently failing rebuild | Repeated work every boot | Leave the sentinel on failure but never block boot or scan; repair is best-effort each cycle. |
| Risk | Divergent rebuild implementations across restore/boot/scan | Drift and inconsistent derived state | Export ONE shared derived-rebuild helper and reuse it everywhere. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The boot and pre-scan sentinel checks add only a cheap file-existence probe on the no-sentinel hot path; the bounded rebuild runs only when the sentinel is present.

### Security
- **NFR-S01**: The sentinel is a local on-disk marker beside the existing restore-journal artifacts; no new external surface, network call, or credential is introduced.

### Reliability
- **NFR-R01**: A repair failure is non-fatal and idempotent across retries - the sentinel persists until a rebuild succeeds, and the base snapshot is never mutated by the repair path.

---

## 8. EDGE CASES

### Data Boundaries
- Sentinel present but derived artifacts already current: the bounded rebuild is safe to run and clears the sentinel; repeated repair yields the same derived state.
- Sentinel absent on boot/scan: the cheap existence probe short-circuits and no rebuild runs.

### Error Scenarios
- Rebuild throws during boot or scan: the error is caught and logged, boot/scan continue, and the sentinel is retained for the next cycle.
- Swap-done journal recovery with no post-restore rebuild evidence: rebuild-needed state is preserved or created so the next boot still repairs.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Files: 4, LOC: small-medium, Systems: checkpoint restore + boot + scan + vector store |
| Risk | 14/25 | Auth: N, API: N, Breaking: N (restore success contract preserved); startup-path timing sensitivity |
| Research | 8/20 | Investigation needs: confirm current line ranges and rebuild-summary shape before editing |
| Multi-Agent | 4/15 | Workstreams: 1 |
| Coordination | 8/15 | Dependencies: shares `memory-index.ts` with packet 004 (keep additive + distinct) |
| **Total** | **46/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Heavy derived rebuild at boot stalls startup | M | M | Bounded + non-fatal rebuild, logged, scheduled right before the startup scan. |
| R-002 | Persistently failing rebuild retries every boot | L | M | Sentinel is retained on failure but never blocks boot or scan. |
| R-003 | Divergent rebuild implementations drift across restore/boot/scan | M | L | Single exported shared derived-rebuild helper reused everywhere. |
| R-004 | `memory-index.ts` edit collides with packet 004's enrichment backfill | M | L | Keep the sentinel check additive and in a distinct region to ease later integration. |

---

## 11. USER STORIES

### US-001: Self-healing derived artifacts after a degraded restore (Priority: P0)

**As an** operator running the memory MCP, **I want** a post-restore derived-rebuild failure to repair itself on the next boot, **so that** FTS, community, and derived-graph search stop silently returning stale results.

**Acceptance Criteria**:
1. Given a restore whose derived rebuild fails, When the restore completes, Then it returns success and a `.needs-rebuild` sentinel is written.
2. Given the sentinel is present, When the daemon next boots and before the startup scan, Then a bounded derived rebuild runs and clears the sentinel on success.

---

### US-002: Bounded, non-blocking repair (Priority: P1)

**As an** operator, **I want** the repair to be bounded and non-fatal, **so that** a failing rebuild never blocks daemon startup or the scan and is retried on the next cycle.

**Acceptance Criteria**:
1. Given the repair throws, When boot or the scan runs the bounded rebuild, Then boot/scan still complete and the sentinel is retained for a later retry.

---

## 12. OPEN QUESTIONS

- The follow-up research recommended DEFERRING this work, but the operator explicitly authorized implementing it now alongside packet 004; this packet is therefore active by operator decision rather than by the research recommendation.
- Whether a future change should bound sentinel retries (for example, a backoff or attempt counter) is left open; the current contract is to retry best-effort each boot/scan cycle without ever blocking.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
