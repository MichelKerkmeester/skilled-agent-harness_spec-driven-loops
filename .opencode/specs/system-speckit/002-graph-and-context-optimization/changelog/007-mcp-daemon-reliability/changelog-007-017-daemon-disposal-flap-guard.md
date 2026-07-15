---
title: "Changelog: Daemon disposal relaunch-flap guard [007-mcp-daemon-reliability/017-daemon-disposal-flap-guard]"
description: "Chronological changelog for the Daemon disposal relaunch-flap guard phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/017-daemon-disposal-flap-guard` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability`

### Summary

The mk-spec-memory daemon no longer flaps when a session ends. Before this, an owner session's disposal sent SIGTERM to the shared daemon child, and the launcher's supervisor respawned it on a 250 ms backoff — under a runtime that was already going away — so the fresh daemon was killed again ~1 s later. Every session bridged to that daemon saw its MCP transport drop. This is the exact failure a two-model investigation (Opus 4.8 + gpt-5.5 xhigh) reproduced live, and it sits squarely in the owner-shutdown territory v3.5.0.2 explicitly deferred.

### Added

- LAUNCHER_INITIAL_PPID const at module load in mk-spec-memory-launcher.cjs to capture the parent pid at startup for orphan detection
- Five disposal-gate unit cases to launcher-watchdog.vitest.ts covering owner-alive, shutdown, changed-ppid, orphan-to-1, and crash-recycle branches
- Feature-catalog entry and feature_catalog.md registration for the owner-disposal relaunch gate
- Playbook scenario 421 with manual_testing_playbook.md table row and file-count reconciliation (386 scenario / 320 catalog)

### Changed

- Verified report against first-party code: launcher already guards its own shutdown; the real gap was a disposal race where the 250ms relaunch fires before the launcher's SIGTERM
- Gated the scheduleRelaunch timer callback to abort, clear lease files, and exit when the launcher is shutting down or orphaned (ppid changed or reparented to 1) in mk-spec-memory-launcher.cjs
- Extracted the gate predicate into a pure shouldAbortRelaunchOnFire helper in model-server-supervision.cjs for unit testability; re-exported and called from the launcher with behavior preserved
- Ran launcher vitest suite: watchdog 15/15 plus clean-close, reap, session-proxy, and ipc-probe 39/39 (54 pass, no regression)

### Fixed

- Lifecycle race in the relaunch supervisor where the 250ms relaunch timer could fire under a disposing owner, spawning a daemon that was immediately killed and dropping all bridged transports
- Validated that both recycle and crash-recovery paths preserve their behavior through scheduleRelaunch with the owner alive

### Verification

- node --check launcher + supervision lib - PASS
- launcher-watchdog vitest (incl. 5 new disposal-gate cases) - PASS (20/20)
- clean-close + reap + session-proxy + ipc-probe vitest - PASS (39/39)
- recycle/crash-recovery preserved (logic + tests) - PASS
- comment-hygiene (durable WHY, no ids/paths) - PASS
- feature-catalog + playbook entries link-resolve + count self-check (386) - PASS
- validate.sh --strict (this packet) - PASS
- Runtime flap-stop on fresh session - DEFERRED (.cjs activates on a fresh launcher)

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | LAUNCHER_INITIAL_PPID const + fire-time gate in the scheduleRelaunch callback; the gate now calls (and re-exports) the extracted predicate |
| `.opencode/bin/lib/model-server-supervision.cjs` | Modified | Extracted the pure shouldAbortRelaunchOnFire predicate next to shouldSkipLaunch / superviseChildExit so the gate is unit-testable |
| `mcp_server/tests/launcher-watchdog.vitest.ts` | Modified | Five shouldAbortRelaunchOnFire unit cases: owner-alive, shutdown, changed-ppid, orphan-to-1, crash/recycle |
| `feature_catalog/14--pipeline-architecture/mcp-launcher-owner-disposal-relaunch-gate.md (+ feature_catalog.md)` | Added | Feature catalog entry + index registration |
| `manual_testing_playbook/14--pipeline-architecture/mcp-launcher-owner-disposal-relaunch-gate.md (+ manual_testing_playbook.md)` | Added | Playbook scenario 421 + index table row + count reconciliation (385->386 scenario / 319->320 catalog) |

### Follow-Ups

- Runtime-verify the flap stops on a fresh session; the launcher change activates only on a new launcher process, so the end-to-end flap-stop is confirmed by syntax, unit tests, and code logic, not by live observation yet.
- Orphan detection assumes the parent dies. If a disposal leaves a persistent wrapper as the launcher's parent, the ppid will not change and the gate falls back to prior behavior (no regression, but no help in that case). The complete fix is ownership re-election.
- Only the dominant flap is fixed. Deferred to follow-up phases: daemon ownership re-election, the mk-code-index reconnecting proxy, dead-socket reap requiring N probe failures, CLAUDE_SESSION_PID flow and orphan-mcp-sweeper scheduling (the Stop-hook is currently a no-op and orphans accumulate), and a persistent launcher log for attributable future incidents.
