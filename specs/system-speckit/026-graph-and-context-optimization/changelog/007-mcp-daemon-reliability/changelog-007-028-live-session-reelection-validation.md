---
title: "Changelog: Live two-session daemon re-election adoption test [007-mcp-daemon-reliability/028-live-session-reelection-validation]"
description: "Chronological changelog for the Live two-session daemon re-election adoption test phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-15

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/028-live-session-reelection-validation` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability`

### Summary

The changelog for v3.5.0.4 said the full multi-session behavior of daemon re-election was under live observation rather than proven, because a real launcher seemed impossible to spawn in a test without touching the shared production lease and database. This packet proved it can, and in proving it found a real defect.

### Added

- Live two-launcher adoption test (daemon-reelection-adoption-live.vitest.ts) running two real mk-spec-memory launchers against a throwaway fake-root, covering connected-secondary survival, flag-off death, and fresh-session-after-dispose single-writer invariant
- Reap-before-respawn on the stale-lease reclaim branch in mk-spec-memory-launcher.cjs that reads the recorded child pid, reaps it if alive, and aborts the spawn on EPERM-uncertain to prevent double-writer

### Changed

- Proved the isolated single-launcher harness spawns a real launcher with a working MCP round-trip against a temp root, validating the test isolation recipe
- Reconciled the v3.5.0.4 changelog, RELEASE_NOTES, and ENV_REFERENCE to reflect the proven behavior and the fix rather than the prior observation hedge
- Ran durability suite green (18/18) and launcher-lease suite green (11/11)

### Fixed

- A fresh session started after an owner disposal spawned a second daemon on the same database because lease liveness keyed on the dead owner pid rather than the live daemon; the stale-reclaim branch now reaps the live orphan before respawning, restoring the single-writer invariant (lsof confirmed both daemons held the WAL open before the fix, single writer after)

### Verification

- Live adoption test (3 cases) - PASS
- Full durability suite - PASS, 18/18
- Launcher-lease unit suite - PASS, 11/11
- Standalone repro after fix - PASS, orphan reaped within 1s
- Launcher parse (node --check) - PASS
- Changelog and RELEASE_NOTES HVR - PASS, 0 semicolons, 0 em-dashes
- validate.sh --strict on this packet - PASS
- Tasks complete - 13 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | Reap the live released daemon on stale-lease reclaim before respawn |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts` | Created | Live two-launcher adoption test, three cases |
| `.opencode/skills/system-spec-kit/changelog/v3.5.0.4.md` | Modified | Replaced the observation hedge with proven behavior and the fix |
| `.opencode/skills/system-spec-kit/changelog/RELEASE_NOTES.md` | Modified | Same reconciliation |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | Re-election row reflects the live test and the reap |

### Follow-Ups

- Fresh sessions do not reuse the warm daemon. A fresh session after disposal reaps the released daemon and spawns a clean one rather than adopting the warm one. True adoption is a deferred follow-up; the value of re-election remains for already-connected live secondaries.
- PID-recycle assumption. The reap signals a pid recorded in the lease, the same lease-freshness assumption as the existing dead-socket reap. No new risk class is introduced.
- Activation needs a fresh session. The launcher reads its code at startup, so a launcher already running keeps the old behavior until the next session spawns it.
