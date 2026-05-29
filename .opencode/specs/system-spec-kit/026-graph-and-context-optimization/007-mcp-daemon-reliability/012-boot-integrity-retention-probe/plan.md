---
title: "Implementation Plan: boot integrity-check + retention durability + probe fix"
description: "Add a marker-gated detect-only boot FTS integrity-check with the marker path from getDbPath, make the retention sweep durable after deletes with guarded vacuum and checkpoint, and require a deepProbe JSON-RPC reply on the bridge reap decision with a 5000ms clamped timeout."
trigger_phrases:
  - "boot integrity check plan"
  - "retention durability plan"
  - "probe deepProbe reap plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/012-boot-integrity-retention-probe"
    last_updated_at: "2026-05-29T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented boot integrity-check, retention durability, probe deepProbe fix"
    next_safe_action: "Run strict packet validation"
    blockers: []
    session_dedup:
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000012a1"
      session_id: "007-012-boot-integrity-retention-probe-plan"
      parent_session_id: null
    key_files:
      - "spec.md"
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Boot Integrity-Check + Retention Durability + Probe Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript MCP server + Node CJS launcher bridge |
| **Framework** | `@modelcontextprotocol/sdk`, better-sqlite3 FTS5, JSON-RPC liveness probe |
| **Storage** | `context-index.sqlite` via `vectorIndex` (WAL + FTS5) |
| **Testing** | vitest source-level and behavior tests plus the staged build/validate checks |

### Overview
Packet 010 made the at-rest WAL durable in steady state. This plan closes three remaining gaps: it detects FTS corruption at boot but only after an unclean shutdown (gated on a crash marker), it makes the retention sweep durable after deletes, and it stops the bridge from trusting a hung daemon by requiring a real JSON-RPC initialize reply with a longer, clamped probe timeout.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `sk-code` OpenCode TypeScript/Node route loaded.
- [x] Boot, vector-index, retention-sweep, and probe files read before edits.
- [x] Sibling packets 009/010 and the committed corruption runbook reviewed.

### Definition of Done
- [x] MCP server TypeScript build passes.
- [x] Targeted vitest suites pass (385+ green).
- [x] Boot integrity-check runs only when the crash marker is present.
- [x] Bridge reap decision requires a deepProbe JSON-RPC reply.
- [ ] Packet strict validation exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Detect-only boot integrity gating, transactional-then-best-effort durability, and application-level liveness: write a crash marker on open and clear it on clean close; run the integrity-check only when the marker survived; do durability reclamation outside the delete tx; and require a JSON-RPC handshake (not a bare connect) before bridging.

### Key Components
- **boot integrity-check** (`context-server.ts`): marker-gated async-after-ready FTS5 `integrity-check`, marker path from `vectorIndex.getDbPath()`.
- **crash marker** (`vector-index-store.ts`): `.unclean-shutdown` written on DB open, deleted on clean close after the WAL TRUNCATE.
- **retention durability** (`memory-retention-sweep.ts`): post-commit FTS `optimize` + guarded `incremental_vacuum` + `wal_checkpoint(TRUNCATE)`.
- **liveness probe** (`launcher-ipc-bridge.cjs`): `DEFAULT_PROBE_TIMEOUT_MS` 5000 + `deepProbe`-required reap decision.

### Data Flow
DB open writes `.unclean-shutdown` -> daemon runs -> clean close does WAL TRUNCATE then deletes the marker. On boot, if the marker is present, an async-after-ready FTS5 integrity-check runs and flags `corrupt` on failure. A retention sweep commits its delete tx, then (only if rows were deleted) runs optimize + guarded vacuum + checkpoint(TRUNCATE). A reconnect probes with `deepProbe` (JSON-RPC initialize) within 5000ms: a valid reply bridges; a hung daemon is reaped and respawned.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| boot path in `context-server.ts` | No corruption detection at startup | Add marker-gated detect-only FTS integrity-check; marker path from `getDbPath()`; set health corrupt + banner + runbook on failure | `context-server.vitest.ts` |
| DB open/close in `vector-index-store.ts` | Opens/closes the DB with a WAL TRUNCATE on close | Write `.unclean-shutdown` on open; delete it on clean close after TRUNCATE | `vector-index-store.vitest.ts` |
| retention sweep delete tx | Commits deletes, no reclamation | Add post-commit best-effort optimize + guarded incremental_vacuum + checkpoint(TRUNCATE) | `memory-retention-sweep.vitest.ts` |
| bridge reap decision in `launcher-ipc-bridge.cjs` | Reap timeout 2500ms; connect-ok could bridge | Raise to 5000ms (env + clamp); require deepProbe JSON-RPC reply | `launcher-ipc-bridge-probe.vitest.ts` |
| packet docs | New child packet | Add Level 2 docs and checklist | `validate.sh --strict` |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read `context-server.ts` boot/ready region and the health-state surface.
- [x] Read `vector-index-store.ts` open/close path and `getDbPath()`.
- [x] Read `memory-retention-sweep.ts` delete tx and `launcher-ipc-bridge.cjs` probe path.

### Phase 2: Core Implementation
- [x] Write `.unclean-shutdown` marker on open; delete on clean close after TRUNCATE.
- [x] Add marker-gated detect-only boot FTS integrity-check; derive marker path from `getDbPath()`.
- [x] Add post-delete best-effort optimize + guarded incremental_vacuum + checkpoint(TRUNCATE).
- [x] Raise probe timeout to 5000ms (env + clamp); require deepProbe on the reap decision.

### Phase 3: Verification
- [x] Add vitest assertions for boot integrity-check, deepProbe reap, and retention durability.
- [x] Run TypeScript build and the staged vitest suites.
- [ ] Run strict packet validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Build | MCP server TypeScript compilation | `npm run build --workspace=@spec-kit/mcp-server` |
| Regression | context server boot integrity, vector-index marker, retention sweep, lifecycle shutdown | vitest |
| Behavior | launcher liveness probe deepProbe reap and timeout clamp | vitest |
| Contract | Packet docs and metadata-free child packet shape | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet 009 launcher 7000ms grace | Internal | Present | The probe timeout clamp is anchored to this constant |
| Packet 010 at-rest WAL durability | Internal | Present | Steady-state autocheckpoint stays in 010; this packet adds the retention path |
| Corruption runbook `026/004/012/bug-report-memory-db-corruption.md` | Internal | Committed | The boot banner points operators here on a corrupt verdict |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: boot, retention, or probe behavior regresses.
- **Procedure**: restore the previous boot path (no marker, no integrity-check), the previous retention sweep (commit-only), and the previous probe (2500ms, connect-ok). No data migration or DB recovery is involved.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (confirm) -> Phase 2 (implement) -> Phase 3 (verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.5 hour |
| Core Implementation | Medium | 1.0 hour |
| Verification | Medium | 1.0 hour |
| **Total** | | **~2.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No auto rebuild/recover/swap path added (detect-only).
- [x] No change to `SHUTDOWN_DEADLINE_MS`, the close-time TRUNCATE, or the launcher 7000ms grace.
- [x] No change to the 010 steady-state autocheckpoint cadence.

### Rollback Procedure
1. Restore the previous boot path with no marker and no integrity-check.
2. Restore the retention sweep to commit-only with no reclamation.
3. Restore the probe to a 2500ms connect-ok decision and re-run the staged suites.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (the crash marker is a local zero-content file that self-clears on clean close)
<!-- /ANCHOR:enhanced-rollback -->
