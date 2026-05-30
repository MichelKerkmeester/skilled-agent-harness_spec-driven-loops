---
title: "Implementation Summary: Live F2 clean-close reap coverage"
description: "The F2 clean-close barrier now has real end-to-end coverage: a new test drives reapLeaseChildBeforeRespawn against actual child processes and a real marker file, proving the SIGTERM/SIGKILL reap and the clean-close determination — without the launcher-spawn flake that skipped the legacy suite."
trigger_phrases:
  - "live reap test summary"
  - "F2 clean-close coverage summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/036-infra-followup-hardening/001-live-two-launcher-test"
    last_updated_at: "2026-05-30T22:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented + verified; 5/5 green"
    next_safe_action: "Commit; then proceed to child 002"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/launcher-clean-close-reap.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003605"
      session_id: "036-001-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "RED-before is intrinsic: reapLeaseChildBeforeRespawn was unexported, so the live reap path had zero callable coverage until this packet."
---
# Implementation Summary: Live F2 clean-close reap coverage

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | system-spec-kit/036-infra-followup-hardening/001-live-two-launcher-test |
| **Completed** | 2026-05-30 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The F2 clean-close barrier — the launcher logic that decides whether a possibly-dirty database is handed to a replacement daemon — now has real end-to-end coverage. Until now only its pure helpers were unit-tested; the reap orchestration itself was untested because the one real-process launcher suite is entirely skipped as a "known launcher process lifecycle flake."

### Direct reap-function coverage (not launcher spawning)
The new `launcher-clean-close-reap.vitest.ts` imports the real `reapLeaseChildBeforeRespawn` and drives it with throwaway `node -e` children whose SIGTERM behavior selects each branch, plus a real `.unclean-shutdown` marker file whose location is pinned via `MEMORY_DB_PATH`. This deliberately avoids spawning real launcher processes — the exact thing that got the legacy suite skipped — while still exercising the genuine F2 code path: SIGTERM, the SIGKILL escalation after the grace window, and the marker-based clean-close determination. Five cases cover: marker-path resolution, already-dead child, graceful-clean (cleanClose true), graceful-dirty (marker survives → false), and ignore-SIGTERM (SIGKILL → killed → false).

### Export-only production change
`reapLeaseChildBeforeRespawn` and `uncleanMarkerPresent` are added to the launcher's `module.exports`. No reap logic changed. The `require.main === module` guard means importing the launcher never starts a daemon (verified).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | Export `reapLeaseChildBeforeRespawn` + `uncleanMarkerPresent` (export-only) |
| `mcp_server/tests/launcher-clean-close-reap.vitest.ts` | Created | Live reap-barrier test, 5 cases |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

An Opus scope+verify swarm first confirmed the reap seams (CONFIRM_GO) and mapped every dependency by symbol at HEAD. The swarm's original sketch spawned two real launcher processes; I narrowed it to direct reap-function coverage because real-launcher spawning is the documented flake source, and the operator's standing guidance is that a flaky infra test is worse than none. The reap function carries the F2 logic, so testing it directly against real children + a real marker is both deterministic and faithful. Verified by running the suite green and confirming the single SIGKILL-escalation case completes within a bounded deadline via the real 7s grace constant.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Test the reap function directly, not via spawned launchers | Real-launcher lifecycle is the exact flake that skipped launcher-lease.vitest.ts; the reap function holds the F2 logic and is deterministic in isolation |
| Pin the marker via MEMORY_DB_PATH | uncleanShutdownMarkerPath() already resolves the marker from MEMORY_DB_PATH's dirname, so the test owns the marker location with no production change |
| Export-only launcher edit | Needed callable access without touching reap behavior; require.main guard keeps importing side-effect-free |
| Skip-with-reason on unknown-eperm liveness | A hardened sandbox that hides liveness must not produce a false assertion on the wrong branch |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `launcher-clean-close-reap.vitest.ts` | PASS, 5/5 (~8.5s; the SIGKILL case pays the real 7s grace) |
| `node --check` launcher | PASS |
| Launcher export introspection (no auto-run) | PASS — reapLeaseChildBeforeRespawn + uncleanMarkerPresent callable; marker path resolves; main() not invoked |
| Launcher disk == HEAD before edit | PASS — no drift |
| Comment-hygiene audit | PASS, 0 violations |
| Packet strict-validate | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not a full two-launcher integration test.** This covers the reap function — the safety-critical core of the F2 barrier — but not the full launcher-B-bridges-then-respawns wiring end to end. The bridge respawn-on-dead decision is separately unit-tested in `launcher-ipc-bridge-probe.vitest.ts`; combining both into a real two-process test remains deferred for the same flake reason that skipped the legacy suite.
2. **One case pays the real grace window.** The ignore-SIGTERM case waits the real 7s `RESPAWN_REAP_GRACE_MS` before the SIGKILL backstop, so the suite runs ~8.5s. Bounded and deterministic, but not instant — acceptable for a single safety-critical case.
<!-- /ANCHOR:limitations -->
