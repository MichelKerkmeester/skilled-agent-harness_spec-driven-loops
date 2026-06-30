---
title: "Implementation Summary: Live two-session daemon re-election adoption test"
description: "A live two-launcher test proved re-election end to end, caught a fresh-session double-writer that default-on introduced, and the reap-before-respawn fix restored the single-writer invariant."
trigger_phrases:
  - "live reelection validation done"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/028-live-session-reelection-validation"
    last_updated_at: "2026-06-08T05:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Live test built, double-writer found and fixed, docs reconciled, suites green"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-028-live-session-reelection-validation"
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
| **Spec Folder** | 028-live-session-reelection-validation |
| **Completed** | 2026-06-08 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The changelog for v3.5.0.4 said the full multi-session behavior of daemon re-election was under live observation rather than proven, because a real launcher seemed impossible to spawn in a test without touching the shared production lease and database. This packet proved it can, and in proving it found a real defect.

### A live, isolated, two-session test

A new durability test runs two real mk-spec-memory launchers against a throwaway fake-root. The launcher is real-copied so its lease and database directory resolve to the temp root, the daemon dist is real-copied so the daemon's workspace-root guard resolves to the temp root too, the heavy dependencies are symlinked, and the IPC socket lives in a short temp directory to stay under the macOS socket path limit. No production lease, database, or socket is touched. The test covers three cases: a connected secondary keeps transport through an owner disposal with the flag on, the daemon dies with its owner when the flag is off, and a fresh session started after disposal ends up the single writer.

### The defect it caught

With the flag on, the first two cases passed, but a fresh session started after the owner disposed spawned a second daemon on the same database. The release path keeps the daemon lease for adoption, but lease liveness keys on the dead owner pid rather than the live daemon, so a fresh launcher saw the lease as stale, reclaimed it, and spawned a replacement without reaping the still-live released daemon. An `lsof` poll showed both daemons holding the same WAL database open for the full observation window. That is a regression versus the prior kill-on-disposal behavior, which left a single clean writer after a cold restart.

### The fix

On the stale-lease reclaim branch, the launcher now reads the recorded child and, if it is still alive, reaps it with the existing dead-socket reap helper before spawning a replacement. The reap runs under the owner-lease exclusive acquisition, so two racing fresh launchers cannot both reap and spawn. If liveness cannot be confirmed (EPERM), it aborts the spawn and reports the lease held so the host reconnects instead of creating a second writer.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | Reap the live released daemon on stale-lease reclaim before respawn |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts` | Created | Live two-launcher adoption test, three cases |
| `.opencode/skills/system-spec-kit/changelog/v3.5.0.4.md` | Modified | Replaced the observation hedge with proven behavior and the fix |
| `.opencode/skills/system-spec-kit/changelog/RELEASE_NOTES.md` | Modified | Same reconciliation |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | Re-election row reflects the live test and the reap |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The isolation recipe came first, proven with a single-launcher probe, after two failed attempts taught the constraints: symlinking the daemon dist makes its workspace-root guard resolve to the real tree (so it fell back to the production database), and the SDK is hoisted to the kit-level node_modules. Copying the dist and linking both node_modules levels fixed it. The two-session harness then reproduced the finding, and a four-perspective council (the direct repro plus two claude2 opus seats and one cli-codex gpt-5.5 seat) independently confirmed it and converged on the reap-before-respawn fix over the larger true-adoption option. The fix mirrors the existing dead-socket reap branch exactly, so it inherits the SIGTERM-to-SIGKILL ladder, the process-tree sweep, and the clean-close barrier for free.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reap the orphan rather than adopt it | Minimal, deterministic, reuses tested code, and makes the worst case match the prior single-writer behavior |
| Defer true adoption (reuse the warm daemon) | A larger ownership-transfer change with more edge cases; recorded as a follow-up enhancement |
| Run two real launchers in a fake-root | The only faithful way to prove the lease, bridge, and reclaim logic without touching production |
| Reconcile the v3.5.0.4 docs in place | The fix makes the original safety claim true, and the user kept v3.5.0.4 as the single latest release |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Live adoption test (3 cases) | PASS |
| Full durability suite | PASS, 18/18 |
| Launcher-lease unit suite | PASS, 11/11 |
| Standalone repro after fix | PASS, orphan reaped within 1s |
| Launcher parse (`node --check`) | PASS |
| Changelog and RELEASE_NOTES HVR | PASS, 0 semicolons, 0 em-dashes |
| `validate.sh --strict` on this packet | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Fresh sessions do not reuse the warm daemon.** A fresh session after disposal reaps the released daemon and spawns a clean one rather than adopting the warm one. True adoption is a deferred follow-up; the value of re-election remains for already-connected live secondaries.
2. **PID-recycle assumption.** The reap signals a pid recorded in the lease, the same lease-freshness assumption as the existing dead-socket reap. No new risk class is introduced.
3. **Activation needs a fresh session.** The launcher reads its code at startup, so a launcher already running keeps the old behavior until the next session spawns it.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
