---
title: "Changelog: Daemon-reliability follow-ups [007-mcp-daemon-reliability/026-daemon-reliability-followups]"
description: "Chronological changelog for the Daemon-reliability follow-ups phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/026-daemon-reliability-followups` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability`

### Summary

The four follow-ups from the anti-disconnection investigation are closed, and re-election now has a real live test it never had.

### Added

- Orphan-sweep LaunchAgent template at .opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist with dry-run default so loading is non-destructive
- Hermetic re-election integration test (daemon-reelection-release-integration.vitest.ts) that drives real OS process semantics with the exported decision functions, asserting flag-on releases the detached daemon and flag-off kills it
- cli MCP sessionId scoping caveat in references/cli/memory_handback.md documenting the E_SESSION_SCOPE guard for dispatched sub-sessions

### Changed

- Confirmed the launcher lease and DB dir are hardcoded relative to the script with no env override, making a full-live spawn unsafe for testing
- Ran the re-election integration test (3/3 pass) and verified the live daemon pid was unchanged after the test run (95960 before and after)
- Re-ran scenario 419 end to end for real, confirming the plist lint that previously failed now passes

### Fixed

- Scenario 419 always failed its plist lint because the LaunchAgent template was never committed; the template now exists and passes plutil -lint
- Re-election had only unit coverage; the hermetic integration test now validates the real release-vs-kill decision and OS semantics without touching production state

### Verification

- plutil -lint on the template - PASS, OK
- Re-election integration test (stress config) - PASS, 3/3
- Live daemon pid unchanged after the test - PASS, 95960 before and after
- Scenario 419 re-run for real - PASS, all commands including the plist lint
- Comment-hygiene on the new test file - PASS, exit 0
- sessionId caveat present - PASS
- validate.sh --strict on this packet - PASS
- Tasks complete - 12 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist` | Created | Dry-run-default LaunchAgent template that 419 lints |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-release-integration.vitest.ts` | Created | Hermetic release-vs-kill integration test |
| `.opencode/skills/system-spec-kit/references/cli/memory_handback.md` | Modified | MCP session scoping caveat |

### Follow-Ups

- The integration test validates the decision and OS mechanics, not lease bookkeeping or true adoption. It exercises the real release-vs-kill decision plus detached-spawn, unref, SIGTERM, and reparent. The launcher's lease-file release bookkeeping and a secondary actually adopting the released daemon remain covered by the unit suite and a deliberate multi-session check.
- The plist hardcodes this machine's repo root and home. launchd needs absolute paths, so an operator on a different machine edits the two paths flagged in the header before installing.
- Re-election stays machine-local under test. The flag is set in gitignored .env.local and is not a committed default; promotion waits for live multi-session validation.
