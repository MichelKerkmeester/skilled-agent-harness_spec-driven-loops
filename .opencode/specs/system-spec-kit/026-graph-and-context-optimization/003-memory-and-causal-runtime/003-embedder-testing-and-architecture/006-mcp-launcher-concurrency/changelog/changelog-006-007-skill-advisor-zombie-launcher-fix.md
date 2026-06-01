---
title: "Skill-Advisor Zombie Launcher Fix"
description: "A missing launcher-boundary PID guard in mk-skill-advisor-launcher.cjs let duplicate launcher processes survive as degraded children. The fix adds the parent-owned PID guard, serializes the pre-spawn acquisition window then adds a spawn-three regression test. All verification gates passed."
trigger_phrases:
  - "skill-advisor zombie launcher fix"
  - "mk-skill-advisor-launcher pid guard"
  - "spawn-three regression test"
  - "launcher boundary pid race"
  - "daemon sqlite launcher asymmetry"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-18

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/007-skill-advisor-zombie-launcher-fix` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency`

### Summary

After Phase 006 shipped, a live process audit at 2026-05-18T16:47Z still showed three `mk-skill-advisor-launcher` processes while `mk-code-index-launcher` and `mk-spec-memory-launcher` each held at one. The root cause was an asymmetry in how the launchers enforce the process-count invariant: code-index and spec-memory write an inline PID guard before spawning their child, while skill-advisor only probed the daemon SQLite lease, which is acquired inside the child server after startup work. That left a race window where duplicate parent launchers could survive as degraded children.

The fix adds a parent-owned PID guard to `mk-skill-advisor-launcher.cjs`. The launcher now checks the live `.mk-skill-advisor-launcher.json` owner, serializes the pre-spawn acquisition window with the bootstrap lock, writes its own PID guard before calling `launchServer()` then re-probes ownership before starting `advisor-server.js`. Duplicate launchers now exit 0 with `LEASE_HELD_BY:<ownerPid>` instead of spawning degraded children. A spawn-three regression test was added to `launcher-lease.vitest.ts` to lock this behavior.

### Added

- Parent-owned PID guard in `mk-skill-advisor-launcher.cjs` that checks and writes `.mk-skill-advisor-launcher.json` before `launchServer()` with a re-probe after bootstrap serialization
- `007-REQ-001` spawn-three regression test in `launcher-lease.vitest.ts` covering the three-launcher pattern where only owner #1 survives and launchers #2 and #3 exit 0 with `LEASE_HELD_BY:<pid#1>`

### Changed

- `mk-skill-advisor-launcher.cjs` pre-spawn acquisition window serialized via bootstrap lock so duplicates cannot pass before the first owner writes the PID guard
- `launcher-lease.vitest.ts` fixture ownership moved to the launcher to match the corrected ownership model. Test count grew from 10 to 11.

### Fixed

- Three `mk-skill-advisor-launcher` zombie processes survived after Phase 006 because the daemon SQLite lease was acquired inside the child server rather than the parent launcher. The parent-owned PID guard closes that race window.
- Duplicate launchers could spawn degraded child servers and keep their parent processes alive. They now exit 0 at the launcher boundary before reaching the child spawn path.

### Verification

| Check | Result |
|-------|--------|
| `npx vitest --run launcher-lease` | PASS, exit 0. 1 file passed. 11 tests passed. |
| `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck` | PASS, exit 0. |
| Isolated spawn-three smoke | PASS. Owner pid `13360`. Launcher #2 and #3 exited 0 with `LEASE_HELD_BY:13360`. Launcher #1 remained alive until cleanup. |
| Smoke `ps` process-count probe | BLOCKED by sandbox `spawnSync ps EPERM`. Direct child exit/liveness assertions used as fallback. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <007> --strict --verbose` | PASS, exit 0. Errors: 0. Warnings: 0. |

### Files Changed

| File | Action | What changed |
|------|--------|-------------|
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modified | Adds parent-owned PID guard check and write with re-probe before `launchServer()`. Preserves daemon SQLite lease probing. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/launcher-lease.vitest.ts` | Modified | Moves fixture lease ownership to the launcher. Adds `007-REQ-001` spawn-three regression test. |

### Follow-Ups

- The `ps` process-count smoke verification was blocked by the codex sandbox `EPERM` restriction. Capture explicit `ps -A | grep mk-skill-advisor-launcher | wc -l` evidence in a non-sandboxed environment to close the literal evidence gap.
- No change was made to `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts` because the root cause was in the parent launcher acquisition gap, not the daemon SQLite lease code. Confirm this boundary holds in a future integration review.
