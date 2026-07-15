---
title: "Implementation Summary: Daemon supervisor probes before adopting"
description: "The spec-memory launcher now deep-probes a released daemon before adopting it, so a live-but-wedged daemon is reaped and respawned instead of bridging clients into a dead end."
trigger_phrases:
  - "daemon probe before adopt summary"
  - "wedged daemon reap respawn"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/006-operator-tooling/009-daemon-supervisor-probe-before-adopt"
    last_updated_at: "2026-06-14T19:50:00Z"
    last_updated_by: "main-agent"
    recent_action: "Applied the probe-before-adopt fix + regression test; baseline 3/3 → 4/4 vitest green"
    next_safe_action: "Run post-implementation deep-review; commit"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "009-daemon-supervisor-probe-before-adopt"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-daemon-supervisor-probe-before-adopt |
| **Completed** | 2026-06-14 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The spec-memory daemon supervisor used to decide a released daemon was healthy from two cheap checks — the pid is alive (`process.kill(pid,0)`) and a socket file exists on disk. A daemon whose event loop is wedged passes both: it is still "alive" and still owns its listening socket, but it never services a request. The launcher would adopt it "instead of reaping" and bridge every client into a dead end, so `memory_*` calls returned `ECONNREFUSED` with no path to recovery — exactly the failure that pinned a real daemon at 120% CPU for four hours while every call failed. The supervisor can now tell the difference.

### Probe before adopt

When the stale-reclaim path finds a released daemon recorded under a stale lease, it now sends a real JSON-RPC liveness probe before adopting — the same deep probe the dead-socket decision already uses, with the same tuned timeout and retry that tolerates a daemon that is merely busy mid-FTS-merge. A daemon that replies is adopted exactly as before, so warm-daemon reuse and the single-writer guarantee are unchanged. A daemon that does not reply is no longer adopted: control falls through to the stale-reclaim path's own reap-and-respawn block, which tears the wedged daemon down under the respawn lock and spawns a fresh one. The practical payoff: a wedged daemon self-heals on the next launcher invocation, with no operator `kill` needed.

### Adversarial-review hardening

A gpt-5.5 red-team of the implemented diff surfaced one consequence worth closing: the new probe adds a multi-second window between reading the stale-lease snapshot and acquiring the respawn lock, which widens a pre-existing race where two racing launchers could both reap the same orphan and spawn a second writer. The stale-reclaim path now re-reads the lease under the respawn lock and defers if the recorded `childPid` no longer matches the snapshot (a replacement already spawned), mirroring the guard the dead-socket respawn path already has. The probe call is also wrapped so a thrown probe-infrastructure error is treated as not-alive and falls through to reap, rather than aborting startup.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | Gate stale-reclaim adoption on a deep JSON-RPC probe; fall through to reap+respawn on a failed probe; re-validate the lease under the respawn lock; treat a probe throw as not-alive |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts` | Modified | Add a SIGSTOP'd-daemon regression case; thread an env override into `startSession` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The root cause was confirmed three ways before a line changed: a two-seat gpt-5.5 council investigation, a direct read of the cited launcher and bridge source, and a read-only query of the live index DB (which showed the exact 2,947 incomplete enrichments and 11,507 indexed paths the council cited). The fix reuses an existing, unit-tested probe primitive rather than inventing a new liveness check. Verification used the real-launcher durability suite in isolated temp roots, so it never touched the production daemon. A scoped `git stash` captured the pre-fix baseline (3/3 cases green) before the change; after it, the suite runs 4/4 green, the new case being a daemon frozen with `SIGSTOP` that is reaped and replaced with the single-writer invariant intact.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse `probeLeaseHolderWithRetries` instead of a new check | It already speaks the daemon's JSON-RPC, already detects a hung daemon, and is already tuned to not false-reap a busy-but-responsive daemon. A second liveness mechanism would be a second thing to keep correct. |
| Fall through to the stale-reclaim block's own reap+respawn | That block already reaps the orphan under the respawn lock and spawns a fresh daemon. Routing through the shared `respawnAfterDeadSocket` would not work here — it expects the owner lease to match the old daemon's pid, but on this path the launcher itself owns the lease, so it always reports "superseded". |
| Simulate the wedge with `SIGSTOP` in the test | A stopped process is alive to `kill(pid,0)`, keeps its socket, and never answers a request — the same observable state as a busy-loop, and deterministic to produce. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check` on the edited launcher | PASS |
| `probeLeaseHolderWithRetries` exported + required | PASS (`typeof === 'function'`) |
| Pre-fix baseline (durability suite, stashed change) | PASS — 3/3 cases, 14.37s |
| Post-fix durability suite | PASS — 4/4 cases, 26.40s (delta: +1 new case, 0 regressions) |
| New hung-daemon case: SIGSTOP'd daemon reaped+respawned, single writer | PASS |
| Re-run after review hardening (revalidation + throw-safety) | PASS — 4/4, 26.35s |
| Adversarial review of the diff (gpt-5.5 xhigh) | 2 P1 + 3 P2; P1-001 + P2-002 fixed, rest documented |
| Comment hygiene (no spec-path/packet-id in code comments) | PASS — durable WHY only |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **This fixes recovery, not the trigger.** The daemon still gets wedged by an unbounded background-enrichment loop in `handlers/memory-save.ts` (`scheduleBackgroundEnrichment`). That root cause #1 is out of scope here and tracked separately; this packet ensures the supervisor recovers from it.
2. **Reaping a wedged daemon SIGKILLs it with an uncheckpointed WAL.** SQLite's WAL is crash-safe and the replacement daemon rebuilds the FTS shadow at boot, so the index is preserved, but recovery is not a clean checkpoint.
3. **The 7s reap grace is fixed.** A wedged (e.g. SIGSTOP'd) daemon ignores SIGTERM, so reap always waits the full `RESPAWN_REAP_GRACE_MS` before SIGKILL. Recovery on the next launch takes roughly ten seconds, not instant.
4. **False-reap budget is inherited, not tightened (review P1-002).** A synchronous maintenance window longer than the probe budget (5s first + 1.5s retry) reads like a wedge and would reap a live-but-busy daemon. This is the same budget the dead-socket bridge decision already uses; the authors tuned 5s against FTS-merge windows (`launcher-ipc-bridge.cjs` probe comment). Left as the existing accepted tradeoff rather than diverging the adopt path's budget.
5. **Adopt-success double-probe (review P2-001).** A daemon that passes the adopt-gate probe but wedges before the downstream bridge probe is left for the next launcher to recover (self-heals next launch). Not worth restructuring the bridge path.
6. **Concurrent-race regression test deferred (review P2-003).** The post-lock revalidation is exercised on its no-op path by the single-launcher test; a deterministic two-launcher race test needs timing injection and would be flaky, so it is omitted in favor of the verified guard.
<!-- /ANCHOR:limitations -->
