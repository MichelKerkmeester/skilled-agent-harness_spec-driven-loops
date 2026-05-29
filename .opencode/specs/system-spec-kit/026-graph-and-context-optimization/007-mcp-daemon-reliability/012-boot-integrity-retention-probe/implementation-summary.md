---
title: "Implementation Summary: boot integrity-check + retention durability + probe fix"
description: "The daemon now writes an unclean-shutdown crash marker and runs a detect-only boot FTS integrity-check only when it survived, the retention sweep reclaims space and truncates the WAL after deletes, and the liveness probe requires a JSON-RPC initialize reply within 5000ms before bridging."
trigger_phrases:
  - "boot integrity check summary"
  - "retention durability summary"
  - "deepProbe reap fix summary"
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
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000012a3"
      session_id: "007-012-boot-integrity-retention-probe-impl"
      parent_session_id: null
    key_files:
      - "spec.md"
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `012-boot-integrity-retention-probe` |
| **Completed** | 2026-05-29 |
| **Level** | 2 |
| **Status** | implemented |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Three durability and liveness guards landed on top of packet 010. First, a detect-only boot FTS integrity-check: `vector-index-store.ts` writes a `.unclean-shutdown` crash marker on DB open and deletes it on clean close (after the WAL TRUNCATE); on boot, ONLY when the marker is present, `context-server.ts` runs an async-after-ready (registerTimeout 0, unref) FTS5 `integrity-check` — on failure it sets health `corrupt`, logs a loud banner, and points to the committed runbook (`026/004/012/bug-report-memory-db-corruption.md`). There is NO auto rebuild/`.recover`/swap (detect-only; auto-recover deferred). The marker path is derived from `vectorIndex.getDbPath()` (the actually-opened DB) so it stays correct under `MEMORY_DB_PATH` — a review fix. Second, retention-sweep durability: after the delete transaction commits AND rows were deleted, `memory-retention-sweep.ts` runs best-effort (each its own try/catch, OUTSIDE the tx) FTS `optimize`, a GUARDED `incremental_vacuum` (only when `auto_vacuum == INCREMENTAL`), and `wal_checkpoint(TRUNCATE)`. Third, a liveness-probe fix: `launcher-ipc-bridge.cjs` raises `DEFAULT_PROBE_TIMEOUT_MS` from 2500 to 5000 (env `SPECKIT_PROBE_TIMEOUT_MS`, clamped strictly below the 7000ms launcher grace from 009), and the reap/bridge decision now REQUIRES a JSON-RPC initialize reply (`deepProbe`), not a bare socket connect — so a hung daemon is reaped and respawned instead of bridged into.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modified | Marker-gated detect-only boot FTS integrity-check; marker path derived from `vectorIndex.getDbPath()`; health corrupt + banner + runbook pointer on failure |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` | Modified | Write `.unclean-shutdown` crash marker on DB open; delete it on clean close after the WAL TRUNCATE |
| `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts` | Modified | Post-delete best-effort FTS optimize + guarded incremental_vacuum + checkpoint(TRUNCATE), outside the tx |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | Modified | Probe timeout 2500->5000 (env + clamp); deepProbe JSON-RPC reply required on the reap decision |
| `.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts` | Modified | Assert marker-gated boot integrity-check behavior |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-ipc-bridge-probe.vitest.ts` | Modified | Assert deepProbe-required reap and probe timeout clamp |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-retention-sweep.vitest.ts` | Modified | Assert post-delete durability work and the guarded incremental_vacuum |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/012-boot-integrity-retention-probe/*.md` | Created | Packet documentation and checklist |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The change is intentionally scoped to detection and reclamation, not recovery. The boot integrity-check is gated on the crash marker so a clean boot pays no cost, and runs async-after-ready so it never blocks readiness. A focused adversarial review found one P1 and two LOW issues. The P1: the initial implementation made connect-ok the production default on the reap path, which would bridge a client into a hung daemon (one that accepts a socket but never services JSON-RPC) and never respawn it — disabling hung-daemon detection. This was fixed by passing `deepProbe: true` on the `maybeBridgeLeaseHolder` path so the decision requires a real JSON-RPC initialize reply; the raised 5000ms timeout alone prevents false-reaping a busy-but-responsive daemon mid-merge. The two LOW issues: marker-dir divergence under `MEMORY_DB_PATH` (FIXED by deriving the marker path from `getDbPath()`), and the marker lingering after a fatal dimension-mismatch boot loop (DOCUMENTED — bounded, self-clearing, one extra cheap read-only integrity-check per boot, no false `corrupt` verdict).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Ship detect-only, defer auto-recover | Detection is the safe, low-risk first step; an automatic rebuild/recover/swap is a larger follow-on with its own failure modes |
| Gate the boot integrity-check on a crash marker | A clean shutdown should pay no boot cost; only an unclean prior shutdown warrants the check |
| Derive the marker path from `vectorIndex.getDbPath()` | The marker must sit beside the actually-opened DB, including under `MEMORY_DB_PATH` (review fix) |
| Require deepProbe (not connect-ok) on the reap decision | A bare socket connect would bridge into a hung daemon and never respawn it; only a JSON-RPC reply proves liveness (P1 review fix) |
| Raise probe timeout to 5000ms, clamped below 7000ms | Gives a busy daemon time to answer without false-reaping, while the launcher still owns the hard kill grace |
| Run retention durability outside the tx, each step guarded | Reclamation failures must never abort the committed delete or each other; `incremental_vacuum` only when `auto_vacuum == INCREMENTAL` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run build --workspace=@spec-kit/mcp-server` (tsc) | PASS |
| Targeted vitest suites (context-server, launcher-ipc-bridge-probe, memory-retention-sweep, lifecycle-shutdown, vector-index-store) | PASS (385+ green) |
| Boot integrity-check gated on marker presence | PASS |
| deepProbe required on reap decision; probe timeout clamped below 7000ms | PASS |
| Focused adversarial review | 1 P1 (probe connect-ok regression, FIXED) + 2 LOW (marker-dir divergence FIXED; marker lingers after fatal boot loop DOCUMENTED) |
| `validate.sh --strict` | Target 0/0 (pending run) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Auto-recover is intentionally deferred.** This packet ships detect-only; an automatic rebuild/`.recover`/swap on a corrupt verdict is a follow-on.
2. **The crash marker can persist after a fatal dimension-mismatch boot loop.** It survives until a clean close, costing one extra cheap read-only integrity-check per boot — bounded, self-clearing, and never a false `corrupt` verdict.
3. **Steady-state autocheckpoint stays in packet 010.** This packet adds durability only on the retention-delete path and the boot detection path.
<!-- /ANCHOR:limitations -->
