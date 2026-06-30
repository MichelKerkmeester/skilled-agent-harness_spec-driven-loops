---
title: "Implementation Summary: Phase 9: daemon-reclaim-hardening"
description: "Tridimensional-liveness dead-socket reclaim landed in the code-index launcher across 9 verified chunks (probe, decision, guards, wiring, WAL hygiene, conditional CAS, PID registry), all gated by a kill-switch; 31 tests pass with no regression."
trigger_phrases:
  - "daemon reclaim hardening implemented"
  - "code-index launcher dead-socket reclaim done"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/009-daemon-reclaim-hardening"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase complete: 9 chunks landed, 31 tests green"
    next_safe_action: "Production soak: restart daemon, observe reclaim"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-session/009-daemon-reclaim-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-daemon-reclaim-hardening |
| **Completed** | 2026-06-29 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Made the code-index daemon's liveness **tridimensional** (PID + socket-serving + heartbeat) in `.opencode/bin/mk-code-index-launcher.cjs` (+ `lib/launcher-ipc-bridge.cjs` + the child `code-graph-db.ts`), so a wedged daemon (PID alive, socket dead) is reclaimed instead of returning MCP `-32000`. Every research rec + GPT-xhigh must-fix landed across 9 verified chunks:

1. `probeExistingService` socket-health probe (normalizes `probeDaemon`).
2. env helpers + `childSpawnedAtIso` + `launcherDiagnostic`.
3. pure `classifyOwnerReclaim` compound-predicate decision.
4. `ownerUidMatches` + `verifyPidIdentity` kill-guards.
5. wiring: `classifyLiveOwnerReclaim` + the final socket-veto + child-PID threading.
6. hermetic end-to-end reclaim test.
7. startup WAL hygiene (`checkpointStaleWalIfNeeded` + `wal_autocheckpoint`).
8. conditional-CAS guard (`staleLeaseUnchanged`).
9. crash-surviving `.code-graph-daemon-pid.json` registry + discovery reclaim.

Everything is gated by `reclaimDeadSocketEnabled()` (kill-switch) so the old PID+heartbeat behavior is one env var away.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

GPT 5.5 high/fast (cli-codex) implemented it in **small, isolated chunks** — the only reliable mode after two single-shot mega-dispatches timed out mid-edit (reverted to known-good each time). GPT reliably built additive/pure pieces; flow-touching wiring chunks sometimes exited 1 after applying patches (a post-work glitch) — each was verified by re-running the suite myself, kept only when clean, reverted when partial. Gate 3 was pre-answered in every prompt to stop the agent pausing for the spec-folder question.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Compound predicate + final socket-veto (not a probe-failure count) | The GPT-xhigh verification caught that a count-based kill would false-kill a busy `code_graph_scan` |
| sqlite3 CLI fallback for WAL checkpoint | The prebuilt `better-sqlite3` ABI can mismatch the launcher's Node; the fallback truncates anyway |
| Kill-switch default ON | The fix is needed; `SPECKIT_LAUNCHER_RECLAIM_DEAD_SOCKET=0` restores the old path if it misbehaves |
| Per-chunk verify+commit | Each chunk independently tested + committed by explicit path, surviving the concurrent session's churn |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cd .opencode && npx vitest run --config vitest.config.bin.ts` | 6 files / **31 tests pass** (decision, guards, reclaim-e2e, WAL, CAS, registry) |
| `node --check` (launcher + bridge) | OK |
| Full bin suite after each chunk | no regression |
| Reclaim safety (e2e) | wedge reclaimed; still-starting / fresh-heartbeat / kill-switch-off all spared |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not production-soaked.** The new launcher logic activates on the NEXT daemon launch; the live daemon was deliberately not restarted. The hermetic tests prove the behavior; a soak (restart + observe) would confirm the grace/max-init defaults (30s/120s, env-overridable) on the slowest machine.
2. **better-sqlite3 prebuilt ABI** mismatches the launcher Node in this env — the WAL checkpoint uses the sqlite3 CLI fallback; a `npm rebuild better-sqlite3` would restore the faster in-process path.
<!-- /ANCHOR:limitations -->
