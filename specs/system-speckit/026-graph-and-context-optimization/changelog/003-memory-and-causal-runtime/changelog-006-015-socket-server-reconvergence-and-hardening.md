---
title: "Phase 015: Socket-server reconvergence and hardening"
description: "Levelled spec-memory's IPC socket server up to the hardened race-safe bridge contract, moved spec-kit and skill-advisor to a shared IPC module, kept code-index byte-identical with a drift test and added TOCTOU plus probe regressions."
trigger_phrases:
  - "socket server reconvergence"
  - "spec-memory socket hardening"
  - "shared ipc socket server"
  - "ipc socket drift check"
  - "toctou bridge bind test"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-04

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/015-socket-server-reconvergence-and-hardening` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency`

### Summary

This phase closed the drift left after the daemon bridge work. A canonical `@spec-kit/shared/ipc/socket-server.ts` now carries the hardened race-safe bridge contract. spec-memory and skill-advisor re-export it, while code-index keeps a byte-identical local copy guarded by a drift-check because it cannot yet import `@spec-kit/shared`. The work also adds tests for socket TOCTOU recovery, socket-copy drift and probe-no-spawn behavior.

### Added

- Canonical shared IPC socket-server module with race-safe reclaim, directory hardening, TCP retry support, containment checks and structural `McpServerLike` typing.
- TOCTOU socket regression covering real `EADDRINUSE` reclaim and an ENOENT survivor case.
- Drift-check test that fails if the code-index socket-server copy diverges from the canonical shared source.
- Probe-no-spawn regression for the `x-speckit-probe: liveness` marker.

### Changed

- spec-memory `socket-server.ts` now re-exports the shared hardened module instead of carrying the older permissive unlink behavior.
- skill-advisor `socket-server.ts` now re-exports the shared module.
- code-index `socket-server.ts` was aligned as a byte-identical local copy until its package can take the shared dependency.
- Builds were run for shared, code-index, skill-advisor and spec-kit MCP server packages.

### Fixed

- spec-memory's IPC bridge no longer has the weakest socket reclaim behavior in the launcher-concurrency stack.
- The three socket-server implementations now have a guard against silent contract drift.
- The shared bridge contract preserves foreign-node, non-socket and foreign-UID refusals while surviving benign vanished-node races.

### Verification

| Check | Result |
|-------|--------|
| `nested-changelog.js --json` draft | Ran and used as the starting draft |
| Shared package build | Exit 0 per packet artifacts |
| code-index build | Exit 0 per packet artifacts |
| skill-advisor MCP build | Exit 0 per packet artifacts |
| spec-kit MCP server build | Exit 0 per packet artifacts |
| New socket and probe tests | TOCTOU 2 passed, drift 1 passed and probe 3 passed |
| Independent review | GO with zero P0 and zero P1 findings |
| Hygiene and scope | Comment hygiene zero violations across touched TypeScript files, no deletions and allowed paths only |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts` | Added | Created the canonical hardened IPC socket-server implementation. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/ipc/socket-server.ts` | Modified | Re-exported the shared module, leveling spec-memory up to the hardened contract. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/ipc/socket-server.ts` | Modified | Re-exported the shared module. |
| `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts` | Modified | Aligned the local copy byte-for-byte with the canonical shared source. |
| `.opencode/skills/system-code-graph/mcp_server/tests/ipc-socket-drift.vitest.ts` | Added | Added a drift guard for the code-index local copy. |
| `.opencode/skills/system-code-graph/mcp_server/tests/ipc-socket-toctou.vitest.ts` | Added | Added race coverage for socket bind reclaim. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/model-server-demand-probe.vitest.ts` | Added | Added probe marker coverage so liveness checks do not spawn the model server. |

### Follow-Ups

- Restart affected daemons or reconnect MCP so the new `dist` output is active.
- Finish code-index unification by adding the `@spec-kit/shared` dependency and replacing its byte-identical local copy with an import.
- Track the unrelated advisor shared-embeddings failure separately.
