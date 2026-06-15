---
title: "Changelog: Orphan-sweep Stop-hook activation [007-mcp-daemon-reliability/021-orphan-sweep-stop-hook-activation]"
description: "Chronological changelog for the Orphan-sweep Stop-hook activation phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/021-orphan-sweep-stop-hook-activation` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability`

### Summary

Leaked MCP daemons can finally be cleaned up on session end. The Stop hook runs session-cleanup.sh, but that script only reaps a session's processes when CLAUDE_SESSION_PID is set — and the harness never sets it, so it logged skip reason=no-session-pid and did nothing while orphaned daemons piled up. It deliberately would not guess the pid from its PPID, because on a shared terminal that mis-targets and kills live sibling sessions (the v3.5.0.2 incident). So the safe answer is not to guess at all.

### Added

- SCRIPT_DIR resolution, SPECKIT_STOP_HOOK_ORPHAN_SWEEP mode flag, and a test-only SPECKIT_ORPHAN_SWEEPER_BIN override in session-cleanup.sh
- run_orphan_sweep_fallback function (off/dry-run/live) wired into the no-session-pid branch of session-cleanup.sh
- launcher-stop-hook-orphan-sweep.vitest.ts with 4 gating tests: off (no-op), dry-run, live, and unknown mapped to off, via a stub sweeper

### Changed

- Confirmed session-cleanup.sh no-ops without a session pid and refuses a PPID guess as the safety contract
- Ran bash -n syntax check and functional smoke across all three modes (off no-op, dry-run passes --dry-run, live passes no flag)

### Fixed

- The Stop hook logged skip reason=no-session-pid and did nothing while orphaned MCP daemons accumulated, because the harness never set CLAUDE_SESSION_PID; added a flag-gated fallback to the pid-independent orphan-only sweeper that cannot touch live sessions

### Verification

- bash -n session-cleanup.sh - PASS
- functional smoke (off / dry-run / live) - PASS
- launcher-stop-hook-orphan-sweep.vitest.ts - PASS (4/4)
- default no-op preserved (flag unset) - PASS
- comment-hygiene (durable WHY, no ids/paths) - PASS
- validate.sh --strict (this packet) - PASS
- live reap observed on a real session - DEFERRED (opt-in; operator enables after a dry-run review)
- Tasks complete - 10 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/scripts/session-cleanup.sh` | Modified | run_orphan_sweep_fallback (off/dry-run/live) in the no-session-pid branch; SCRIPT_DIR + SPECKIT_STOP_HOOK_ORPHAN_SWEEP + a test-only SPECKIT_ORPHAN_SWEEPER_BIN override |
| `mcp_server/tests/launcher-stop-hook-orphan-sweep.vitest.ts` | Created | Gating tests: off (no-op), dry-run, live, unknown -> off, via a stub sweeper |

### Follow-Ups

- Default off. Orphans are only swept when an operator sets SPECKIT_STOP_HOOK_ORPHAN_SWEEP. The default stays a no-op, so the accumulation only stops once enabled.
- Runtime-unverified reap. The gating is fully tested, but an actual live reap on session end is owed to an operator dry-run-then-enable pass; it cannot be safely exercised in-session.
- Session-scoped cleanup still needs the pid. The precise, session-scoped kill remains gated on CLAUDE_SESSION_PID; this packet only adds the pid-independent orphan fallback, it does not make the harness provide a session pid.
