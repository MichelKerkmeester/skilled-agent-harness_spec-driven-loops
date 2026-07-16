---
title: "Implementation Summary: Daemon-reliability follow-ups"
description: "Shipped the missing orphan-sweep LaunchAgent template, a hermetic re-election release-vs-kill integration test, a real scenario 419 re-run, and a cli MCP sessionId scoping caveat."
trigger_phrases:
  - "daemon reliability follow-ups done"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/007-mcp-daemon-reliability/026-daemon-reliability-followups"
    last_updated_at: "2026-06-07T21:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All four follow-ups complete and verified; committing"
    next_safe_action: "Commit and push the packet"
    blockers: []
    key_files:
      - ".opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist"
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-release-integration.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-026-daemon-reliability-followups"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
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
| **Spec Folder** | 026-daemon-reliability-followups |
| **Completed** | 2026-06-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The four follow-ups from the anti-disconnection investigation are closed, and re-election now has a real live test it never had.

### Orphan-sweep LaunchAgent template

Scenario 419 lints a LaunchAgent template that was never committed, so it always failed. The template now exists at `.opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist`. It runs the sweeper in dry-run with a log path, so merely loading it is non-destructive, and it does not fire on load. An operator activates it deliberately. `plutil -lint` reports OK.

### Hermetic re-election integration test

Re-election had only unit coverage. A raw live spawn was unsafe because the launcher's lease and DB dir are hardcoded relative to the script with no env override, so a spawned real launcher would bridge to or clobber the live owner. An opus council resolved the design: a hermetic test that requires the real exported decision functions (`contextServerSpawnIo`, `shouldReleaseDaemonForReelection`, `daemonReelectionEnabled`) and drives real OS process semantics with a sleeper stand-in. It asserts that with the flag on the owner's SIGTERM releases the detached daemon and it survives, and with the flag off it kills the daemon. It never opens a daemon DB, socket, or lease, and it reaps only the pids it spawns. The test passes three of three and the live daemon pid is unchanged after the run.

### Scenario 419 re-run for real

With the template in place, scenario 419 was run end to end for real: both syntax checks pass, the plist lint that used to fail now passes, the dry-run sweep is non-destructive and shows preserve decisions for live sessions, and the idle-timeout knob is discoverable in the docs.

### cli MCP session scoping caveat

A dispatched cli sub-session that calls memory tools with a parent or foreign sessionId gets `E_SESSION_SCOPE`. That is an intended session-spoofing guard, not a bug. The shared cli memory-handback reference now documents it: omit `sessionId` so the server generates one, then reuse the `effectiveSessionId` it returns.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist` | Created | Dry-run-default LaunchAgent template that 419 lints |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-release-integration.vitest.ts` | Created | Hermetic release-vs-kill integration test |
| `.opencode/skills/system-spec-kit/references/cli/memory_handback.md` | Modified | MCP session scoping caveat |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The one hard item, a safe live re-election test, went to a two-seat opus council via the separate claude2 account so the seats were truly independent processes. One seat returned a comprehensive, source-cited design and a clear verdict that a full-live spawn is unsafe because the lease and DB dir are not env-isolable. The orchestrator independently verified that crux against the launcher source before trusting it. The recommended hermetic test was then written and run, passing three of three with the live daemon untouched. The plist came from a second opus agent that verified the sweeper flags against source and confirmed `plutil -lint`. Scenario 419 was then run for real to prove the plist fix end to end. A stuck council seat was reaped after the answer was already delivered and verified.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reject a full-live launcher spawn in the test | The lease and DB dir are hardcoded relative to the script, so a spawn would touch the shared production state |
| Hermetic test with the real exported functions | It validates the real release-vs-kill decision and OS semantics without opening any DB, socket, or lease |
| Ship the template in dry-run by default | Loading it is then non-destructive, matching the operator-approved rollout posture |
| Treat E_SESSION_SCOPE as intended | It is a session-spoofing guard; the fix is to omit sessionId, which the caveat documents |
| Defer writable re-runs of the other three scenarios | Their features are covered by their own vitest suites and the earlier read-only run |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `plutil -lint` on the template | PASS, OK |
| Re-election integration test (stress config) | PASS, 3/3 |
| Live daemon pid unchanged after the test | PASS, 95960 before and after |
| Scenario 419 re-run for real | PASS, all commands including the plist lint |
| Comment-hygiene on the new test file | PASS, exit 0 |
| sessionId caveat present | PASS |
| `validate.sh --strict` on this packet | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The integration test validates the decision and OS mechanics, not lease bookkeeping or true adoption.** It exercises the real release-vs-kill decision plus detached-spawn, unref, SIGTERM, and reparent. The launcher's lease-file release bookkeeping and a secondary actually adopting the released daemon remain covered by the unit suite and a deliberate multi-session check.
2. **The plist hardcodes this machine's repo root and home.** launchd needs absolute paths, so an operator on a different machine edits the two paths flagged in the header before installing.
3. **Re-election stays machine-local under test.** The flag is set in gitignored `.env.local` and is not a committed default; promotion waits for live multi-session validation.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
