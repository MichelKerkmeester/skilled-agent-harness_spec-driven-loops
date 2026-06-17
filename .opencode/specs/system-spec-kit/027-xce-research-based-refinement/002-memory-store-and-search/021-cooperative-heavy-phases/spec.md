---
title: "Feature Specification: cooperative heavy phases keep the daemon responsive [template:level_1/spec.md]"
description: "020 made a reindex's scan and post-scan embedding queue un-reaped via a maintenance marker, but un-reaped is not responsive: a blocked event loop can neither answer a competing launcher's probe nor fire the marker's 20s self-refresh, so a block exceeding the 180s TTL lets the marker go stale and a second daemon spawns. The exact ~79s blocking phase was never pinned. This phase instruments the scan to pin a true event-loop block apart from slow-but-cooperative work, fixes the one unbounded synchronous transaction (trigger-embedding-backfill) regardless, and refreshes the marker on entry to each un-yielded tail phase."
trigger_phrases:
  - "cooperative heavy phases daemon responsiveness"
  - "event loop lag instrumentation reindex scan"
  - "trigger embedding backfill chunk and yield"
  - "027 002/021"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027/002/021-cooperative-heavy-phases"
    last_updated_at: "2026-06-17T17:15:00Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Instrumented scan event-loop lag and chunked the trigger-backfill transaction"
    next_safe_action: "Run a clean single-launcher live reindex and read phase/lag logs to pin any residual block"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/trigger-embedding-backfill.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/trigger-embedding-backfill.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-002-021-cooperative-heavy-phases"
      parent_session_id: null
    completion_pct: 90
    open_questions:
      - "Which phase, if any, blocks the event loop on the live daemon (deploy-time lag read)?"
    answered_questions:
      - "Is the launcher-side adopt/reap logic the root cause? No: it correctly adopts a daemon holding a fresh marker, so no second daemon spawns while the marker is fresh."
      - "Can any enumerated synchronous phase block 79s with the trigger-backfill flag off? No: the main loop and the LIMIT-5 tail phases already yield (embeddings are out-of-process), and the orphan sweep is bounded to 200 rows."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: cooperative heavy phases keep the daemon responsive

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
| **Status** | Complete (code); deploy-time lag read pending |
| **Created** | 2026-06-17 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Spec** | ../spec.md |
| **Phase** | 21 (memory-store-and-search track) |
| **Predecessor** | 020-maintenance-grace-background-embedding |
| **Successor** | None |
| **Handoff Criteria** | The scan emits per-phase wall-clock plus an event-loop lag sample so a true block is distinguishable from slow-but-cooperative work; the unbounded trigger-backfill transaction is chunked and cancellable; each un-yielded tail phase refreshes the marker on entry; the trigger-backfill cancel/yield unit tests plus the scan-job and adoption-harness suites pass; the live single-launcher lag read is the deploy-time check |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase is the direct follow-on to 020. 018 made the reindex scan cancellable and added cooperative `setImmediate` yields to its two big tail loops. 019 wrote a `.maintenance-active.json` marker so a competing launcher adopts a busy daemon instead of reaping it. 020 extended that marker to the post-scan background-embedding queue. 020's own limitation closes the loop being opened here: *"The marker makes the daemon un-reaped while busy, it does not make it responsive."* A daemon whose event loop is blocked can neither answer a competing launcher's probe/bridge nor fire the marker's 20s self-refresh timer; if a single synchronous phase blocks longer than the 180s TTL, the marker goes stale and a second daemon spawns anyway. 020 noted the longest blocking tail phase observed (~79s) but never pinned which phase it was.

**Scope Boundary**: Making the daemon *responsive* through its heavy phases, not merely un-reaped. The instrumentation that pins the blocking phase, the one genuinely unbounded synchronous transaction (the gated trigger-embedding-backfill), and a per-tail-phase marker refresh. The launcher-side adopt/reap guard from 019 is unchanged (it was investigated and found correct).

**Dependencies**:
- The 019/020 maintenance marker (`lib/storage/maintenance-marker.ts`) and its `onPhase`-driven `refresh()`, reused unchanged.
- The 018 cooperative-yield idiom (`if (++n % N === 0) { cancel-check; await setImmediate }`) and the in-process cancel flag, reused as the pattern for the trigger-backfill chunking.

**Deliverables**:
- Scan instrumentation: per-phase wall-clock plus an event-loop lag sampler, gated to the background path.
- The trigger-embedding-backfill whole-corpus transaction chunked into per-chunk transactions that yield between chunks, with an `isCancelled` signal threaded through.
- Each un-yielded tail phase refreshes the marker on entry (via `onPhase`) so it carries a full TTL.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
020's marker keeps a busy daemon un-reaped, but a blocked event loop is still the failure mode that breaks re-election: it cannot answer a competing launcher's bridge/probe, and it cannot fire the marker's 20s self-refresh, so a synchronous phase that blocks longer than the 180s TTL lets the marker go stale and a fresh launcher spawns a second daemon. The exact phase that blocks (~79s observed in 020) was never identified, and static analysis shows that with the trigger-backfill flag off, no enumerated synchronous phase should block that long — so the blocker must be measured on the live daemon, not guessed.

### Purpose
The scan now measures event-loop lag and per-phase wall-clock so a true block is distinguishable from slow-but-cooperative work; the one unbounded synchronous transaction (trigger-embedding-backfill's whole-corpus phrase sync) is chunked and cancellable so it can never block when enabled; and each un-yielded tail phase refreshes the marker on entry so a bounded block never outlives the TTL. Together these keep the daemon responsive through its heaviest phases, and the instrumentation pins any residual blocker at deploy time.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Scan instrumentation in `handlers/memory-index.ts`: an event-loop lag sampler (`setInterval` drift, max-lag plus a per-sample block warning) and per-phase wall-clock for the un-yielded tail phases, both gated to the background path (`ctx.onPhase` present) so the synchronous foreground path stays byte-identical.
- A `timedPhase` wrapper that enters each un-yielded tail phase (orphan-sweep, enrichment-repair, trigger-backfill, near-dup-repair) via `ctx.onPhase`, which refreshes the marker, giving each phase a full TTL ahead of it.
- `lib/search/trigger-embedding-backfill.ts`: the whole-corpus `syncPhraseRows` transaction split into ~200-row chunk transactions that `await setImmediate` between chunks (never inside a transaction); an `isCancelled?` option threaded from both scan call sites; a periodic yield in the embedding loop's cache-hit fast path; a new `cancelled` result status.

### Out of Scope
- The 019/020 launcher-side adopt/reap guard, the marker schema, TTL, and dir resolution — investigated and found correct; a fresh marker already causes adoption rather than a second daemon, so no launcher change is made here.
- Adding explicit `setImmediate` yields to the already-cooperative phases (main batch loop, metadata-promoter, causal-chain) or the bounded LIMIT-5 / 200-row phases — they already yield (embeddings are out-of-process) or are too small to block; the lag sampler covers them.
- The live single-launcher force-reindex lag read; that is the deploy-time confirmation, not a code deliverable.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/handlers/memory-index.ts` | Modify | Event-loop lag sampler + `timedPhase` per-phase timing/marker-refresh; thread `isCancelled` into both trigger-backfill call sites |
| `mcp_server/lib/search/trigger-embedding-backfill.ts` | Modify | Chunk the whole-corpus transaction, yield between chunks, thread `isCancelled`, yield in the cache-hit fast path, add `cancelled` status |
| `mcp_server/tests/trigger-embedding-backfill.vitest.ts` | Modify | Add cancel-immediate, cancel-at-chunk-boundary, and cooperative-yield cases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The scan distinguishes a true event-loop block from slow-but-cooperative work | A background scan logs `[memory-index-scan] phase=<name> ms=<elapsed>` per tail phase and `event-loop blocked ~<ms>` / `max-event-loop-lag ms=<ms>` from a drift sampler; the synchronous foreground path is unchanged (instrumentation gated on `ctx.onPhase`) |
| REQ-002 | The unbounded trigger-backfill transaction can never block the loop | `syncPhraseRows` is split into ~200-row chunk transactions that `await setImmediate` between chunks (never inside a transaction); `isCancelled` returns the run early with status `cancelled`; the cache-hit fast path yields periodically |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Each un-yielded tail phase carries a full marker TTL | The orphan-sweep, enrichment-repair, trigger-backfill, and near-dup-repair phases each enter via `timedPhase`, which fires `ctx.onPhase` and thereby `maintenance.refresh()`, so a bounded block in any one of them never outlives the 180s TTL |
| REQ-004 | The launcher root-cause question is resolved | The launcher adopt/reap path is confirmed to adopt a daemon holding a fresh marker (no second daemon while the marker is fresh), so the residual gap is daemon-side marker staleness, which REQ-001..003 address; no launcher code is changed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `tsc --noEmit` is clean and the trigger-backfill cancel/yield unit tests plus the existing scan-job and daemon-reelection adoption-harness suites pass.
- **SC-002**: A clean single-launcher live force reindex emits the phase and lag logs; if any phase shows an event-loop block exceeding the launcher probe timeout, the 018 chunk-and-yield is applied to that phase. The daemon pid is unchanged throughout and `vec == fts` (deploy verification).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A yield placed inside a `database.transaction()` would corrupt or partial-commit | better-sqlite3 transactions are synchronous; an `await` inside one suspends an open write transaction | The chunk loop yields strictly BETWEEN self-contained chunk transactions; a durable code comment mirrors the existing 018 comment, and the cancel/yield unit tests assert the chunk boundary |
| Risk | Per-chunk atomicity replaces whole-corpus atomicity in the trigger-backfill | A mid-sync cancel leaves a partial phrase sync | Safe because the upserts are idempotent (`ON CONFLICT DO UPDATE`) and the deletes are per-memory-id, so the next scan reconciles a partial state |
| Dependency | The 019/020 marker and its `onPhase` refresh | This phase refreshes the marker per tail phase and reuses the schema unchanged | The launcher reads the marker exactly as in 019/020; only the refresh cadence (per tail phase) is widened |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which phase, if any, actually blocks the event loop on the live daemon? Static analysis exonerates every enumerated synchronous phase when the trigger-backfill flag is off, so the lag sampler must pin it on a clean single-launcher live reindex. That read is the deploy-time check, and applying the 018 yield to whatever it fingers is the only remaining branch.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
