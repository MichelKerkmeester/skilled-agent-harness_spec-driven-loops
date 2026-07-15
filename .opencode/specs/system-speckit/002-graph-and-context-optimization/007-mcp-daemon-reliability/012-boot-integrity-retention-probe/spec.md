---
title: "Feature Specification: boot integrity-check + retention durability + probe liveness fix"
description: "Add a detect-only boot FTS integrity-check gated on an unclean-shutdown crash marker, make the retention sweep durable after deletes, and require a JSON-RPC initialize reply on the liveness probe so a hung daemon is reaped instead of bridged."
trigger_phrases:
  - "boot integrity check"
  - "unclean shutdown crash marker"
  - "retention sweep durability"
  - "liveness probe deepProbe reap"
  - "026 007 012 boot integrity retention probe"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/007-mcp-daemon-reliability/012-boot-integrity-retention-probe"
    last_updated_at: "2026-05-29T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented boot integrity-check, retention durability, probe deepProbe fix"
    next_safe_action: "Run strict packet validation"
    blockers: []
    session_dedup:
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000012a0"
      session_id: "007-012-boot-integrity-retention-probe-spec"
      parent_session_id: null
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Should boot run a full rebuild on corruption? No, this packet ships detect-only; auto-recover is deferred."
---
# Feature Specification: Boot Integrity-Check + Retention Durability + Probe Liveness Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (boot integrity, at-rest durability, and hung-daemon detection hardening) |
| **Status** | implemented |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
| **Parent** | `system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability` |
| **Predecessor** | 010-at-rest-wal-durability |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Three gaps remained after packet 010 made the at-rest WAL durable. First, a daemon that died mid-write (SIGKILL/OOM/crash) could leave an FTS5 index in a torn state with no detection at the next boot, so a corrupt search index would surface only as cryptic query failures. Second, the retention sweep committed its delete transaction but never reclaimed space or truncated the WAL, so deleted rows lingered at rest in WAL and free pages. Third, the launcher liveness probe's default reap timeout (2500ms) was short enough to false-reap a busy-but-responsive daemon mid-merge, and the bridge decision could be satisfied by a bare socket connect — which would bridge a client into a HUNG daemon that accepts at libuv but never services JSON-RPC, and never respawn it.

### Purpose
Detect FTS corruption at boot when (and only when) the prior shutdown was unclean, reclaim space and truncate the WAL after retention deletes, and require a real JSON-RPC initialize reply before the bridge trusts a daemon — while giving a busy daemon enough grace (5000ms, strictly below the 7000ms launcher kill grace) to answer.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Write a `.unclean-shutdown` crash marker on DB open and delete it on clean close (after the WAL TRUNCATE), with the marker path derived from `vectorIndex.getDbPath()` so it tracks the actually-opened DB under `MEMORY_DB_PATH`.
- On boot, ONLY if the marker is present, run a detect-only async-after-ready FTS5 `integrity-check` (registerTimeout 0, unref); on failure set health `corrupt`, log a loud banner, and point to the committed runbook (`026/004/012/bug-report-memory-db-corruption.md`).
- After the retention delete transaction commits AND rows were deleted, run best-effort (each its own try/catch, OUTSIDE the tx): FTS `optimize`, a GUARDED `incremental_vacuum` (only when `auto_vacuum == INCREMENTAL`), and `wal_checkpoint(TRUNCATE)`.
- Raise `DEFAULT_PROBE_TIMEOUT_MS` from 2500 to 5000 (env `SPECKIT_PROBE_TIMEOUT_MS`, clamped strictly below the 7000ms launcher grace), and require a JSON-RPC initialize reply (`deepProbe`) — not a bare connect — on the `maybeBridgeLeaseHolder` reap decision.

### Out of Scope
- Auto rebuild / `.recover` / index swap on corruption (detect-only ships; auto-recover deferred to a follow-on).
- Changing `SHUTDOWN_DEADLINE_MS`, the close-time WAL TRUNCATE itself, the at-rest autocheckpoint cadence (010), or the launcher 7000ms grace (009).
- Adding new signal handlers or changing recovery semantics beyond detect-and-flag.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modify | Boot detect-only FTS integrity-check gated on marker presence; derive marker path from `vectorIndex.getDbPath()`; set health `corrupt` + banner + runbook pointer on failure |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` | Modify | Write `.unclean-shutdown` crash marker on DB open; delete it on clean close after the WAL TRUNCATE |
| `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts` | Modify | Post-delete best-effort FTS `optimize` + guarded `incremental_vacuum` + `wal_checkpoint(TRUNCATE)`, all outside the tx |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | Modify | Raise probe timeout to 5000ms (env + clamp); require `deepProbe` JSON-RPC initialize reply on the reap decision |
| `.opencode/skills/system-spec-kit/mcp_server/tests/*.vitest.ts` | Modify | Regression coverage for boot integrity-check, probe deepProbe reap, and retention sweep durability |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Boot must detect FTS corruption after an unclean shutdown, detect-only | A `.unclean-shutdown` marker is written on DB open and deleted on clean close; on boot, ONLY when the marker is present, an async-after-ready FTS5 `integrity-check` runs; on failure health is set `corrupt` with a loud banner and the runbook pointer; NO auto rebuild/recover/swap |
| REQ-002 | The crash-marker path must track the actually-opened DB | The marker path is derived from `vectorIndex.getDbPath()` so it stays correct under `MEMORY_DB_PATH` and never diverges from the opened DB directory |
| REQ-003 | Retention deletes must be durable at rest | After the delete transaction commits AND rows were deleted, FTS `optimize`, a guarded `incremental_vacuum`, and `wal_checkpoint(TRUNCATE)` run best-effort outside the tx; `incremental_vacuum` runs only when `auto_vacuum == INCREMENTAL` |
| REQ-004 | The liveness probe must reap a hung daemon, not bridge into it | The bridge/reap decision REQUIRES a JSON-RPC initialize reply (`deepProbe: true`) on the `maybeBridgeLeaseHolder` path; a bare connect-ok is NOT sufficient to bridge |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Probe timeout must not false-reap a busy daemon | `DEFAULT_PROBE_TIMEOUT_MS` is 5000 (env `SPECKIT_PROBE_TIMEOUT_MS`), clamped strictly below the 7000ms launcher grace from 009 |
| REQ-006 | Regression coverage must lock the three behaviors | Vitest asserts marker-gated boot integrity-check, deepProbe-required reap, and post-delete retention durability; existing daemon-reliability suites stay green |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A clean shutdown leaves no marker and skips the boot integrity-check; an unclean prior shutdown leaves the marker and triggers exactly one async-after-ready integrity-check.
- **SC-002**: A torn FTS index after an unclean shutdown sets health `corrupt`, logs the banner, and points to the runbook, with no auto rebuild attempted.
- **SC-003**: A retention sweep that deletes rows leaves a truncated WAL and reclaimed free pages (when `auto_vacuum == INCREMENTAL`); a sweep that deletes nothing performs no durability work.
- **SC-004**: A hung daemon (accepts a socket but never replies to initialize) is reaped and respawned, not bridged; a busy-but-responsive daemon within 5000ms is not false-reaped.
- **SC-005**: TypeScript build, targeted vitest suites, and strict packet validation pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Marker-dir divergence under `MEMORY_DB_PATH` writes the marker next to the wrong DB | Med | Derive the marker path from `vectorIndex.getDbPath()` (the actual opened DB) — fixed in review |
| Risk | A bare connect-ok probe bridges a client into a hung daemon and never respawns | High | Require `deepProbe` JSON-RPC initialize reply on the reap decision — corrects a P1 review regression |
| Risk | A raised probe timeout could itself mask a slow-start daemon | Low | Clamp `SPECKIT_PROBE_TIMEOUT_MS` strictly below the 7000ms launcher grace so the launcher still owns the hard kill |
| Risk | An `incremental_vacuum` against a non-INCREMENTAL DB is a no-op or error | Low | Guard on `auto_vacuum == INCREMENTAL` before running it |
| Dependency | Packet 009 launcher 7000ms grace | High | The probe timeout clamp is anchored to this constant |
| Dependency | Packet 010 at-rest WAL durability | High | This packet extends durability to the retention path; 010 owns the steady-state autocheckpoint |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The boot integrity-check runs only after an unclean shutdown and only async-after-ready (registerTimeout 0, unref), so a clean boot pays no cost.
- **NFR-P02**: Retention durability work runs only when rows were deleted, outside the delete transaction.

### Security
- **NFR-S01**: No new external interface or secret; the crash marker is a local zero-content file beside the DB.

### Reliability
- **NFR-R01**: Corruption is flagged, never silently served; the probe reaps hung daemons rather than bridging into them.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Boot Boundaries
- Clean close deletes the marker after the WAL TRUNCATE, so a subsequent clean boot skips the integrity-check entirely.
- A fatal dimension-mismatch boot loop can leave the marker present until a clean close; this costs one extra cheap read-only integrity-check per boot but never produces a false `corrupt` verdict (self-clearing).

### Retention Boundaries
- A sweep that deletes zero rows performs no `optimize`/`vacuum`/`checkpoint` work.
- `incremental_vacuum` is skipped unless `auto_vacuum == INCREMENTAL`; each durability step has its own try/catch so one failure cannot abort the others or the sweep.

### Probe Boundaries
- A daemon that accepts a socket but never replies to initialize is classified hung (deepProbe fails) and reaped, not bridged.
- A busy-but-responsive daemon that answers within 5000ms is bridged and not false-reaped.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 11/25 | Four source files plus three test files |
| Risk | 16/25 | Touches boot path, at-rest durability, and hung-daemon detection |
| Research | 9/20 | Builds on packets 009/010 and the committed corruption runbook |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-001
REQ-002
REQ-003
REQ-004
REQ-005
REQ-006
SC-001
SC-002
SC-003
SC-004
SC-005
-->
