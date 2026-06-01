---
title: "Cross-Launcher Lease Propagation: mk-code-index and mk-spec-memory"
description: "PID-file lease propagated from the skill-advisor pattern into mk-code-index-launcher.cjs and mk-spec-memory-launcher.cjs. Both launchers now refuse duplicate-start when a live sibling holds the lease. Six vitest cases green across two new test files."
trigger_phrases:
  - "cross-launcher lease propagation"
  - "mk-code-index single writer"
  - "mk-spec-memory single writer"
  - "launcher-boundary PID lease"
  - "zombie daemon prevention code-graph spec-memory"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-18

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/002-cross-launcher-lease-propagation` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency`

### Summary

The `mk-code-index` and `mk-spec-memory` launchers had no guard against concurrent starts. An audit found `mk_code_index` running 3 concurrent daemon processes and `mk-spec-memory` running 4. Neither launcher refused to start when a live sibling was already active. Both relied on WAL and busy-timeout to absorb the SQLite contention, masking the symptom while leaving a latent corruption window open.

The 006 launcher-boundary PID-file lease pattern shipped for skill-advisor was propagated to both sibling launchers via a cli-codex dispatch. Each launcher now writes a `.<name>-launcher.json` file on bootstrap and exits cleanly before opening any SQLite file when a live sibling holds the lease. Stale PIDs trigger a `staleReclaimed: true` reclaim path. A child-aware SIGTERM extension on the spec-memory launcher ensures no orphan `context-server.js` lingers after shutdown. Six new vitest cases across two test files confirm spawn-twice exit behavior, stale-PID reclaim and env-var override on both launchers.

### Added

- Inline PID-file lease primitive in `mk-code-index-launcher.cjs` with atomic `<path>.tmp.<pid>` write and rename
- Inline PID-file lease primitive in `mk-spec-memory-launcher.cjs` with child-aware SIGTERM forwarding to `context-server.js`
- Env-var gate `MK_CODE_INDEX_STRICT_SINGLE_WRITER` (default `1`) to disable exit behavior for dev overrides
- Env-var gate `MK_SPEC_MEMORY_STRICT_SINGLE_WRITER` (default `1`) with the same semantics
- `system-code-graph/mcp_server/tests/launcher-lease.vitest.ts` (NEW) with 3 spawn-based cases for the code-graph launcher
- `system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts` (NEW) with 3 spawn-based cases for the spec-memory launcher
- `system-code-graph/references/launcher-lease.md` (NEW) documenting PID-file format, env-var override, stale-reclaim path and cross-launcher parity contract
- `system-spec-kit/references/launcher-lease.md` (NEW) mirroring the code-graph reference with spec-memory-specific details

### Changed

- `mk-code-index-launcher.cjs` startup path now probes the recorded PID via `process.kill(pid, 0)` before the bootstrap lock. Live sibling detected: exits 0 with `LEASE_HELD_BY:<pid>`. Dead PID: logs `staleReclaimed: true` and continues.
- `mk-spec-memory-launcher.cjs` SIGTERM handler extended to forward the signal to the child `context-server.js` process before clearing the lease file
- Cleanup hooks on SIGTERM, SIGINT and normal exit remove the PID-file in both launchers

### Fixed

- `mk-code-index` accumulated 3 concurrent daemon processes across runtimes because the launcher never refused a duplicate start. The PID-file lease closes this structurally.
- `mk-spec-memory` accumulated 4 processes (2 launcher, 2 context-server.js children) for the same reason. The lease plus child-aware SIGTERM forwarding closes both paths.

### Verification

| Check | Result |
|-------|--------|
| `npm --prefix .opencode/skills/system-code-graph run typecheck` | PASS. `tsc --noEmit` exit 0, no diagnostics. |
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run typecheck` | PASS. `tsc --noEmit` exit 0, no diagnostics. |
| `vitest --run launcher-lease` (code-graph, independent rerun) | PASS. 3 tests, 385ms. |
| `vitest --run launcher-lease` (spec-memory, independent rerun) | PASS. 3 tests, 392ms. |
| Manual spawn-twice probe for code-graph | PASS. Second launcher PID 52613 exited 0 with `LEASE_HELD_BY:<owner>`. Lease file removed after SIGTERM. |
| Manual spawn-twice probe for spec-memory | PASS. Second launcher PID 55959 exited 0 with `LEASE_HELD_BY:<owner>`. Lease file removed after SIGTERM. |
| Scope discipline (`git status` vs spec.md Files to Change) | PASS. All 7 modified files appear in scope table. One runtime `.mk-spec-memory-launcher.json` updated by the live launcher was not committed. |
| Strict spec validate | PASS. 0 errors, 1 advisory PRIORITY_TAGS warning consistent with packet 006 baseline. |
| Cross-launcher `LEASE_HELD_BY` parity | PASS. `grep -c 'LEASE_HELD_BY' .opencode/bin/mk-*-launcher.cjs` returns 3. |
| 24-hour zero-zombie soak (SC-002) | DEFERRED. Operator runs after restarting all runtimes. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/bin/mk-code-index-launcher.cjs` | Modify (+81/-11) | Inline PID lease, cleanup hooks, env-var gate |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify (+81/-11) | Same primitive, child-aware SIGTERM forwarding |
| `.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts` | Create (+179) | 3 spawn-based vitest cases (NEW) |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts` | Create (+182) | 3 spawn-based vitest cases (NEW) |
| `.opencode/skills/system-code-graph/references/launcher-lease.md` | Create (+83) | Code-graph lease reference doc (NEW) |
| `.opencode/skills/system-spec-kit/references/launcher-lease.md` | Create (+83) | Spec-memory lease reference doc (NEW) |

### Follow-Ups

- Run the 24-hour zombie soak after restarting all MCP-using runtimes to confirm at most 3 launcher PIDs are alive across all connected clients.
- Mark the soak evidence in `checklist.md` with the timestamp and `ps aux` output once complete.
