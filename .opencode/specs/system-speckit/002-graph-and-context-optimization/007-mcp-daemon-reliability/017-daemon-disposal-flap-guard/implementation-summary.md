---
title: "Implementation Summary: Daemon disposal relaunch-flap guard"
description: "The mk-spec-memory launcher no longer respawns its daemon under a disposing owner session — a fire-time orphan/shutdown gate stops the SIGTERM/relaunch flap that dropped bridged transports."
trigger_phrases:
  - "daemon disposal flap done"
  - "launcher relaunch guard summary"
  - "mcp respawn fix summary"
  - "orphan gate implemented"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/007-mcp-daemon-reliability/017-daemon-disposal-flap-guard"
    last_updated_at: "2026-06-07T15:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Added disposal-gate unit test + catalog/playbook 421 (20/20 launcher tests pass)"
    next_safe_action: "Runtime-verify flap-stop on a fresh session; then RC-2 ownership re-election"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-017-daemon-disposal-flap-guard"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Report said the launcher doesn't set its shutdown flag — true? -> No; it does. The gap is the disposal race (250ms relaunch fires before the launcher SIGTERM)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 017-daemon-disposal-flap-guard |
| **Completed** | 2026-06-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The `mk-spec-memory` daemon no longer flaps when a session ends. Before this, an owner session's disposal sent `SIGTERM` to the shared daemon child, and the launcher's supervisor respawned it on a 250 ms backoff — under a runtime that was already going away — so the fresh daemon was killed again ~1 s later. Every session bridged to that daemon saw its MCP transport drop. This is the exact failure a two-model investigation (Opus 4.8 + gpt-5.5 xhigh) reproduced live, and it sits squarely in the owner-shutdown territory v3.5.0.2 explicitly deferred.

### The fire-time gate

The supervisor still schedules the relaunch, but the timer callback now re-checks reality at the moment it fires: if the launcher is shutting down, or its owning runtime has gone away (the launcher's parent pid changed / reparented to 1), it releases the owner lease and exits cleanly instead of respawning. Because the MCP host spawns the launcher directly, the parent-pid signal is a reliable "owner disposed" indicator. Crash-recovery and RSS-recycle are untouched: both run with the owner alive and no shutdown in progress, so the gate is a no-op for them and the daemon respawns as before.

### What this deliberately does NOT do

This stops the dominant flap with a small, additive, reversible change. It does not yet implement the complete RC-2 fix (keep the shared daemon alive across an owner's exit by re-electing ownership to a live secondary), nor the related deferred items. Those are recorded as the next phases.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | `LAUNCHER_INITIAL_PPID` const + fire-time gate in the `scheduleRelaunch` callback; the gate now calls (and re-exports) the extracted predicate |
| `.opencode/bin/lib/model-server-supervision.cjs` | Modified | Extracted the pure `shouldAbortRelaunchOnFire` predicate next to `shouldSkipLaunch` / `superviseChildExit` so the gate is unit-testable |
| `mcp_server/tests/launcher-watchdog.vitest.ts` | Modified | Five `shouldAbortRelaunchOnFire` unit cases: owner-alive, shutdown, changed-ppid, orphan-to-1, crash/recycle |
| `feature_catalog/pipeline-architecture/mcp-launcher-owner-disposal-relaunch-gate.md` (+ `feature_catalog.md`) | Added | Feature catalog entry + index registration |
| `manual_testing_playbook/pipeline-architecture/mcp-launcher-owner-disposal-relaunch-gate.md` (+ `manual_testing_playbook.md`) | Added | Playbook scenario 421 + index table row + count reconciliation (385->386 scenario / 319->320 catalog) |

### Test, catalog, and playbook coverage

The fix shipped as an inline conditional, which left the fire-time gate logic untested. To close that, the predicate was extracted into a pure helper in the supervision library (matching the existing `shouldSkipLaunch` / `superviseChildExit` pattern) and re-exported from the launcher, so the watchdog suite now asserts all five branches without spawning a process. A feature-catalog entry and playbook scenario 421 document the behavior and its verification commands; the playbook's deterministic file-count self-check was reconciled to 386 (it had drifted to an asserted 384 while the committed tree already held 385).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The investigators' cited lines were verified against the real launcher first — which corrected the report's framing (the launcher already guards its own shutdown; the true gap is the disposal race, not a missing flag). The change is additive and was checked with `node --check` (clean) and the launcher vitest suite: launcher-watchdog 15/15, plus clean-close-barrier + clean-close-reap + session-proxy + ipc-bridge-probe 39/39 — 54 tests, no regression to the recycle/crash/reap paths. Runtime confirmation (observing the flap actually stop) is owed to the next fresh session, because a `.cjs` launcher change only activates when a new launcher process starts.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Verify the report against first-party code before coding | The report said "the launcher doesn't set its shutdown flag"; the code shows it does (`launcherShutdownInProgress` + timer cancel). The real cause is the 250 ms relaunch racing the launcher's own SIGTERM |
| Gate at relaunch FIRE-time, not schedule-time | By the time the backoff fires, the disposing parent has usually exited, so the orphan signal is reliable then |
| Use parent-pid (orphan) detection | The MCP host is the launcher's direct parent, so a ppid change cleanly means "owning runtime gone"; strictly additive (parent alive = no-op, no regression) |
| Ship the small safe fix; defer RC-2 | The complete daemon-outlives-owner fix is larger and needs runtime validation; this stops the dominant flap now with low risk |
| Leave mk-code-index for a separate phase | Its raw-bridge no-reconnect failure mode is a different change (port the session-proxy) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check` launcher + supervision lib | PASS |
| launcher-watchdog vitest (incl. 5 new disposal-gate cases) | PASS (20/20) |
| clean-close + reap + session-proxy + ipc-probe vitest | PASS (39/39) |
| recycle/crash-recovery preserved (logic + tests) | PASS |
| comment-hygiene (durable WHY, no ids/paths) | PASS |
| feature-catalog + playbook entries link-resolve + count self-check (386) | PASS |
| `validate.sh --strict` (this packet) | PASS |
| Runtime flap-stop on fresh session | DEFERRED (`.cjs` activates on a fresh launcher) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Runtime-unverified this session.** The gate predicate is now unit-tested across all five branches, but the launcher change activates only on a fresh launcher process, so the end-to-end flap-stop is confirmed by syntax + unit tests + code logic, not by live observation yet.
2. **Orphan detection assumes the parent dies.** If a disposal leaves a persistent wrapper as the launcher's parent, the ppid won't change and the gate falls back to prior behavior (no regression, but no help in that case). The complete fix is RC-2.
3. **Partial vs the full report.** Only the dominant flap is fixed. Deferred to follow-up phases: RC-2 (daemon outlives owner via ownership re-election), the `mk-code-index` reconnecting proxy, dead-socket reap requiring N probe failures, `CLAUDE_SESSION_PID` flow / `orphan-mcp-sweeper` schedule (the Stop-hook is currently a no-op and orphans accumulate), and a persistent launcher log for attributable future incidents.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
